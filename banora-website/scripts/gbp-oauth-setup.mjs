// One-time local setup: exchanges the downloaded Google OAuth Desktop-app
// client JSON for a refresh token, then looks up the Business Profile
// account/location IDs needed by the seo-agent cron routes.
//
// Run manually, once: node scripts/gbp-oauth-setup.mjs <path to client JSON>
// If the account/location lookup fails (e.g. a transient quota limit), your
// refresh token is already saved — just re-run the lookup alone:
//   node scripts/gbp-oauth-setup.mjs --lookup-only
// Not deployed — same category as check-sitemap.mjs / convert-images.mjs.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createServer } from "node:http";
import { OAuth2Client } from "google-auth-library";

const REDIRECT_PORT = 51753;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/oauth2callback`;
const SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/business.manage",
];
const OUTPUT_PATH = "scripts/.gbp-oauth-output.json";

function printEnvLines(creds, refreshToken) {
  console.log("\n--- Copy these into Vercel (Project Settings → Environment Variables) ---\n");
  console.log(`GOOGLE_OAUTH_CLIENT_ID=${creds.client_id}`);
  console.log(`GOOGLE_OAUTH_CLIENT_SECRET=${creds.client_secret}`);
  console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${refreshToken}`);
  console.log(`GBP_ACCOUNT_ID=<the "accounts/..." value for Banora Chiropractic below, once looked up>`);
  console.log(`GBP_LOCATION_ID=<the "locations/..." value for Banora Chiropractic below, once looked up>`);
}

// Retries a transient 429 (Google's Business Profile APIs have a very low
// default per-minute quota) with a short backoff instead of giving up.
async function fetchWithRetry(url, options, attempts = 3, delayMs = 20_000) {
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(url, options);
    if (res.status !== 429) return res;
    if (i < attempts - 1) {
      console.log(`  Rate-limited (429) — waiting ${delayMs / 1000}s before retrying...`);
      await new Promise((r) => setTimeout(r, delayMs));
    } else {
      return res;
    }
  }
}

async function lookupAccountsAndLocations(accessToken) {
  console.log("\nLooking up your Business Profile account/location...\n");

  const accountsRes = await fetchWithRetry("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const accountsData = await accountsRes.json();
  if (!accountsRes.ok) {
    console.error("Failed to list Business Profile accounts:", accountsData);
    console.error(
      "\nIf this says RESOURCE_EXHAUSTED / 429, it's a temporary per-minute quota limit, not a real " +
        "problem. Wait a minute or two, then run: node scripts/gbp-oauth-setup.mjs --lookup-only"
    );
    process.exitCode = 1;
    return;
  }

  const accounts = accountsData.accounts ?? [];
  if (accounts.length === 0) {
    console.log("No Business Profile accounts found for this Google account.");
  }

  for (const account of accounts) {
    console.log(`Account: ${account.name}  (${account.accountName ?? "unnamed"})`);

    const locRes = await fetchWithRetry(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storefrontAddress`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const locData = await locRes.json();
    if (!locRes.ok) {
      console.error(`  Failed to list locations for ${account.name}:`, locData);
      continue;
    }
    for (const loc of locData.locations ?? []) {
      console.log(`  Location: ${loc.name}  "${loc.title}"  ${loc.storefrontAddress?.addressLines?.join(", ") ?? ""}`);
    }
  }
}

async function runLookupOnly() {
  if (!existsSync(OUTPUT_PATH)) {
    console.error(`No saved credentials found at ${OUTPUT_PATH}. Run the full setup first:`);
    console.error("  node scripts/gbp-oauth-setup.mjs <path-to-client-secret.json>");
    process.exitCode = 1;
    return;
  }

  const saved = JSON.parse(readFileSync(OUTPUT_PATH, "utf8"));
  const oauth2Client = new OAuth2Client(saved.GOOGLE_OAUTH_CLIENT_ID, saved.GOOGLE_OAUTH_CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: saved.GOOGLE_OAUTH_REFRESH_TOKEN });

  const { token: accessToken } = await oauth2Client.getAccessToken();
  await lookupAccountsAndLocations(accessToken);
  printEnvLines(
    { client_id: saved.GOOGLE_OAUTH_CLIENT_ID, client_secret: saved.GOOGLE_OAUTH_CLIENT_SECRET },
    saved.GOOGLE_OAUTH_REFRESH_TOKEN
  );
}

async function runFullSetup(clientJsonPath) {
  const raw = JSON.parse(readFileSync(clientJsonPath, "utf8"));
  const creds = raw.installed ?? raw.web;
  if (!creds) {
    console.error("Could not find 'installed' or 'web' credentials in that JSON file.");
    process.exitCode = 1;
    return;
  }

  const oauth2Client = new OAuth2Client(creds.client_id, creds.client_secret, REDIRECT_URI);
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  console.log("\n1. Open this URL in a browser and approve access:\n");
  console.log(authUrl);
  console.log(`\n2. Waiting for the redirect on ${REDIRECT_URI} ...\n`);

  await new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      if (req.url === "/favicon.ico") {
        res.writeHead(204).end();
        return;
      }

      if (!req.url?.startsWith("/oauth2callback")) {
        res.writeHead(404).end();
        return;
      }

      const url = new URL(req.url, REDIRECT_URI);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (!code && !error) {
        // Spurious hit (browser preflight, prefetch, etc.) — not Google's
        // real redirect. Ignore it and keep waiting.
        res.writeHead(204).end();
        return;
      }

      if (error || !code) {
        res.writeHead(400, { "Content-Type": "text/plain" }).end("Authorization failed — check the terminal.");
        console.error("Authorization failed:", error ?? "no code returned");
        server.close(() => {
          process.exitCode = 1;
          resolve();
        });
        return;
      }

      res.writeHead(200, { "Content-Type": "text/plain" }).end("Authorized — you can close this tab and return to the terminal.");
      server.close();

      try {
        const { tokens } = await oauth2Client.getToken(code);
        if (!tokens.refresh_token) {
          console.error(
            "\nNo refresh token returned. This usually means you've authorized this app before — " +
              "revoke access at https://myaccount.google.com/permissions and run this script again."
          );
          process.exitCode = 1;
          resolve();
          return;
        }

        console.log("\nRefresh token obtained.");

        // Save immediately — a later failure in the account/location lookup
        // (e.g. a quota limit) must never lose this.
        const output = {
          GOOGLE_OAUTH_CLIENT_ID: creds.client_id,
          GOOGLE_OAUTH_CLIENT_SECRET: creds.client_secret,
          GOOGLE_OAUTH_REFRESH_TOKEN: tokens.refresh_token,
        };
        writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
        console.log(`Saved to ${OUTPUT_PATH} (gitignored).`);

        await lookupAccountsAndLocations(tokens.access_token);
        printEnvLines(creds, tokens.refresh_token);
        console.log(`\n(Delete ${OUTPUT_PATH} once you've copied the values into Vercel.)\n`);
      } catch (err) {
        console.error("Token exchange or lookup failed:", err);
        process.exitCode = 1;
      } finally {
        resolve();
      }
    });

    server.listen(REDIRECT_PORT);
  });
}

const arg = process.argv[2];
if (arg === "--lookup-only") {
  await runLookupOnly();
} else if (arg) {
  await runFullSetup(arg);
} else {
  console.error("Usage:");
  console.error("  node scripts/gbp-oauth-setup.mjs <path-to-client-secret.json>   (first time)");
  console.error("  node scripts/gbp-oauth-setup.mjs --lookup-only                  (retry the account/location lookup)");
  process.exitCode = 1;
}
