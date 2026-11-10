// Exchanges the stored Google OAuth refresh token for a short-lived access token.
// Used by every seo-agent module that needs to call a Google API.

export interface GoogleAuthEnv {
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
}

export async function getAccessToken(env: GoogleAuthEnv): Promise<string> {
  const { clientId, clientSecret, refreshToken } = env;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Missing GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET / GOOGLE_OAUTH_REFRESH_TOKEN"
    );
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google token refresh failed (${res.status}): ${err}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}
