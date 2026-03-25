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
    metaTitle: 'Posture Correction | Banora Chiropractic | Tweed Heads South',
    metaDescription: 'Posture correction and assessment at Banora Chiropractic, Tweed Heads South. Improve your posture with expert chiropractic care. Book your assessment online.',
    heroHeading: 'Posture Correction',
    heroSubheading: 'Stand taller, sit easier, and move with more confidence.',
    icon: '🧍',
    shortDescription: 'Comprehensive posture assessment and correction programs to help you stand straighter and reduce strain on your body.',
    overview: 'Poor posture is one of the most common issues we see — and it is not surprising given how much time we spend sitting at desks, looking at phones, and driving. Over time, poor posture can contribute to back pain, neck tension, headaches, and fatigue. At Banora Chiropractic, we assess your posture thoroughly and create a plan to help you improve it — combining adjustments, exercises, and practical advice you can use every day.',
    benefits: [
      'May help reduce strain on your spine and joints',
      'Can support better breathing and energy levels',
      'Aims to reduce tension headaches linked to posture',
      'May help prevent long-term spinal changes',
      'Designed to improve your body awareness and comfort',
    ],
    whoIsItFor: 'Anyone who sits for long periods, uses a computer or phone regularly, or has noticed their posture changing over time. We also see many young people whose posture has been affected by heavy school bags and screen time.',
    whatToExpect: 'We start with a detailed posture assessment, looking at how your spine and body are aligned. From there, we will create a plan that may include chiropractic adjustments, stretches, and strengthening exercises. We will also give you practical tips for your workspace, sleeping position, and daily habits.',
    faqs: [
      { question: 'Can posture really be corrected?', answer: 'In many cases, yes — particularly if the changes are due to muscle imbalances and habits rather than structural changes. The earlier you address posture concerns, the better the potential outcomes. We will be honest about what we can and cannot help with.' },
      { question: 'How long does posture correction take?', answer: 'It varies depending on how long the posture issue has been developing and its cause. Some people notice improvements within weeks, while more established patterns may take longer. Consistency with exercises and adjustments is key.' },
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
    metaTitle: 'Pregnancy Chiropractic | Banora Chiropractic | Tweed Heads South',
    metaDescription: 'Gentle pregnancy chiropractic care in Tweed Heads South. Safe, supportive care for expecting mums. Book your appointment at Banora Chiropractic.',
    heroHeading: 'Pregnancy Chiropractic',
    heroSubheading: 'Gentle support for your changing body throughout pregnancy.',
    icon: '🤰',
    shortDescription: 'Safe, gentle chiropractic care designed to support your body through the physical changes of pregnancy.',
    overview: 'Pregnancy puts incredible demands on your body — your centre of gravity shifts, your ligaments loosen, and your spine has to adapt to a growing bump. Many expecting mums experience lower back pain, pelvic discomfort, and general achiness. Chiropractic care during pregnancy uses gentle, modified techniques to help keep your spine and pelvis aligned, which may help you feel more comfortable as your body changes.',
    benefits: [
      'May help reduce lower back and pelvic pain during pregnancy',
      'Aims to support better pelvic alignment',
      'Can help manage pregnancy-related discomfort',
      'Gentle techniques modified for each stage of pregnancy',
      'Designed to support your comfort right up to delivery',
    ],
    whoIsItFor: 'Expecting mums at any stage of pregnancy who want gentle, supportive care for their changing body. Whether you are experiencing specific discomfort or simply want to maintain your spinal health during pregnancy, we can help.',
    whatToExpect: 'We use specially designed pregnancy pillows and modified techniques so you can lie comfortably during treatment. Our adjustments are gentle and adapted to your stage of pregnancy. We will also provide advice on exercises, stretches, and sleeping positions that may help.',
    faqs: [
      { question: 'Is chiropractic care safe during pregnancy?', answer: 'Yes, chiropractic care is widely considered safe during pregnancy when performed by a qualified practitioner. We use gentle techniques specifically modified for expecting mums, and we will always check in with how you are feeling throughout your visit.' },
      { question: 'When should I start chiropractic care during pregnancy?', answer: 'You can start at any stage. Some women come to us early in pregnancy for preventive care, while others seek help when discomfort arises — often in the second or third trimester. There is no wrong time to start.' },
    ],
    relatedConditions: ['back-pain', 'sciatica'],
    relatedServices: ['chiropractic-adjustments', 'paediatric-chiropractic'],
  },
  {
    slug: 'paediatric-chiropractic',
    title: 'Paediatric Chiropractic',
    metaTitle: 'Paediatric Chiropractic | Banora Chiropractic | Tweed Heads South',
    metaDescription: 'Gentle chiropractic care for babies, children, and teens in Tweed Heads South. Safe, age-appropriate techniques. Book at Banora Chiropractic.',
    heroHeading: 'Paediatric Chiropractic',
    heroSubheading: 'Gentle care for growing bodies — from newborns to teens.',
    icon: '👶',
    shortDescription: 'Age-appropriate, gentle chiropractic care for babies, children, and adolescents to support healthy growth and development.',
    overview: 'Children are not just small adults — their bodies are growing, adapting, and changing constantly. From the physical demands of birth to the tumbles of childhood and the growth spurts of adolescence, a child\'s spine goes through a lot. Paediatric chiropractic uses very gentle techniques — often no more pressure than you would use to test the ripeness of a tomato — to check and support your child\'s spinal health.',
    benefits: [
      'Very gentle techniques suitable for newborns through to teens',
      'May support healthy spinal development',
      'Can help address postural concerns in growing children',
      'Aims to support overall comfort and wellbeing',
      'Age-appropriate assessment and care for every stage',
    ],
    whoIsItFor: 'Parents who want to have their child\'s spine checked, babies after birth, children experiencing growing pains or posture concerns, and active teens involved in sports. Many families bring their children in for regular check-ups alongside their own care.',
    whatToExpect: 'We will take the time to chat with you (and your child, if they are old enough) about any concerns. The assessment is thorough but gentle, and any adjustments use very light pressure. We always explain what we are doing and make sure both you and your child are comfortable.',
    faqs: [
      { question: 'Is chiropractic safe for babies?', answer: 'Yes. Paediatric chiropractic techniques for babies are extremely gentle — using about the same pressure you would use to check if a piece of fruit is ripe. Our chiropractors have experience working with babies and young children.' },
      { question: 'At what age can my child see a chiropractor?', answer: 'Children can be assessed at any age, including newborns. Many parents bring their babies in for a check-up within the first few weeks after birth, particularly after a difficult or assisted delivery.' },
    ],
    relatedConditions: ['back-pain', 'neck-pain'],
    relatedServices: ['chiropractic-adjustments', 'pregnancy-chiropractic'],
  },
];
