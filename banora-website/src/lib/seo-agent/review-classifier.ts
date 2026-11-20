// Decides which un-replied GBP reviews are safe to auto-reply to, and drafts
// text for the rest. Auto-posted replies ALWAYS come from the static
// templates below — never freely generated — so AHPRA compliance (never
// promise outcomes, see CLAUDE.md) holds by construction, not by hoping a
// model call stays compliant. Voice follows .claude/skills/gbp-manager/SKILL.md.

import { starCount, type GbpReview } from "./gbp-reviews";

const RISK_KEYWORDS =
  /\b(refund|sue|lawsuit|complain|rude|hurt|worse|pain (?:got|is) worse|injur\w*|misdiagnos\w*|wrong|cancel(?:led)? my|never again|scam|unprofessional|waiting|wait(?:ed)? (?:over |for )?\d|charge(?:d)?|bill(?:ed)?|insurance|hicaps|reception|cure(?:d)?|fix(?:ed)?|guarantee|diagnos\w*)\b/i;

const MAX_AUTO_REPLY_LENGTH = 280;

// Replies are public, so they must never confirm or imply the reviewer is a patient
// ("see you next time", "glad we could help", "happy patients") or touch on their
// health. Keep them generic: thank them for the review, nothing more.
const POSITIVE_TEMPLATES: Array<(name: string) => string> = [
  (name) => `Thanks ${name} for taking the time to leave a review. It's much appreciated.`,
  (name) => `Thank you for the kind words, ${name}. We'll pass them on to the team.`,
  (name) => `Thanks ${name}, we really appreciate you sharing your feedback.`,
  (name) => `Thank you ${name} for taking the time to write this. It means a lot to the team.`,
];

const NEGATIVE_DRAFT_TEMPLATE = (name: string) =>
  `Hi ${name}, thank you for your feedback. We take every comment seriously and would ` +
  `welcome the chance to talk it through. Please call the clinic on (07) 5599 2322 ` +
  `and ask to speak with Dr James Shipway or Dr Paul Cater.`;

// For a positive-but-flagged review (too long, or mentions something like
// billing/insurance that needs a personal, specific reply) — don't apologise,
// just hand it to a human with a neutral starting point.
const NEEDS_PERSONAL_TOUCH_TEMPLATE = (name: string) =>
  `Thanks ${name} — this one mentions something specific worth replying to personally rather than with a generic thank-you.`;

function firstName(displayName: string | undefined): string {
  const name = (displayName ?? "").trim().split(/\s+/)[0];
  return name || "there";
}

// Simple deterministic string hash — picks a template per review without
// needing any stored state, while still varying across different reviews.
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export type ReviewAction =
  | {
      kind: "auto_replied";
      reviewId: string;
      reviewer: string;
      rating: number;
      comment: string;
      replyText: string;
    }
  | {
      kind: "draft";
      reviewId: string;
      reviewer: string;
      rating: number;
      comment: string;
      draftText: string;
    };

function isLowRisk(review: GbpReview): boolean {
  const comment = review.comment ?? "";
  const rating = starCount(review);

  if (rating < 4) return false;
  if (comment.length === 0) return false; // ambiguous — let a human decide
  if (comment.length > MAX_AUTO_REPLY_LENGTH) return false;
  if (RISK_KEYWORDS.test(comment)) return false;

  return true;
}

export function classifyReviews(reviews: GbpReview[]): ReviewAction[] {
  return reviews.map((review) => {
    const name = firstName(review.reviewer.displayName);
    const rating = starCount(review);
    const comment = review.comment ?? "";

    if (isLowRisk(review)) {
      const template = POSITIVE_TEMPLATES[hashString(review.reviewId) % POSITIVE_TEMPLATES.length];
      return {
        kind: "auto_replied",
        reviewId: review.reviewId,
        reviewer: name,
        rating,
        comment,
        replyText: template(name),
      };
    }

    const draftText = rating <= 3 ? NEGATIVE_DRAFT_TEMPLATE(name) : NEEDS_PERSONAL_TOUCH_TEMPLATE(name);

    return {
      kind: "draft",
      reviewId: review.reviewId,
      reviewer: name,
      rating,
      comment,
      draftText,
    };
  });
}
