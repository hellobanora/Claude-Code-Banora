export interface Area {
  slug: string;
  name: string;
  state: 'NSW' | 'QLD';
  metaTitle: string;
  metaDescription: string;
  heroHeading: string;
  distance: string;
  driveTime: string;
  description: string;
  localInfo: string;
  servicesHighlight: string;
  /** True for the suburb the clinic is in — templates swap travel copy for local copy. */
  isLocal?: boolean;
  /** Optional extra local sections (body paragraphs separated by blank lines). */
  sections?: { heading: string; body: string }[];
  /** Optional suburb FAQs — rendered on the page and as FAQPage schema. */
  faqs?: { question: string; answer: string }[];
}

export const areas: Area[] = [
  {
    slug: 'tweed-heads-south',
    name: 'Tweed Heads South',
    state: 'NSW',
    metaTitle: 'Chiropractor Tweed Heads South | Banora Chiropractic',
    metaDescription: "Chiropractor in Tweed Heads South at 2/44 Greenway Drive, near Tweed City. Free parking, HICAPS, no referral needed, Saturday mornings. Book online today.",
    heroHeading: 'Chiropractor in Tweed Heads South',
    distance: '0 km',
    driveTime: 'On Greenway Drive',
    isLocal: true,
    description: "Banora Chiropractic is right here in Tweed Heads South, at 2/44 Greenway Drive. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience, and most of the people they see live or work within a few minutes of the clinic: families from the surrounding streets, staff from the shops and businesses around Tweed City, tradies between jobs and retirees who'd rather not drive far for their care.",
    localInfo: "We're on Greenway Drive between Reece Plumbing and Border Bikes, a couple of minutes from Tweed City Shopping Centre. Parking is free and right out the front, and the clinic is on the ground floor with no steps, so it's easy if you're bringing a pram, using a walking frame or just moving gingerly with a sore back.",
    servicesHighlight: "From back pain and neck stiffness to headaches, sports injuries, pregnancy care and kids, we offer the full range of chiropractic care right here in Tweed Heads South. Each service has its own page below.",
    sections: [
      {
        heading: 'Fitting care around work, school and the shops',
        body: "Being local means you can fit an appointment in around the school run, a shift or a trip to Tweed City. We're open until 6pm on Monday, Tuesday and Thursday, and Saturday mornings from 8am to midday. Wednesday we start at 2pm, and Friday is a short session from 12pm to 2pm.\n\nYou can book online any time, or call (07) 5599 2322 and we'll find a time that suits.",
      },
      {
        heading: 'What to expect at your first visit',
        body: "Your first appointment takes around 30 to 45 minutes. We'll ask about your history and what's been bothering you, then assess how your spine and joints are moving. We explain what we find and what we suggest before any treatment starts.\n\nWe use a range of techniques, including gentle, low-force options for people who prefer not to be adjusted by hand. If we think you'd be better looked after by your GP, a physio or another practitioner, we'll tell you. Results vary between individuals, and we'll be upfront about what's realistic for you.",
      },
    ],
    faqs: [
      {
        question: 'Where exactly is Banora Chiropractic?',
        answer: "2/44 Greenway Drive, Tweed Heads South NSW 2486, between Reece Plumbing and Border Bikes and a couple of minutes from Tweed City Shopping Centre. Parking is free and right out the front.",
      },
      {
        question: 'Do I need a referral to see a chiropractor?',
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
      {
        question: 'Can I claim on my health fund?',
        answer: "Yes, if your extras cover includes chiropractic. We have HICAPS on-site, so your rebate is processed on the spot and you only pay the gap. We also accept DVA and WorkCover.",
      },
      {
        question: 'Are you open on Saturdays?',
        answer: "Yes, from 8am to 12pm. Saturday appointments tend to fill first, so booking a few days ahead is a good idea.",
      },
    ],
  },
  {
    slug: 'tweed-heads',
    name: 'Tweed Heads',
    state: 'NSW',
    metaTitle: 'Chiropractor Tweed Heads | Banora Chiropractic',
    metaDescription: 'Chiropractor for Tweed Heads locals, about 5 minutes away in Tweed Heads South. Gentle options, free parking, HICAPS and no referral needed. Book online.',
    heroHeading: 'Your Tweed Heads Chiropractor, 5 Minutes Down the Road',
    distance: '3 km',
    driveTime: '5 min drive',
    description: "Banora Chiropractic is about 5 minutes from the centre of Tweed Heads, at 2/44 Greenway Drive in Tweed Heads South. We don't have a clinic in town itself, but a large share of our patients come from Tweed Heads, Tweed Heads West and out towards Fingal Head. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience, and they see everyone from retirees and hospitality workers to office staff, tradies and young families.",
    localInfo: "Head south out of town towards Tweed City Shopping Centre and you'll reach us in around 5 minutes, depending on traffic. We're on Greenway Drive between Reece Plumbing and Border Bikes. Unlike in town, parking is free and right out the front, with no meters and no time limits to watch, and the clinic is on the ground floor with no steps.",
    servicesHighlight: "Most Tweed Heads patients come to us for lower back pain, neck pain, sciatica and headaches, but we also look after sports injuries, posture concerns, pregnancy-related back and pelvic discomfort, and kids. Each service has its own page below.",
    sections: [
      {
        heading: 'Gentle care for older patients',
        body: "Tweed Heads has plenty of active retirees, and a lot of them come to us with stiff lower backs, sore hips, neck pain or reduced movement that's making golf, bowls, gardening or a walk around Jack Evans Boat Harbour harder than it used to be.\n\nNot everyone wants a traditional manual adjustment, and that's fine. We use a range of techniques, including low-force options such as Activator and drop-table work, and we'll talk you through the choices before we start. We also take your other health conditions and medications into account, and we'll work alongside your GP where that helps.",
      },
      {
        heading: 'On your feet, at a desk or in the surf',
        body: "We see a lot of people whose work keeps them on their feet all day in the shops, cafes and clubs around town, as well as people who spend long hours at a desk or behind the wheel. Sore lower backs, tight necks and headaches that build through the day are common.\n\nWe also see surfers from Duranbah and Snapper with stiff necks and shoulders from paddling. Whatever brings you in, your first visit starts with a full assessment, and we'll explain what we find before any treatment. Many patients find their care helps them stay active, though results vary between individuals.",
      },
      {
        heading: 'Hours that work around you',
        body: "We're open until 6pm on Monday, Tuesday and Thursday, and from 8am to midday on Saturday. Wednesday we start at 2pm, and Friday is a short session from 12pm to 2pm. You can book online any time, or call (07) 5599 2322.",
      },
    ],
    faqs: [
      {
        question: 'How far is Banora Chiropractic from Tweed Heads?',
        answer: "About 3 km, or roughly a 5-minute drive south of town towards Tweed City. We're at 2/44 Greenway Drive, Tweed Heads South, with free on-site parking.",
      },
      {
        question: 'Do you offer gentle chiropractic for older people?',
        answer: "Yes. Alongside traditional adjustments we use low-force techniques such as Activator and drop-table work. We'll assess you first and discuss which approach suits you before any treatment.",
      },
      {
        question: 'Do I need a referral?',
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
      {
        question: 'Can I claim on my health fund or DVA?',
        answer: "Yes. We have HICAPS on-site, so health fund rebates are processed on the spot and you only pay the gap. We also accept DVA and WorkCover.",
      },
    ],
  },
  {
    slug: 'banora-point',
    name: 'Banora Point',
    state: 'NSW',
    metaTitle: 'Chiropractor Near Banora Point | Banora Chiropractic',
    metaDescription: "Chiropractor near Banora Point, 6 minutes away in Tweed Heads South. Care for back pain, neck pain and the whole family. Free parking, HICAPS. Book online.",
    heroHeading: 'Chiropractor Near Banora Point',
    distance: '4 km',
    driveTime: '6 min drive',
    description: 'Banora Point locals — your chiropractor is just around the corner. Banora Chiropractic is a short 6-minute drive from Banora Point, making it easy to fit quality chiropractic care into your busy schedule. We have been the go-to chiropractors for Banora Point families for years.',
    localInfo: 'Just a quick trip via Leisure Drive or the Pacific Motorway. Our clinic is on Greenway Drive with easy parking and no steps — perfect for the whole family.',
    servicesHighlight: 'From growing kids to active grandparents, we help Banora Point residents of all ages with back pain, neck pain, headaches, sports injuries, and more. We also offer pregnancy and paediatric chiropractic care.',
  },
  {
    slug: 'coolangatta',
    name: 'Coolangatta',
    state: 'QLD',
    metaTitle: 'Chiropractor Near Coolangatta | Banora Chiropractic',
    metaDescription: "Chiropractor near Coolangatta, 10 minutes south in Tweed Heads South. Care for surfers, desk workers and families. Free parking, HICAPS. Book online today.",
    heroHeading: 'Chiropractor Near Coolangatta',
    distance: '7 km',
    driveTime: '10 min drive',
    description: "Coolangatta and Tweed Heads are really one town with a state line running through the middle, so plenty of our patients live on the Queensland side. Banora Chiropractic is about 10 minutes south of Coolangatta, at 2/44 Greenway Drive in Tweed Heads South. Dr James Shipway and Dr Paul Cater see people from right along the southern Gold Coast, from surfers who paddle out at Snapper and Greenmount to people who work at the airport or spend their days at a desk.",
    localInfo: "Head south through Tweed Heads and you'll reach us in around 10 minutes, depending on traffic. We're on Greenway Drive between Reece Plumbing and Border Bikes. Parking is free and right out the front, and the clinic is on the ground floor with no steps, so you won't be hunting for a park near the beach or feeding a meter.",
    servicesHighlight: "We see a lot of the same problems from the Coolangatta side of the border: stiff necks and sore lower backs from long sessions in the surf, shoulders that have had enough of paddling, and the neck and mid-back tightness that comes with screens and desk work. We also look after families, including pregnancy and paediatric care.",
    sections: [
      {
        heading: 'Surfing, swimming and sore necks',
        body: "Paddling a board means holding your head up and your back arched for long stretches. That can load the joints and muscles of the neck, upper back and lower back, and it often shows up as stiffness the morning after a big session. Shoulders take a share of the work too.\n\nIf that sounds familiar, we'll assess how your neck, back and shoulders are moving and explain what we find. Care may include adjustments, soft tissue work and a few exercises you can do between surfs. Results vary from person to person, and we'll tell you honestly if we think you'd be better served by someone else.",
      },
      {
        heading: 'Crossing the border: time zones and health cover',
        body: "Our appointment times are NSW time. From the first Sunday in October to the first Sunday in April, NSW is on daylight saving and Queensland isn't, so a 9:00am booking with us is 8:00am in Coolangatta. Outside daylight saving, the clocks match.\n\nYour Queensland address doesn't change how you claim. We have HICAPS on-site, so private health fund rebates are processed on the spot and you only pay the gap. A Medicare care plan from your Queensland GP works here too, as does DVA cover. If you have a workers compensation or CTP claim, give us a call before your first visit and we'll check what paperwork you need.",
      },
    ],
    faqs: [
      {
        question: 'How far is Banora Chiropractic from Coolangatta?',
        answer: "About 7 km, or roughly a 10-minute drive south through Tweed Heads. We're at 2/44 Greenway Drive, Tweed Heads South, with free on-site parking.",
      },
      {
        question: 'Are appointment times in NSW or Queensland time?',
        answer: "NSW time. During daylight saving (October to April) NSW is an hour ahead of Coolangatta, so a 9:00am appointment is 8:00am Queensland time. For the rest of the year the times are the same.",
      },
      {
        question: 'Can I claim on my Queensland health fund?',
        answer: "Yes. Health fund rebates work the same on both sides of the border. We have HICAPS on-site, so your rebate is processed on the spot and you only pay the gap.",
      },
      {
        question: 'Do I need a referral?',
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
    ],
  },
  {
    slug: 'palm-beach',
    name: 'Palm Beach',
    state: 'QLD',
    metaTitle: 'Chiropractor Near Palm Beach QLD | Banora Chiropractic',
    metaDescription: "Chiropractor near Palm Beach QLD, a 12-minute drive south in Tweed Heads South. Family care, free parking, HICAPS and no referral needed. Book online today.",
    heroHeading: 'Chiropractor Near Palm Beach',
    distance: '10 km',
    driveTime: '12 min drive',
    description: 'Palm Beach residents — great chiropractic care is closer than you think. Banora Chiropractic is just 12 minutes south in Tweed Heads South. We see many patients from Palm Beach and the southern Gold Coast who prefer our personal approach and easy parking over the busier strip clinics.',
    localInfo: 'Head south on the Gold Coast Highway, cross into NSW, and we are on Greenway Drive. Easy to find, easy to park, and we will have you back at the beach in no time.',
    servicesHighlight: 'Active Palm Beach lifestyle taking its toll? We help with sports injuries, surfing strains, back pain, and general wellness care. Our chiropractors understand the demands of an active coastal lifestyle.',
  },
  {
    slug: 'currumbin',
    name: 'Currumbin',
    state: 'QLD',
    metaTitle: 'Chiropractor Near Currumbin | Banora Chiropractic',
    metaDescription: "Chiropractor near Currumbin, 15 minutes south in Tweed Heads South. Care for back pain, neck pain and more. Free parking, HICAPS, no referral. Book online.",
    heroHeading: 'Chiropractor Near Currumbin',
    distance: '12 km',
    driveTime: '15 min drive',
    description: 'Currumbin locals looking for a chiropractor with a personal touch — we are just 15 minutes down the road. At Banora Chiropractic, you will not feel like a number. We take the time to understand your health, your goals, and how to help you feel your best.',
    localInfo: 'A straightforward drive south via the Gold Coast Highway. We are in Tweed Heads South on Greenway Drive — easy to find with free parking right at the door.',
    servicesHighlight: 'Whether you are recovering from a Currumbin Creek kayaking mishap or dealing with chronic back pain, our experienced chiropractors are here to help with personalised, evidence-based care.',
  },
  {
    slug: 'elanora',
    name: 'Elanora',
    state: 'QLD',
    metaTitle: 'Chiropractor Near Elanora | Banora Chiropractic',
    metaDescription: "Chiropractor near Elanora QLD, a 12-minute drive south in Tweed Heads South. Family chiropractic care for all ages, with free parking and HICAPS. Book online.",
    heroHeading: 'Chiropractor Near Elanora',
    distance: '9 km',
    driveTime: '12 min drive',
    description: 'Elanora families — you have got a great chiropractor just a short drive away. Banora Chiropractic in Tweed Heads South offers friendly, professional chiropractic care for the whole family. We see patients of all ages, from newborns to grandparents.',
    localInfo: 'Head south on the Gold Coast Highway past The Pines shopping centre and you will reach us in about 12 minutes. Free parking and ground-level access make visits easy.',
    servicesHighlight: 'We help Elanora families with everything from kids\' postural check-ups to adult back pain, pregnancy care, and sports injuries. Your whole family is welcome.',
  },
  {
    slug: 'bilinga',
    name: 'Bilinga',
    state: 'QLD',
    metaTitle: 'Chiropractor Near Bilinga | Banora Chiropractic',
    metaDescription: "Chiropractor near Bilinga and Gold Coast Airport, 8 minutes south in Tweed Heads South. 30+ years combined experience, free parking, HICAPS. Book online.",
    heroHeading: 'Chiropractor Near Bilinga',
    distance: '6 km',
    driveTime: '8 min drive',
    description: 'Bilinga is just a short hop from our clinic in Tweed Heads South. Whether you live near the beach or work around Gold Coast Airport, Banora Chiropractic is your convenient local chiropractor — just 8 minutes down the road.',
    localInfo: 'A quick drive south from Bilinga via the Gold Coast Highway. We are on Greenway Drive in Tweed Heads South with easy on-site parking.',
    servicesHighlight: 'Back pain, neck stiffness, headaches, sports injuries — we help Bilinga residents with a wide range of musculoskeletal concerns. Pop in before or after work for convenient care.',
  },
  {
    slug: 'tugun',
    name: 'Tugun',
    state: 'QLD',
    metaTitle: 'Chiropractor Near Tugun | Banora Chiropractic',
    metaDescription: "Chiropractor near Tugun QLD, 9 minutes south in Tweed Heads South. Care for back pain, neck pain and headaches. Free parking, HICAPS, no referral. Book online.",
    heroHeading: 'Chiropractor Near Tugun',
    distance: '8 km',
    driveTime: '9 min drive',
    description: 'Tugun locals — quality chiropractic care is just 9 minutes south of you. Banora Chiropractic offers a personal, professional experience without the crowds of the bigger Gold Coast clinics. We take the time to get to know you and your health.',
    localInfo: 'A short and easy drive south via the Gold Coast Highway. We are located on Greenway Drive in Tweed Heads South — look for us between Reece Plumbing and Border Bikes.',
    servicesHighlight: 'From surfer\'s shoulder to office worker\'s back, we treat a wide range of conditions. Our chiropractors use multiple techniques so we can find the approach that works best for you.',
  },
  {
    slug: 'kirra',
    name: 'Kirra',
    state: 'QLD',
    metaTitle: 'Chiropractor Near Kirra | Banora Chiropractic',
    metaDescription: "Chiropractor near Kirra Beach, 9 minutes south in Tweed Heads South. 30+ years combined experience, free on-site parking and HICAPS. Book online today.",
    heroHeading: 'Chiropractor Near Kirra',
    distance: '7 km',
    driveTime: '9 min drive',
    description: 'Kirra Beach locals — your neighbourhood chiropractor is just across the border. Banora Chiropractic is a quick 9-minute drive from Kirra, making it easy to fit chiropractic care around your beach lifestyle, work, or family schedule.',
    localInfo: 'Head south past Coolangatta and across into NSW — we are on Greenway Drive with free parking and easy access. Quick and hassle-free.',
    servicesHighlight: 'Whether it is a surfing injury, chronic back pain, or your kids need a spinal check-up, we have got you covered. Our chiropractors have over 30 years of combined experience.',
  },
  {
    slug: 'burleigh-heads',
    name: 'Burleigh Heads',
    state: 'QLD',
    metaTitle: 'Chiropractor Near Burleigh Heads | Banora Chiropractic',
    metaDescription: "Chiropractor near Burleigh Heads, 20 minutes south in Tweed Heads South. Easy free parking, HICAPS and no referral needed. Saturday mornings. Book online.",
    heroHeading: 'Chiropractor Near Burleigh Heads',
    distance: '18 km',
    driveTime: '20 min drive',
    description: 'Burleigh Heads residents looking for a chiropractor with a personal, unhurried approach — we are worth the 20-minute drive south. Banora Chiropractic offers experienced, evidence-based care without the wait times and parking headaches of busier Gold Coast clinics.',
    localInfo: 'Take the M1 or Gold Coast Highway south to Tweed Heads South. We are on Greenway Drive with free on-site parking — a refreshing change from trying to find a park in Burleigh.',
    servicesHighlight: 'We help active Burleigh locals with sports injuries, back pain, neck stiffness, and general wellness care. Our range of techniques means we can find the right approach for your body and lifestyle.',
  },
  {
    slug: 'terranora',
    name: 'Terranora',
    state: 'NSW',
    metaTitle: 'Chiropractor Near Terranora | Banora Chiropractic',
    metaDescription: "Chiropractor near Terranora NSW, 8 minutes away in Tweed Heads South. Family chiropractic care, free parking, HICAPS and no referral needed. Book online.",
    heroHeading: 'Chiropractor Near Terranora',
    distance: '5 km',
    driveTime: '8 min drive',
    description: 'Terranora is one of our closest neighbouring suburbs — just 8 minutes from our Greenway Drive clinic. Many Terranora families trust Banora Chiropractic for their regular chiropractic care. We are your local, trusted chiropractors.',
    localInfo: 'A quick drive via Terranora Road to Greenway Drive. We are easy to find with on-site parking and ground-level access for the whole family.',
    servicesHighlight: 'We help Terranora families with back pain, neck pain, headaches, kids\' posture, pregnancy care, and sports injuries. From newborns to grandparents — everyone is welcome.',
  },
  {
    slug: 'chinderah',
    name: 'Chinderah',
    state: 'NSW',
    metaTitle: 'Chiropractor Near Chinderah | Banora Chiropractic',
    metaDescription: 'Chiropractor near Chinderah NSW. Banora Chiropractic is about 10 minutes north, up the M1 in Tweed Heads South. Care for the whole family. Book online.',
    heroHeading: 'Chiropractor Near Chinderah',
    distance: '7 km',
    driveTime: '10 min drive',
    description: 'Chinderah locals: Banora Chiropractic is about 10 minutes north of you, just up the M1 in Tweed Heads South. We have been looking after Tweed families for years with friendly, unhurried care.',
    localInfo: 'Head north on the M1 (Pacific Motorway) to Tweed Heads South and you will find us on Greenway Drive, between Reece Plumbing and Border Bikes. Free parking and ground-level access make every visit simple.',
    servicesHighlight: 'Whether you are a fisherman with a sore back, a parent running after kids, or a retiree wanting to stay active — we can help with personalised chiropractic care tailored to your needs.',
  },
  {
    slug: 'kingscliff',
    name: 'Kingscliff',
    state: 'NSW',
    metaTitle: 'Chiropractor near Kingscliff | Banora Chiropractic',
    metaDescription: 'Chiropractor near Kingscliff, about 14 minutes north in Tweed Heads South. Saturday mornings, free parking, HICAPS and no referral needed. Book online.',
    heroHeading: 'Chiropractor Near Kingscliff',
    distance: '11 km',
    driveTime: '14 min drive',
    description: "Banora Chiropractic is about 14 minutes north of Kingscliff, at 2/44 Greenway Drive in Tweed Heads South. We don't have a clinic in Kingscliff itself, but plenty of our patients live along the Tweed Coast, from Kingscliff and Salt down to Casuarina, and find the drive up the M1 easy enough. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience, and they see everyone from tradies and office workers to retirees, pregnant women and young families.",
    localInfo: "From Kingscliff, head up Tweed Coast Road to the M1 at Chinderah, then north to Tweed Heads South. It's usually around 14 minutes, a little longer in school-holiday traffic. We're on Greenway Drive between Reece Plumbing and Border Bikes, with free parking right out the front and a ground-floor entrance with no steps.",
    servicesHighlight: 'Most Kingscliff patients come to us for lower back pain, neck pain and headaches, but we also look after sports injuries, pregnancy-related back and pelvic discomfort, and kids. Each service has its own page below.',
    sections: [
      {
        heading: 'Saturday mornings and after-work appointments',
        body: "We're open until 6pm on Monday, Tuesday and Thursday, and from 8am to midday on Saturday, which suits a lot of Kingscliff patients who'd rather not take time off work. Wednesday we start at 2pm, and Friday is a short session from 12pm to 2pm, so it's worth booking ahead if you need one of those.\n\nYou can book online any time, or call (07) 5599 2322 and we'll find a time that works.",
      },
      {
        heading: 'What we see from the Tweed Coast',
        body: "Coastal life is active, and a lot of what we see reflects that: stiff lower backs after a weekend of surfing or gardening, sore necks from paddling or long days at a laptop, and shoulders that have had one too many sessions at the gym. We also see pregnant women with lower back and pelvic discomfort, and parents who bring their kids in.\n\nYour first visit starts with a full assessment, and we'll explain what we find before any treatment. If we think you'd be better looked after by your GP, a physio or another practitioner, we'll tell you. Results vary between individuals, and we'll be upfront about what's realistic for you.",
      },
    ],
    faqs: [
      {
        question: 'How far is Banora Chiropractic from Kingscliff?',
        answer: "About 11 km, or roughly a 14-minute drive north via Tweed Coast Road and the M1. We're at 2/44 Greenway Drive, Tweed Heads South, with free on-site parking.",
      },
      {
        question: 'Do you see Kingscliff patients on Saturdays?',
        answer: "Yes. We're open Saturday from 8am to 12pm. Saturday spots tend to fill first, so booking online a few days ahead is a good idea.",
      },
      {
        question: 'Do I need a referral?',
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
      {
        question: 'Can I claim on my health fund?',
        answer: "Yes, if your extras cover includes chiropractic. We have HICAPS on-site, so your rebate is processed on the spot and you only pay the gap.",
      },
    ],
  },
  {
    slug: 'casuarina',
    name: 'Casuarina',
    state: 'NSW',
    metaTitle: 'Chiropractor Near Casuarina | Banora Chiropractic',
    metaDescription: 'Chiropractor near Casuarina NSW. Banora Chiropractic is about 16 minutes north in Tweed Heads South. Care for back pain, neck pain and more. Book online.',
    heroHeading: 'Chiropractor Near Casuarina',
    distance: '16 km',
    driveTime: '16 min drive',
    description: 'Living in Casuarina and looking for a chiropractor nearby? Banora Chiropractic in Tweed Heads South is about 16 minutes north, a straightforward drive up Tweed Coast Road and the M1. We see many patients from Casuarina who appreciate avoiding the Gold Coast traffic and enjoy the relaxed, unhurried care at our clinic. Whether you are dealing with back pain from long days at the beach, neck stiffness from desk work, a sports injury, or want to keep the whole family moving well — we are close by and ready to help.',
    localInfo: 'Head north along Tweed Coast Road to the M1 at Chinderah, then continue north to Tweed Heads South. We are on Greenway Drive with free on-site parking and full wheelchair access.',
    servicesHighlight: 'Casuarina locals come to us for everything from back and neck pain to sports injuries, pregnancy care, and paediatric chiropractic. Our experienced chiropractors treat patients of all ages and fitness levels.',
  },
  {
    slug: 'murwillumbah',
    name: 'Murwillumbah',
    state: 'NSW',
    metaTitle: 'Chiropractor Near Murwillumbah | Banora Chiropractic',
    metaDescription: 'Chiropractor near Murwillumbah. Banora Chiropractic is about 27 minutes up the M1 in Tweed Heads South. Care for back pain, neck pain and families. Book online.',
    heroHeading: 'Chiropractor Near Murwillumbah',
    distance: '28 km',
    driveTime: '27 min drive',
    description: 'Murwillumbah residents: Banora Chiropractic in Tweed Heads South is a straightforward drive of about 27 minutes up the Pacific Motorway. We regularly see patients from Murwillumbah and the Tweed Valley who make the trip for our thorough, personal approach to chiropractic care. For many, the drive just becomes part of the routine.',
    localInfo: 'Take the Pacific Motorway (M1) north from Murwillumbah towards Tweed Heads and exit at Tweed Heads South. We are on Greenway Drive — easy to find, with free on-site parking waiting for you.',
    servicesHighlight: 'From farming injuries and manual labour strain to family chiropractic and sports care — our chiropractors are experienced across a broad range of conditions. We welcome patients from across the Tweed Valley.',
  },
];
