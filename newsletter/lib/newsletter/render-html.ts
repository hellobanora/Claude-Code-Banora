// =============================================================================
// BANORA CHIROPRACTIC — NEWSLETTER HTML RENDERER
// File: lib/newsletter/render-html.ts
// =============================================================================
//
// Converts Claude's newsletter JSON output into a full table-based HTML email
// compatible with Gmail, Apple Mail, Outlook, and Mailchimp.
//
// Used by:
//   api/preview.ts        — returns this HTML as the preview page
//   api/send-newsletter.ts — sends this HTML as the Mailchimp campaign content
//
// Image placeholders: evergreen images (logo, team, clinic) use env var URLs
// when set; seasonal images (hero, diagram, product) use placeholders and
// should be swapped in Mailchimp Content Studio before final send.
// =============================================================================

// ─── Types ───────────────────────────────────────────────────────────────────

export type NewsletterContent = {
  issue_number: number;
  month: string;
  subject_line: string;
  preview_text: string;
  sections: {
    seasonal_health: {
      label: string;
      headline: string;
      body_html: string;
      tips: Array<{ title: string; body: string }>;
      image_slots: { hero: string; tips_sidebar: string };
    };
    education_spotlight: {
      label: string;
      headline: string;
      body_html: string;
      region_cards: Array<{ region: string; description: string }>;
      image_slots: { diagram: string };
    };
    product_of_month: {
      label: string;
      product_name: string;
      brand: string;
      description: string;
      benefit_pills: string[];
      who_benefits: string[];
      image_slots: { product_photo: string };
    };
    clinic_news: {
      label: string;
      headline: string;
      doctors_note: string;
      updates: Array<{ icon: string; title: string; body: string }>;
      image_slots: { team_photo: string; clinic_banner: string };
    };
    cta: {
      headline: string;
      body: string;
      button_label: string;
      button_url: string;
      phone_line: string;
    };
  };
};

// ─── Section renderers ───────────────────────────────────────────────────────

function renderTip(tip: { title: string; body: string }, index: number, isLast: boolean): string {
  const marginStyle = isLast ? '' : 'margin-bottom:14px;';
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${marginStyle}">
      <tr>
        <td valign="top" style="width:36px;padding-right:14px;">
          <div style="width:36px;height:36px;background:#FFD232;border-radius:6px;text-align:center;line-height:36px;font-family:'Outfit',Arial,sans-serif;font-size:15px;font-weight:600;color:#1B3A5C;">${index + 1}</div>
        </td>
        <td valign="middle">
          <div style="font-family:'Outfit',Arial,sans-serif;font-size:14px;color:#FFFFFF;line-height:1.5;"><span style="font-weight:600;">${escapeHtml(tip.title)}.</span> ${escapeHtml(tip.body)}</div>
        </td>
      </tr>
    </table>`;
}

function renderRegionCardPair(
  left: { region: string; description: string },
  right: { region: string; description: string } | null,
  isLast: boolean
): string {
  const marginStyle = isLast ? '' : 'margin-bottom:10px;';
  const rightCell = right
    ? `<td class="mobile-full region-card" valign="top" style="width:50%;padding-left:8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E5E7EB;border-radius:8px;">
          <tr>
            <td style="padding:16px 16px 14px 16px;">
              <div style="font-family:'Outfit',Arial,sans-serif;font-size:13px;font-weight:600;color:#1B3A5C;margin-bottom:6px;">${escapeHtml(right.region)}</div>
              <div style="font-family:'Outfit',Arial,sans-serif;font-size:13px;color:#6B7280;line-height:1.5;">${escapeHtml(right.description)}</div>
            </td>
          </tr>
        </table>
      </td>`
    : `<td style="width:50%;padding-left:8px;"></td>`;

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${marginStyle}">
      <tr>
        <td class="mobile-full region-card" valign="top" style="width:50%;padding-right:8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E5E7EB;border-radius:8px;">
            <tr>
              <td style="padding:16px 16px 14px 16px;">
                <div style="font-family:'Outfit',Arial,sans-serif;font-size:13px;font-weight:600;color:#1B3A5C;margin-bottom:6px;">${escapeHtml(left.region)}</div>
                <div style="font-family:'Outfit',Arial,sans-serif;font-size:13px;color:#6B7280;line-height:1.5;">${escapeHtml(left.description)}</div>
              </td>
            </tr>
          </table>
        </td>
        ${rightCell}
      </tr>
    </table>`;
}

function renderBenefitPillRow(pills: string[]): string {
  const rows: string[] = [];
  for (let i = 0; i < pills.length; i += 2) {
    const left = pills[i];
    const right = pills[i + 1];
    rows.push(`
      <tr>
        <td class="pill" style="padding-right:6px;padding-bottom:6px;">
          <div style="display:inline-block;border:1px solid #5B9EC9;color:#5B9EC9;font-family:'Outfit',Arial,sans-serif;font-size:11px;font-weight:500;padding:5px 11px;border-radius:20px;white-space:nowrap;">${escapeHtml(left)}</div>
        </td>
        ${right
          ? `<td class="pill" style="padding-bottom:6px;">
              <div style="display:inline-block;border:1px solid #5B9EC9;color:#5B9EC9;font-family:'Outfit',Arial,sans-serif;font-size:11px;font-weight:500;padding:5px 11px;border-radius:20px;white-space:nowrap;">${escapeHtml(right)}</div>
            </td>`
          : '<td></td>'}
      </tr>`);
  }
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">${rows.join('')}</table>`;
}

function renderWhoBenefitsRow(item: string, isLast: boolean): string {
  const paddingStyle = isLast ? '' : 'padding-bottom:8px;';
  return `
    <tr>
      <td valign="top" style="${paddingStyle}">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="width:20px;padding-right:10px;color:#5B9EC9;font-size:16px;line-height:20px;">&#8594;</td>
            <td style="font-family:'Outfit',Arial,sans-serif;font-size:14px;color:#374151;line-height:1.5;">${escapeHtml(item)}</td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function renderUpdateCard(update: { icon: string; title: string; body: string }, isLast: boolean): string {
  const marginStyle = isLast ? '' : 'margin-bottom:12px;';
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E5E7EB;border-radius:8px;${marginStyle}">
      <tr>
        <td style="padding:18px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="top" style="padding-right:14px;font-size:22px;line-height:1;">${update.icon}</td>
              <td valign="top">
                <div style="font-family:'Outfit',Arial,sans-serif;font-size:14px;font-weight:600;color:#1B3A5C;margin-bottom:4px;">${escapeHtml(update.title)}</div>
                <div style="font-family:'Outfit',Arial,sans-serif;font-size:13px;color:#6B7280;line-height:1.55;">${escapeHtml(update.body)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

// ─── Image helpers ────────────────────────────────────────────────────────────

function logoUrl(): string {
  return process.env.IMG_LOGO_URL
    ?? 'https://brand-assets.mailchimp.com/01KNR169260A5P9EKMG0ZXQ412.png';
}

function teamPhotoUrl(): string {
  return process.env.IMG_TEAM_URL
    ?? 'https://placehold.co/200x200/E8F0F8/1B3A5C?text=Team+Photo';
}

function clinicBannerUrl(): string {
  return process.env.IMG_CLINIC_BANNER_URL
    ?? 'https://placehold.co/520x220/E8F0F8/1B3A5C?text=Clinic+Banner';
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#8217;')
    .replace(/—/g, '&#8212;')
    .replace(/–/g, '&#8211;');
}

function padIssue(n: number): string {
  return String(n).padStart(2, '0');
}

// ─── Main render function ────────────────────────────────────────────────────

export function renderNewsletterHtml(
  content: NewsletterContent,
  opts: { isPreview?: boolean } = {}
): string {
  const { sections } = content;
  const s = sections;

  // Tips
  const tipsHtml = s.seasonal_health.tips
    .map((t, i) => renderTip(t, i, i === s.seasonal_health.tips.length - 1))
    .join('');

  // Region card rows (pairs)
  const cards = s.education_spotlight.region_cards;
  const regionRowsHtml = Array.from({ length: Math.ceil(cards.length / 2) }, (_, i) =>
    renderRegionCardPair(cards[i * 2], cards[i * 2 + 1] ?? null, i === Math.ceil(cards.length / 2) - 1)
  ).join('');

  // Benefit pills
  const benefitPillsHtml = renderBenefitPillRow(s.product_of_month.benefit_pills);

  // Who benefits
  const whoBenefitsHtml = s.product_of_month.who_benefits
    .map((item, i) => renderWhoBenefitsRow(item, i === s.product_of_month.who_benefits.length - 1))
    .join('');

  // Update cards
  const updateCardsHtml = s.clinic_news.updates
    .map((u, i) => renderUpdateCard(u, i === s.clinic_news.updates.length - 1))
    .join('');

  // Preview banner (only shown in browser preview, not in email send)
  const previewBanner = opts.isPreview
    ? `<div style="background:#FFD232;padding:12px 24px;text-align:center;font-family:Arial,sans-serif;font-size:13px;font-weight:600;color:#1B3A5C;">
        &#128065; PREVIEW — Not yet sent &nbsp;&middot;&nbsp; Images are placeholders
      </div>`
    : '';

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="format-detection" content="telephone=no" />
  <!--[if mso]>
  <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  <![endif]-->
  <title>${escapeHtml(content.subject_line)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet" type="text/css" />
  <!--[if mso]><style>* { font-family: Arial, sans-serif !important; }</style><![endif]-->
  <style type="text/css">
    body, #bodyTable { margin:0 !important; padding:0 !important; width:100% !important; }
    img { border:0; display:block; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
    table { border-collapse:collapse !important; mso-table-lspace:0pt; mso-table-rspace:0pt; }
    a { color:inherit; }
    @media only screen and (max-width:640px) {
      .email-body     { width:100% !important; }
      .mobile-full    { width:100% !important; display:block !important; }
      .mobile-hide    { display:none !important; }
      .mobile-pad     { padding-left:24px !important; padding-right:24px !important; }
      .mobile-text-md { font-size:22px !important; line-height:30px !important; }
      .region-card    { margin-bottom:10px !important; }
      .pill           { margin-bottom:8px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F0EDE8;font-family:'Outfit',Arial,sans-serif;">

  ${previewBanner}

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#F0EDE8;">
    ${escapeHtml(content.preview_text)}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F0EDE8">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table class="email-body" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">


          <!-- ══ HEADER ════════════════════════════════════════════════════ -->
          <tr>
            <td bgcolor="#1B3A5C" style="border-radius:12px 12px 0 0;padding:20px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="width:50%;">
                    <img src="${logoUrl()}" width="160" height="103" alt="Banora Chiropractic" style="display:block;width:160px;height:103px;filter:brightness(0) invert(1);" />
                  </td>
                  <td valign="middle" align="right" style="width:50%;">
                    <div style="font-family:'Outfit',Arial,sans-serif;font-size:10px;font-weight:500;color:#FFD232;letter-spacing:0.1em;text-transform:uppercase;">Issue No. ${padIssue(content.issue_number)}</div>
                    <div style="font-family:'Outfit',Arial,sans-serif;font-size:14px;font-weight:500;color:#FFFFFF;margin-top:2px;">${escapeHtml(content.month)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero image -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:0;">
              <img src="https://placehold.co/600x280/1B3A5C/FFFFFF?text=${encodeURIComponent('REPLACE: ' + s.seasonal_health.image_slots.hero.slice(0, 60))}"
                   width="600" height="280" alt="${escapeHtml(s.seasonal_health.image_slots.hero)}"
                   style="width:100%;max-width:600px;height:auto;display:block;" />
            </td>
          </tr>


          <!-- ══ SECTION 1 — Seasonal Health ═══════════════════════════════ -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:40px 40px 0 40px;" class="mobile-pad">
              <div style="font-family:'Outfit',Arial,sans-serif;font-size:10px;font-weight:600;color:#1B3A5C;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:12px;">${escapeHtml(s.seasonal_health.label)}</div>
              <div class="mobile-text-md" style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:600;color:#1B3A5C;line-height:1.2;margin-bottom:20px;">${escapeHtml(s.seasonal_health.headline)}</div>
            </td>
          </tr>

          <!-- 2-column: body copy + sidebar image -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:0 40px 32px 40px;" class="mobile-pad">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="mobile-full" valign="top" style="width:316px;padding-right:24px;">
                    <div style="font-family:'Outfit',Arial,sans-serif;font-size:15px;color:#374151;line-height:1.7;">${s.seasonal_health.body_html}</div>
                  </td>
                  <td class="mobile-full mobile-hide" valign="top" style="width:240px;">
                    <img src="https://placehold.co/240x240/E8F0F8/1B3A5C?text=${encodeURIComponent(s.seasonal_health.image_slots.tips_sidebar.slice(0, 40))}"
                         width="240" height="240" alt="${escapeHtml(s.seasonal_health.image_slots.tips_sidebar)}"
                         style="border-radius:8px;width:240px;height:240px;object-fit:cover;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Tips card — navy panel -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:0 40px 40px 40px;" class="mobile-pad">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1B3A5C;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:28px 28px 28px 28px;">
                    <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:600;color:#FFFFFF;line-height:1.2;margin-bottom:20px;">Your ${escapeHtml(content.sections.seasonal_health.headline.split(':')[0] ?? 'Health')} Guide</div>
                    ${tipsHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:0 40px;" class="mobile-pad">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top:1px solid #E5E7EB;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>


          <!-- ══ SECTION 2 — Education Spotlight ═══════════════════════════ -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:36px 40px 0 40px;" class="mobile-pad">
              <div style="font-family:'Outfit',Arial,sans-serif;font-size:10px;font-weight:600;color:#1B3A5C;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:12px;">${escapeHtml(s.education_spotlight.label)}</div>
              <div class="mobile-text-md" style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:600;color:#1B3A5C;line-height:1.2;margin-bottom:20px;">${escapeHtml(s.education_spotlight.headline)}</div>
              <div style="font-family:'Outfit',Arial,sans-serif;font-size:15px;color:#374151;line-height:1.7;margin-bottom:24px;">${s.education_spotlight.body_html}</div>
            </td>
          </tr>

          <!-- Education diagram -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:0 40px 24px 40px;" class="mobile-pad">
              <img src="https://placehold.co/520x300/F0EDE8/1B3A5C?text=${encodeURIComponent('REPLACE: ' + s.education_spotlight.image_slots.diagram.slice(0, 60))}"
                   width="520" height="300" alt="${escapeHtml(s.education_spotlight.image_slots.diagram)}"
                   style="width:100%;max-width:520px;height:auto;border-radius:8px;display:block;" />
            </td>
          </tr>

          <!-- Region cards -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:0 40px 16px 40px;" class="mobile-pad">

              <!-- Panel header -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F9FA;border:1px solid #E5E7EB;border-radius:8px 8px 0 0;">
                <tr>
                  <td style="padding:12px 16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="middle">
                          <div style="font-family:'Outfit',Arial,sans-serif;font-size:14px;font-weight:600;color:#1B3A5C;">${escapeHtml(s.education_spotlight.headline)}</div>
                        </td>
                        <td valign="middle" align="right">
                          <div style="display:inline-block;background:#FFD232;color:#1B3A5C;font-family:'Outfit',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:4px 10px;border-radius:4px;">Patient Education</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Info note -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F8F9FA;border:1px solid #E5E7EB;border-top:0;margin-bottom:16px;">
                <tr>
                  <td style="padding:12px 16px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="top" style="padding-right:10px;padding-top:1px;">
                          <div style="width:20px;height:20px;background:#E8F0F8;border-radius:4px;text-align:center;line-height:20px;font-family:'Outfit',Arial,sans-serif;font-size:11px;font-weight:600;color:#1B3A5C;">i</div>
                        </td>
                        <td valign="top">
                          <div style="font-family:'Outfit',Arial,sans-serif;font-size:13px;color:#6B7280;line-height:1.5;font-style:italic;">Ask Dr James or Dr Paul about any of these areas at your next visit.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${regionRowsHtml}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:24px 40px 0 40px;" class="mobile-pad">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top:1px solid #E5E7EB;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>


          <!-- ══ SECTION 3 — Product of the Month ══════════════════════════ -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:36px 40px 0 40px;" class="mobile-pad">
              <div style="font-family:'Outfit',Arial,sans-serif;font-size:10px;font-weight:600;color:#FFD232;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:12px;">${escapeHtml(s.product_of_month.label)}</div>
            </td>
          </tr>

          <tr>
            <td bgcolor="#FFFFFF" style="padding:0 40px 36px 40px;" class="mobile-pad">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Product info -->
                  <td class="mobile-full" valign="top" style="width:300px;padding-right:24px;">
                    <div style="display:inline-block;border:1px solid #1B3A5C;color:#1B3A5C;font-family:'Outfit',Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;padding:4px 8px;border-radius:4px;margin-bottom:12px;">Practitioner Grade</div>
                    <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;font-weight:600;color:#1B3A5C;line-height:1.15;margin-bottom:4px;">${escapeHtml(s.product_of_month.product_name)}</div>
                    <div style="font-family:'Outfit',Arial,sans-serif;font-size:12px;color:#9E9E9E;letter-spacing:0.08em;margin-bottom:14px;">${escapeHtml(s.product_of_month.brand)}</div>
                    <div style="font-family:'Outfit',Arial,sans-serif;font-size:14px;color:#374151;line-height:1.65;margin-bottom:18px;">${escapeHtml(s.product_of_month.description)}</div>
                    ${benefitPillsHtml}
                  </td>
                  <!-- Product image -->
                  <td class="mobile-full" valign="top" style="width:196px;">
                    <img src="https://placehold.co/196x256/F8F9FA/9E9E9E?text=${encodeURIComponent('REPLACE: ' + s.product_of_month.product_name.slice(0, 30))}"
                         width="196" height="256" alt="${escapeHtml(s.product_of_month.image_slots.product_photo)}"
                         style="border-radius:8px;border:1px solid #E5E7EB;width:196px;max-width:100%;height:auto;display:block;" />
                  </td>
                </tr>
              </table>

              <div style="font-family:'Outfit',Arial,sans-serif;font-size:10px;font-weight:600;color:#9E9E9E;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:12px;margin-top:20px;">Who Benefits Most</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${whoBenefitsHtml}
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:0 40px;" class="mobile-pad">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="border-top:1px solid #E5E7EB;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>


          <!-- ══ SECTION 4 — From the Clinic ═══════════════════════════════ -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:36px 40px 0 40px;" class="mobile-pad">
              <div style="font-family:'Outfit',Arial,sans-serif;font-size:10px;font-weight:600;color:#1B3A5C;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:12px;">${escapeHtml(s.clinic_news.label)}</div>
              <div class="mobile-text-md" style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:600;color:#1B3A5C;line-height:1.2;margin-bottom:24px;">${escapeHtml(s.clinic_news.headline)}</div>
            </td>
          </tr>

          <!-- Team photo + doctors note -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:0 40px 28px 40px;" class="mobile-pad">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="mobile-full mobile-hide" valign="top" style="width:200px;padding-right:24px;">
                    <img src="${teamPhotoUrl()}" width="200" height="200"
                         alt="Dr James and Dr Paul"
                         style="border-radius:8px;width:200px;height:200px;object-fit:cover;display:block;" />
                  </td>
                  <td class="mobile-full" valign="top">
                    <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:500;color:#1B3A5C;margin-bottom:6px;">A Note from Dr James &amp; Dr Paul</div>
                    <div style="font-family:'Outfit',Arial,sans-serif;font-size:12px;color:#9E9E9E;margin-bottom:12px;">Your Chiropractors &middot; Banora Chiropractic</div>
                    <div style="font-family:'Outfit',Arial,sans-serif;font-size:14px;color:#374151;line-height:1.7;">${escapeHtml(s.clinic_news.doctors_note)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Update cards -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:0 40px 28px 40px;" class="mobile-pad">
              ${updateCardsHtml}
            </td>
          </tr>

          <!-- Clinic banner -->
          <tr>
            <td bgcolor="#FFFFFF" style="padding:0 40px 40px 40px;" class="mobile-pad">
              <img src="${clinicBannerUrl()}" width="520" height="220"
                   alt="Banora Chiropractic clinic"
                   style="width:100%;max-width:520px;height:auto;border-radius:8px;display:block;" />
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;color:#9E9E9E;margin-top:12px;">Banora Chiropractic</div>
              <div style="font-family:'Outfit',Arial,sans-serif;font-size:13px;color:#9E9E9E;margin-top:2px;">2/44 Greenway Drive, Tweed Heads South NSW 2486</div>
            </td>
          </tr>


          <!-- ══ SECTION 5 — CTA ════════════════════════════════════════════ -->
          <tr>
            <td bgcolor="#1B3A5C" style="padding:48px 40px;text-align:center;" class="mobile-pad">
              <div style="width:56px;height:56px;background:rgba(255,255,255,0.1);border:2px solid rgba(255,210,50,0.4);border-radius:50%;margin:0 auto 20px;text-align:center;line-height:56px;font-size:24px;">&#128197;</div>
              <div class="mobile-text-md" style="font-family:'Cormorant Garamond',Georgia,serif;font-size:30px;font-weight:600;color:#FFFFFF;line-height:1.2;margin-bottom:14px;">${escapeHtml(s.cta.headline)}</div>
              <div style="font-family:'Outfit',Arial,sans-serif;font-size:15px;color:#C5D8E8;line-height:1.6;max-width:380px;margin:0 auto 28px;">${escapeHtml(s.cta.body)}</div>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px;">
                <tr>
                  <td style="background:#FFFFFF;border-radius:8px;">
                    <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${s.cta.button_url}" style="height:50px;v-text-anchor:middle;width:240px;" arcsize="12%" fillcolor="#FFFFFF"><w:anchorlock/><center style="font-family:Arial,sans-serif;font-size:15px;font-weight:bold;color:#1B3A5C;">${escapeHtml(s.cta.button_label)}</center></v:roundrect><![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${s.cta.button_url}" style="display:inline-block;background:#FFFFFF;color:#1B3A5C;font-family:'Outfit',Arial,sans-serif;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:8px;min-width:200px;text-align:center;">${escapeHtml(s.cta.button_label)}</a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>
              <div style="font-family:'Outfit',Arial,sans-serif;font-size:14px;color:#8BA9C4;">${escapeHtml(s.cta.phone_line.replace('07 5599 2322', ''))}<a href="tel:0755992322" style="color:#FFD232;font-weight:500;text-decoration:none;">07 5599 2322</a></div>
            </td>
          </tr>


          <!-- ══ FOOTER ════════════════════════════════════════════════════ -->
          <tr>
            <td bgcolor="#F0EDE8" style="border-radius:0 0 12px 12px;padding:28px 40px;" class="mobile-pad">
              <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;color:#6B7280;margin-bottom:2px;">Banora Chiropractic</div>
              <div style="font-family:'Outfit',Arial,sans-serif;font-size:12px;color:#9E9E9E;line-height:1.6;margin-bottom:16px;">
                2/44 Greenway Drive<br />
                Tweed Heads South NSW 2486<br />
                <a href="tel:0755992322" style="color:#9E9E9E;text-decoration:none;">07 5599 2322</a> &middot;
                <a href="mailto:info@banorachiropractic.com.au" style="color:#9E9E9E;text-decoration:none;">info@banorachiropractic.com.au</a>
              </div>
              <div style="font-family:'Outfit',Arial,sans-serif;font-size:11px;color:#9E9E9E;line-height:1.8;">
                You&#8217;re receiving this because you&#8217;re a valued patient of Banora Chiropractic.<br />
                <a href="*|UNSUB|*" style="color:#6B7280;text-decoration:underline;">Unsubscribe</a>
                &nbsp;&middot;&nbsp;
                <a href="*|UPDATE_PROFILE|*" style="color:#6B7280;text-decoration:underline;">Update preferences</a>
              </div>
            </td>
          </tr>


        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
