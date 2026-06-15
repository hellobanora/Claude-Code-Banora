// Patient intake form handler — sends formatted email to hello@banorachiropractic.com.au
// Accepts JSON payload from /forms/*.html and returns { ok: true|false }

export const prerender = false;
import type { APIRoute } from 'astro';

const TO = 'hello@banorachiropractic.com.au';
const FROM = 'Banora Website <forms@banorachiropractic.com.au>';

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function renderRow(label: string, value: string): string {
  return `<tr><td style="padding:10px 20px;border-bottom:1px solid #eee;">
    <p style="margin:0 0 3px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#888;">${escape(label)}</p>
    <p style="margin:0;font-size:14px;color:#222;line-height:1.5;white-space:pre-wrap;">${escape(value)}</p>
  </td></tr>`;
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[intake] RESEND_API_KEY missing');
    return json({ ok: false, msg: 'Server config error' }, 500);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, msg: 'Invalid JSON' }, 400);
  }

  if (!payload || typeof payload !== 'object') {
    return json({ ok: false, msg: 'Invalid payload' }, 400);
  }

  // _subject from the form (e.g. "Initial Consultation - Sarah Johnson")
  const rawSubject = String(payload._subject || 'Patient Intake').slice(0, 200);
  const subject = `Banora — ${rawSubject}`;

  // Honeypot — if present, accept silently
  if (payload._gotcha) return json({ ok: true });

  // Render every other field as a row, skipping internal ones
  const rows = Object.entries(payload)
    .filter(([k]) => !k.startsWith('_'))
    .map(([k, v]) => {
      const val = v == null || v === '' ? '—' : String(v);
      return renderRow(k, val.slice(0, 5000));
    })
    .join('');

  if (!rows) {
    return json({ ok: false, msg: 'No data to send' }, 400);
  }

  const html = `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
  <tr><td align="center">
    <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <tr><td style="background:#1B3A5C;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">${escape(rawSubject)}</h1>
        <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:13px;">Patient intake form submission</p>
      </td></tr>
      <tr><td style="padding:0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${rows}
        </table>
      </td></tr>
      <tr><td style="background:#f0f0f0;padding:14px 32px;text-align:center;border-top:1px solid #e0e0e0;">
        <p style="color:#999;font-size:11px;margin:0;">Sent from banorachiropractic.com.au/forms/</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('[intake resend error]', res.status, err);
      return json({ ok: false, msg: 'Send failed (' + res.status + ')' }, 502);
    }
  } catch (e) {
    console.error('[intake resend exception]', e);
    return json({ ok: false, msg: 'Network error' }, 502);
  }

  return json({ ok: true });
};
