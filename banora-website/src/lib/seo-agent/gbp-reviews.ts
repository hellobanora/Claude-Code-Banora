// Google Business Profile review read/reply.
// Account + location discovery moved to the Business Profile APIs, but review
// read/reply still lives on the legacy "Google My Business API" v4 resource.
// Verify field names against https://developers.google.com/my-business/reference/rest
// if Google changes this again.
//
// GBP_ACCOUNT_ID/GBP_LOCATION_ID already carry their "accounts/"/"locations/"
// prefix (that's the literal resource name Google's API returns) — never
// prefix them again when building a URL.

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

const MAX_PAGES = 10; // 50/page — covers up to 500 reviews, well beyond a single-location practice

export async function listUnrepliedReviews(
  accessToken: string,
  accountId: string,
  locationId: string
): Promise<GbpReview[]> {
  const allReviews: GbpReview[] = [];
  let pageToken: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const url = new URL(
      `https://mybusiness.googleapis.com/v4/${accountId}/${locationId}/reviews`
    );
    url.searchParams.set("pageSize", "50");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`GBP reviews list failed (${res.status}): ${err}`);
    }

    const data = (await res.json()) as { reviews?: GbpReview[]; nextPageToken?: string };
    allReviews.push(...(data.reviews ?? []));

    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }

  return allReviews.filter((r) => !r.reviewReply);
}

export async function postReply(
  accessToken: string,
  accountId: string,
  locationId: string,
  reviewId: string,
  text: string
): Promise<void> {
  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/${accountId}/${locationId}/reviews/${reviewId}/reply`,
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
