// IconPractice API proxy — all booking API calls route through here
// GET /api/booking?action=...
// POST /api/booking (register appointment)

export const prerender = false;
import type { APIRoute } from 'astro';

const BASE = 'https://app.iconpractice.com';
const T1 = import.meta.env.ICONPRACTICE_TOKEN1 || '245386';
const T2 = import.meta.env.ICONPRACTICE_TOKEN2 || '7138';

const PATHS: Record<string, string> = {
  'practices':              '/api/v1/widget/practices',
  'practice-details':       '/api/v1/widget/practice-details',
  'practitioner-services':  '/api/v1/widget/practitioner-services',
  'practitioners-services': '/api/v1/widget/practitioners-services',
  'month-schedule':         '/api/v1/widget/month-schedule',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ url }) => {
  const action = url.searchParams.get('action') ?? '';
  if (!PATHS[action]) return json({ success: false, message: 'Unknown action' }, 400);

  const params = new URLSearchParams(url.searchParams);
  params.delete('action');

  if (['practices', 'practice-details'].includes(action)) {
    params.set('ob_token', T1);
    params.set('ob_token2', T2);
  }

  try {
    const r = await fetch(`${BASE}${PATHS[action]}?${params}`);
    return json(await r.json());
  } catch {
    return json({ success: false, message: 'Upstream error' }, 502);
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    body.ob_token = T1;
    body.ob_token2 = T2;
    // Send as form-encoded — JSON boolean false is treated as empty by Laravel's required rule
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(body)) {
      if (v !== null && v !== undefined) params.set(k, String(v));
    }
    const r = await fetch(`${BASE}/api/v1/widget/register-appointment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    return json(await r.json());
  } catch {
    return json({ success: false, message: 'Upstream error' }, 502);
  }
};
