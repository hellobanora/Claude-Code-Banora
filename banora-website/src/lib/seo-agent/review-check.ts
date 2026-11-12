// Shared GBP review check + classify + auto-reply logic, used by both the
// weekly full SEO report and the standalone, more frequent review-only check.

import { listUnrepliedReviews, postReply } from "./gbp-reviews";
import { classifyReviews, type ReviewAction } from "./review-classifier";

export interface ReviewCheckEnv {
  accessToken: string;
  accountId?: string;
  locationId?: string;
}

export interface ReviewCheckResult {
  autoReplied: ReviewAction[];
  needsReply: ReviewAction[];
  checked: boolean;
  error: string | null;
}

export async function runReviewCheck(env: ReviewCheckEnv, logPrefix: string): Promise<ReviewCheckResult> {
  const { accessToken, accountId, locationId } = env;
  const gbpConfigured = Boolean(accountId && locationId);

  if (!gbpConfigured) {
    console.warn(
      `${logPrefix} GBP_ACCOUNT_ID/GBP_LOCATION_ID not set — skipping review checks`
    );
    return { autoReplied: [], needsReply: [], checked: false, error: null };
  }

  let error: string | null = null;
  const unrepliedReviews = await listUnrepliedReviews(accessToken, accountId!, locationId!).catch((err) => {
    console.error(`${logPrefix} GBP review list failed`, err);
    error = err instanceof Error ? err.message : String(err);
    return [];
  });

  // "checked" means we actually got a successful review list back, not just
  // that the env vars were present — a thrown error must never be silently
  // reported as "nothing needs attention".
  const checked = !error;

  const classified = classifyReviews(unrepliedReviews);
  const autoReplied = classified.filter((r) => r.kind === "auto_replied");
  const needsReply = classified.filter((r) => r.kind === "draft");

  if (checked) {
    for (const review of autoReplied) {
      if (review.kind !== "auto_replied") continue;
      try {
        await postReply(accessToken, accountId!, locationId!, review.reviewId, review.replyText);
        console.log(`${logPrefix} auto-replied to review ${review.reviewId}`);
      } catch (err) {
        console.error(`${logPrefix} failed to post reply for review ${review.reviewId}`, err);
      }
    }
  }

  return { autoReplied, needsReply, checked, error };
}
