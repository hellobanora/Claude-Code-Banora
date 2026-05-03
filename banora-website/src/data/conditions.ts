export interface Condition {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  icon: string;
  shortDescription: string;
  overview: string;
  symptoms: string[];
  howWeHelp: string;
  faqs: { question: string; answer: string }[];
  relatedConditions: string[];
  relatedServices: string[];
}

export const conditions: Condition[] = [
  {
    slug: 'back-pain',
    title: 'Back Pain',
    metaTitle: 'Back Pain Treatment | Chiropractor Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Suffering from back pain in Tweed Heads South? Banora Chiropractic may help with lower back pain, upper back stiffness, and spinal discomfort. Book online today.',
    heroHeading: 'Back Pain',
    heroSubheading: 'You do not have to just put up with it — let us help you find some relief.',
    icon: '🔙',
    shortDescription: 'Chiropractic care that aims to address the underlying causes of back pain, not just the symptoms.',
    overview: 'Back pain is one of the most common reasons people visit us at Banora Chiropractic. Whether it is a dull ache that has been building over months, a sharp pain that hit you out of nowhere, or stiffness that makes it hard to get out of bed in the morning — we understand how much it can affect your daily life. Our chiropractors will assess your spine, identify what is contributing to your pain, and work with you on a plan to help you feel better.',
    symptoms: [
      'Dull, aching pain in the lower or upper back',
      'Sharp or shooting pain that may radiate into the legs',
      'Stiffness or reduced range of motion',
      'Pain that worsens with sitting, standing, or bending',
      'Muscle spasms or tightness around the spine',
      'Difficulty sleeping due to back discomfort',
    ],
    howWeHelp: 'We start by understanding your pain — when it started, what makes it better or worse, and how it is affecting your life. After a thorough assessment, we will explain what we have found and recommend a care plan. This may include spinal adjustments, soft tissue work, posture advice, and exercises to do at home. Our goal is to address the cause, not just the symptom.',
    faqs: [
      { question: 'Can a chiropractor help with my back pain?', answer: 'Chiropractic care is one of the most common and well-researched approaches to back pain. Many people find that chiropractic adjustments, combined with exercise and lifestyle changes, may help reduce their pain and improve their function. We will assess your situation and let you know if chiropractic care is appropriate for you.' },
      { question: 'How quickly will I feel better?', answer: 'Everyone responds differently. Some people notice improvement after their first visit, while others may take a few sessions to start feeling the benefits. We will give you a realistic timeline based on your specific situation — no guesswork, no overpromising.' },
      { question: 'Should I see a chiropractor or a doctor for back pain?', answer: 'Both can play a role. Chiropractors are primary contact practitioners, which means you do not need a referral to see us. If we believe your back pain requires medical investigation, we will refer you to the appropriate professional.' },
    ],
    relatedConditions: ['sciatica', 'neck-pain'],
    relatedServices: ['chiropractic-adjustments', 'posture-correction'],
  },
  {
    slug: 'neck-pain',
    title: 'Neck Pain',
    metaTitle: 'Neck Pain Treatment | Chiropractor Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Neck pain relief at Banora Chiropractic, Tweed Heads South. Expert chiropractic care for stiff necks, tech neck, and cervical discomfort. Book online.',
    heroHeading: 'Neck Pain',
    heroSubheading: 'From tech neck to tension — we can help you loosen up.',
    icon: '🦒',
    shortDescription: 'Targeted chiropractic care for neck pain, stiffness, and tension that may be affecting your daily comfort.',
    overview: 'Neck pain is incredibly common — and it is getting more so thanks to our screen-heavy lifestyles. Whether your neck is stiff from hours at a desk, sore from sleeping in an awkward position, or has been bothering you for longer than you can remember, we can help. At Banora Chiropractic, we gently assess your cervical spine and surrounding muscles to find out what is going on, and create a plan to help you move your neck freely again.',
    symptoms: [
      'Stiffness or restricted movement when turning your head',
      'Aching or sharp pain in the neck or upper shoulders',
      'Headaches that start at the base of the skull',
      'Pain that radiates into the shoulders or arms',
      'A grinding or clicking feeling when moving your neck',
      'Tenderness in the muscles around your neck',
    ],
    howWeHelp: 'We will carefully assess your neck — checking your range of motion, palpating for areas of tension or restriction, and looking at your posture. Treatment may include gentle cervical adjustments, soft tissue work, and advice on workspace ergonomics. We will also show you stretches and exercises you can do at home to help manage your neck health.',
    faqs: [
      { question: 'Is it safe to have my neck adjusted?', answer: 'Cervical adjustments are a well-established chiropractic technique with a strong safety profile. Our chiropractors are highly trained in neck adjustments and will always discuss the approach with you first. We offer a range of techniques including Diversified, Thompson, and Arthrostim to suit your comfort level.' },
      { question: 'What is tech neck?', answer: 'Tech neck refers to neck pain and postural changes that come from spending long periods looking down at phones, tablets, or laptops. It is becoming increasingly common and can cause neck stiffness, headaches, and upper back tension. Chiropractic care, combined with posture awareness, may help manage these symptoms.' },
    ],
    relatedConditions: ['headaches-migraines', 'shoulder-pain'],
    relatedServices: ['chiropractic-adjustments', 'posture-correction'],
  },
  {
    slug: 'sciatica',
    title: 'Sciatica',
    metaTitle: 'Sciatica Treatment | Chiropractor Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Sciatica pain relief at Banora Chiropractic, Tweed Heads South. Chiropractic care that aims to address the cause of sciatic nerve pain. Book online.',
    heroHeading: 'Sciatica',
    heroSubheading: 'That shooting pain down your leg? We see it all the time — and we may be able to help.',
    icon: '⚡',
    shortDescription: 'Chiropractic assessment and care for sciatic nerve pain, aiming to address the underlying cause of your symptoms.',
    overview: 'Sciatica is not a condition in itself — it is a symptom of something irritating your sciatic nerve, which runs from your lower back down through your hips and legs. The pain can range from a mild ache to a sharp, burning sensation that makes it hard to sit, stand, or walk. At Banora Chiropractic, we assess your lower back and pelvis to identify what is causing the nerve irritation and work to address it at the source.',
    symptoms: [
      'Pain that radiates from the lower back down one leg',
      'Sharp, shooting, or burning pain in the buttock or leg',
      'Numbness or tingling in the leg or foot',
      'Weakness in the affected leg',
      'Pain that worsens with sitting or bending',
      'Difficulty standing up or walking comfortably',
    ],
    howWeHelp: 'We conduct a thorough neurological and orthopaedic examination to understand what is irritating your sciatic nerve. Depending on the cause, treatment may include spinal adjustments to improve alignment, specific stretches to reduce nerve tension, and advice on positions and movements that may help manage your symptoms. If we suspect something more serious, we will refer you for imaging or to a specialist.',
    faqs: [
      { question: 'Can a chiropractor help with sciatica?', answer: 'Chiropractic care is a common approach to managing sciatica symptoms. By addressing spinal alignment and reducing pressure on the sciatic nerve, many people find relief through chiropractic treatment. We will assess your situation thoroughly to determine if chiropractic care is the right approach for you.' },
      { question: 'How long does sciatica take to resolve?', answer: 'It depends on the underlying cause. Some cases of sciatica improve significantly within a few weeks of care, while more established cases may take longer. We will be upfront about what to expect based on your assessment.' },
    ],
    relatedConditions: ['back-pain', 'neck-pain'],
    relatedServices: ['chiropractic-adjustments', 'sports-chiropractic'],
  },
  {
    slug: 'headaches-migraines',
    title: 'Headaches & Migraines',
    metaTitle: 'Headache & Migraine Relief | Chiropractor Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Headache and migraine relief through chiropractic care at Banora Chiropractic, Tweed Heads South. Address the cause, not just the symptoms. Book online.',
    heroHeading: 'Headaches & Migraines',
    heroSubheading: 'Tired of reaching for painkillers? There may be a better way.',
    icon: '🤕',
    shortDescription: 'Chiropractic care that aims to identify and address the spinal and muscular causes of recurring headaches and migraines.',
    overview: 'If you are dealing with regular headaches or migraines, you know how much they can take over your day. While there are many causes of headaches, a significant number originate from tension and dysfunction in the neck and upper back — and that is where chiropractic care can make a real difference. At Banora Chiropractic, we look beyond the headache itself to understand what is driving it, and work to address those underlying factors.',
    symptoms: [
      'Recurring headaches, especially at the base of the skull or temples',
      'Migraines with or without visual disturbances',
      'Tension-type headaches with a band-like pressure',
      'Headaches linked to neck stiffness or tension',
      'Pain behind the eyes',
      'Headaches that worsen with stress or prolonged sitting',
    ],
    howWeHelp: 'We assess your neck, upper back, and posture to identify any spinal restrictions or muscle tension that may be contributing to your headaches. Treatment typically includes gentle cervical and thoracic adjustments, soft tissue work on tight muscles, and advice on posture, hydration, and stress management. Many of our patients report a reduction in headache frequency and intensity with regular care.',
    faqs: [
      { question: 'Can chiropractic care help with migraines?', answer: 'Research suggests that chiropractic care may help reduce the frequency and intensity of migraines for some people, particularly when the migraines have a cervicogenic (neck-related) component. We will assess whether chiropractic care is likely to benefit your specific type of headache.' },
      { question: 'How is a chiropractic approach to headaches different?', answer: 'Rather than focusing on managing the pain with medication, we look at what is causing the headaches. If spinal restrictions, muscle tension, or posture are contributing factors, addressing these may help reduce your headache frequency and severity over time.' },
    ],
    relatedConditions: ['neck-pain', 'shoulder-pain'],
    relatedServices: ['chiropractic-adjustments', 'posture-correction'],
  },
  {
    slug: 'shoulder-pain',
    title: 'Shoulder Pain',
    metaTitle: 'Shoulder Pain Treatment | Chiropractor Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Shoulder pain assessment and chiropractic care at Banora Chiropractic, Tweed Heads South. Address shoulder stiffness, impingement, and discomfort. Book online.',
    heroHeading: 'Shoulder Pain',
    heroSubheading: 'From frozen shoulders to nagging aches — we will get to the bottom of it.',
    icon: '💪',
    shortDescription: 'Chiropractic assessment and care for shoulder pain, stiffness, and restricted movement.',
    overview: 'Your shoulders do a lot of heavy lifting — literally and figuratively. When shoulder pain strikes, it can make everything from getting dressed to driving the car uncomfortable. Shoulder problems can originate from the shoulder joint itself, the surrounding muscles, or even from your neck and upper back. At Banora Chiropractic, we take the time to figure out where your shoulder pain is actually coming from, so we can address it effectively.',
    symptoms: [
      'Pain when lifting your arm or reaching overhead',
      'Stiffness or restricted movement in the shoulder',
      'Aching pain at night that disrupts sleep',
      'Sharp pain with certain movements',
      'Weakness in the arm or shoulder',
      'Pain that radiates from the neck into the shoulder',
    ],
    howWeHelp: 'We examine your shoulder joint, assess your range of motion, and check the surrounding structures — including your neck and upper back, which often contribute to shoulder problems. Treatment may include shoulder and spinal adjustments, extremity techniques, soft tissue work, and specific rehabilitation exercises. If we suspect a tear or structural issue that requires imaging, we will refer you appropriately.',
    faqs: [
      { question: 'Can a chiropractor help with shoulder pain?', answer: 'Yes, chiropractors are trained in the assessment and management of shoulder conditions. Many types of shoulder pain — including impingement, stiffness, and referred pain from the neck — can respond well to chiropractic care. We will assess your shoulder and let you know if we can help.' },
      { question: 'Do you treat frozen shoulder?', answer: 'We can assess and manage frozen shoulder (adhesive capsulitis) with gentle techniques aimed at improving range of motion and reducing discomfort. Frozen shoulder can be a slow process, but many patients find that chiropractic care, combined with specific exercises, helps them progress.' },
    ],
    relatedConditions: ['neck-pain', 'back-pain'],
    relatedServices: ['chiropractic-adjustments', 'sports-chiropractic'],
  },
  {
    slug: 'sports-injuries',
    title: 'Sports Injuries',
    metaTitle: 'Sports Injuries Treatment | Chiropractor Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Sports injury assessment and chiropractic care at Banora Chiropractic, Tweed Heads South. Get back to doing what you love sooner. Book online.',
    heroHeading: 'Sports Injuries',
    heroSubheading: 'Whether you train hard or gave it too much on the weekend — we can help get you back to it.',
    icon: '🏃',
    shortDescription: 'Chiropractic assessment and care for sports injuries, aimed at helping you recover well and get back to doing what you love.',
    overview: 'The Tweed and Gold Coast is full of active people — surfers, runners, cyclists, swimmers, team sport players, and plenty of enthusiastic weekend warriors. When injury strikes, it is more than just pain; it is time away from the activity you love. At Banora Chiropractic, we assess and manage a wide range of sports injuries, looking at both the site of injury and the underlying mechanics that may have contributed to it.',
    symptoms: [
      'Joint pain or swelling following sport or exercise',
      'Muscle strains or persistent tightness after training',
      'Lower back or hip pain from running, lifting, or twisting',
      'Shoulder pain from throwing, swimming, or overhead movements',
      'Knee or ankle discomfort affecting your ability to train',
      'Recurring injuries that keep coming back in the same spot',
    ],
    howWeHelp: 'We begin with a thorough assessment — taking a history of how the injury occurred, examining the affected area, and looking at your movement patterns and biomechanics. Treatment may include spinal and extremity adjustments, soft tissue work, rehabilitation exercises, and practical advice on load management and return-to-sport timelines. For more complex injuries, we work alongside GPs, physiotherapists, and sports medicine doctors to make sure you are getting the right care at every stage.',
    faqs: [
      { question: 'Can a chiropractor help with sports injuries?', answer: 'Chiropractors are trained in the assessment and management of musculoskeletal injuries, including many common sports injuries. Conditions like ankle sprains, shoulder injuries, lower back strains, and repetitive stress injuries can often respond well to chiropractic care. We will be upfront if your injury needs imaging or a referral to another practitioner.' },
      { question: 'Do I need to stop training while I receive chiropractic care?', answer: 'Not necessarily. We will give you honest, practical advice on what you can and cannot do during your recovery. In many cases, modified training is possible — and staying active sensibly often supports a faster recovery. We will work with you to keep you moving as much as safely allows.' },
      { question: 'Can chiropractic care help prevent sports injuries?', answer: 'Regular chiropractic care may help identify movement restrictions, joint dysfunction, and muscle imbalances that can increase injury risk over time. Many athletes use chiropractic care as part of their ongoing maintenance routine — not just when they are injured.' },
    ],
    relatedConditions: ['back-pain', 'shoulder-pain', 'sciatica'],
    relatedServices: ['sports-chiropractic', 'chiropractic-adjustments'],
  },
];
