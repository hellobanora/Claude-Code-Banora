// Google Business Profile review read/reply.
// Account + location discovery moved to the Business Profile APIs, but review
// read/reply still lives on the legacy "Google My Business API" v4 resource.
// Verify field names against https://developers.google.com/my-business/reference/rest
// if Google changes this again.

export interface GbpReview {
  reviewId: string;
  reviewer: { displayName?: string };
  starRating: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  comment?: string;
  createTime: string;
  reviewReply?: { comment: string; updateTime: string };
}

const STAR_VALUE: Record<GbpReview["starRating"], number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

export function starCount(review: GbpReview): number {
  return STAR_VALUE[review.starRating] ?? 0;
}

export async function listUnrepliedReviews(
  accessToken: string,
  accountId: string,
  locationId: string
): Promise<GbpReview[]> {
  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GBP reviews list failed (${res.status}): ${err}`);
  }

  const data = (await res.json()) as { reviews?: GbpReview[] };
  const reviews = data.reviews ?? [];
  return reviews.filter((r) => !r.reviewReply);
}

export async function postReply(
  accessToken: string,
  accountId: string,
  locationId: string,
  reviewId: string,
  text: string
): Promise<void> {
  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: text }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GBP reply post failed for review ${reviewId} (${res.status}): ${err}`);
  }
}
