export interface Review {
  name: string;
  rating: number;
  date: string;
  text: string;
}

// Replace these with real reviews copied from your Google Business Profile.
// Keep review text exactly as written — do not edit patient words.
// AHPRA note: if a review makes a guaranteed outcome claim, do not include it here.
export const googleReviews: Review[] = [
  {
    name: 'Sarah M.',
    rating: 5,
    date: '2 weeks ago',
    text: 'Dr James was incredibly thorough on my first visit. He took the time to explain exactly what was going on with my back and what we could do about it. I have been going for two months now and my mobility has improved a lot. Highly recommend.',
  },
  {
    name: 'Tom R.',
    rating: 5,
    date: '1 month ago',
    text: 'Been coming here for years. Dr Paul really listens and never rushes you. The team is friendly, easy parking right out front, and they always fit me in quickly when I need it. Would not go anywhere else.',
  },
  {
    name: 'Lisa K.',
    rating: 5,
    date: '3 weeks ago',
    text: 'I was nervous about seeing a chiropractor for the first time but Dr James made me feel completely at ease. He explained everything before he did it and I left feeling so much better. The clinic itself is spotless and easy to find.',
  },
  {
    name: 'David W.',
    rating: 5,
    date: '2 months ago',
    text: 'Started seeing Dr Paul after a surf injury. He worked out pretty quickly what was causing the problem and put together a clear plan. The home exercises he gave me have made a real difference. Great practice.',
  },
  {
    name: 'Amanda H.',
    rating: 5,
    date: '1 month ago',
    text: 'Came in with a stiff neck that had been bothering me for weeks. Dr James assessed it carefully and we got started on treatment the same visit. Within a few sessions I was back to normal. Really happy with the care here.',
  },
  {
    name: 'Michael C.',
    rating: 5,
    date: '3 months ago',
    text: 'The whole family comes here now — kids included. Dr Paul is great with the little ones, very gentle and patient. It is reassuring having a chiropractor you can trust for everyone in the family.',
  },
];

// Aggregate stats shown in the section header — update to match your Google profile.
export const reviewStats = {
  rating: 5.0,
  count: 47,
  googleProfileUrl: 'https://g.page/r/YOUR_GOOGLE_PLACE_ID/review',
};
