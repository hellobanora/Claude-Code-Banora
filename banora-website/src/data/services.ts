import { pricing } from './clinic';

export interface Service {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  icon: string;
  shortDescription: string;
  overview: string;
  benefits: string[];
  whoIsItFor: string;
  whatToExpect: string;
  faqs: { question: string; answer: string }[];
  relatedConditions: string[];
  relatedServices: string[];
  /** Optional extra sections (body paragraphs separated by blank lines). */
  sections?: { heading: string; body: string }[];
  /** Blog post slugs to link from this page. */
  relatedPosts?: string[];
}

export const services: Service[] = [
  {
    slug: 'chiropractic-adjustments',
    title: 'Chiropractic Adjustments',
    metaTitle: 'Chiropractic Adjustments | Banora Chiropractic | Tweed Heads South',
    metaDescription: 'Professional chiropractic adjustments in Tweed Heads South. Dr James Shipway and Dr Paul Cater use Diversified, Thompson, Soft Tissue Therapy, Arthrostim, and Extremity techniques. Book online today.',
    heroHeading: 'Chiropractic Adjustments',
    heroSubheading: 'Hands-on care tailored to your body, your goals, and how you want to feel.',
    icon: '🦴',
    shortDescription: 'Targeted spinal adjustments using a range of techniques to help restore movement, reduce discomfort, and support your overall wellbeing.',
    overview: 'At Banora Chiropractic, our adjustments are never one-size-fits-all. Dr James and Dr Paul each bring different techniques to the table — from Diversified and Thompson adjustments to Soft Tissue Therapy and Arthrostim — so your care is matched to what your body needs. Whether you are dealing with stiffness, pain, or just want to move better, we will work with you to find the right approach.',
    benefits: [
      'May help reduce back, neck, and joint discomfort',
      'Aims to improve spinal mobility and range of motion',
      'Can support better posture and body alignment',
      'May assist with headache and migraine management',
      'Designed to support your nervous system function',
    ],
    whoIsItFor: 'Chiropractic adjustments can be suitable for people of all ages — from young children to older adults. Whether you are an office worker with a stiff neck, an active person dealing with a sports niggle, or a parent carrying kids around all day, adjustments may help you feel more comfortable in your body.',
    whatToExpect: 'Your first visit includes a thorough assessment — we will chat about your health history, do a physical exam, and discuss what is going on. From there, we will recommend a care plan that makes sense for you. Regular adjustments typically take around 15 minutes and are tailored to your comfort level.',
    faqs: [
      { question: 'Does a chiropractic adjustment hurt?', answer: 'Most people find adjustments comfortable. You may hear a popping sound, which is simply gas releasing from the joint — completely normal. We always work within your comfort zone and offer gentle techniques if you prefer.' },
      { question: 'How many visits will I need?', answer: 'That depends on your situation. Some people feel improvement after just a few visits, while others benefit from ongoing care. We will give you an honest recommendation based on your assessment — no pressure, no lock-in plans.' },
      { question: 'Is chiropractic care safe?', answer: 'Chiropractic care has an excellent safety profile. Our chiropractors are university-trained, registered with AHPRA, and use evidence-based techniques. We will always discuss any considerations specific to your health before starting care.' },
    ],
    relatedConditions: ['back-pain', 'neck-pain', 'headaches-migraines'],
    relatedServices: ['posture-correction', 'sports-chiropractic'],
  },
  {
    slug: 'posture-correction',
    title: 'Posture Correction',
    metaTitle: 'Posture Correction Chiropractor | Forward Head Posture | Banora Chiropractic',
    metaDescription: 'Chiropractor for posture correction in Tweed Heads South. We assess and address forward head posture, rounded shoulders, and poor posture. Book your assessment online.',
    heroHeading: 'Posture Correction',
    heroSubheading: 'Forward head posture, rounded shoulders, or a back that aches by midday — we can assess what is going on and help you do something about it.',
    icon: '🧍',
    shortDescription: 'Chiropractic posture assessment and correction for forward head posture, rounded shoulders, and postural pain — combining adjustments, exercises, and practical advice.',
    overview: 'Poor posture is one of the most common issues we see — and it is not surprising given how much time we spend sitting at desks, looking at phones, and driving. Forward head posture is particularly prevalent: for every 2.5 centimetres the head sits forward of the shoulders, the effective load on the neck increases significantly. Over time, poor posture can contribute to neck pain, back pain, tension headaches, and chronic fatigue. Many people come to us specifically looking for a chiropractor for posture correction — and we are well placed to help. At Banora Chiropractic, we conduct a thorough postural assessment and create a personalised plan combining spinal adjustments, targeted exercises, and practical daily habits.',
    benefits: [
      'May help reduce neck and back pain caused by postural strain',
      'Addresses forward head posture and rounded shoulder patterns',
      'Can support better breathing and energy levels',
      'Aims to reduce tension headaches linked to poor posture',
      'May help prevent long-term postural and spinal changes',
      'Designed to improve your body awareness and daily comfort',
    ],
    whoIsItFor: 'Anyone who sits for long periods, uses screens regularly, or has noticed changes in their posture over time. We commonly see people with forward head posture from desk and phone use, rounded shoulders from prolonged sitting, and postural changes in young people from heavy school bags and screen time.',
    whatToExpect: 'We start with a detailed posture assessment — looking at your spinal alignment, head position, shoulder position, and how you move. We will identify the specific patterns contributing to your discomfort and explain what we find. From there, your care plan may include chiropractic adjustments to restore joint mobility, exercises to strengthen the deep postural muscles, and practical guidance on workstation setup, sleeping position, and daily habits.',
    faqs: [
      { question: 'Can a chiropractor fix forward head posture?', answer: 'A chiropractor can assess forward head posture, address the joint restrictions in the cervical and thoracic spine that contribute to it, and guide you through the specific exercises that help correct it. Forward head posture is largely a habit and an adaptation — with consistent effort and the right approach, significant improvement is achievable. We will be honest about what is realistic for your specific situation.' },
      { question: 'Can posture really be corrected?', answer: 'In many cases, yes — particularly when the changes are driven by muscle imbalances and habitual positions rather than structural changes. The earlier posture is addressed, the better the potential outcomes. Chiropractic adjustments combined with targeted exercises tend to produce better results than exercises alone.' },
      { question: 'How long does posture correction take?', answer: 'It depends on how long the posture pattern has been developing and its underlying cause. Some people notice improvements within a few weeks. More established patterns — particularly long-standing forward head posture — may take longer and require more consistency. We will give you a realistic timeframe based on your assessment.' },
    ],
    relatedConditions: ['back-pain', 'neck-pain', 'headaches-migraines'],
    relatedServices: ['chiropractic-adjustments', 'sports-chiropractic'],
  },
  {
    slug: 'sports-chiropractic',
    title: 'Sports Chiropractic',
    metaTitle: 'Sports Chiropractic | Banora Chiropractic | Tweed Heads South',
    metaDescription: 'Sports chiropractic care in Tweed Heads South. Help prevent injuries, improve performance, and recover faster. Book with our experienced chiropractors.',
    heroHeading: 'Sports Chiropractic',
    heroSubheading: 'Get back in the game — or stay ahead of it.',
    icon: '🏃',
    shortDescription: 'Specialised chiropractic care for athletes and active people to support performance, recovery, and injury prevention.',
    overview: 'Whether you are a weekend warrior, a competitive athlete, or just someone who loves staying active, your body takes a beating. Sports chiropractic focuses on keeping your musculoskeletal system performing at its best — helping you recover from injuries, prevent new ones, and move more efficiently. Our chiropractors understand the demands of sport and tailor care to your specific activity and goals.',
    benefits: [
      'May help speed up recovery from sports injuries',
      'Aims to improve joint mobility and flexibility',
      'Can support better biomechanics and movement patterns',
      'May help reduce the risk of recurring injuries',
      'Designed to complement your training and recovery routine',
    ],
    whoIsItFor: 'Runners, surfers, gym-goers, golfers, swimmers, team sport players — anyone who uses their body actively and wants to keep it performing well. We also work with people recovering from sports injuries who want to get back to their activity safely.',
    whatToExpect: 'We will assess your movement, identify any restrictions or imbalances, and create a care plan that fits your training schedule. Treatment may include spinal and extremity adjustments, soft tissue work, and exercise recommendations. We aim to get you moving well and keep you that way.',
    faqs: [
      { question: 'Do I need to be an athlete to benefit from sports chiropractic?', answer: 'Not at all. If you are active in any way — walking, swimming, gardening, playing with your kids — sports chiropractic principles can help you move better and reduce your risk of injury.' },
      { question: 'Can chiropractic help with a specific sports injury?', answer: 'Many sports injuries involve the musculoskeletal system, which is exactly what we work with. We will assess your injury, determine if chiropractic care is appropriate, and if needed, refer you to the right specialist.' },
    ],
    relatedConditions: ['back-pain', 'shoulder-pain', 'sciatica'],
    relatedServices: ['chiropractic-adjustments', 'posture-correction'],
  },
  {
    slug: 'pregnancy-chiropractic',
    title: 'Pregnancy Chiropractic',
    metaTitle: 'Pregnancy Chiropractor Tweed Heads | Banora Chiropractic',
    metaDescription: 'Pregnancy chiropractor in Tweed Heads South. Gentle, modified care for lower back and pelvic discomfort during pregnancy. HICAPS on-site. Book online.',
    heroHeading: 'Pregnancy Chiropractic in Tweed Heads South',
    heroSubheading: 'Gentle, modified care for the back and pelvic aches that can come with a growing bump.',
    icon: '🤰',
    shortDescription: 'Gentle, modified chiropractic care to help with the back and pelvic discomfort that often comes with pregnancy.',
    overview: "Your body changes a lot in nine months. Your centre of gravity moves forward, the hormone relaxin loosens the ligaments around your pelvis, and your lower back takes on more load as your bump grows. It's no surprise that lower back pain, pelvic girdle pain and sore hips are some of the most common things pregnant women tell us about.\n\nAt Banora Chiropractic in Tweed Heads South, we use gentle, modified techniques and positioning to help you stay comfortable through each trimester. Care is adapted to your stage of pregnancy and to how you're feeling on the day, and many women find it a useful part of looking after themselves while pregnant. Results vary between individuals, so we'll always talk you through what's realistic for you.",
    benefits: [
      'May help ease lower back and pelvic discomfort during pregnancy',
      'Gentle techniques and positioning adapted to each trimester',
      'Practical advice on sleeping positions, stretches and daily movement',
      'Care that works alongside your midwife, obstetrician or GP',
      'Support after your baby arrives, as your body recovers',
    ],
    whoIsItFor: "Women at any stage of pregnancy who are dealing with lower back pain, pelvic or hip discomfort, pain running down the leg, or mid-back and rib tightness as the bump grows. Some women come in during the first trimester; others don't think about it until the third. Either is fine. We also see mums in the months after birth, when feeding, lifting and broken sleep can leave the neck and back feeling it.",
    whatToExpect: "At your first visit we'll ask about your pregnancy, your health history and what's bothering you, then do a gentle physical assessment. We use pregnancy pillows and a drop-section table so you can lie comfortably without pressure on your bump, and side-lying positions where needed. Treatment is gentle and we check in with you throughout. You'll also leave with practical advice on sleeping, sitting and moving that may help between visits.",
    sections: [
      {
        heading: 'Working alongside your pregnancy care team',
        body: "Your midwife, obstetrician or GP is in charge of your pregnancy care, and our role is to support that, not replace it. Before we start, we'll ask about any complications, and we'll keep your care within what your medical team is comfortable with.\n\nSome symptoms need a medical review rather than a chiropractor. If you have bleeding, fluid loss, severe or sudden pain, headaches with swelling or vision changes, or your baby is moving less than usual, contact your midwife, doctor or hospital straight away. If anything in our assessment needs medical attention, we'll refer you to your GP or obstetrician.",
      },
      {
        heading: 'Why women choose Banora Chiropractic during pregnancy',
        body: "Dr Paul Cater has a particular interest in pregnancy and paediatric care, and both Dr Paul and Dr James use Sacro-Occipital Technique (SOT), a gentle method that relies on positioning and low-force adjustments. Between them they have more than 30 years of experience.\n\nThe practical side helps too. The clinic is on the ground floor with no steps, parking is right out the front, and we're open Saturday mornings. HICAPS is on-site, so if your extras cover includes chiropractic you can claim on the spot. You don't need a referral.",
      },
    ],
    faqs: [
      { question: 'Is chiropractic care safe during pregnancy?', answer: "Every pregnancy is different, so we start by asking about your health and any complications. For many women, gentle chiropractic care with techniques modified for pregnancy is a reasonable option, but it isn't right for everyone, and if we don't think it's suitable for you we'll tell you. If you're unsure, check with your midwife or doctor before booking." },
      { question: 'When can I start chiropractic care during pregnancy?', answer: "At any stage. Some women come in during the first trimester, while others start when discomfort shows up in the second or third. We adapt techniques and positioning as your pregnancy progresses." },
      { question: 'Will I have to lie on my stomach?', answer: "No. We use pregnancy pillows that support your bump, along with side-lying and seated positions, so you can stay comfortable for your whole visit." },
      { question: 'Do I need a referral, and can I claim on my health fund?', answer: "You don't need a referral. If your private health extras cover includes chiropractic, we can process your claim on the spot through HICAPS, so you only pay the gap." },
      { question: 'Can you help after my baby is born?', answer: "Many mums come back in the months after birth, when feeding, lifting and carrying a baby can leave the neck and back sore. You're welcome to bring your baby along to your appointment." },
    ],
    relatedConditions: ['back-pain', 'sciatica', 'hip-pain', 'mid-back-pain'],
    relatedServices: ['chiropractic-adjustments', 'paediatric-chiropractic'],
    relatedPosts: ['chiropractic-care-during-pregnancy', 'sciatica-during-pregnancy'],
  },
  {
    slug: 'paediatric-chiropractic',
    title: 'Paediatric Chiropractic',
    metaTitle: 'Kids & Baby Chiropractor Tweed Heads | Banora Chiropractic',
    metaDescription: 'Kids and baby chiropractor in Tweed Heads South. Gentle, age-appropriate assessment and care, from newborns to teens. HICAPS on-site. Book online.',
    heroHeading: 'Chiropractic for Kids & Babies in Tweed Heads South',
    heroSubheading: 'Gentle, age-appropriate care for growing bodies, from newborns to teens.',
    icon: '👶',
    shortDescription: 'Gentle, age-appropriate chiropractic assessment and care for babies, children and teens.',
    overview: "Kids aren't small adults. Their spines are still growing, their bones and joints are softer, and the way they move changes from one year to the next. So the way we assess and treat children is different too: lighter pressure, shorter visits, and plenty of explanation for both you and your child.\n\nAt Banora Chiropractic in Tweed Heads South, we see babies, school-age children and teenagers. Parents usually bring them in for musculoskeletal concerns, like a teenager with a sore back from sport or a heavy school bag, or a child with a stiff neck after a fall. We'll always tell you honestly whether we think chiropractic care is appropriate, and results vary from child to child.",
    benefits: [
      "Gentle, low-force techniques adapted to your child's age and size",
      'Assessment of posture and movement as your child grows',
      'May help with musculoskeletal aches from sport, play or school bags',
      'Clear explanations for parents, and for kids in words they understand',
      'Referral to your GP or paediatrician when something needs medical attention',
    ],
    whoIsItFor: "Babies, children and teenagers with musculoskeletal concerns, such as back or neck pain, aches after a fall or sports injury, or posture changes that come with growth spurts, screens and school bags. We see plenty of active teens who play footy, netball and touch or surf, and kids who come in alongside a parent who's already a patient.",
    whatToExpect: "We'll start by talking with you about your child's health history, birth and development, and what you've noticed. Then we'll do a gentle, age-appropriate assessment of how they move. If we think care is suitable, we'll explain what we'd like to do before we do it, and you stay with your child the whole time. Children get much lighter pressure than adults, and for babies it's very gentle, low-force work. If anything in our assessment needs a medical opinion, we'll refer you to your GP or paediatrician.",
    sections: [
      {
        heading: "What chiropractic care for kids is (and isn't) for",
        body: "Chiropractic care for children focuses on musculoskeletal concerns: muscles, joints and how the body moves. We don't treat colic, ADHD, ear infections, bedwetting, asthma or developmental conditions, and chiropractic care isn't a substitute for your GP, paediatrician or child health nurse.\n\nIf your child is unwell, has a fever, isn't feeding well, or you're worried about their development, please see your GP or paediatrician first. We're always happy to work alongside your child's medical team.",
      },
      {
        heading: 'Why families choose Banora Chiropractic',
        body: `Dr Paul Cater has a particular interest in pregnancy and paediatric care, and Dr James Shipway is a dad of four, so both are well used to keeping little ones at ease. Between them they have more than 30 years of experience.\n\nThe clinic is on the ground floor with no steps, so prams are easy, and parking is right out the front. We're open Saturday mornings, which helps around school and sport. Child and student fees are $${pricing.newPatient.studentChild} for the first visit and $${pricing.regularAdjustment.studentChild} after that, and HICAPS is on-site if your family's extras cover includes chiropractic.`,
      },
    ],
    faqs: [
      { question: 'Is chiropractic care safe for children?', answer: "All health care carries some risk, and we take that seriously with children. We take a full history first, use gentle, low-force techniques, and only treat when we think it's appropriate. For babies and young children, care is very light touch. If you have concerns, talk with us or your GP before booking." },
      { question: 'What age can my child see a chiropractor?', answer: "We see children of all ages, from babies through to teenagers. How we assess and treat changes with age, and for babies and young children it's always very gentle, low-force care." },
      { question: "What should I bring to my child's first visit?", answer: "Any relevant reports or scans, a list of medications, and your health fund card if you'd like to claim. For babies, bring whatever helps them settle, like a feed, dummy or favourite toy." },
      { question: 'Will you refer us to a doctor if needed?', answer: "Yes. If something in our assessment needs a medical opinion, or your child's symptoms aren't the kind of thing chiropractic care is suited to, we'll refer you to your GP or paediatrician and explain why." },
      { question: 'How much does it cost?', answer: `Child and student fees are $${pricing.newPatient.studentChild} for the first visit and $${pricing.regularAdjustment.studentChild} for follow-ups. HICAPS is on-site, so if your extras cover includes chiropractic, you can claim on the spot and only pay the gap.` },
    ],
    relatedConditions: ['back-pain', 'neck-pain', 'posture-tech-neck', 'sports-injuries'],
    relatedServices: ['chiropractic-adjustments', 'pregnancy-chiropractic'],
    relatedPosts: ['chiropractic-care-for-kids'],
  },
];
