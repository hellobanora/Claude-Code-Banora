// IconPractice API proxy — all booking API calls route through here
// GET /api/booking?action=...
// POST /api/booking (register appointment via old widget API)

export const prerender = false;
import type { APIRoute } from 'astro';

const BASE = 'https://app.iconpractice.com';
const OLD_BASE = 'https://www.iconpractice.com';
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

    // Step 1: Fetch widget page to get session token + cookies
    const widgetUrl = `${OLD_BASE}/ob/${T2}/banorachiropractic/${T1}/2`;
    const widgetRes = await fetch(widgetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Banora/1.0)' },
    });
    const widgetHtml = await widgetRes.text();

    // Collect session cookies from widget page response
    const setCookies: string[] = (widgetRes.headers as any).getSetCookie?.() ?? [];
    const cookieStr = setCookies.map((c: string) => c.split(';')[0]).join('; ');

    // Extract token from hidden input (handles either attribute order)
    const tokenMatch =
      widgetHtml.match(/name=["']token["'][^>]*value=["']([^"']+)["']/) ||
      widgetHtml.match(/value=["']([^"']+)["'][^>]*name=["']token["']/);
    const token = tokenMatch ? tokenMatch[1] : T1;

    // Step 2: Parse DOB from YYYY-MM-DD
    const [dobYear = '', dobMonth = '', dobDay = ''] = (body.customer_dob || '').split('-');

    // Step 3: Build form-encoded body for old widget API
    const form = new URLSearchParams({
      first_name: body.customer_firstname || '',
      last_name:  body.customer_lastname  || '',
      email:      body.customer_email     || '',
      mobile:     body.customer_mobile    || '',
      dob_day:    dobDay,
      dob_month:  dobMonth,
      dob_year:   dobYear,
      prac_sel:   String(body.practitioner_id   || ''),
      appt_type:  String(body.service_item_id   || ''),
      tss:        String(body.ts_schedule_start || ''),
      tse:        String(body.ts_schedule_end   || ''),
      pid:        String(body.practice_id       || ''),
      token,
      existing:   String(body.existing ?? 0),
    });

    // Step 4: POST to old widget API with session cookies
    const r = await fetch(`${OLD_BASE}/ob/ajax/register_appt.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer':  widgetUrl,
        'Origin':   OLD_BASE,
        'User-Agent': 'Mozilla/5.0 (compatible; Banora/1.0)',
        ...(cookieStr ? { 'Cookie': cookieStr } : {}),
      },
      body: form.toString(),
    });

    const result = await r.json();
    return json(result);
  } catch (err) {
    console.error('[proxy POST error]', err);
    return json({ success: false, message: 'Upstream error' }, 502);
  }
};
