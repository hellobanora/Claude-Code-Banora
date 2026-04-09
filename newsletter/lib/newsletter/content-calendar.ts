// =============================================================================
// BANORA CHIROPRACTIC — 12-MONTH CONTENT CALENDAR
// File: lib/newsletter/content-calendar.ts
// =============================================================================

export type MonthlyBrief = {
  issue: number;
  month: string;
  australian_season: 'Summer' | 'Autumn' | 'Winter' | 'Spring';

  seasonal_health: {
    topic: string;
    local_context: string;        // Tweed/Gold Coast hook
    tips_theme: string;           // What the 5 tips should focus on
    hero_photo_direction: string; // Briefing for photo sourcing
  };

  education_spotlight: {
    topic: string;
    key_message: string;          // The one takeaway patients should leave with
    region_cards: string[];       // Which anatomy regions to cover
    diagram_direction: string;    // What the medical illustration should show
  };

  product_of_month: {
    product: string;
    why_this_month: string;       // Seasonal / clinical relevance
    benefit_pills: [string, string, string, string];
    target_patients: string[];    // 4 patient profiles who benefit most
  };

  clinic_news: {
    doctors_note_theme: string;   // Tone / angle for the personal note
    updates: Array<{
      icon: string;
      title: string;
      body: string;
    }>;
  };
};

export const CONTENT_CALENDAR: MonthlyBrief[] = [
  // ─── ISSUE 01: JANUARY ──────────────────────────────────────────────────────
  {
    issue: 1,
    month: 'January',
    australian_season: 'Summer',
    seasonal_health: {
      topic: 'New Year Spinal Reset: Posture Audit for the Year Ahead',
      local_context: 'Summer on the Tweed — beach days, outdoor sport, long drives south for holidays',
      tips_theme: 'Simple posture checks and resets patients can do at home to start the year right',
      hero_photo_direction: 'Person standing tall outdoors in summer sunshine, looking confident and relaxed — beach or park setting',
    },
    education_spotlight: {
      topic: 'The Posture Chain: How Your Phone Is Reshaping Your Spine',
      key_message: 'Forward head posture from screen use puts enormous load on the cervical spine — small habit changes make a real difference',
      region_cards: ['Cervical spine (C1–C7)', 'Thoracic spine (T1–T12)', 'Lumbar spine (L1–L5)'],
      diagram_direction: 'Medical illustration showing forward head posture vs neutral spine alignment — side-view comparison',
    },
    product_of_month: {
      product: 'Metagenics Vitamin D3',
      why_this_month: 'Summer sun paradox — many Australians remain deficient despite outdoor lifestyle. Supports bone density and immune function heading into the year.',
      benefit_pills: ['Bone Density', 'Immune Support', 'Muscle Function', 'Mood Balance'],
      target_patients: [
        'Patients who work indoors despite living in a sunny climate',
        'Anyone with a history of stress fractures or osteoporosis',
        'Patients feeling unexplained fatigue or low mood',
        'Older patients needing calcium absorption support',
      ],
    },
    clinic_news: {
      doctors_note_theme: 'New year, fresh start — encourage patients to prioritise their health in January before life gets busy again',
      updates: [
        { icon: '📅', title: 'January Hours', body: 'We are open from January 6th. Book online to secure your preferred time — January fills quickly.' },
        { icon: '⭐', title: 'New Year Check-Up', body: 'Start 2027 with a spinal check-up. Identifying issues early saves months of discomfort later.' },
      ],
    },
  },

  // ─── ISSUE 02: FEBRUARY ─────────────────────────────────────────────────────
  {
    issue: 2,
    month: 'February',
    australian_season: 'Summer',
    seasonal_health: {
      topic: 'Back-to-School Backpack Safety for Kids',
      local_context: 'School returns across NSW and QLD — Tweed and Gold Coast families heading back to the school run',
      tips_theme: 'Practical backpack fitting and posture advice for parents to share with their kids',
      hero_photo_direction: 'Child wearing a well-fitted backpack walking to school — bright, natural, optimistic',
    },
    education_spotlight: {
      topic: "Children's Spinal Development: Why Early Care Matters",
      key_message: "A child's spine is still developing — early postural habits and load management have lifelong consequences",
      region_cards: ['Cervical spine', 'Thoracic spine', 'Lumbar spine', 'Sacrum & pelvis'],
      diagram_direction: 'Medical illustration of a developing child spine vs adult spine, or backpack load distribution diagram',
    },
    product_of_month: {
      product: 'Metagenics Omega-3 Fish Oil (Kids)',
      why_this_month: 'Brain and joint development for school-age children. Supports concentration and reduces inflammation during a high-activity term.',
      benefit_pills: ['Brain Function', 'Joint Health', 'Concentration', 'Immune Support'],
      target_patients: [
        'School-age children with growing pains or joint discomfort',
        'Kids struggling with focus or concentration at school',
        'Active children involved in team sports',
        'Parents wanting foundational nutritional support for their children',
      ],
    },
    clinic_news: {
      doctors_note_theme: 'February is a great time for a children\'s check-up before the term gets busy — spine issues in kids are often caught late',
      updates: [
        { icon: '👶', title: 'Paediatric Consultations', body: 'We see patients from newborns through to teenagers. Ask us about children\'s chiropractic at your next visit.' },
        { icon: '📅', title: 'After-School Appointments', body: 'Tuesday and Thursday late afternoons available for families. Book online to secure school-friendly times.' },
      ],
    },
  },

  // ─── ISSUE 03: MARCH ────────────────────────────────────────────────────────
  {
    issue: 3,
    month: 'March',
    australian_season: 'Autumn',
    seasonal_health: {
      topic: 'Weekend Warrior Injuries: Footy Season Prep',
      local_context: 'NRL and AFL seasons kick off — Tweed locals back in club footy, touch, and social sport',
      tips_theme: 'Safe return-to-sport tips focused on warm-up, recovery, and injury prevention',
      hero_photo_direction: 'Person doing dynamic stretching or warm-up exercises on a field or grass — energetic, athletic',
    },
    education_spotlight: {
      topic: 'Soft Tissue vs Joint Injuries: What Is Actually Happening',
      key_message: 'Understanding the difference helps patients seek the right care faster — and avoid making things worse',
      region_cards: ['Muscles & tendons', 'Ligaments & joints', 'Spinal discs', 'Nerve involvement'],
      diagram_direction: 'Medical illustration comparing muscle/tendon injury vs joint/disc injury — cross-section anatomical style',
    },
    product_of_month: {
      product: 'Metagenics Turmeric/Curcumin',
      why_this_month: 'Natural anti-inflammatory support for sports recovery and joint health as cooler weather arrives and sport ramps up.',
      benefit_pills: ['Anti-Inflammatory', 'Joint Support', 'Recovery', 'Pain Management'],
      target_patients: [
        'Active patients returning to winter sport after the off-season',
        'Anyone with chronic joint inflammation or arthritis',
        'Patients who prefer natural alternatives to NSAIDs',
        'Post-injury patients in the recovery phase',
      ],
    },
    clinic_news: {
      doctors_note_theme: 'Footy season brings a wave of preventable injuries — a pre-season check-up is the smartest thing active patients can do',
      updates: [
        { icon: '🏉', title: 'Sports Injury Appointments', body: 'Acute sports injuries seen same-week where possible. Call us on 07 5599 2322 if you need to be seen quickly.' },
        { icon: '⭐', title: 'Pre-Season Check-Up', body: 'A short assessment now can identify weaknesses before they become injuries. Book before season starts.' },
      ],
    },
  },

  // ─── ISSUE 04: APRIL ────────────────────────────────────────────────────────
  {
    issue: 4,
    month: 'April',
    australian_season: 'Autumn',
    seasonal_health: {
      topic: 'Desk Posture Deep Dive: WFH Ergonomics That Actually Work',
      local_context: 'Autumn settles in — WFH days increase as beach days wind down, more time at the desk',
      tips_theme: 'Practical home office ergonomics patients can implement without buying expensive equipment',
      hero_photo_direction: 'Person at a tidy home desk with good posture — laptop elevated, feet flat, natural light',
    },
    education_spotlight: {
      topic: 'Thoracic Spine: The Forgotten Region That Drives Neck Pain',
      key_message: 'Most neck pain actually originates in the thoracic spine — this is why treating the neck alone rarely provides lasting relief',
      region_cards: ['Thoracic spine (T1–T12)', 'Cervical junction (C7/T1)', 'Rib articulations', 'Postural chain'],
      diagram_direction: 'Medical illustration of thoracic kyphosis and its relationship to forward head posture — side profile',
    },
    product_of_month: {
      product: 'Metagenics B Complex',
      why_this_month: 'Nervous system support for desk workers. Combats stress and energy crashes from long screen hours and cognitive load.',
      benefit_pills: ['Energy Production', 'Nervous System', 'Stress Support', 'Mental Clarity'],
      target_patients: [
        'Desk workers experiencing afternoon energy crashes',
        'Patients with high cognitive workload or work-related stress',
        'Anyone experiencing fatigue, irritability, or poor concentration',
        'Patients with known B12 or folate deficiency',
      ],
    },
    clinic_news: {
      doctors_note_theme: 'Easter and school holidays — a good reminder that rest does not mean slumping on the couch for a week',
      updates: [
        { icon: '🐣', title: 'Easter Hours', body: 'Closed Good Friday and Easter Monday. Open Saturday April 19th. Book ahead to avoid missing your appointment.' },
        { icon: '📅', title: 'School Holiday Availability', body: 'Extra appointment times available during school holidays — a great time to bring the whole family in.' },
      ],
    },
  },

  // ─── ISSUE 05: MAY ──────────────────────────────────────────────────────────
  {
    issue: 5,
    month: 'May',
    australian_season: 'Autumn',
    seasonal_health: {
      topic: 'Pre-Winter Mobility Check: Get Ahead of the Cold',
      local_context: 'Tweed autumn — mornings cooling down, the hills foggy, afternoons still warm but the change is coming',
      tips_theme: 'Pre-winter movement habits that protect joints and spine before the cold sets in',
      hero_photo_direction: 'Person doing morning stretches or yoga outdoors in golden autumn light — calm and intentional',
    },
    education_spotlight: {
      topic: 'Joint Stiffness Explained: What Is Actually Happening Inside',
      key_message: 'Joint stiffness is not just "getting old" — it is a biological process that can be slowed with the right care and habits',
      region_cards: ['Synovial joints', 'Cartilage health', 'Spinal facet joints', 'Disc hydration'],
      diagram_direction: 'Medical illustration comparing a healthy synovial joint with a degenerated one — cross-section detail',
    },
    product_of_month: {
      product: 'Metagenics Glucosamine & Chondroitin',
      why_this_month: 'Joint support heading into winter. Helps maintain cartilage health and mobility before cold weather tightens everything up.',
      benefit_pills: ['Cartilage Support', 'Joint Mobility', 'Pain Relief', 'Long-Term Protection'],
      target_patients: [
        'Patients over 45 noticing morning stiffness in hips, knees, or spine',
        'Anyone with diagnosed osteoarthritis or joint wear',
        'Active patients wanting to protect their joints proactively',
        'Post-surgical patients maintaining joint health after recovery',
      ],
    },
    clinic_news: {
      doctors_note_theme: 'The best time to address joint health is before winter hits — encourage patients to act now rather than wait for pain',
      updates: [
        { icon: '❄️', title: 'Winter Prep Check-Up', body: 'A mobility assessment now can identify stiff regions before they become painful in the cold. Book your winter prep appointment.' },
        { icon: '⭐', title: 'Refer a Friend', body: 'Know someone who has been putting off seeing a chiropractor? New patients are always welcome — no referral needed.' },
      ],
    },
  },

  // ─── ISSUE 06: JUNE ─────────────────────────────────────────────────────────
  {
    issue: 6,
    month: 'June',
    australian_season: 'Winter',
    seasonal_health: {
      topic: 'Winter Warm-Up: Protecting Your Spine in the Cold',
      local_context: 'Winter on the Tweed — mornings below 10°C, patients skipping morning routines, indoor time increasing',
      tips_theme: 'Winter-specific habits for maintaining spinal health when motivation and warmth are both low',
      hero_photo_direction: 'Person in warm layers doing a gentle morning stretch outdoors or by a bright window — cosy and active',
    },
    education_spotlight: {
      topic: 'Disc Health 101: How Your Discs Work and Why They Bulge',
      key_message: 'Disc bulges are rarely sudden — they develop over years of load and dehydration. Understanding this empowers patients to act earlier.',
      region_cards: ['Disc anatomy', 'Nucleus pulposus', 'Annular fibres', 'Nerve root compression'],
      diagram_direction: 'Medical illustration of a healthy disc vs bulging disc vs herniated disc — sagittal cross-section sequence',
    },
    product_of_month: {
      product: 'Metagenics Probiotics (Ultra Flora)',
      why_this_month: 'Winter immune support. Emerging research links gut microbiome health to systemic inflammation and recovery — highly relevant for chiropractic patients.',
      benefit_pills: ['Immune Support', 'Gut Health', 'Inflammation', 'Recovery'],
      target_patients: [
        'Patients prone to winter colds and reduced immunity',
        'Anyone who has recently taken a course of antibiotics',
        'Patients with digestive discomfort or bloating',
        'Anyone wanting to support overall health through winter',
      ],
    },
    clinic_news: {
      doctors_note_theme: 'Winter is peak season for preventable injuries — reinforce that keeping warm and moving is non-negotiable',
      updates: [
        { icon: '📅', title: 'Extended Winter Hours', body: 'Extra Thursday evening appointments available through June and July for patients who cannot make it during the day.' },
        { icon: '❄️', title: 'Winter Wellness Package', body: 'Ask us about our winter care plan — consistent care through the colder months keeps you moving and pain-free.' },
      ],
    },
  },

  // ─── ISSUE 07: JULY (matches the v3 PDF) ────────────────────────────────────
  {
    issue: 7,
    month: 'July',
    australian_season: 'Winter',
    seasonal_health: {
      topic: 'Winter Wellness: Protect Your Spine This Season',
      local_context: 'Peak winter on the Tweed and Gold Coast — coldest mornings of the year, school holidays slowing activity',
      tips_theme: 'Five practical daily habits to keep the spine mobile and pain-free through the coldest month',
      hero_photo_direction: 'Person stretching, walking outdoors, or doing a morning routine — active, warm layers, natural setting',
    },
    education_spotlight: {
      topic: 'Understanding Your Spine: Regions, Nerves & Degeneration',
      key_message: 'The spine is a connected system — a problem in one region affects the whole chain, and disc degeneration is a progressive process where early intervention matters',
      region_cards: ['Cervical (C1–C7)', 'Thoracic (T1–T12)', 'Lumbar (L1–L5)', 'Sacrum & Coccyx'],
      diagram_direction: 'Disc degeneration progression diagram — healthy to degenerated, with spinal region labels',
    },
    product_of_month: {
      product: 'Metagenics Magnesium Glycinate',
      why_this_month: 'Muscle relaxation, sleep quality, and nerve function. Peak relevance in cold months when muscles tighten, sleep is disrupted, and tension builds.',
      benefit_pills: ['Muscle Recovery', 'Better Sleep', 'Nerve Support', 'Stress Relief'],
      target_patients: [
        'Anyone experiencing muscle cramps or tension',
        'Poor sleepers or patients with restless legs',
        'Desk workers with tight shoulders and upper back',
        'Active patients needing faster muscle recovery',
      ],
    },
    clinic_news: {
      doctors_note_theme: 'Winter is when we see the most preventable injuries — warm, empathetic, gently urging patients not to wait for pain',
      updates: [
        { icon: '📅', title: 'Extended Winter Hours', body: 'Extra Thursday evening appointments through July and August for those who cannot make it during the day.' },
        { icon: '⭐', title: 'Refer a Friend', body: 'Know someone who could benefit? New patients are always welcome — no referral needed.' },
      ],
    },
  },

  // ─── ISSUE 08: AUGUST ───────────────────────────────────────────────────────
  {
    issue: 8,
    month: 'August',
    australian_season: 'Winter',
    seasonal_health: {
      topic: 'Sleep & Spinal Health: Your Overnight Recovery Guide',
      local_context: 'End of winter — patients tired after months of cold, poor sleep patterns established, spring still weeks away',
      tips_theme: 'Sleep position, pillow choice, and overnight recovery habits that protect the spine',
      hero_photo_direction: 'Person waking refreshed in a bright bedroom — morning light, relaxed posture, optimistic tone',
    },
    education_spotlight: {
      topic: 'Sleeping Positions: Best and Worst for Your Back',
      key_message: 'The position you sleep in for 7–8 hours has enormous cumulative effect on spinal alignment and disc recovery',
      region_cards: ['Cervical support', 'Lumbar curve', 'Hip alignment', 'Pillow selection'],
      diagram_direction: 'Medical illustration showing spinal alignment in back sleeping vs side sleeping vs stomach sleeping',
    },
    product_of_month: {
      product: 'Metagenics Zinc & Vitamin C',
      why_this_month: 'End-of-winter immune boost. Supports tissue repair, collagen production, and recovery as the body transitions toward spring.',
      benefit_pills: ['Immune Defence', 'Tissue Repair', 'Collagen Support', 'Antioxidant'],
      target_patients: [
        'Patients coming out of a winter cold or illness',
        'Anyone with slow-healing injuries or soft tissue complaints',
        'Patients with low immune resilience through winter',
        'Active patients wanting to support recovery and connective tissue',
      ],
    },
    clinic_news: {
      doctors_note_theme: 'The end of winter is a natural reset point — encourage patients to book before spring ramps up',
      updates: [
        { icon: '🌸', title: 'Spring Is Coming', body: 'September brings warmer weather and more activity. Get your spine ready now so you start spring feeling strong.' },
        { icon: '📅', title: 'August Availability', body: 'Appointments available this week — book online at banorachiropractic.com.au/book or call us on 07 5599 2322.' },
      ],
    },
  },

  // ─── ISSUE 09: SEPTEMBER ────────────────────────────────────────────────────
  {
    issue: 9,
    month: 'September',
    australian_season: 'Spring',
    seasonal_health: {
      topic: 'Spring Into Movement: Easing Back Into Exercise Safely',
      local_context: 'Spring on the Tweed — warm days returning, patients motivated to exercise again after a sedentary winter',
      tips_theme: 'Safe return-to-exercise progression to avoid the classic spring injury spike',
      hero_photo_direction: 'Person jogging or cycling outdoors in spring sunshine — optimistic, energetic, outdoors',
    },
    education_spotlight: {
      topic: 'Sciatica Explained: Causes, Symptoms & What Actually Helps',
      key_message: 'Sciatica is a symptom, not a diagnosis — identifying the root cause determines the right treatment, and most cases resolve with conservative care',
      region_cards: ['Lumbar spine (L4–S1)', 'Piriformis muscle', 'Sciatic nerve pathway', 'Sacroiliac joint'],
      diagram_direction: 'Medical illustration tracing the sciatic nerve from lumbar spine through the leg — showing common compression points',
    },
    product_of_month: {
      product: 'Metagenics Magnesium Glycinate',
      why_this_month: 'Second rotation — muscle recovery focus as physical activity increases through spring. Prevents cramps during exercise ramp-up.',
      benefit_pills: ['Muscle Recovery', 'Cramp Prevention', 'Better Sleep', 'Stress Relief'],
      target_patients: [
        'Patients returning to exercise after a quiet winter',
        'Anyone experiencing muscle cramps during increased activity',
        'Runners and cyclists ramping up training for spring events',
        'Patients with historically tight calves, hamstrings, or back muscles',
      ],
    },
    clinic_news: {
      doctors_note_theme: 'Spring is exciting but the injury rate spikes every year — warm, encouraging tone with a gentle caution about going too hard too fast',
      updates: [
        { icon: '🌸', title: 'Spring Check-Up', body: 'Before you ramp up activity, a quick spinal check is the smartest investment. Book now while spring spots are available.' },
        { icon: '⭐', title: 'Refer a Friend', body: 'Know someone keen to get active this spring? Send them our way — new patients are always welcome.' },
      ],
    },
  },

  // ─── ISSUE 10: OCTOBER ──────────────────────────────────────────────────────
  {
    issue: 10,
    month: 'October',
    australian_season: 'Spring',
    seasonal_health: {
      topic: 'Gardening Season: Protect Your Back Outdoors',
      local_context: 'Spring gardens across Tweed and the Gold Coast — weeding, planting, mowing — peak season for gardening-related back injuries',
      tips_theme: 'Safe gardening postures, techniques, and recovery habits to prevent lower back strain',
      hero_photo_direction: 'Person gardening with good posture — kneeling properly, using long-handled tools, relaxed and purposeful',
    },
    education_spotlight: {
      topic: 'Lumbar Spine: Why Your Lower Back Bears the Load',
      key_message: 'The lumbar spine carries the majority of body weight — understanding why helps patients protect it better in daily activities like gardening, lifting, and sitting',
      region_cards: ['Lumbar vertebrae (L1–L5)', 'Intervertebral discs', 'Facet joints', 'Core muscle system'],
      diagram_direction: 'Medical illustration of the lumbar spine under load — showing disc compression forces during bending vs neutral posture',
    },
    product_of_month: {
      product: 'Metagenics Omega-3 Fish Oil',
      why_this_month: 'Anti-inflammatory support for increased outdoor activity. Supports joint lubrication and recovery as patients become more active in spring.',
      benefit_pills: ['Anti-Inflammatory', 'Joint Lubrication', 'Recovery', 'Brain Health'],
      target_patients: [
        'Patients with joint stiffness or inflammatory conditions',
        'Active gardeners and outdoor enthusiasts ramping up activity',
        'Anyone with cardiovascular health goals',
        'Patients with dry skin or eyes (related omega deficiency signs)',
      ],
    },
    clinic_news: {
      doctors_note_theme: 'October is one of the busiest months for lower back presentations — gardening is the culprit more often than patients realise',
      updates: [
        { icon: '🌻', title: 'October Appointments', body: 'Spring is filling fast. Book ahead to secure your preferred appointment day and time.' },
        { icon: '📅', title: 'Walk-In Welcome', body: 'If you have an acute gardening injury, call us first — we do our best to fit urgent cases in quickly.' },
      ],
    },
  },

  // ─── ISSUE 11: NOVEMBER ─────────────────────────────────────────────────────
  {
    issue: 11,
    month: 'November',
    australian_season: 'Spring',
    seasonal_health: {
      topic: 'Pre-Summer Body Prep: Mobility & Strength for a Big Season',
      local_context: 'Late spring on the Tweed — warming fast, school year ending, patients preparing for Christmas and summer holidays',
      tips_theme: 'Functional mobility and core strength habits to prepare the body for a more active summer',
      hero_photo_direction: 'Person doing functional fitness or yoga outdoors in warm spring light — strong, grounded, purposeful',
    },
    education_spotlight: {
      topic: 'Core Stability: Why Sit-Ups Are Not Enough',
      key_message: 'True core stability comes from deep postural muscles, not superficial abs — this is what actually protects the spine',
      region_cards: ['Transversus abdominis', 'Multifidus', 'Pelvic floor', 'Diaphragm'],
      diagram_instruction: 'Medical illustration of the deep core muscle system — showing the four-muscle canister concept (TA, multifidus, pelvic floor, diaphragm)',
      diagram_direction: 'Medical illustration of the deep core cylinder — transversus abdominis, multifidus, pelvic floor, diaphragm working together',
    },
    product_of_month: {
      product: 'Metagenics Protein / Collagen',
      why_this_month: 'Supports muscle and connective tissue as patients increase training for summer. Collagen directly supports ligaments, tendons, and spinal discs.',
      benefit_pills: ['Muscle Repair', 'Collagen Support', 'Recovery', 'Joint Integrity'],
      target_patients: [
        'Active patients increasing training load heading into summer',
        'Patients over 40 wanting to maintain muscle mass and connective tissue',
        'Post-injury patients rebuilding strength',
        'Anyone with chronic tendon or ligament issues',
      ],
    },
    clinic_news: {
      doctors_note_theme: 'End of year is coming — encourage patients to book their December appointment before the clinic fills up for the holiday period',
      updates: [
        { icon: '📅', title: 'Book Before Christmas', body: 'December fills quickly. Book your pre-Christmas appointment now to avoid the holiday rush.' },
        { icon: '⭐', title: 'Gift of Health', body: 'Chiropractic gift vouchers available — a thoughtful Christmas gift for someone you care about.' },
      ],
    },
  },

  // ─── ISSUE 12: DECEMBER ─────────────────────────────────────────────────────
  {
    issue: 12,
    month: 'December',
    australian_season: 'Summer',
    seasonal_health: {
      topic: 'Holiday Travel Survival Guide for Your Spine',
      local_context: 'Christmas travel season — long drives south to NSW, flights to see family, hours in holiday traffic on the M1',
      tips_theme: 'Practical spinal care strategies for long car journeys, flights, and holiday sitting',
      hero_photo_direction: 'Family loading car for a road trip or person relaxed in a car seat — summer, holiday mood, luggage',
    },
    education_spotlight: {
      topic: 'Travel Ergonomics: Cars, Planes & How to Arrive Pain-Free',
      key_message: 'Extended sitting is one of the worst things for disc health — but small, consistent habits during travel make a significant difference',
      region_cards: ['Lumbar support', 'Hip flexor impact', 'Thoracic compression', 'Neck fatigue'],
      diagram_direction: 'Medical illustration of spinal alignment in a car seat — correct lumbar support position vs slouched position',
    },
    product_of_month: {
      product: 'Metagenics Turmeric/Curcumin',
      why_this_month: 'Anti-inflammatory support for holiday travel strain. Portable, easy to pack, and ideal for patients doing long road trips or interstate flights.',
      benefit_pills: ['Anti-Inflammatory', 'Joint Support', 'Travel Recovery', 'Pain Relief'],
      target_patients: [
        'Patients doing long road trips or flights for Christmas',
        'Anyone with chronic joint inflammation or arthritis managing holiday activity',
        'Patients who will be carrying heavy luggage or lifting holiday loads',
        'Active people maintaining their training through the holiday period',
      ],
    },
    clinic_news: {
      doctors_note_theme: 'Christmas and New Year — warm, genuine festive message, and a reminder that the clinic is here for acute issues over the break',
      updates: [
        { icon: '🎄', title: 'Christmas Hours', body: 'We close December 24th and reopen January 6th. For urgent matters, call 07 5599 2322 and we will do our best to help.' },
        { icon: '📅', title: 'Book Early January', body: 'January books up fast as people restart their routines. Book your first 2027 appointment now.' },
      ],
    },
  },
];

// =============================================================================
// HELPER: GET BRIEF FOR A SPECIFIC MONTH
// =============================================================================

export function getBriefForMonth(month: string): MonthlyBrief | undefined {
  return CONTENT_CALENDAR.find(b => b.month.toLowerCase() === month.toLowerCase());
}

export function getBriefForIssue(issue: number): MonthlyBrief | undefined {
  return CONTENT_CALENDAR.find(b => b.issue === issue);
}

export function buildUserPrompt(brief: MonthlyBrief): string {
  return `Generate the newsletter content for Issue ${brief.issue} — ${brief.month} (${brief.australian_season}).

MONTHLY BRIEF:
${JSON.stringify(brief, null, 2)}

Generate all 5 sections using the structure and rules in your system prompt.
Ensure the content sounds like Dr James and Dr Paul are speaking directly to their Tweed Heads/Gold Coast patients.
Apply all AHPRA compliance rules strictly throughout.`;
}
