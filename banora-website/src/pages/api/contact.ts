// Contact form handler — sends email via Resend to hello@banorachiropractic.com.au
// Accepts traditional form-encoded POST (no JS required) and redirects to /thank-you/

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

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY missing');
    return new Response('Server config error', { status: 500 });
  }

  const ct = request.headers.get('content-type') || '';
  const form = ct.includes('application/json')
    ? new URLSearchParams(Object.entries(await request.json()).map(([k, v]) => [k, String(v)]))
    : new URLSearchParams(await request.text());

  if (form.get('_gotcha')) {
    return redirect('/thank-you/', 303);
  }

  const name = (form.get('name') || '').trim().slice(0, 200);
  const email = (form.get('email') || '').trim().slice(0, 200);
  const phone = (form.get('phone') || '').trim().slice(0, 50);
  const message = (form.get('message') || '').trim().slice(0, 5000);
  const next = (form.get('_next') || '/thank-you/').trim();

  if (!name || !email || !message || !isEmail(email)) {
    return new Response('Missing or invalid fields', { status: 400 });
  }

  const html = `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <tr><td style="background:#1B3A5C;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">New Contact Enquiry</h1>
        <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:13px;">From the Banora Chiropractic website</p>
      </td></tr>
      <tr><td style="padding:28px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;border-radius:8px;border-left:4px solid #2C5F8A;">
          <tr><td style="padding:18px 20px 4px;">
            <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#888;">Name</p>
            <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#1B3A5C;">${escape(name)}</p>
          </td></tr>
          <tr><td style="padding:0 20px 4px;">
            <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#888;">Email</p>
            <p style="margin:0 0 16px;font-size:15px;color:#333;"><a href="mailto:${escape(email)}" style="color:#2C5F8A;">${escape(email)}</a></p>
          </td></tr>
          ${phone ? `<tr><td style="padding:0 20px 4px;">
            <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#888;">Phone</p>
            <p style="margin:0 0 16px;font-size:15px;color:#333;"><a href="tel:${escape(phone)}" style="color:#2C5F8A;">${escape(phone)}</a></p>
          </td></tr>` : ''}
          <tr><td style="padding:0 20px 18px;">
            <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#888;">Message</p>
            <p style="margin:0;font-size:15px;color:#333;line-height:1.6;white-space:pre-wrap;">${escape(message)}</p>
          </td></tr>
        </table>
        <p style="color:#666;font-size:13px;margin:20px 0 0;line-height:1.6;">
          Reply to this email to respond directly to ${escape(name)}.
        </p>
      </td></tr>
      <tr><td style="background:#f0f0f0;padding:14px 32px;text-align:center;border-top:1px solid #e0e0e0;">
        <p style="color:#999;font-size:11px;margin:0;">Sent from banorachiropractic.com.au/contact</p>
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
        reply_to: email,
        subject: `Banora — Contact enquiry from ${name}`,
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('[contact resend error]', res.status, err);
      return new Response('Email send failed', { status: 502 });
    }
  } catch (e) {
    console.error('[contact resend exception]', e);
    return new Response('Email send failed', { status: 502 });
  }

  return redirect(next, 303);
};
