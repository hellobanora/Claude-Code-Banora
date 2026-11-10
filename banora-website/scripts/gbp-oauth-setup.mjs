// One-time local setup: exchanges the downloaded Google OAuth Desktop-app
// client JSON for a refresh token, then looks up the Business Profile
// account/location IDs needed by the seo-agent cron routes.
//
// Run manually, once: node scripts/gbp-oauth-setup.mjs "<path to client JSON>"
// Not deployed — same category as check-sitemap.mjs / convert-images.mjs.

import { readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { OAuth2Client } from "google-auth-library";

const REDIRECT_PORT = 51753;
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/oauth2callback`;
const SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/business.manage",
];

const clientJsonPath = process.argv[2];
if (!clientJsonPath) {
  console.error("Usage: node scripts/gbp-oauth-setup.mjs <path-to-client-secret.json>");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(clientJsonPath, "utf8"));
const creds = raw.installed ?? raw.web;
if (!creds) {
  console.error("Could not find 'installed' or 'web' credentials in that JSON file.");
  process.exit(1);
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

const server = createServer(async (req, res) => {
  if (!req.url?.startsWith("/oauth2callback")) {
    res.writeHead(404).end();
    return;
  }

  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    res.writeHead(400, { "Content-Type": "text/plain" }).end("Authorization failed — check the terminal.");
    console.error("Authorization failed:", error ?? "no code returned");
    server.close();
    process.exit(1);
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
      process.exit(1);
    }

    console.log("\nRefresh token obtained. Looking up your Business Profile account/location...\n");
    oauth2Client.setCredentials(tokens);
    const accessToken = tokens.access_token;

    const accountsRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const accountsData = await accountsRes.json();
    if (!accountsRes.ok) {
      console.error("Failed to list Business Profile accounts:", accountsData);
      process.exit(1);
    }

    const accounts = accountsData.accounts ?? [];
    for (const account of accounts) {
      console.log(`Account: ${account.name}  (${account.accountName ?? "unnamed"})`);

      const locRes = await fetch(
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

    const output = {
      GOOGLE_OAUTH_CLIENT_ID: creds.client_id,
      GOOGLE_OAUTH_CLIENT_SECRET: creds.client_secret,
      GOOGLE_OAUTH_REFRESH_TOKEN: tokens.refresh_token,
    };
    writeFileSync("scripts/.gbp-oauth-output.json", JSON.stringify(output, null, 2));

    console.log("\n--- Copy these into Vercel (Project Settings → Environment Variables) ---\n");
    console.log(`GOOGLE_OAUTH_CLIENT_ID=${creds.client_id}`);
    console.log(`GOOGLE_OAUTH_CLIENT_SECRET=${creds.client_secret}`);
    console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`GBP_ACCOUNT_ID=<the "accounts/..." value for Banora Chiropractic above>`);
    console.log(`GBP_LOCATION_ID=<the "locations/..." value for Banora Chiropractic above>`);
    console.log(
      "\n(Also saved to scripts/.gbp-oauth-output.json, which is gitignored — delete it once you've copied the values.)\n"
    );
  } catch (err) {
    console.error("Token exchange or lookup failed:", err);
    process.exit(1);
  }
});

server.listen(REDIRECT_PORT);
