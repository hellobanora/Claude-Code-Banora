#!/usr/bin/env bash
# Renews the SEO agent's Google login and puts it straight into Vercel.
# Secrets go from Google to Vercel without being printed.
#
#   bash scripts/renew-google-login.sh ~/Downloads/client_secret_*.json
#
# Needs: the client JSON downloaded from Google Cloud (Clients → Banora Chiro SEO tool → Add secret),
# and the Vercel CLI logged in to hellobanoras-projects.
set -euo pipefail

CLIENT_JSON="${1:?Usage: bash scripts/renew-google-login.sh <client_secret JSON>}"
SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$SITE_DIR/scripts/.gbp-oauth-output.json"
LINK_DIR="$(mktemp -d)"
trap 'rm -rf "$LINK_DIR" "$OUT"' EXIT

cd "$SITE_DIR"
echo "1/4  Opening Google sign-in. Use the account that manages the Banora Business Profile."
echo "     If Google says the app is unverified: Advanced → Go to Banora Chiro SEO tool → Allow."
# Show the sign-in link and progress, but never the secret lines.
node scripts/gbp-oauth-setup.mjs "$CLIENT_JSON" | grep -vE '^(GOOGLE_OAUTH_|--- Copy these|\(Delete )' || true
[ -s "$OUT" ] || { echo "No token was saved. Run the script again."; exit 1; }

echo "2/4  Linking to the banora-website Vercel project…"
(cd "$LINK_DIR" && vercel link --yes --project banora-website --scope hellobanoras-projects > /dev/null)

value() { node -e "process.stdout.write(require(process.argv[1])[process.argv[2]])" "$OUT" "$1"; }

echo "3/4  Updating Vercel (values are not shown)…"
for key in GOOGLE_OAUTH_CLIENT_SECRET GOOGLE_OAUTH_REFRESH_TOKEN; do
  (cd "$LINK_DIR" && vercel env rm "$key" production --yes > /dev/null 2>&1 || true)
  value "$key" | (cd "$LINK_DIR" && vercel env add "$key" production --sensitive > /dev/null)
  echo "     ✓ $key"
done

echo "4/4  Redeploying the live site so it uses the new login…"
(cd "$LINK_DIR" && vercel redeploy "$(vercel ls banora-website --prod --scope hellobanoras-projects 2>/dev/null | grep -o 'https://[^ ]*' | head -1)" --scope hellobanoras-projects > /dev/null)

rm -f "$CLIENT_JSON"
echo
echo "Done. The downloaded JSON and the temporary token file have been deleted."
echo "Last step: in Google Cloud, disable and delete the OLD secret ending …WYw8 (from 10 Nov)."
