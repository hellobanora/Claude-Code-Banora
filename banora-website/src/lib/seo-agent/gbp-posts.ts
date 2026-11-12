// Google Business Profile "Posts" — read src/data about why these are
// pre-written, not generated: a previous post was denied by Google for
// clinical-claim language ("we treat X"). Every post here is fixed,
// pre-vetted copy in a patient-tip/FAQ style (matching .claude/skills/
// gbp-manager/SKILL.md's own example posts) — never auto-generated at
// request time, and never auto-published; always drafted for approval.

export type CtaType = "BOOK" | "LEARN_MORE" | "CALL";

export interface GbpPostDraft {
  id: string;
  summary: string;
  imageFileName: string; // relative to /public/images/
  ctaType: CtaType;
  ctaPath?: string; // site-relative path, e.g. "/conditions/sciatica/" — omitted for CALL
}

// 8 posts = 2 full cycles of gbp-manager's 4-week rotation (health tip,
// behind-the-scenes, FAQ, community/practical) — rotated by ISO week number
// so the choice is deterministic without needing any stored state.
export const POST_ROTATION: GbpPostDraft[] = [
  {
    id: "sciatica-tip",
    summary:
      "Sciatica — that sharp pain running from your lower back down the leg — often eases with gentle movement rather than rest. Stretches like the piriformis stretch or a slow knee-to-chest pull may help take some pressure off the nerve. If it's been hanging around for more than a couple of weeks, it's worth getting properly assessed rather than just stretching and hoping. Call (07) 5599 2322 or book online.",
    imageFileName: "hero-back-neck.jpg",
    ctaType: "LEARN_MORE",
    ctaPath: "/conditions/sciatica/",
  },
  {
    id: "team-post",
    summary:
      "Six days a week, Dr James Shipway and Dr Paul Cater have been looking after Tweed Heads South and the surrounding suburbs from the same clinic on Greenway Drive. Ground floor access, free parking right out front, and no referral needed to book in.",
    imageFileName: "team-both-doctors.jpg",
    ctaType: "BOOK",
    ctaPath: "/book/",
  },
  {
    id: "faq-referral",
    summary:
      "‘Do I need a referral to see a chiropractor?’ Nope — chiropractors are primary contact practitioners, so you can book directly with us. If you’ve got a Medicare care plan from your GP, bring it along, but it’s not required to get started.",
    imageFileName: "clinic-spinal-adjustment.jpg",
    ctaType: "BOOK",
    ctaPath: "/book/",
  },
  {
    id: "hicaps-tip",
    summary:
      "We have HICAPS on-site, so if your health fund covers chiropractic, your rebate is processed on the spot — you only pay the gap. We also accept DVA and WorkCover. Ask at reception or give us a call on (07) 5599 2322 if you’re not sure what your cover includes.",
    imageFileName: "hero-all-ages.jpg",
    ctaType: "CALL",
  },
  {
    id: "neck-posture-tip",
    summary:
      "Hours at a desk or on your phone can leave your neck and shoulders feeling tight by the end of the day. Try bringing your screen up to eye level and taking a short movement break every 45 minutes or so — small changes that add up. If stiffness is sticking around, it’s worth having it assessed.",
    imageFileName: "clinic-neck-assessment.jpg",
    ctaType: "LEARN_MORE",
    ctaPath: "/conditions/neck-pain/",
  },
  {
    id: "sports-tip",
    summary:
      "Whether it’s surfing at Duranbah, a weekend game, or just getting back into training, niggles are common when you push your body. The ones worth paying attention to are the ones that keep coming back in the same spot — that’s often a sign something underneath needs a proper look, not just rest.",
    imageFileName: "hero-sports.jpg",
    ctaType: "LEARN_MORE",
    ctaPath: "/services/sports-chiropractic/",
  },
  {
    id: "faq-hours",
    summary:
      "‘Are you open on weekends?’ Yes — Saturday mornings from 8am to midday. We’re also open until 6pm Monday, Tuesday and Thursday for anyone who can’t get in during a standard 9-to-5.",
    imageFileName: "clinic-adjustment-wide.jpg",
    ctaType: "BOOK",
    ctaPath: "/book/",
  },
  {
    id: "headache-tip",
    summary:
      "Headaches that start at the base of the skull and spread forward are often linked to tension in the neck and upper back — not just ‘a headache’. Simple changes like adjusting screen height and taking regular breaks can help, and if they’re frequent, it’s worth finding out what’s actually driving them.",
    imageFileName: "hero-chiro-exam.jpg",
    ctaType: "LEARN_MORE",
    ctaPath: "/conditions/headaches-migraines/",
  },
];

function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function pickThisWeeksPost(now: Date = new Date()): GbpPostDraft {
  const week = isoWeekNumber(now);
  return POST_ROTATION[week % POST_ROTATION.length];
}

export async function createLocalPost(
  accessToken: string,
  accountId: string,
  locationId: string,
  draft: { summary: string; imageUrl: string; ctaType: CtaType; ctaUrl?: string }
): Promise<void> {
  const body: Record<string, unknown> = {
    languageCode: "en-AU",
    summary: draft.summary,
    topicType: "STANDARD",
    media: [{ mediaFormat: "PHOTO", sourceUrl: draft.imageUrl }],
  };

  if (draft.ctaType === "CALL") {
    body.callToAction = { actionType: "CALL" };
  } else if (draft.ctaUrl) {
    body.callToAction = { actionType: draft.ctaType, url: draft.ctaUrl };
  }

  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/${accountId}/${locationId}/localPosts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GBP post create failed (${res.status}): ${err}`);
  }
}
