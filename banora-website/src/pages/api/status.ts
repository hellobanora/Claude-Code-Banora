// Public status endpoint — check site health anytime
// GET /api/status

import type { APIRoute } from "astro";
import { runAllChecks } from "../../lib/health-checks";

export const prerender = false;

export const GET: APIRoute = async () => {
  const siteUrl = import.meta.env.SITE_URL || "https://banorachiropractic.com.au";
  const results = await runAllChecks(siteUrl);
  const allPassed = results.every((r) => r.status === "pass");

  const response = {
    timestamp: new Date().toISOString(),
    status: allPassed ? "healthy" : "degraded",
    checks: results,
  };

  return new Response(JSON.stringify(response, null, 2), {
    status: allPassed ? 200 : 503,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, max-age=0",
    },
  });
};
