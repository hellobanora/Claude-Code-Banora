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
        body: "Being local means you can fit an appointment in around the school run, a shift or a trip to Tweed City. We're open until 6pm on Monday, Tuesday and Thursday, and Saturday mornings from 8am to 11:30am. Wednesday we start at 2pm, and Friday is a short session from 12pm to 2pm.\n\nYou can book online any time, or call (07) 5599 2322 and we'll find a time that suits.",
      },
      {
        heading: 'What to expect at your first visit',
        body: "Your first appointment takes around 30 to 45 minutes. We'll ask about your history and what's been bothering you, then assess how your spine and joints are moving. We explain what we find and what we suggest before any treatment starts.\n\nWe use a range of techniques, including gentle, low-force options for people who prefer not to be adjusted by hand. If we think you'd be better looked after by your GP, a physio or another practitioner, we'll tell you. Results vary between individuals, and we'll be upfront about what's realistic for you.",
      },
      {
        heading: 'Sciatica and back pain are common here',
        body: 'Two of the most common reasons Tweed Heads South locals come to see us are <a href="/conditions/sciatica/" class="text-mid-blue underline hover:text-navy">sciatica treatment in Tweed Heads South</a> and ongoing back pain that just will not settle on its own. If you are after a <a href="/conditions/back-pain/" class="text-mid-blue underline hover:text-navy">back pain chiropractor in Tweed Heads South</a>, you are already in the right suburb.',
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
        answer: "Yes, from 8am to 11:30am. Saturday appointments tend to fill first, so booking a few days ahead is a good idea.",
      },
    ],
  },
  {
    slug: 'tweed-heads',
    name: 'Tweed Heads',
    state: 'NSW',
    metaTitle: 'Chiropractor Near Tweed Heads — 5 Min Away | Banora Chiropractic',
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
        body: "We're open until 6pm on Monday, Tuesday and Thursday, and from 8am to 11:30am on Saturday. Wednesday we start at 2pm, and Friday is a short session from 12pm to 2pm. You can book online any time, or call (07) 5599 2322.",
      },
      {
        heading: 'Sciatica and back pain are common here too',
        body: 'A lot of people searching for <a href="/conditions/sciatica/" class="text-mid-blue underline hover:text-navy">sciatica treatment in Tweed Heads South</a> end up finding us just down the road. If ongoing back pain is what has brought you here, our <a href="/conditions/back-pain/" class="text-mid-blue underline hover:text-navy">back pain chiropractor in Tweed Heads South</a> page covers how we approach it.',
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
    description: "Banora Point is the suburb next door to ours, about 6 minutes from Banora Chiropractic at 2/44 Greenway Drive, Tweed Heads South. A lot of the people we see live there, from families in the streets off Leisure Drive to retirees in the lifestyle villages and people who work from home. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience.",
    localInfo: "From most of Banora Point, take Leisure Drive or the Pacific Motorway north and you'll be with us in around 6 minutes. We're on Greenway Drive between Reece Plumbing and Border Bikes, with free parking out the front and a ground-floor entrance with no steps.",
    servicesHighlight: "Banora Point patients come to us most often for lower back pain, neck pain, headaches and sciatica. We also see a lot of pregnant women, kids and older patients from the area. Each service has its own page below.",
    sections: [
      {
        heading: "Banora Chiropractic, but not in Banora Point",
        body: "People sometimes drive around Banora Point looking for us. We're actually just over the boundary in Tweed Heads South, on Greenway Drive near Tweed City Shopping Centre. If you're coming from home, it's usually a shorter trip than going into Tweed Heads or across to the Gold Coast.\n\nThat makes it easy to drop in before work, between school runs, or on your way to the shops. We're open until 6pm on Monday, Tuesday and Thursday, and on Saturday mornings from 8am to 11:30am.",
      },
      {
        heading: "Care for older Banora Point locals",
        body: "Banora Point has a large retiree community, and many of them come to us with stiff lower backs, sore hips and necks that make it harder to play golf, bowls or keep up with the grandkids. Not everyone wants a traditional adjustment. We also use low-force techniques such as Activator and drop-table work, and we'll talk through the options before anything starts.\n\nWe take your other health conditions and medications into account, and we're happy to work with your GP. If ongoing <a href=\"/conditions/back-pain/\" class=\"text-mid-blue underline hover:text-navy\">back pain</a> or <a href=\"/conditions/hip-pain/\" class=\"text-mid-blue underline hover:text-navy\">hip pain</a> is the reason you're looking, those pages explain how we approach it. Results vary between individuals.",
      },
    ],
    faqs: [
      {
        question: "Is Banora Chiropractic in Banora Point?",
        answer: "No. Despite the name, we're at 2/44 Greenway Drive, Tweed Heads South, about 6 minutes from most of Banora Point. Parking is free and right out the front.",
      },
      {
        question: "Do you offer gentle techniques for older patients?",
        answer: "Yes. As well as traditional adjustments, we use low-force options such as Activator and drop-table work. We assess you first and discuss what suits you before any treatment.",
      },
      {
        question: "Do I need a referral?",
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
      {
        question: "Can I claim on my health fund?",
        answer: "Yes, if your extras cover includes chiropractic. We have HICAPS on-site, so your rebate is processed on the spot and you only pay the gap. We also accept DVA.",
      },
    ],
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
    description: "Palm Beach is about 12 minutes north of Banora Chiropractic, which is at 2/44 Greenway Drive, Tweed Heads South, just over the border in NSW. We see plenty of people from Palm Beach and the suburbs around it: young families, surfers and swimmers who use the beach every day, and people working in the cafes and shops along the Gold Coast Highway. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience.",
    localInfo: "Head south on the Gold Coast Highway or the M1 through Tugun and across the border into Tweed Heads, and you'll reach us in around 12 minutes. We're on Greenway Drive between Reece Plumbing and Border Bikes. Parking is free and right out the front, so there's no hunting for a spot near the beach.",
    servicesHighlight: "Palm Beach patients most often come to us for lower back pain, neck and shoulder stiffness from paddling, and the aches that come with desk work and young kids. We also offer pregnancy and paediatric care. Each service has its own page below.",
    sections: [
      {
        heading: "Morning swims, surfs and sore shoulders",
        body: "A lot of Palm Beach locals are in the water before work. Paddling and freestyle both put the neck, upper back and shoulders through a lot of repeated movement, and it often shows up as stiffness that hangs around. Our <a href=\"/services/sports-chiropractic/\" class=\"text-mid-blue underline hover:text-navy\">sports chiropractic</a> page covers how we assess and manage that.\n\nWe'll look at how your neck, upper back and shoulders are moving and explain what we find. Care may include adjustments, soft tissue work and exercises to keep you in the water. If we think a physio or your GP is a better fit, we'll say so. Results vary between individuals.",
      },
      {
        heading: "Crossing the border for an appointment",
        body: "Our times are in NSW time. From the first Sunday in October to the first Sunday in April, NSW is on daylight saving, so a 10:00am booking with us is 9:00am in Palm Beach. For the rest of the year the clocks match.\n\nBeing a Queensland resident doesn't change how you claim. We have HICAPS on-site, so health fund rebates are processed on the spot. A Medicare care plan from your Queensland GP is fine too.",
      },
    ],
    faqs: [
      {
        question: "How far is Banora Chiropractic from Palm Beach?",
        answer: "About 10 km, or roughly a 12-minute drive south over the border. We're at 2/44 Greenway Drive, Tweed Heads South, with free on-site parking.",
      },
      {
        question: "Are your appointment times in Queensland time?",
        answer: "No, they're NSW time. During daylight saving (October to April) we're an hour ahead of Palm Beach. The rest of the year the times are the same.",
      },
      {
        question: "Do I need a referral?",
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
    ],
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
    description: "Currumbin is about 15 minutes north of Banora Chiropractic, at 2/44 Greenway Drive, Tweed Heads South. We see people from right across the area, from Currumbin beachfront and Currumbin Waters to the acreage properties out in Currumbin Valley. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience.",
    localInfo: "From Currumbin, head south on the Gold Coast Highway or the M1 through Tugun and across the border, and you'll reach us in around 15 minutes. We're on Greenway Drive between Reece Plumbing and Border Bikes, with free parking out the front and a ground-floor entrance with no steps.",
    servicesHighlight: "Currumbin patients often come in with stiff necks and shoulders from surfing and paddling, lower back pain from work around the property, and headaches that build through a day at the desk. We also see pregnant women and kids. Each service has its own page below.",
    sections: [
      {
        heading: "From the Alley to the Valley",
        body: "Currumbin covers a lot of ground. Down at the beach and the Alley, we see surfers and stand-up paddlers with sore necks, upper backs and shoulders. Out in Currumbin Valley, it's more often lower backs from fencing, mowing and lifting on larger blocks.\n\nEither way, your first visit starts with a full assessment. We'll explain what we find before any treatment, and talk you through the options. If <a href=\"/conditions/neck-pain/\" class=\"text-mid-blue underline hover:text-navy\">neck pain</a> or <a href=\"/conditions/shoulder-pain/\" class=\"text-mid-blue underline hover:text-navy\">shoulder pain</a> is what's bothering you, those pages go into more detail. Results vary between individuals.",
      },
      {
        heading: "Hours, time zones and health funds",
        body: "We're open until 6pm on Monday, Tuesday and Thursday, and from 8am to 11:30am on Saturday. Our times are in NSW time, so during daylight saving (October to April) a 9:00am appointment is 8:00am in Currumbin.\n\nWe have HICAPS on-site, so Queensland health fund rebates are processed on the spot and you only pay the gap.",
      },
    ],
    faqs: [
      {
        question: "How far is Banora Chiropractic from Currumbin?",
        answer: "About 12 km, or roughly a 15-minute drive south over the border. We're at 2/44 Greenway Drive, Tweed Heads South, with free on-site parking.",
      },
      {
        question: "Can I claim my Queensland health fund at your clinic?",
        answer: "Yes. Health fund rebates work the same on both sides of the border. We have HICAPS on-site, so you only pay the gap on the day.",
      },
      {
        question: "Do I need a referral?",
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
    ],
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
    description: "Elanora is about 12 minutes north of Banora Chiropractic, at 2/44 Greenway Drive, Tweed Heads South. It's a family suburb, and that's who we see most from there: parents with sore backs from lifting kids and car seats, teenagers who play weekend sport, and grandparents who help with the school pick-up. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience.",
    localInfo: "From Elanora, head south on the M1 or the Gold Coast Highway through Tugun and across the border, and you'll reach us in about 12 minutes. We're on Greenway Drive between Reece Plumbing and Border Bikes. Parking is free, and the clinic is on the ground floor with no steps, which helps if you're bringing a pram.",
    servicesHighlight: "Elanora families come to us for back and neck pain, headaches, sports injuries, pregnancy care and kids' chiropractic. Each service has its own page below.",
    sections: [
      {
        heading: "Kids, sport and growing bodies",
        body: "With several schools in and around Elanora, we see plenty of school-age kids and teenagers. Common reasons include sore necks and backs from heavy school bags and long screen time, and niggles from netball, footy, touch and surf club training.\n\nWe adapt our techniques for children, using gentle, low-force methods, and a parent stays in the room the whole time. Our <a href=\"/services/paediatric-chiropractic/\" class=\"text-mid-blue underline hover:text-navy\">paediatric chiropractic</a> and <a href=\"/conditions/sports-injuries/\" class=\"text-mid-blue underline hover:text-navy\">sports injuries</a> pages explain more about what's involved.",
      },
      {
        heading: "Pregnancy and new parents",
        body: "Lower back and pelvic discomfort are common during pregnancy, and the lifting, feeding and carrying that comes after can bring on neck and upper back pain. Our <a href=\"/services/pregnancy-chiropractic/\" class=\"text-mid-blue underline hover:text-navy\">pregnancy chiropractic</a> page covers how we position and adapt care for expectant mums. We'll always assess you first, explain what we find, and work alongside your GP or midwife. Results vary between individuals.",
      },
    ],
    faqs: [
      {
        question: "How far is Banora Chiropractic from Elanora?",
        answer: "About 9 km, or roughly a 12-minute drive south over the border. We're at 2/44 Greenway Drive, Tweed Heads South, with free on-site parking.",
      },
      {
        question: "Do you see children?",
        answer: "Yes. We see babies, kids and teenagers, using gentle techniques adapted to their age. A parent or guardian stays with them for the whole appointment.",
      },
      {
        question: "Do I need a referral?",
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
    ],
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
    description: "Bilinga is about 8 minutes north of Banora Chiropractic, at 2/44 Greenway Drive, Tweed Heads South. It's a small suburb, but it's home to Gold Coast Airport and the Southern Cross University campus, so as well as locals near the beach we see a lot of people who work or study there. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience.",
    localInfo: "From Bilinga, head south on the Gold Coast Highway through Coolangatta and Tweed Heads, and you'll reach us in around 8 minutes. We're on Greenway Drive between Reece Plumbing and Border Bikes, with free parking out the front and a ground-floor entrance with no steps.",
    servicesHighlight: "Bilinga patients often come in with lower back pain, neck and shoulder stiffness, and headaches. A lot of that comes from shift work, lifting, long days on their feet or long hours at a desk. Each service has its own page below.",
    sections: [
      {
        heading: "Shift work, lifting and long hours",
        body: "Airport work often means early starts, late finishes, repetitive lifting and long stretches on your feet. Students and university staff tend to have the opposite problem: hours at a laptop, with the neck and upper back to show for it.\n\nWe'll assess what's going on and explain what we find before any treatment. Care may include adjustments, soft tissue work and practical changes for your workday. Our <a href=\"/conditions/back-pain/\" class=\"text-mid-blue underline hover:text-navy\">back pain</a> and <a href=\"/conditions/posture-tech-neck/\" class=\"text-mid-blue underline hover:text-navy\">posture and tech neck</a> pages go into more detail. Results vary between individuals.",
      },
      {
        heading: "Fitting appointments around a roster",
        body: "We're open until 6pm on Monday, Tuesday and Thursday, from 2pm on Wednesday, and from 8am to 11:30am on Saturday. You can book online at any hour, which helps if your roster changes week to week.\n\nOur times are in NSW time. During daylight saving (October to April) we're an hour ahead of Bilinga, so check the time when you book.",
      },
    ],
    faqs: [
      {
        question: "How far is Banora Chiropractic from Gold Coast Airport?",
        answer: "About 6 km, or roughly an 8-minute drive south. We're at 2/44 Greenway Drive, Tweed Heads South, with free on-site parking.",
      },
      {
        question: "Can I book outside business hours?",
        answer: "You can book online at any time, day or night. Appointments run Monday to Saturday, with sessions until 6pm on Monday, Tuesday and Thursday.",
      },
      {
        question: "Do I need a referral?",
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
    ],
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
    description: "Tugun is about 9 minutes north of Banora Chiropractic, at 2/44 Greenway Drive, Tweed Heads South. It's a quiet beach suburb with a strong local feel, and we see people from all over it: surf club members, parents at the local schools, and retirees who walk the beach path every morning. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience.",
    localInfo: "From Tugun, take the M1 south through the Tugun Bypass, or the Gold Coast Highway through Bilinga and Coolangatta, and you'll reach us in about 9 minutes. We're on Greenway Drive between Reece Plumbing and Border Bikes, with free parking out the front and a ground-floor entrance with no steps.",
    servicesHighlight: "Tugun patients most often come to us for lower back pain, stiff necks, headaches and shoulder problems. We also see older patients who want to stay active, and families with kids. Each service has its own page below.",
    sections: [
      {
        heading: "Staying active on the southern Gold Coast",
        body: "A lot of our Tugun patients are active and want to stay that way: surfing, swimming laps between the flags, walking to Currumbin or Kirra, or volunteering at the surf club. When a sore back, stiff neck or <a href=\"/conditions/shoulder-pain/\" class=\"text-mid-blue underline hover:text-navy\">shoulder pain</a> gets in the way, that's often when they come to see us.\n\nWe'll assess how you're moving and explain what we find before any treatment. Care may include adjustments, soft tissue work and a few exercises to do at home. Results vary between individuals, and we'll be upfront about what's realistic.",
      },
      {
        heading: "Gentle options if you'd prefer them",
        body: "Not everyone wants a traditional hands-on adjustment, and that's fine. We also use low-force techniques such as Activator and drop-table work, which many older patients prefer. We'll talk through the options at your first visit and go with what you're comfortable with.\n\nOur times are in NSW time. During daylight saving (October to April) we're an hour ahead of Tugun.",
      },
    ],
    faqs: [
      {
        question: "How far is Banora Chiropractic from Tugun?",
        answer: "About 8 km, or roughly a 9-minute drive south. We're at 2/44 Greenway Drive, Tweed Heads South, with free on-site parking.",
      },
      {
        question: "Do I have to be adjusted by hand?",
        answer: "No. We also use low-force techniques such as Activator and drop-table work. We'll explain the options and agree on an approach with you before any treatment.",
      },
      {
        question: "Do I need a referral?",
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
    ],
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
    description: "Kirra is about 9 minutes from Banora Chiropractic, at 2/44 Greenway Drive, Tweed Heads South. It's one of the best-known surf breaks on the coast, and many of the people we see from Kirra are in the water most days. We also see locals who walk the beachfront path to Coolangatta, and people working in the cafes and apartments along Marine Parade. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience.",
    localInfo: "From Kirra, head through Coolangatta and south into Tweed Heads, then on towards Tweed City Shopping Centre. You'll reach us in around 9 minutes. We're on Greenway Drive between Reece Plumbing and Border Bikes, with free parking out the front, so no beachside meters.",
    servicesHighlight: "Kirra patients often come in with stiff necks and upper backs from paddling, lower back pain, shoulder problems and headaches. We also look after families, pregnant women and kids. Each service has its own page below.",
    sections: [
      {
        heading: "Long paddles and stiff necks",
        body: "Long sessions at Kirra mean a lot of paddling with your head up and your lower back arched. That can leave the neck, upper back and shoulders stiff the next morning, and it can build up over a season.\n\nWe'll assess how your neck, back and shoulders are moving and explain what we find before any treatment. Care may include adjustments, soft tissue work and exercises to do between surfs. Our <a href=\"/conditions/neck-pain/\" class=\"text-mid-blue underline hover:text-navy\">neck pain</a> and <a href=\"/services/sports-chiropractic/\" class=\"text-mid-blue underline hover:text-navy\">sports chiropractic</a> pages go into more detail. Results vary between individuals.",
      },
      {
        heading: "Queensland address, NSW clinic",
        body: "We're only a few minutes over the border, but our appointment times are NSW time. From October to April, during daylight saving, a 9:00am booking with us is 8:00am in Kirra.\n\nWe have HICAPS on-site, so Queensland health fund rebates are processed on the spot. A Medicare care plan from your Queensland GP is accepted here too.",
      },
    ],
    faqs: [
      {
        question: "How far is Banora Chiropractic from Kirra?",
        answer: "About 7 km, or roughly a 9-minute drive south through Coolangatta and Tweed Heads. We're at 2/44 Greenway Drive, Tweed Heads South, with free on-site parking.",
      },
      {
        question: "Are your appointments in Queensland or NSW time?",
        answer: "NSW time. During daylight saving (October to April) NSW is an hour ahead of Kirra. The rest of the year the times are the same.",
      },
      {
        question: "Do I need a referral?",
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
    ],
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
    description: "Burleigh Heads is about 20 minutes north of Banora Chiropractic, at 2/44 Greenway Drive, Tweed Heads South. It's further than most of the suburbs we see patients from, but plenty of Burleigh locals make the drive, often because they work or have family near the border, or because they'd rather not hunt for a park around James Street. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience.",
    localInfo: "From Burleigh Heads, take the M1 south past the airport and exit at Tweed Heads South. It's usually around 20 minutes, a bit longer in peak hour. We're on Greenway Drive between Reece Plumbing and Border Bikes, with free parking out the front and a ground-floor entrance with no steps.",
    servicesHighlight: "Burleigh patients most often come to us for lower back pain, neck stiffness, headaches and sports injuries from running, gym training and surfing. Each service has its own page below.",
    sections: [
      {
        heading: "Runners, gym-goers and the headland stairs",
        body: "Burleigh is a very active suburb. Between runs along the beachfront, the headland walking track, gym sessions and surfing at the point, we see plenty of people with sore lower backs, tight hips and niggling knees or shoulders.\n\nWe'll assess you, explain what we find, and agree on a plan before any treatment. Care may include adjustments, soft tissue work and exercises to support your training. Our <a href=\"/conditions/sports-injuries/\" class=\"text-mid-blue underline hover:text-navy\">sports injuries</a> and <a href=\"/conditions/knee-pain/\" class=\"text-mid-blue underline hover:text-navy\">knee pain</a> pages explain more. Results vary between individuals.",
      },
      {
        heading: "Making the drive worth it",
        body: "Because it's a 20-minute trip, we try to keep your time in the waiting room short and plan follow-up visits so you're not driving down more often than you need to. Saturday morning appointments, from 8am to 11:30am, suit a lot of Burleigh patients.\n\nOur times are in NSW time, so during daylight saving (October to April) we're an hour ahead of Burleigh. If the drive becomes a problem, we're happy to suggest a practitioner closer to home.",
      },
    ],
    faqs: [
      {
        question: "How far is Banora Chiropractic from Burleigh Heads?",
        answer: "About 18 km, or roughly a 20-minute drive south on the M1. We're at 2/44 Greenway Drive, Tweed Heads South, with free on-site parking.",
      },
      {
        question: "Are you open on Saturdays?",
        answer: "Yes, from 8am to 11:30am. Saturday appointments tend to fill first, so booking online a few days ahead is a good idea.",
      },
      {
        question: "Do I need a referral?",
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
    ],
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
    description: "Terranora sits in the hills just west of us, about 8 minutes from Banora Chiropractic at 2/44 Greenway Drive, Tweed Heads South. We see a lot of Terranora families, and a fair few people who spend their weekends working on acreage blocks, gardens and steep driveways. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience.",
    localInfo: "Come down from Terranora via Terranora Road towards the Pacific Motorway and Tweed Heads South, and you'll reach us in about 8 minutes. We're on Greenway Drive between Reece Plumbing and Border Bikes, with free parking out the front and a ground-floor entrance with no steps.",
    servicesHighlight: "Terranora patients often come in with lower back pain, neck and shoulder stiffness, and headaches. We also look after pregnant women and kids, so the whole family can be seen in one place. Each service has its own page below.",
    sections: [
      {
        heading: "Acreage, gardens and sore backs",
        body: "Life on a bigger block in Terranora tends to mean mowing slopes, lifting bags of soil, clearing gutters and pulling out lantana. That kind of work loads the lower back, and plenty of people come to us after a weekend that went a bit too far.\n\nWe'll assess how your back, hips and neck are moving, explain what we find, and talk you through options before any treatment. Care may include adjustments, soft tissue work and a few exercises to help you keep up with the jobs around the place. If <a href=\"/conditions/sciatica/\" class=\"text-mid-blue underline hover:text-navy\">sciatica</a> or leg pain is part of the picture, that page explains more. Results vary from person to person.",
      },
      {
        heading: "One clinic for the whole family",
        body: "A lot of Terranora households bring more than one person to see us. We see babies and school-age kids, teenagers who play sport, parents with sore backs, and grandparents who want to stay mobile. Our <a href=\"/services/paediatric-chiropractic/\" class=\"text-mid-blue underline hover:text-navy\">paediatric chiropractic</a> and <a href=\"/services/pregnancy-chiropractic/\" class=\"text-mid-blue underline hover:text-navy\">pregnancy chiropractic</a> pages explain how we adapt our care for children and expectant mums.",
      },
    ],
    faqs: [
      {
        question: "How far is Banora Chiropractic from Terranora?",
        answer: "About 5 km, or roughly an 8-minute drive via Terranora Road. We're at 2/44 Greenway Drive, Tweed Heads South, with free on-site parking.",
      },
      {
        question: "Can I bring my kids to the same appointment?",
        answer: "We see children and adults, and we can often book family members back to back. Call (07) 5599 2322 and we'll find times that work.",
      },
      {
        question: "Do I need a referral?",
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
    ],
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
    description: "Chinderah is about 10 minutes south of Banora Chiropractic, at 2/44 Greenway Drive, Tweed Heads South. We see a mix of people from Chinderah: families from the riverside streets, people who work on the farms and in the businesses along the old highway, and plenty who fish or boat on the Tweed River. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience.",
    localInfo: "From Chinderah, head north on the M1 (Pacific Motorway) and exit at Tweed Heads South. You'll reach us in about 10 minutes. We're on Greenway Drive between Reece Plumbing and Border Bikes, with free parking out the front and a ground-floor entrance with no steps.",
    servicesHighlight: "Chinderah patients often come to us for lower back pain, sciatica, neck and shoulder stiffness, and headaches. We also look after pregnant women, kids and older patients. Each service has its own page below.",
    sections: [
      {
        heading: "Physical work and sore backs",
        body: "Farm work, trades and long days in a ute or on a boat all take a toll on the lower back. Bending, lifting and twisting through the day can bring on back pain, and sometimes pain that runs down the leg.\n\nWe'll assess what's going on and explain what we find before any treatment. Care may include adjustments, soft tissue work and practical changes to how you lift and move at work. Our <a href=\"/conditions/sciatica/\" class=\"text-mid-blue underline hover:text-navy\">sciatica</a> and <a href=\"/conditions/back-pain/\" class=\"text-mid-blue underline hover:text-navy\">back pain</a> pages go into more detail. If we think you need imaging or a GP review first, we'll tell you.",
      },
      {
        heading: "Early finishes and Saturday mornings",
        body: "If you start early, our afternoon sessions might suit. We're open until 6pm on Monday, Tuesday and Thursday, and from 2pm to 6pm on Wednesday. Saturday mornings run from 8am to 11:30am.\n\nYou can book online at any time, or call (07) 5599 2322. We also accept WorkCover claims; give us a call first so we can check what paperwork you need.",
      },
    ],
    faqs: [
      {
        question: "How far is Banora Chiropractic from Chinderah?",
        answer: "About 7 km, or roughly a 10-minute drive north on the M1. We're at 2/44 Greenway Drive, Tweed Heads South, with free on-site parking.",
      },
      {
        question: "Do you accept WorkCover?",
        answer: "Yes. Call us on (07) 5599 2322 before your first visit and we'll check what you need to bring for your claim.",
      },
      {
        question: "Do I need a referral?",
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
    ],
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
        body: "We're open until 6pm on Monday, Tuesday and Thursday, and from 8am to 11:30am on Saturday, which suits a lot of Kingscliff patients who'd rather not take time off work. Wednesday we start at 2pm, and Friday is a short session from 12pm to 2pm, so it's worth booking ahead if you need one of those.\n\nYou can book online any time, or call (07) 5599 2322 and we'll find a time that works.",
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
        answer: "Yes. We're open Saturday from 8am to 11:30am. Saturday spots tend to fill first, so booking online a few days ahead is a good idea.",
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
    description: "Casuarina is about 16 minutes south of Banora Chiropractic, at 2/44 Greenway Drive, Tweed Heads South. A lot of young families have moved into the Casuarina and Salt estates over the past few years, and many of them now come to us, along with surfers, cyclists on the coastal path and people working from home. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience.",
    localInfo: "From Casuarina, head north along Tweed Coast Road to the M1 at Chinderah, then continue north and exit at Tweed Heads South. It's usually around 16 minutes. We're on Greenway Drive between Reece Plumbing and Border Bikes, with free parking out the front and a ground-floor entrance with no steps.",
    servicesHighlight: "Casuarina patients most often come in for lower back pain, neck stiffness from desk work, pregnancy-related discomfort and kids' chiropractic. Each service has its own page below.",
    sections: [
      {
        heading: "Working from home on the Tweed Coast",
        body: "Plenty of Casuarina locals work from a home office, a kitchen bench or a laptop on the couch. Over time, that often shows up as neck pain, upper back tightness and headaches by mid-afternoon.\n\nWe'll assess your neck and upper back, explain what we find, and suggest practical changes to your setup alongside any treatment. Our <a href=\"/conditions/posture-tech-neck/\" class=\"text-mid-blue underline hover:text-navy\">posture and tech neck</a> and <a href=\"/conditions/headaches-migraines/\" class=\"text-mid-blue underline hover:text-navy\">headaches</a> pages explain more. Results vary between individuals.",
      },
      {
        heading: "Young families",
        body: "With so many young families in the newer estates, we see a lot of pregnant women and new parents. Lifting babies, car seats and prams can bring on lower back, neck and wrist pain. We also see children, using gentle, age-appropriate techniques, with a parent in the room the whole time. Our <a href=\"/services/pregnancy-chiropractic/\" class=\"text-mid-blue underline hover:text-navy\">pregnancy chiropractic</a> and <a href=\"/services/paediatric-chiropractic/\" class=\"text-mid-blue underline hover:text-navy\">paediatric chiropractic</a> pages have more detail.",
      },
    ],
    faqs: [
      {
        question: "How far is Banora Chiropractic from Casuarina?",
        answer: "About 16 km, or roughly a 16-minute drive north via Tweed Coast Road and the M1. We're at 2/44 Greenway Drive, Tweed Heads South, with free on-site parking.",
      },
      {
        question: "Can you see me while I'm pregnant?",
        answer: "Yes. We adapt positioning and techniques throughout pregnancy, and we'll work alongside your GP or midwife. We assess you first and explain everything before any treatment.",
      },
      {
        question: "Do I need a referral?",
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
    ],
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
    description: "Murwillumbah is about 27 minutes from Banora Chiropractic, at 2/44 Greenway Drive, Tweed Heads South. It's the furthest suburb we list, but we see a steady number of people from Murwillumbah and the Tweed Valley, often because they work on the coast or are already coming into Tweed Heads for shopping, appointments or family. Dr James Shipway and Dr Paul Cater have over 30 years of combined experience.",
    localInfo: "From Murwillumbah, take the Tweed Valley Way or the M1 north towards Tweed Heads and exit at Tweed Heads South. It's usually around 27 minutes. We're on Greenway Drive between Reece Plumbing and Border Bikes, near Tweed City Shopping Centre, with free parking out the front.",
    servicesHighlight: "Murwillumbah and Tweed Valley patients often come to us for lower back pain from farm and manual work, sciatica, neck pain and headaches. Each service has its own page below.",
    sections: [
      {
        heading: "Farm work, trades and the rail trail",
        body: "Cane and banana farming, trades and other physical work are part of life in the Tweed Valley, and they can be hard on the lower back. We also see walkers and cyclists who've taken up the Northern Rivers Rail Trail and come in with sore lower backs, hips or knees.\n\nWe'll assess you, explain what we find, and agree on a plan before any treatment. Our <a href=\"/conditions/back-pain/\" class=\"text-mid-blue underline hover:text-navy\">back pain</a> and <a href=\"/conditions/hip-pain/\" class=\"text-mid-blue underline hover:text-navy\">hip pain</a> pages explain more. Results vary between individuals.",
      },
      {
        heading: "Planning around a longer drive",
        body: "Many of our Murwillumbah patients book their appointment around a trip to Tweed City Shopping Centre, which is a couple of minutes from the clinic. We'll plan your follow-up visits so you're not making the drive more often than you need to.\n\nWe're open until 6pm on Monday, Tuesday and Thursday, and from 8am to 11:30am on Saturday. If the distance becomes a problem, we're happy to suggest a practitioner closer to home.",
      },
    ],
    faqs: [
      {
        question: "How far is Banora Chiropractic from Murwillumbah?",
        answer: "About 28 km, or roughly a 27-minute drive north. We're at 2/44 Greenway Drive, Tweed Heads South, near Tweed City Shopping Centre, with free on-site parking.",
      },
      {
        question: "How often will I need to come in?",
        answer: "It depends on what we find at your first visit, and results vary between individuals. We'll explain our recommendation and plan visits with the drive in mind.",
      },
      {
        question: "Do I need a referral?",
        answer: "No. You can book directly online or call us on (07) 5599 2322. If you have a Medicare care plan from your GP, bring it along.",
      },
    ],
  },
];
