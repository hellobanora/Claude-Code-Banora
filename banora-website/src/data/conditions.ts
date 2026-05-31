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
    slug: 'hip-pain',
    title: 'Hip Pain',
    metaTitle: 'Hip Pain Treatment | Chiropractor Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Hip pain assessment and chiropractic care at Banora Chiropractic, Tweed Heads South. Address hip stiffness, bursitis, referred pain, and more. Book online.',
    heroHeading: 'Hip Pain',
    heroSubheading: 'Stiff hips, nagging aches, or pain that stops you in your tracks — let us find out what is going on.',
    icon: '🦴',
    shortDescription: 'Chiropractic assessment and care for hip pain, stiffness, and restricted movement — from acute injuries to long-standing discomfort.',
    overview: 'Hip pain is something we see regularly at Banora Chiropractic, and it can affect people of all ages. Whether you are dealing with stiffness when you get out of bed in the morning, pain when walking or climbing stairs, or a deep aching sensation in your groin or buttock — hip pain can make everyday movement feel like a chore. The hip is a complex joint, and pain in the area does not always originate from the hip itself. It can be referred from the lower back, pelvis, or sacroiliac joint. A thorough assessment helps us work out exactly where your pain is coming from so we can address it properly.',
    symptoms: [
      'Aching or sharp pain in the hip, groin, or outer thigh',
      'Stiffness in the hip, particularly in the morning or after sitting',
      'Pain when walking, climbing stairs, or getting in and out of a car',
      'A clicking or catching sensation in the hip',
      'Pain that radiates from the lower back into the hip or buttock',
      'Reduced range of motion — difficulty rotating the leg or crossing it over',
    ],
    howWeHelp: 'We start with a thorough assessment of your hip, pelvis, and lower back to understand where your pain is coming from and what is contributing to it. Treatment may include targeted adjustments to the hip joint and surrounding structures, lumbar and pelvic adjustments where relevant, soft tissue work, and specific exercises to restore strength and mobility. We will also advise on activities and movements to help or avoid while you recover.',
    faqs: [
      { question: 'Can a chiropractor help with hip pain?', answer: 'Yes, chiropractors are trained to assess and treat hip pain from a musculoskeletal perspective. Many types of hip pain — including stiffness, referred pain from the lower back, bursitis, and movement restriction — can respond well to chiropractic care. We will assess your hip thoroughly and let you know if we can help, or refer you if imaging or specialist input is needed.' },
      { question: 'Is my hip pain coming from my back?', answer: 'It is surprisingly common for hip pain to originate in the lower back or sacroiliac joint rather than the hip itself. Pain can be referred along nerves into the hip, groin, or outer thigh in a way that feels very much like a hip problem. A proper assessment, including range of motion testing and orthopaedic examination, can help clarify this.' },
      { question: 'I have been told I have hip bursitis — can chiropractic help?', answer: 'Trochanteric bursitis (inflammation of the bursa on the outer hip) often has contributing factors in the hip mechanics, lower back, and surrounding muscles. Chiropractic care can address some of these contributing factors and may complement other management strategies. We will give you an honest assessment of how we can help in your specific situation.' },
    ],
    relatedConditions: ['back-pain', 'sciatica'],
    relatedServices: ['chiropractic-adjustments', 'sports-chiropractic'],
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
    slug: 'posture-tech-neck',
    title: 'Posture & Tech Neck',
    metaTitle: 'Posture Correction & Tech Neck Treatment | Chiropractor Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Tech neck, rounded shoulders, and poor posture from desk work or phone use? Banora Chiropractic in Tweed Heads South assesses and helps manage posture-related pain. Book online.',
    heroHeading: 'Posture & Tech Neck',
    heroSubheading: 'Hours at a desk or on your phone can take a toll on your neck and upper back — let us help you understand what is going on.',
    icon: '🧍',
    shortDescription: 'Chiropractic assessment and care for posture-related neck and upper back pain — including the forward-head strain often called "tech neck".',
    overview: '"Tech neck" is the term many people now use for the neck and upper back strain that builds up from long hours looking down at phones, laptops, and desks. When your head tips forward, the muscles at the back of your neck and shoulders have to work much harder to hold it up — and over time that can lead to stiffness, aching, and tension headaches. At Banora Chiropractic, we see this pattern often, particularly in desk workers, students, and anyone whose day involves a lot of screen time. Posture is rarely about simply "sitting up straight" — it is about how your spine, muscles, and daily habits interact. We take the time to assess your posture and movement, explain what we find in plain English, and work with you on practical changes that fit your life. Results vary between individuals, and we will give you an honest picture of what care may involve.',
    symptoms: [
      'Aching or tightness across the neck, shoulders, and upper back',
      'A forward-head or rounded-shoulder posture, especially by the end of the day',
      'Stiffness and reduced movement when turning your head',
      'Tension headaches that build through a working day',
      'Upper back or between-the-shoulder-blade discomfort from sitting',
      'Pain or fatigue that worsens with phone, laptop, or desk use',
      'A feeling of being "hunched" or unable to sit upright comfortably',
    ],
    howWeHelp: 'We start with a thorough postural and movement assessment — looking at your neck, upper back, and shoulders, and how your everyday habits may be contributing. Depending on what we find, care may include chiropractic adjustments to restore movement in stiff areas, soft tissue work to release tight muscles, and specific exercises to support the muscles that help hold good posture. Just as importantly, we offer practical ergonomic advice for your desk, screen, and phone use, so the changes carry over into daily life. We will be honest about what chiropractic care can and cannot do, and refer you on if we believe another approach is needed.',
    faqs: [
      {
        question: 'What is "tech neck", and can chiropractic help?',
        answer: 'Tech neck describes the neck and upper back strain that builds up from looking down at screens for long periods. It can lead to muscle tightness, stiffness, and tension headaches. Chiropractic care may help by addressing joint stiffness and muscle tension, improving movement, and giving you exercises and ergonomic advice to reduce the strain. We always start with a thorough assessment, and results vary between individuals.',
      },
      {
        question: 'Can a chiropractor really improve my posture?',
        answer: 'Posture is influenced by many things — joint movement, muscle strength and length, daily habits, and how your workspace is set up. Chiropractic care can help address stiffness and muscle tension that make good posture harder to maintain, and we combine this with targeted exercises and ergonomic advice. Lasting change usually comes from a mix of in-clinic care and small adjustments to your daily routine.',
      },
      {
        question: 'I sit at a desk all day — what can I do between appointments?',
        answer: 'Simple changes often make a real difference: positioning your screen at eye level, keeping your phone higher rather than looking down, taking regular movement breaks, and doing a few specific exercises we can show you. We will give you practical, realistic advice tailored to your work setup rather than a long list you will not keep up with.',
      },
      {
        question: 'Are posture-related headaches connected to my neck?',
        answer: 'They can be. Tension in the muscles at the base of the skull and upper neck — often made worse by a forward-head posture — is a common contributor to what are known as cervicogenic (neck-related) headaches. We assess your neck and upper back to understand whether posture may be playing a role in your headaches and how we may be able to help.',
      },
    ],
    relatedConditions: ['neck-pain', 'headaches-migraines'],
    relatedServices: ['posture-correction', 'chiropractic-adjustments'],
  },
];
