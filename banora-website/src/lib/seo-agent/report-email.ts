// Builds and sends the weekly SEO agent report email via Resend.
// Styled to match the existing contact-form email template (src/pages/api/contact.ts).

import type { SearchConsoleReport } from "./search-console";
import type { ReviewAction } from "./review-classifier";

const FROM = "Banora SEO Agent <forms@banorachiropractic.com.au>";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function queryRow(q: SearchConsoleReport["trackedQueries"][number]): string {
  const clickDelta = q.thisWeek.clicks - q.lastWeek.clicks;
  const sign = clickDelta > 0 ? "+" : "";
  return `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;color:#1B3A5C;">${escape(q.query)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:center;">${q.thisWeek.clicks} (${sign}${clickDelta})</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:center;">${q.thisWeek.impressions}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:center;">${q.thisWeek.position || "—"}</td>
    </tr>`;
}

function reviewRow(r: ReviewAction, text: string): string {
  return `
    <tr><td style="padding:12px 0;border-bottom:1px solid #eee;">
      <p style="margin:0 0 4px;font-size:13px;color:#888;">${escape(r.reviewer)} — ${"★".repeat(r.rating)}</p>
      <p style="margin:0 0 8px;font-size:14px;color:#333;">${escape(r.comment || "(no comment)")}</p>
      <p style="margin:0;font-size:13px;color:#2C5F8A;"><strong>Reply:</strong> ${escape(text)}</p>
    </td></tr>`;
}

export function buildReportHtml(
  searchConsole: SearchConsoleReport,
  autoReplied: ReviewAction[],
  needsReply: ReviewAction[],
  reviewsChecked = true
): string {
  const queryRows = searchConsole.trackedQueries.map(queryRow).join("");
  const autoRepliedRows = autoReplied
    .map((r) => (r.kind === "auto_replied" ? reviewRow(r, r.replyText) : ""))
    .join("");
  const needsReplyRows = needsReply
    .map((r) => (r.kind === "draft" ? reviewRow(r, r.draftText) : ""))
    .join("");

  return `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <tr><td style="background:#1B3A5C;padding:24px 32px;">
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">Weekly SEO &amp; Reviews Report</h1>
        <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:13px;">Banora Chiropractic</p>
      </td></tr>
      <tr><td style="padding:28px 32px;">
        <h2 style="font-size:15px;color:#1B3A5C;margin:0 0 10px;">Search Console — tracked keywords</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td style="padding:8px 12px;font-size:12px;text-transform:uppercase;color:#888;">Query</td>
            <td style="padding:8px 12px;font-size:12px;text-transform:uppercase;color:#888;text-align:center;">Clicks</td>
            <td style="padding:8px 12px;font-size:12px;text-transform:uppercase;color:#888;text-align:center;">Impressions</td>
            <td style="padding:8px 12px;font-size:12px;text-transform:uppercase;color:#888;text-align:center;">Avg. position</td>
          </tr>
          ${queryRows}
        </table>

        ${
          autoReplied.length
            ? `<h2 style="font-size:15px;color:#1B3A5C;margin:0 0 10px;">Reviews auto-replied this week (${autoReplied.length})</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">${autoRepliedRows}</table>`
            : ""
        }

        ${
          !reviewsChecked
            ? `<p style="color:#b45309;font-size:13px;background:#fef3c7;padding:10px 12px;border-radius:6px;">Review checking is paused — Google's Business Profile API quota increase is still pending. Search Console data above is unaffected.</p>`
            : needsReply.length
              ? `<h2 style="font-size:15px;color:#1B3A5C;margin:0 0 10px;">Needs your reply (${needsReply.length})</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">${needsReplyRows}</table>
        <p style="color:#666;font-size:13px;margin:8px 0 0;">Open Google Business Profile → Reviews to reply, or approve these in chat with the banora-seo-agent task.</p>`
              : `<p style="color:#666;font-size:13px;">No reviews currently need a manual reply.</p>`
        }
      </td></tr>
      <tr><td style="background:#f0f0f0;padding:14px 32px;text-align:center;border-top:1px solid #e0e0e0;">
        <p style="color:#999;font-size:11px;margin:0;">Banora SEO Agent — automated weekly report</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

export async function sendReportEmail(
  resendApiKey: string,
  toEmail: string,
  html: string
): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [toEmail],
        subject: "Banora — Weekly SEO & Reviews Report",
        html,
      }),
    });

    if (!res.ok) {
      console.error("[seo-agent] Resend send failed", res.status, await res.text());
    }
    return res.ok;
  } catch (err) {
    console.error("[seo-agent] Resend send exception", err);
    return false;
  }
}
