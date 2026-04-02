// IconPractice API proxy — all booking API calls route through here
// GET /api/booking?action=...
// POST /api/booking (register appointment via old widget API)

export const prerender = false;
import type { APIRoute } from 'astro';

const BASE     = 'https://app.iconpractice.com';
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

// ---- Confirmation email via Resend ----
async function sendConfirmationEmail(body: any) {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey || !body.customer_email) return;

  const ts = Number(body.ts_schedule_start);
  const apptDate = new Date(ts * 1000);
  const isNew = body.new_patient === 1 || body.new_patient === '1';

  const longDate = apptDate.toLocaleString('en-AU', {
    timeZone: 'Australia/Brisbane',
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
  const shortDate = apptDate.toLocaleDateString('en-AU', {
    timeZone: 'Australia/Brisbane',
    weekday: 'short', day: 'numeric', month: 'short',
  });

  const name = `${body.customer_firstname || ''} ${body.customer_lastname || ''}`.trim();

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#1B3A5C;padding:28px 32px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Banora Chiropractic</h1>
            <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:14px;">Appointment Confirmed</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="color:#1a1a1a;font-size:16px;margin:0 0 16px;">Hi ${name},</p>
            <p style="color:#444;font-size:15px;margin:0 0 24px;line-height:1.6;">
              You're all booked in. Here's a summary of your appointment:
            </p>
            <!-- Details card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;border-radius:8px;border-left:4px solid #2C5F8A;margin-bottom:24px;">
              <tr><td style="padding:20px 20px 4px;">
                <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#888;">Date &amp; Time</p>
                <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#1B3A5C;">${longDate}</p>
              </td></tr>
              <tr><td style="padding:0 20px 4px;">
                <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#888;">Location</p>
                <p style="margin:0 0 16px;font-size:15px;color:#333;">2/44 Greenway Drive, Tweed Heads South NSW 2486<br>
                  <span style="color:#888;font-size:13px;">On-site parking available</span></p>
              </td></tr>
              ${isNew ? `<tr><td style="padding:0 20px 16px;">
                <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#888;">What to expect</p>
                <p style="margin:0;font-size:15px;color:#333;">Initial consultation — allow 30–45 minutes.<br>
                  <span style="color:#888;font-size:13px;">No referral needed. Arrive 5 mins early if possible.</span></p>
              </td></tr>` : ''}
            </table>
            <!-- Reschedule note -->
            <p style="color:#444;font-size:14px;line-height:1.6;margin:0 0 24px;padding:16px;background:#fff8e6;border-radius:8px;border:1px solid #f0d080;">
              Need to reschedule or cancel? Please call us as soon as possible on
              <a href="tel:+61755992322" style="color:#2C5F8A;font-weight:600;">(07) 5599 2322</a>.
            </p>
            <p style="color:#555;font-size:15px;margin:0 0 4px;">We look forward to seeing you!</p>
            <p style="color:#555;font-size:15px;margin:0;">— The team at Banora Chiropractic</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f0f0f0;padding:16px 32px;text-align:center;border-top:1px solid #e0e0e0;">
            <p style="color:#999;font-size:12px;margin:0;">
              Banora Chiropractic &nbsp;·&nbsp; 2/44 Greenway Drive, Tweed Heads South NSW 2486 &nbsp;·&nbsp;
              <a href="tel:+61755992322" style="color:#999;">(07) 5599 2322</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Banora Chiropractic <bookings@banorachiropractic.com.au>',
        to: [body.customer_email],
        subject: `Your appointment on ${shortDate} — Banora Chiropractic`,
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('[resend error]', res.status, err);
    }
  } catch (e) {
    console.error('[resend exception]', e);
  }
}

// ---- GET — proxy to IconPractice REST API ----
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

// ---- POST — register appointment via old widget API ----
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
        'Referer':    widgetUrl,
        'Origin':     OLD_BASE,
        'User-Agent': 'Mozilla/5.0 (compatible; Banora/1.0)',
        ...(cookieStr ? { 'Cookie': cookieStr } : {}),
      },
      body: form.toString(),
    });

    const raw = await r.text();
    console.log('[register_appt response]', r.status, raw.slice(0, 500));

    // Parse response — fall back to success if 2xx but not JSON
    let result: any;
    try {
      result = JSON.parse(raw);
    } catch {
      result = r.ok ? { success: true, confirmed: true } : null;
    }

    if (r.ok && result?.success !== false) {
      // Fire confirmation email (non-blocking — failure won't break the booking)
      sendConfirmationEmail(body).catch(() => {});
      return json(result ?? { success: true, confirmed: true });
    }

    return json({ success: false, message: result?.message || raw.slice(0, 200) || 'Booking failed' }, 502);

  } catch (err) {
    console.error('[proxy POST error]', err);
    return json({ success: false, message: 'Upstream error' }, 502);
  }
};
