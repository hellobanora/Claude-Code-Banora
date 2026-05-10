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
    metaTitle: 'Back Pain & Lumbar Pain Treatment | Chiropractor Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Lower back pain and lumbar pain relief at Banora Chiropractic, Tweed Heads South. Expert chiropractic care for back pain, lumbar spine pain, and upper back discomfort. Book online.',
    heroHeading: 'Back Pain',
    heroSubheading: 'Whether it is lower back pain, lumbar pain, or upper back stiffness — you do not have to just put up with it.',
    icon: '🔙',
    shortDescription: 'Chiropractic care that aims to address the underlying causes of back pain and lumbar pain, not just the symptoms.',
    overview: 'Back pain is one of the most common reasons people visit us at Banora Chiropractic. Whether it is a dull ache in the lumbar spine that has been building over months, a sharp lower back pain that hit you out of nowhere, upper back stiffness that makes it hard to breathe deeply, or lumbar pain that worsens when bending or sitting — we understand how much it can affect your daily life. Around 4 million Australians live with back pain at any given time. Our chiropractors will assess your spine thoroughly, identify what is contributing to your pain, and work with you on a clear plan to help you feel better.',
    symptoms: [
      'Dull, aching pain in the lower back or lumbar spine',
      'Sharp or shooting lower back pain that may radiate into the hips or legs',
      'Lumbar pain that worsens with sitting, standing, bending, or lifting',
      'Upper back pain and stiffness between the shoulder blades',
      'Muscle spasms or tightness around the lumbar spine',
      'Lower back pain that is worse in the morning and eases with movement',
      'Difficulty sleeping due to back or lumbar discomfort',
    ],
    howWeHelp: 'We start by understanding your pain — when it started, what makes it better or worse, and how it is affecting your life. Whether you have acute lumbar pain from an injury or chronic lower back pain that has been building for years, we will conduct a thorough assessment and explain what we have found. Care may include spinal adjustments to restore lumbar joint mobility, soft tissue work to ease muscle tension, specific lower back pain exercises to do at home, and posture and movement advice to address the contributing factors. Our goal is to address the cause, not just the symptom.',
    faqs: [
      { question: 'Can a chiropractor help with lower back pain?', answer: 'Chiropractic care is one of the most common and well-researched approaches to lower back pain and lumbar pain. Many people find that chiropractic adjustments, combined with appropriate exercise and lifestyle changes, may help reduce their pain and improve their function. We will assess your situation and let you know if chiropractic care is appropriate for you.' },
      { question: 'What is the difference between lower back pain and lumbar pain?', answer: 'They describe the same region — the lumbar spine refers to the five vertebrae in the lower back (L1–L5). Lumbar pain, lower back pain, and lumbar spine pain are all terms for discomfort in this area. The causes and presentation can vary widely, which is why a proper assessment is important.' },
      { question: 'How quickly will I feel better?', answer: 'Everyone responds differently. Some people notice improvement after their first visit, while others may take a few sessions to start feeling the benefits. We will give you a realistic timeline based on your specific situation — no guesswork, no overpromising.' },
      { question: 'Should I see a chiropractor or a doctor for back pain?', answer: 'Both can play a role. Chiropractors are primary contact practitioners, which means you do not need a referral to see us. If we believe your back pain requires medical investigation, we will refer you to the appropriate professional.' },
    ],
    relatedConditions: ['sciatica', 'neck-pain', 'hip-pain'],
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
    metaTitle: 'Sciatica Treatment & Relief | Chiropractor Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Sciatica pain relief at Banora Chiropractic, Tweed Heads South. Chiropractic care, sciatica exercises, and stretches that aim to address sciatic nerve pain. Book online.',
    heroHeading: 'Sciatica',
    heroSubheading: 'That shooting pain down your leg? We see it all the time — and we may be able to help you get on top of it.',
    icon: '⚡',
    shortDescription: 'Chiropractic assessment, care, and exercise guidance for sciatic nerve pain — aiming to address the underlying cause of your symptoms.',
    overview: 'Sciatica is not a condition in itself — it is a symptom of something irritating your sciatic nerve, which runs from your lower back down through your hips and into your legs. The pain can range from a dull ache to a sharp, burning sensation that makes it hard to sit, stand, or walk. Some people also experience numbness, tingling, or weakness in the affected leg. Sciatica during pregnancy is also very common, as the growing uterus can place pressure on the sciatic nerve. At Banora Chiropractic, we assess your lower back, pelvis, and hip to identify what is causing the nerve irritation — then work to address it at the source, not just manage the pain.',
    symptoms: [
      'Pain that radiates from the lower back down one leg — sometimes all the way to the foot',
      'Sharp, shooting, or burning pain in the buttock or leg',
      'Numbness or tingling in the leg or foot',
      'Weakness in the affected leg',
      'Pain that worsens with sitting, bending, or coughing',
      'Difficulty standing up, walking comfortably, or finding a pain-free position',
      'Sciatica pain during pregnancy — hip and leg pain that builds as the pregnancy progresses',
    ],
    howWeHelp: 'We conduct a thorough neurological and orthopaedic examination to understand what is irritating your sciatic nerve. Depending on the cause, care may include spinal adjustments to improve alignment and reduce nerve compression, specific sciatica stretches and exercises to reduce nerve tension and improve mobility, soft tissue work on the piriformis and surrounding hip muscles, and advice on positions and daily movements to help manage your symptoms. For sciatica during pregnancy, we use safe, comfortable techniques suited to each trimester. If we suspect something that requires imaging or specialist referral, we will tell you directly.',
    faqs: [
      {
        question: 'Can a chiropractor help with sciatica?',
        answer: 'Chiropractic care is one of the most common approaches to managing sciatica. By assessing spinal alignment, reducing pressure on the sciatic nerve, and guiding you through appropriate sciatica stretches and exercises, many people find meaningful relief. We will assess your situation thoroughly to determine if chiropractic care is the right approach for your type of sciatica.',
      },
      {
        question: 'What stretches or exercises help sciatica?',
        answer: 'The most helpful sciatica stretches and exercises depend on the underlying cause — which is why a proper assessment matters before starting any exercise program. Commonly recommended movements include the piriformis stretch, knee-to-chest stretch, and gentle nerve flossing exercises. We will show you specifically which exercises for sciatica are appropriate for your situation and teach you how to do them safely.',
      },
      {
        question: 'How long does sciatica take to resolve?',
        answer: 'It depends on the underlying cause and how long the nerve has been irritated. Some cases of sciatica improve significantly within a few weeks of care, while more established cases may take longer. We will be upfront about what to expect based on your assessment — no guesswork.',
      },
      {
        question: 'Is sciatica during pregnancy normal?',
        answer: 'Sciatica during pregnancy is very common, particularly in the second and third trimesters. As the uterus grows and posture changes, pressure on the sciatic nerve can cause the familiar shooting pain down one leg. Chiropractic care uses gentle, pregnancy-safe techniques to help reduce this pressure and ease your symptoms.',
      },
    ],
    relatedConditions: ['back-pain', 'neck-pain', 'hip-pain'],
    relatedServices: ['chiropractic-adjustments', 'sports-chiropractic'],
  },
  {
    slug: 'headaches-migraines',
    title: 'Headaches & Migraines',
    metaTitle: 'Headache & Migraine Relief | Cervicogenic Headache Treatment | Banora Chiropractic',
    metaDescription: 'Chiropractic headache treatment at Banora Chiropractic, Tweed Heads South. Cervicogenic headaches, tension headaches, and migraines — address the cause. Book online.',
    heroHeading: 'Headaches & Migraines',
    heroSubheading: 'Tired of reaching for painkillers? Many headaches start in the neck — and that is something we can assess and address.',
    icon: '🤕',
    shortDescription: 'Chiropractic care that aims to identify and address the spinal and muscular causes of recurring headaches, cervicogenic headaches, and migraines.',
    overview: 'If you are dealing with regular headaches or migraines, you know how much they can take over your day. While there are many causes of headaches, a significant number originate from tension and dysfunction in the neck and upper back — and that is where chiropractic care can make a real difference. Cervicogenic headaches — headaches caused by problems in the cervical spine (neck) — are one of the most common types we see at Banora Chiropractic. They typically cause pain that starts at the base of the skull and spreads toward the forehead or behind the eyes, and are often accompanied by neck stiffness. Tension headaches and migraines with a cervical component can also respond well to chiropractic care. We look beyond the headache itself to understand what is driving it.',
    symptoms: [
      'Recurring headaches, especially at the base of the skull or temples',
      'Cervicogenic headache — pain originating in the neck and radiating to the head',
      'Tension-type headaches with a band-like pressure around the head',
      'Migraines with or without visual disturbances (aura)',
      'Headaches linked to neck stiffness or limited neck movement',
      'Pain behind the eyes or through the forehead',
      'Headaches that worsen with sustained postures — desk work, screens, driving',
    ],
    howWeHelp: 'We assess your neck, upper back, and posture to identify spinal restrictions or muscle tension that may be contributing to your headaches. Cervicogenic headache treatment at Banora Chiropractic typically includes gentle cervical and thoracic adjustments to restore normal joint movement, soft tissue work on tight suboccipital and upper trapezius muscles, and advice on posture, screen time, and stress management. We will also show you specific stretches and exercises targeted at your neck to support long-term headache management.',
    faqs: [
      {
        question: 'What is a cervicogenic headache?',
        answer: 'A cervicogenic headache is a headache that originates from dysfunction in the cervical spine — usually the upper neck joints or surrounding muscles. The pain is typically felt at the back of the head and may radiate toward the forehead, temples, or behind the eyes. It is often accompanied by neck stiffness and can be triggered or worsened by certain neck positions or movements. Cervicogenic headaches are one of the most common types seen in chiropractic practice.',
      },
      {
        question: 'Can chiropractic care help with migraines?',
        answer: 'Research suggests that chiropractic care may help reduce the frequency and intensity of migraines for some people, particularly when the migraines have a cervicogenic (neck-related) component. We will assess whether chiropractic care is likely to benefit your specific type of headache or migraine pattern.',
      },
      {
        question: 'How is chiropractic headache treatment different from medication?',
        answer: 'Rather than focusing on managing the pain with medication, we look at what is causing the headaches. If spinal restrictions, muscle tension, or poor posture are contributing factors, addressing these may help reduce your headache frequency and severity over time — rather than just dulling the pain each time it strikes.',
      },
      {
        question: 'I get headaches every day — is that normal?',
        answer: 'Daily headaches are not something you should have to accept as normal. Chronic daily headaches can have many causes, and persistent patterns deserve a proper assessment. We will take a thorough history, examine your neck and posture, and let you know honestly whether chiropractic care is likely to help — or whether we think you should also see your GP.',
      },
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
  {
    slug: 'hip-pain',
    title: 'Hip Pain',
    metaTitle: 'Hip Pain Treatment | Chiropractor Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Hip pain in Tweed Heads South? Banora Chiropractic assesses hip joint pain, hip flexor pain, and pregnancy-related hip discomfort. Book online today.',
    heroHeading: 'Hip Pain',
    heroSubheading: 'Whether it aches at night, hurts when you walk, or flared up during pregnancy — we can help you work out what is going on.',
    icon: '🦵',
    shortDescription: 'Chiropractic assessment and care for hip joint pain, hip flexor pain, and hip discomfort related to activity, posture, or pregnancy.',
    overview: 'Hip pain is one of those complaints that sounds simple but is rarely straightforward. The hip is a complex joint with a lot happening around it — muscles, tendons, bursae, and nerves — and pain in the hip area can come from the joint itself, the surrounding soft tissue, or even be referred from the lower back. At Banora Chiropractic, we take the time to properly assess where your hip pain is actually coming from before working out a plan to address it. Whether you are dealing with a sharp pain when walking, an ache that wakes you at night, stiffness that builds through the day, or hip discomfort that started during pregnancy — we want to understand your situation fully.',
    symptoms: [
      'Pain in the hip joint, groin, or outer hip area',
      'Hip pain when walking, climbing stairs, or getting up from a seat',
      'Aching hip pain at night that disrupts sleep',
      'Hip flexor tightness or pain at the front of the hip',
      'Lower back and hip pain that seem connected',
      'Hip pain during or after running or sport',
      'Hip joint stiffness or reduced range of movement',
      'Hip pain during pregnancy — especially in the second and third trimester',
    ],
    howWeHelp: 'We begin with a thorough assessment of your hip, pelvis, and lower back — checking range of motion, strength, and joint function to identify what is actually driving your pain. Hip pain often involves more than just the hip itself, so we look at the whole picture. Depending on what we find, care may include chiropractic adjustments to the hip and pelvis, soft tissue work to release tight hip flexors or surrounding muscles, and targeted exercises to support the joint. For hip pain during pregnancy, we use gentle, pregnancy-safe techniques. If we suspect a structural issue — such as a significant labral tear, fracture, or advanced arthritis — we will refer you for imaging or to a specialist.',
    faqs: [
      {
        question: 'Can a chiropractor help with hip pain?',
        answer: 'Chiropractors are trained to assess and manage a range of hip complaints — including hip joint pain, hip flexor pain, bursitis-related discomfort, and hip pain referred from the lower back or sacroiliac joint. Whether chiropractic care is appropriate for your hip pain depends on the cause, which is why we always start with a thorough assessment.',
      },
      {
        question: 'What are the most common causes of hip pain?',
        answer: 'Hip pain can come from many sources — hip joint dysfunction or early arthritis, tight or strained hip flexor muscles, bursitis (inflammation of the fluid-filled sacs around the joint), referral from the lower back or sacroiliac joint, sciatica, or muscle imbalances from prolonged sitting. During pregnancy, hormonal changes and postural shifts are common causes. Getting the right diagnosis is key to getting the right care.',
      },
      {
        question: 'Why does my hip hurt at night?',
        answer: 'Nighttime hip pain is a common complaint. It can be caused by bursitis (which often worsens with pressure on the side you sleep on), hip joint stiffness that builds during inactivity, referred pain from the lower back, or muscle tension that does not get the chance to ease during sleep. It is worth getting assessed rather than assuming it will resolve on its own — persistent nighttime pain can indicate something that responds well to treatment.',
      },
      {
        question: 'Is hip pain during pregnancy normal, and can chiropractic help?',
        answer: 'Hip pain during pregnancy is very common — particularly in the second and third trimesters — and is usually related to changes in posture, the relaxin hormone loosening ligaments, and the shifting centre of gravity as your baby grows. Chiropractic care during pregnancy uses gentle, pregnancy-safe techniques and may help ease hip and pelvic discomfort. Both Dr James and Dr Paul have experience caring for pregnant patients.',
      },
      {
        question: 'Can a chiropractor help with hip flexor pain?',
        answer: 'Hip flexor tightness and pain — often felt at the front of the hip or groin — is something we see regularly, particularly in people who sit for long periods or are active in running or cycling. We can assess whether your hip flexor pain is muscular, joint-related, or connected to your lower back or pelvis, and develop a care plan accordingly.',
      },
    ],
    relatedConditions: ['back-pain', 'sciatica'],
    relatedServices: ['chiropractic-adjustments', 'sports-chiropractic'],
  },
];
