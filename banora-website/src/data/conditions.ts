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
  whatToExpect: string;
  faqs: { question: string; answer: string }[];
  relatedConditions: string[];
  relatedServices: string[];
}

export const conditions: Condition[] = [
  {
    slug: 'back-pain',
    title: 'Back Pain',
    metaTitle: 'Back Pain Treatment Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Back pain and lumbar pain relief at Banora Chiropractic, Tweed Heads South. Expert chiropractic assessment and care for lower back pain, disc problems, and spinal stiffness. Book online.',
    heroHeading: 'Back Pain',
    heroSubheading: 'Lower back pain, lumbar stiffness, or a sudden sharp twinge — you do not have to just put up with it.',
    icon: '🔙',
    shortDescription: 'Chiropractic care that aims to address the underlying causes of back pain, not just the symptoms.',
    overview: `Back pain is one of the most common reasons people visit us at Banora Chiropractic — and one of the most misunderstood. Many people assume that back pain is simply part of getting older, or that they just have to manage it with rest and painkillers. In most cases, that is not the full picture.

Around 4 million Australians live with back pain at any given time. It can show up as a dull, persistent ache in the lower back, a sharp pain that hits suddenly when you bend or lift, stiffness that is worst in the morning, or pain that radiates into the hips and legs. Some people trace their back pain to a specific incident — lifting something awkwardly, a car accident, a fall during sport. For others, it has crept up gradually over months or years of desk work, prolonged sitting, or repetitive movement.

What most back pain has in common is that something in the spine — a joint, a disc, a nerve, or the surrounding muscles — is under more load or stress than it can comfortably handle. The role of chiropractic assessment is to work out which structures are involved and why, so that care can be directed at the actual cause rather than just the symptom. Whether you are dealing with an acute flare-up or a long-standing problem, understanding what is driving your back pain is the first step toward doing something meaningful about it.`,
    symptoms: [
      'Dull, aching pain in the lower back or lumbar spine',
      'Sharp or shooting lower back pain that may radiate into the hips or legs',
      'Stiffness that is worst in the morning and eases with movement',
      'Pain that worsens with sitting, standing for long periods, bending, or lifting',
      'Muscle spasms or tightness across the lumbar region',
      'Upper back pain and stiffness between the shoulder blades',
      'Pain that improves with lying down but returns when you stand or sit',
      'Difficulty sleeping or finding a comfortable position at night',
    ],
    howWeHelp: `Dr James and Dr Paul take a thorough approach to back pain — because back pain is not a single condition. It is a symptom that can come from the facet joints, intervertebral discs, sacroiliac joint, surrounding muscles, or a combination of all of these. Our assessment includes a detailed history, postural and movement analysis, and orthopaedic and neurological testing where relevant, to build an accurate picture of what is going on.

Chiropractic care for back pain at Banora Chiropractic may include spinal adjustments to restore normal joint movement and reduce stiffness, soft tissue work to release tight and overloaded muscles, advice on positions and movements to protect the spine during recovery, and specific exercises to support the lower back and prevent recurrence. We use a range of techniques — including Gonstead, Diversified, Thompson Drop, and Activator — so we can tailor the approach to what suits your body and your preference. We will always explain what we are doing and why, and give you a realistic sense of what recovery may look like for your specific situation.`,
    whatToExpect: `Your first appointment at Banora Chiropractic is primarily an assessment. We will take a detailed history — asking about when the pain started, what aggravates or eases it, and how it is affecting your daily life. We will then examine your posture, movement, and spine, and carry out any relevant orthopaedic tests. If we believe imaging is needed before proceeding with care, we will tell you.

Once we have a clear picture of what is going on, we will explain our findings in plain language and outline a recommended care plan. Most people with back pain begin to notice some improvement within the first few visits, though this varies considerably depending on how long the problem has been present and its underlying cause. We will give you honest, realistic expectations — not a one-size-fits-all treatment count. We also send you home with practical advice and exercises from the start, so you are not just relying on in-clinic visits. Our goal is to get you better and keep you better.`,
    faqs: [
      {
        question: 'Can a chiropractor help with lower back pain?',
        answer: 'Chiropractic care is one of the most widely used and researched approaches to lower back pain. Many people find that chiropractic assessment and treatment, combined with appropriate exercise and lifestyle advice, may help reduce pain and improve function. We will assess your situation thoroughly and let you know honestly whether chiropractic care is appropriate for your type of back pain.',
      },
      {
        question: 'How quickly will I feel better?',
        answer: 'It depends on the nature and duration of your back pain. Some people notice meaningful improvement after just a few visits; others with longer-standing problems may take more time. We will give you a realistic timeline based on your assessment — not a vague promise. We also monitor your progress at each visit and adjust the approach if needed.',
      },
      {
        question: 'Should I rest or keep moving when my back is sore?',
        answer: 'In most cases, gentle movement is better than bed rest. Prolonged rest can actually slow recovery for many types of back pain. That said, the right approach depends on what is causing your pain. We will give you specific guidance on what to do — and what to avoid — based on your assessment.',
      },
      {
        question: 'Do I need a referral or X-rays before I come in?',
        answer: 'No referral is needed. Chiropractors are primary contact practitioners, which means you can book directly. If you have recent imaging, bring it along — it can be very useful. If we believe X-rays or scans are warranted after our assessment, we will refer you for the appropriate imaging.',
      },
    ],
    relatedConditions: ['sciatica', 'neck-pain', 'hip-pain'],
    relatedServices: ['chiropractic-adjustments', 'posture-correction'],
  },

  {
    slug: 'neck-pain',
    title: 'Neck Pain',
    metaTitle: 'Neck Pain Treatment Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Neck pain and stiffness relief at Banora Chiropractic, Tweed Heads South. Chiropractic care for tech neck, cervical pain, and restricted movement. Book online.',
    heroHeading: 'Neck Pain',
    heroSubheading: 'Stiff, sore, and difficult to turn — neck pain makes everything harder. We can help.',
    icon: '🦒',
    shortDescription: 'Targeted chiropractic care for neck pain, stiffness, and tension that may be affecting your daily comfort and movement.',
    overview: `Neck pain has become one of the most common musculoskeletal complaints we see at Banora Chiropractic — and it is getting more prevalent. Our screens keep us looking down and forward for hours at a time, our work keeps us seated for long stretches, and our sleep positions often leave us waking with a stiff or sore neck. Add in the physical demands of daily life, and it is little wonder so many people in the Tweed Heads area are dealing with persistent neck discomfort.

Neck pain can present in a number of ways. For some people it is a constant dull ache across the back of the neck and upper shoulders. For others it is sharp pain when turning the head — the kind that makes reversing the car a careful exercise. Some people notice headaches building from the base of the skull, or tingling and numbness that radiates into the arms and hands. The cervical spine is a complex region with seven vertebrae, multiple small joints, and a network of nerves that supply the arms — which is why neck problems can produce such a wide variety of symptoms.

The good news is that most neck pain, even when it has been present for a long time, responds well to the right care. Chiropractic assessment focuses on identifying which structures are involved — whether that is the joints themselves, the surrounding muscles, a disc, or a combination — and addressing them directly.`,
    symptoms: [
      'Stiffness or restricted movement when turning your head',
      'Aching or sharp pain in the neck, upper shoulders, or base of the skull',
      'Headaches that start at the back of the head and spread forward',
      'Pain, tingling, or numbness that radiates into the shoulders or arms',
      'A grinding, clicking, or grating sensation when moving the neck',
      'Tightness or soreness in the muscles either side of the neck',
      'Pain that worsens after sitting at a desk, looking at a phone, or driving',
      'Neck stiffness that is worst in the morning after sleep',
    ],
    howWeHelp: `We begin with a thorough assessment of your cervical spine — checking your range of motion, feeling for areas of joint restriction and muscle tension, and assessing your posture. Where relevant, we perform neurological screening to check if any nerve involvement is present. This gives us a clear picture of what is driving your neck pain before any treatment begins.

Chiropractic care for neck pain may include gentle cervical adjustments to restore normal joint movement and reduce stiffness, thoracic spine work to address the upper back, which frequently contributes to neck problems, and soft tissue techniques to release tight suboccipital and upper trapezius muscles. We also use low-force options — such as the Activator instrument or Thompson Drop technique — for people who prefer a gentler approach or who are apprehensive about manual neck treatment. Alongside in-clinic care, we will give you stretches and exercises specific to your situation and practical advice on your workstation, pillow setup, and phone habits to reduce the strain going forward.`,
    whatToExpect: `At your first visit, we take time to understand your neck pain properly — when it started, what makes it better or worse, whether it has changed over time, and how it is affecting your daily life and sleep. We then examine your neck and upper back, assess your posture, and carry out any relevant tests. If you have had any previous imaging of your cervical spine, bring it along — it can provide valuable context.

After the assessment, we explain what we have found in straightforward terms and discuss our recommended approach. Many people notice some improvement in their neck movement and comfort within the first few visits. We will also spend time showing you exercises and stretches you can do at home, because what happens between visits matters just as much as the treatment itself. Neck pain that has been present for a long time generally takes more visits to resolve, but we will give you a realistic sense of what to expect from the outset — and we reassess regularly to make sure the approach is working.`,
    faqs: [
      {
        question: 'Is neck adjustment safe?',
        answer: 'Cervical adjustment is a well-established chiropractic technique with a strong safety record when performed by a qualified practitioner. Our chiropractors are highly trained in cervical assessment and treatment. We always discuss the approach with you beforehand and offer alternatives — including low-force and instrument-assisted techniques — for people who prefer a gentler option.',
      },
      {
        question: 'What is tech neck and can chiropractic help?',
        answer: 'Tech neck is the term for the neck pain and postural strain that builds from long hours looking down at phones, laptops, and screens. The head is heavy — about 4–5 kg at neutral — and as it tips forward, the load on the cervical spine increases significantly. Chiropractic care can help address the joint stiffness and muscle tension that develops, and we combine this with practical ergonomic advice to reduce the strain at the source.',
      },
      {
        question: 'My neck clicks — is that a problem?',
        answer: 'Clicking or popping in the neck is common and not usually a sign of anything serious. It often reflects normal movement of gas in the joint fluid, or tendons moving over bony landmarks. However, if clicking is accompanied by pain, catching, or neurological symptoms like tingling or numbness, it is worth having it assessed to understand what is happening.',
      },
    ],
    relatedConditions: ['headaches-migraines', 'shoulder-pain', 'posture-tech-neck'],
    relatedServices: ['chiropractic-adjustments', 'posture-correction'],
  },

  {
    slug: 'sciatica',
    title: 'Sciatica',
    metaTitle: 'Sciatica Treatment Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Sciatica and sciatic nerve pain relief at Banora Chiropractic, Tweed Heads South. Chiropractic assessment, care, and exercises for leg pain, numbness, and lower back pain. Book online.',
    heroHeading: 'Sciatica',
    heroSubheading: 'That shooting pain from your back down your leg — we see it every week, and we may be able to help.',
    icon: '⚡',
    shortDescription: 'Chiropractic assessment and care for sciatic nerve pain, aiming to address the underlying cause rather than just manage the symptom.',
    overview: `Sciatica is not a diagnosis on its own — it is a description of symptoms caused by irritation or compression of the sciatic nerve, the longest nerve in the body. This nerve runs from the lower back through the buttock and down through each leg to the foot. When something presses on or irritates it, the result can range from a dull ache deep in the buttock to a sharp, burning pain that fires down the leg, sometimes all the way to the foot. Numbness, tingling, and weakness in the leg are also common.

The most frequent cause of sciatica is a disc bulge or herniation in the lumbar spine, where the disc presses on the nerve root as it exits the spinal canal. But there are other causes too — including tight piriformis muscle (piriformis syndrome), facet joint inflammation, or spinal stenosis, where the spinal canal itself narrows over time. Getting the cause right matters, because the most effective treatment depends on what is actually driving the nerve irritation.

Sciatica is also common during pregnancy, as postural changes, pelvic widening, and the growing uterus can all place pressure on the sciatic nerve. This is something we manage regularly at Banora Chiropractic, using safe, comfortable techniques suited to each trimester.`,
    symptoms: [
      'Pain that radiates from the lower back or buttock down one leg — sometimes reaching the foot',
      'Sharp, burning, or shooting pain in the buttock or back of the leg',
      'Numbness or tingling in the leg, calf, or foot',
      'Weakness in the affected leg, particularly when walking or standing',
      'Pain that worsens with sitting, bending forward, or coughing and sneezing',
      'Difficulty finding a comfortable position — especially during sleep',
      'Sciatica pain during pregnancy, often in the second and third trimesters',
      'Symptoms that affect one leg more than the other',
    ],
    howWeHelp: `Before any treatment, we carry out a thorough neurological and orthopaedic examination. This helps us understand the likely source of your sciatic nerve irritation — which is essential, because not all sciatica responds to the same approach. We check reflexes, sensation, and muscle strength, and assess the lumbar spine and pelvis both in movement and at rest.

Depending on our findings, chiropractic care may include lumbar spinal adjustments to improve alignment and reduce pressure on the affected nerve root, specific hip and pelvic work to address sacroiliac joint involvement or piriformis tightness, gentle nerve mobilisation techniques to reduce tension along the sciatic nerve, and progressive exercise guidance — including specific sciatica stretches and strengthening work to support the lower back and prevent recurrence. For sciatica during pregnancy, we use modified positioning and low-force techniques that are safe and effective throughout all trimesters. If imaging is warranted — particularly where a significant disc herniation is suspected — we will refer you for an MRI or X-ray before proceeding, and co-manage your care with your GP or specialist where appropriate.`,
    whatToExpect: `Sciatica can be an alarming experience, particularly when the pain is severe or affects your ability to walk comfortably. At your first appointment, we take a careful history — asking about the onset, how the pain travels, any aggravating or relieving factors, and whether you have had any bladder or bowel changes (which, if present, would indicate the need for urgent medical assessment). We then perform our physical examination and explain our findings clearly.

Some people with sciatica notice improvement within a few visits. Others — particularly where the nerve has been compressed for a long period — take longer. We will give you an honest assessment of what to expect based on your examination findings, not a generic response. In the meantime, we will advise you on the positions and movements that are most likely to reduce your symptoms between visits, and give you guided exercises to start making progress from day one. We monitor your neurological signs carefully throughout care and will refer you on without hesitation if we believe another form of treatment is needed.`,
    faqs: [
      {
        question: 'Can a chiropractor help with sciatica?',
        answer: 'Chiropractic care is one of the most common approaches to managing sciatica, particularly when it is caused by lumbar joint dysfunction, disc irritation, or piriformis syndrome. By reducing pressure on the sciatic nerve and improving the mechanics of the lower back and pelvis, many people find meaningful relief. We will assess the cause of your sciatica first to determine whether chiropractic care is the right approach for your situation.',
      },
      {
        question: 'What stretches help sciatica?',
        answer: 'The most effective stretches for sciatica depend on the underlying cause — which is why it is worth having a proper assessment before starting any exercise program. Commonly helpful movements include the piriformis stretch, knee-to-chest stretch, and sciatic nerve flossing exercises. We will show you exactly which exercises are appropriate for your situation and how to do them safely at home.',
      },
      {
        question: 'How long does sciatica take to get better?',
        answer: 'This varies considerably. Acute sciatica triggered by a recent injury often improves significantly within a few weeks of appropriate care. Chronic sciatica — where the nerve has been compressed or irritated for months — generally takes longer. We will give you a realistic timeline based on your specific assessment findings and monitor your progress carefully throughout.',
      },
      {
        question: 'Is chiropractic safe for sciatica during pregnancy?',
        answer: 'Yes. Chiropractic care for sciatica during pregnancy uses modified positioning and gentle, low-force techniques that are safe for both mother and baby. We have experience managing pregnancy-related sciatica and will work with your comfort throughout. We also liaise with your midwife or obstetrician where needed.',
      },
    ],
    relatedConditions: ['back-pain', 'hip-pain'],
    relatedServices: ['chiropractic-adjustments', 'sports-chiropractic'],
  },

  {
    slug: 'headaches-migraines',
    title: 'Headaches & Migraines',
    metaTitle: 'Headache & Migraine Treatment Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Chiropractic care for headaches and migraines at Banora Chiropractic, Tweed Heads South. Cervicogenic headaches, tension headaches, and neck-related migraines assessed and treated. Book online.',
    heroHeading: 'Headaches & Migraines',
    heroSubheading: 'Tired of reaching for painkillers? Many headaches start in the neck — and that is something we can assess and address.',
    icon: '🤕',
    shortDescription: 'Chiropractic care that aims to identify and address the spinal and muscular causes of recurring headaches and migraines.',
    overview: `If you deal with regular headaches or migraines, you know how much they can take over your day — and how easy it is to feel like managing them with pain relief is your only option. But many headaches have a physical cause that can be assessed and addressed, particularly when the neck and upper back are involved.

Cervicogenic headaches — headaches that originate from dysfunction in the cervical spine — are one of the most commonly seen headache types in chiropractic practice. They typically cause pain at the base of the skull that spreads toward the forehead, temples, or behind the eyes, and are often accompanied by neck stiffness. They can be triggered or worsened by sustained postures: long hours at a desk, looking at a phone, driving, or sleeping in an awkward position.

Tension-type headaches are another common presentation, caused by chronic tightness in the muscles of the neck, upper back, and scalp — which creates a band-like pressure around the head. Both cervicogenic headaches and tension headaches can mimic migraines, and some people experience overlapping patterns. Migraines themselves are a distinct condition involving complex neurological changes, but when they have a strong cervical component — neck stiffness before or during the episode, headaches that are triggered by neck movements or posture — chiropractic care may help reduce their frequency and severity for some patients. We will always give you an honest assessment of what is likely driving your headaches and whether our care is likely to make a meaningful difference.`,
    symptoms: [
      'Recurring headaches at the base of the skull, temples, or forehead',
      'Pain that starts in the neck and travels upward — classic cervicogenic headache',
      'A band-like pressure around the head associated with neck or shoulder tension',
      'Headaches that build during desk work, screen use, or driving',
      'Migraines with or without visual disturbances (aura)',
      'Headaches triggered or worsened by specific neck movements or postures',
      'Neck stiffness that accompanies or precedes a headache',
      'Pain behind the eyes or across the forehead',
    ],
    howWeHelp: `We assess your neck, upper back, and posture in detail — looking for the patterns of joint restriction and muscle tension that are most commonly associated with headache disorders. This takes time and matters: the right care for a cervicogenic headache is different from the right care for a tension headache, and both are different again from a migraine with a cervical component.

Chiropractic care for headaches at Banora Chiropractic typically includes cervical and upper thoracic adjustments to restore normal joint movement and reduce the tension placed on the surrounding structures, manual therapy to the suboccipital muscles at the base of the skull — a key contributor to many headache patterns, and guided stretching and strengthening exercises to support the neck between visits. We also spend time reviewing your posture, workstation, pillow, and daily habits, because the most sustained improvement in headache frequency usually comes from a combination of in-clinic care and small changes to the way you use your body each day.`,
    whatToExpect: `Your first appointment begins with a thorough history. We want to understand your headache pattern in detail — how often they occur, where the pain is, how long they last, what seems to trigger or worsen them, and how they have changed over time. We ask about any associated symptoms like nausea, light sensitivity, or visual changes, and we take note of any medications you are currently using. We then examine your neck, upper back, and posture.

If your headaches appear to have a significant cervical or muscular component, we will explain this clearly and outline a care plan. Many patients with cervicogenic or tension-type headaches notice a reduction in frequency or intensity within the first two to four weeks of care. For migraines, the response is more variable — but where there is a strong neck component, meaningful improvement is often achievable. We track your headache frequency and severity over time so we can assess whether care is helping and adjust our approach accordingly. We will also let you know if we think your headaches warrant investigation or referral to your GP or a neurologist.`,
    faqs: [
      {
        question: 'What is a cervicogenic headache?',
        answer: 'A cervicogenic headache originates from dysfunction in the joints, muscles, or nerves of the cervical spine — usually the upper neck. The pain typically starts at the base of the skull and can spread to the forehead, temples, or behind the eyes. It is often accompanied by neck stiffness and can be triggered by certain neck movements or sustained postures. Cervicogenic headaches are one of the most common headache types seen in chiropractic practice and often respond well to treatment directed at the neck.',
      },
      {
        question: 'Can chiropractic care help with migraines?',
        answer: 'Research suggests chiropractic care may help reduce the frequency and severity of migraines for some people, particularly those with a strong cervical component. We will assess whether your migraines are likely to respond to chiropractic care and be upfront if we think another approach — or a referral — would serve you better.',
      },
      {
        question: 'I take painkillers for headaches every week — is that okay?',
        answer: 'Frequent use of over-the-counter pain relief for headaches can actually lead to what is known as medication overuse headache — where the headaches become more frequent as a result of the medication itself. If you are using pain relief more than a few times per week for headaches, it is worth having a proper assessment to look at the underlying cause rather than continuing to manage the symptom alone.',
      },
      {
        question: 'I get headaches every day — is that normal?',
        answer: 'Daily headaches are not something you should accept as normal. There are many possible causes, and persistent patterns deserve a proper assessment. We will take a thorough history, examine your neck and posture, and give you an honest view of whether chiropractic care is likely to help — or whether we think you should also see your GP.',
      },
    ],
    relatedConditions: ['neck-pain', 'shoulder-pain', 'posture-tech-neck'],
    relatedServices: ['chiropractic-adjustments', 'posture-correction'],
  },

  {
    slug: 'hip-pain',
    title: 'Hip Pain',
    metaTitle: 'Hip Pain Treatment Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Hip pain assessment and chiropractic care at Banora Chiropractic, Tweed Heads South. Stiffness, bursitis, referred pain from the lower back — we find the source. Book online.',
    heroHeading: 'Hip Pain',
    heroSubheading: 'Stiff, aching, or painful hips that slow you down — let us work out what is actually going on.',
    icon: '🦴',
    shortDescription: 'Chiropractic assessment and care for hip pain, stiffness, and restricted movement — from acute injuries to long-standing discomfort.',
    overview: `Hip pain is one of those conditions that can significantly affect quality of life without ever being fully explained. You might feel it as a deep ache in the groin, a sharp pain on the outer hip when walking, stiffness that makes getting out of a car uncomfortable, or a general heaviness in the hip that builds through the day. It can affect people at any age — from younger active people dealing with sport-related hip issues, to older adults where changes to the hip joint over time become more relevant.

What makes hip pain particularly complex is that the hip does not always produce pain where the problem actually is. Pain in the hip region can originate from the hip joint itself, but it can also be referred from the lower back, the sacroiliac joint, or the nerves of the lumbar spine. The piriformis muscle, deep in the buttock, is another common culprit — it sits alongside the sciatic nerve and when it is tight or in spasm, it can produce buttock and hip pain that feels very much like a hip problem.

At Banora Chiropractic, we take the time to work out where your hip pain is actually coming from before we recommend any course of care. Treatment directed at the wrong structure will rarely produce lasting improvement — which is why assessment matters as much as the treatment itself.`,
    symptoms: [
      'Aching or sharp pain in the hip, groin, or outer thigh',
      'Stiffness in the hip, particularly in the morning or after sitting for long periods',
      'Pain when walking, climbing stairs, or getting in and out of a car',
      'A clicking, catching, or grinding sensation in the hip joint',
      'Pain deep in the buttock that may radiate down the leg',
      'Reduced range of motion — difficulty crossing the legs, rotating the hip, or squatting',
      'Hip pain that worsens after exercise or prolonged standing',
      'Pain from the lower back that seems to settle in the hip or buttock',
    ],
    howWeHelp: `We conduct a thorough assessment of the hip joint, pelvis, and lumbar spine — because these structures work together, and problems in one area commonly affect the others. We assess range of motion, perform specific orthopaedic tests to identify the likely source of pain, check the sacroiliac joints, and look at how you move and load the hip during everyday activities.

Depending on our findings, chiropractic care may include hip joint mobilisation or adjustment to improve movement and reduce pain, lumbar and pelvic adjustments where the lower back or sacroiliac joint is contributing, soft tissue work to address tight hip flexors, gluteal muscles, or the piriformis, and progressive rehabilitation exercises to restore strength, mobility, and stability around the hip. We also advise on activities to modify during recovery and — for active patients — guide a sensible return to exercise. Where imaging is warranted, or where we suspect a structural issue beyond the scope of chiropractic care, we will refer you to the appropriate specialist without delay.`,
    whatToExpect: `Hip pain assessments at Banora Chiropractic are thorough because they need to be. We take a careful history — understanding when the pain started, what positions or activities aggravate it, whether it has changed over time, and whether you have had any relevant imaging. We then examine the hip and the surrounding structures, and use orthopaedic testing to help differentiate between different possible sources of pain.

We will explain our findings clearly and outline our recommended approach. For hip pain that has been present for a while, improvement is often gradual — but most people begin to notice meaningful changes within the first few weeks of care. We set realistic expectations and track your progress at every visit. Home exercises are a key part of recovery, and we will make sure you leave each appointment knowing what to do between sessions. If at any point we believe your hip would benefit from imaging, a specialist opinion, or a different form of management, we will tell you directly.`,
    faqs: [
      {
        question: 'Can a chiropractor help with hip pain?',
        answer: 'Chiropractors are trained to assess and treat hip pain from a musculoskeletal perspective. Many types of hip pain — including joint stiffness, referred pain from the lower back, sacroiliac dysfunction, and trochanteric bursitis — can respond well to chiropractic care. We will assess your hip thoroughly and let you know honestly if we can help, or refer you if imaging or specialist input is warranted.',
      },
      {
        question: 'Is my hip pain actually coming from my back?',
        answer: 'More often than you might expect, yes. Pain felt in the hip, groin, or outer thigh can be referred from the lumbar spine, sacroiliac joint, or sciatic nerve — and can feel very convincingly like a hip problem. Distinguishing between true hip pain and referred pain from the lower back is an important part of our assessment, because the treatment for each is quite different.',
      },
      {
        question: 'I have been told I have hip bursitis — can chiropractic help?',
        answer: 'Trochanteric bursitis — inflammation of the bursa on the outer hip — is often associated with underlying issues in hip mechanics, lower back alignment, and surrounding muscle tension. Addressing these contributing factors through chiropractic care can form part of an effective management approach. We will give you an honest assessment of what we can and cannot help with in your specific situation.',
      },
    ],
    relatedConditions: ['back-pain', 'sciatica'],
    relatedServices: ['chiropractic-adjustments', 'sports-chiropractic'],
  },

  {
    slug: 'shoulder-pain',
    title: 'Shoulder Pain',
    metaTitle: 'Shoulder Pain Treatment Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Shoulder pain assessment and chiropractic care at Banora Chiropractic, Tweed Heads South. Impingement, stiffness, frozen shoulder, and referred pain from the neck. Book online.',
    heroHeading: 'Shoulder Pain',
    heroSubheading: 'From frozen shoulder to impingement — we will find out what is driving your pain and work on it directly.',
    icon: '💪',
    shortDescription: 'Chiropractic assessment and care for shoulder pain, stiffness, and restricted movement — whatever is causing it.',
    overview: `The shoulder is one of the most mobile joints in the body — and that mobility comes at a cost. The shoulder relies on a complex balance of muscles, tendons, and joint structures to stay stable and functional, which means there are many things that can go wrong. Shoulder pain can affect everything from reaching into a cupboard to getting dressed in the morning, and it has a particular habit of disrupting sleep when lying on the affected side.

Shoulder conditions we commonly see at Banora Chiropractic include rotator cuff strains and impingement syndrome, where structures in the shoulder become pinched during arm movements, frozen shoulder (adhesive capsulitis), where the joint gradually stiffens and becomes increasingly painful, acromioclavicular joint problems from falls or contact sport, and referred pain from the cervical spine or upper thoracic spine, which can produce symptoms deep in the shoulder or running down the arm that feel very much like a shoulder problem.

That last point is particularly important: a significant proportion of people presenting with shoulder pain have a component — or even the primary source — in the neck and upper back rather than the shoulder joint itself. This is why a thorough assessment that includes the cervical spine, not just the shoulder, produces better outcomes.`,
    symptoms: [
      'Pain when lifting the arm or reaching overhead',
      'Stiffness or restricted movement — difficulty rotating the shoulder fully',
      'Aching pain at night, particularly when lying on the affected side',
      'Sharp pain with specific movements — reaching behind the back, throwing, or pushing',
      'Weakness in the arm or difficulty holding objects at shoulder height',
      'Pain that radiates from the neck into the shoulder or down the upper arm',
      'Clicking, catching, or grinding in the shoulder joint during movement',
      'Gradual loss of shoulder range of motion over weeks or months',
    ],
    howWeHelp: `Our assessment of shoulder pain at Banora Chiropractic includes both the shoulder joint and the cervical and thoracic spine. We assess your range of motion, perform specific orthopaedic tests for the rotator cuff, biceps tendon, and acromioclavicular joint, and evaluate your neck and upper back for any involvement. This thorough approach allows us to identify the primary source of your pain accurately.

Chiropractic care for shoulder pain may include shoulder joint mobilisation and extremity adjustment techniques to improve movement and reduce pain, cervical and thoracic adjustments where the neck or upper back is contributing, soft tissue work on the rotator cuff muscles, upper trapezius, and surrounding structures, and targeted rehabilitation exercises to restore strength, stability, and full range of motion. We will also advise on activities to modify and guide your return to full function. If we believe your shoulder would benefit from imaging — particularly where a rotator cuff tear or significant structural damage is suspected — we will refer you for the appropriate investigation.`,
    whatToExpect: `Shoulder assessments at Banora Chiropractic take time to do properly. We begin by taking a detailed history — the mechanism of injury if there was one, how the pain has changed over time, which movements are most problematic, and whether there are any neurological symptoms like tingling or numbness in the arm. We then carry out a physical examination of the shoulder and neck.

Treatment typically begins at or shortly after the first assessment visit. Most people with shoulder pain notice gradual improvement over four to eight weeks of care, though this varies depending on the condition and its severity. Frozen shoulder, for example, is a condition that improves slowly regardless of the treatment approach, while acute impingement often responds more quickly. We will be upfront about the expected timeline for your specific presentation and keep you informed throughout. Home exercises are a key part of shoulder rehabilitation, and we will progress these with you as your strength and range of motion improve.`,
    faqs: [
      {
        question: 'Can a chiropractor help with shoulder pain?',
        answer: 'Chiropractors are trained in the assessment and management of shoulder conditions. Many types of shoulder pain — including impingement, joint stiffness, referred pain from the neck, and post-injury restriction — can respond well to chiropractic care. We will assess your shoulder and neck thoroughly and let you know if we can help, or refer you if imaging or specialist input is needed.',
      },
      {
        question: 'Do you treat frozen shoulder?',
        answer: 'We regularly manage frozen shoulder (adhesive capsulitis) using gentle joint mobilisation and soft tissue techniques aimed at improving range of motion and reducing discomfort. Frozen shoulder is a slow-resolving condition, but many patients find that chiropractic care combined with a progressive exercise program helps them move through the stages more comfortably and maintain as much function as possible.',
      },
      {
        question: 'Could my shoulder pain be coming from my neck?',
        answer: 'Yes — it is more common than most people realise. The nerves that supply the shoulder and arm exit the spine through the cervical region, which means neck problems can produce pain, weakness, or tingling that is felt deep in the shoulder or down the arm. We always assess both the shoulder and the neck to make sure we are treating the right source.',
      },
    ],
    relatedConditions: ['neck-pain', 'back-pain', 'sports-injuries'],
    relatedServices: ['chiropractic-adjustments', 'sports-chiropractic'],
  },

  {
    slug: 'sports-injuries',
    title: 'Sports Injuries',
    metaTitle: 'Sports Injury Treatment Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Sports injury assessment and chiropractic care at Banora Chiropractic, Tweed Heads South. Back, shoulder, hip, and joint injuries — get back to doing what you love. Book online.',
    heroHeading: 'Sports Injuries',
    heroSubheading: 'Whether you train hard or gave it everything on the weekend — we can help you recover well and get back to it.',
    icon: '🏃',
    shortDescription: 'Chiropractic assessment and care for sports injuries — focused on getting you back to full function, not just out of pain.',
    overview: `The Tweed–Gold Coast region is one of the most active parts of Australia. Surfers, runners, cyclists, swimmers, team sport players, CrossFit athletes, and dedicated weekend warriors all share the same coastline and the same risk: when you push your body, injuries happen. At Banora Chiropractic, sports injuries are a significant part of what we do — and we approach them with the same thoroughness we bring to any other musculoskeletal problem.

Sports injuries we commonly manage include lower back strains and disc problems from lifting, throwing, and twisting movements, shoulder injuries including rotator cuff strains, AC joint sprains, and overuse conditions in swimmers and paddlers, hip and pelvic injuries from running and contact sport, knee and ankle issues affecting training load and movement, and repetitive stress conditions that develop gradually from high training volumes. We also work with people who are not injured yet but are experiencing movement restrictions, joint dysfunction, or muscle imbalances that increase their injury risk over time.

The key thing we look for in any sports injury assessment is the underlying mechanism — not just what hurts, but why it happened. A hamstring strain that keeps recurring is not just bad luck; there is usually something in the loading pattern, movement quality, or training program that is contributing to it. Addressing that underlying factor is what prevents the next injury.`,
    symptoms: [
      'Joint pain or swelling following sport, training, or a specific incident',
      'Muscle strains with persistent tightness or weakness after exercise',
      'Lower back or hip pain from running, lifting, or rotational sport',
      'Shoulder pain from throwing, swimming, paddling, or overhead gym movements',
      'Knee or ankle discomfort that limits your ability to train at normal capacity',
      'Recurring injuries that keep returning to the same area',
      'Pain that builds gradually through a training session rather than starting suddenly',
      'Reduced performance, restricted movement, or compensation patterns after an injury',
    ],
    howWeHelp: `We begin every sports injury assessment with a thorough history — understanding how and when the injury occurred, what has changed since, and what your training and goals look like. We then examine the affected area in detail and assess your movement patterns and biomechanics, because the way you move as a whole often reveals as much as the site of injury.

Chiropractic care for sports injuries may include spinal and extremity adjustments to restore joint alignment and movement, soft tissue techniques to address muscle strains, scar tissue, and fascial restrictions, progressive rehabilitation exercises tailored to your sport and training stage, and practical load management advice to keep you moving as much as safely possible during recovery. We also liaise with GPs, physiotherapists, and sports medicine doctors when a multi-disciplinary approach will produce the best outcome. Our goal is always to get you back to full function — not just to reduce pain — because pain-free but dysfunctional is not a satisfying recovery.`,
    whatToExpect: `At your first appointment, we focus on understanding the injury thoroughly before recommending any care. We take a history, examine the injured area, and assess the surrounding structures for any secondary involvement. We will be direct about what we believe is wrong, what we can help with, and what the realistic recovery timeline looks like.

We give practical, honest advice about training during recovery. In most cases, modified training is possible and often beneficial — complete rest is rarely the optimal approach for musculoskeletal sports injuries. We will work with you to keep you as active as is safe, gradually progressing your training load as your recovery allows. If your injury requires imaging, specialist review, or input from another practitioner, we will tell you clearly and help coordinate that care. The aim is to get you back to your sport fully — and with a better understanding of how to reduce the risk of it happening again.`,
    faqs: [
      {
        question: 'Do I need to stop training while I see a chiropractor for a sports injury?',
        answer: 'Not necessarily. We will give you specific, practical guidance on what you can and cannot do during recovery. In most cases, modified training is not only possible but beneficial — staying active in a way that does not aggravate the injury usually supports a faster return to full training. We will work with your training schedule and adjust recommendations as you progress.',
      },
      {
        question: 'Can chiropractic care help prevent sports injuries?',
        answer: 'Regular chiropractic care may help identify joint restrictions, muscle imbalances, and movement limitations that increase injury risk over time. Many athletes use chiropractic as part of their ongoing maintenance routine — not just when they are injured — to stay moving well and reduce the likelihood of soft tissue and joint problems developing.',
      },
      {
        question: 'I have been told my injury needs physio — can I see a chiropractor instead?',
        answer: 'Chiropractors and physiotherapists have overlapping skills in many areas of musculoskeletal injury management. In many cases, chiropractic care is entirely appropriate for sports injuries. Sometimes a combined approach or a referral is the right answer — we will give you an honest assessment and work collaboratively with other practitioners where that serves your recovery best.',
      },
    ],
    relatedConditions: ['back-pain', 'shoulder-pain', 'sciatica'],
    relatedServices: ['sports-chiropractic', 'chiropractic-adjustments'],
  },

  {
    slug: 'posture-tech-neck',
    title: 'Posture & Tech Neck',
    metaTitle: 'Tech Neck & Posture Treatment Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Tech neck, forward head posture, and rounded shoulders from desk work or screen use? Banora Chiropractic in Tweed Heads South assesses and helps manage posture-related pain. Book online.',
    heroHeading: 'Posture & Tech Neck',
    heroSubheading: 'Hours at a desk or on your phone have a way of catching up with you — we can help you understand what is happening and what to do about it.',
    icon: '🧍',
    shortDescription: 'Chiropractic assessment and care for posture-related neck, shoulder, and upper back pain — including the forward-head strain known as tech neck.',
    overview: `We are spending more time than ever looking at screens — and our necks and upper backs are paying the price. The term "tech neck" has become a shorthand for the aching, stiffness, and tension that builds up from long hours hunched over a phone, laptop, or desk. But the problem goes deeper than just posture awareness.

When the head sits forward of its natural position — even by a few centimetres — the load on the cervical spine increases dramatically. A head that weighs 5 kg in a neutral position can place the equivalent of 20–25 kg of load on the neck when it is tilted forward at 45 degrees. Over hours of screen time each day, the muscles, joints, and discs of the cervical spine are under sustained, abnormal load. The result is not just discomfort — it can include joint stiffness, disc changes, muscle imbalances, and headaches that become increasingly frequent over time.

Rounded shoulders and a forward-head posture are not simply a matter of bad habits. They are often the result of muscle imbalances that develop from repetitive patterns — tight chest and anterior shoulder muscles, weakened deep neck flexors and upper back stabilisers — combined with joint stiffness that makes it physically harder to maintain an upright position. Telling someone to "just sit up straight" without addressing these underlying factors rarely produces lasting change. Our approach is to assess what is actually going on structurally and give you a care plan that makes improvement achievable.`,
    symptoms: [
      'Aching or tightness across the neck, upper shoulders, and between the shoulder blades',
      'A visibly forward-head or rounded-shoulder posture, particularly by the end of the day',
      'Stiffness and reduced range of motion when turning the head',
      'Tension headaches that build through the working day',
      'Upper back or between-the-shoulder-blade discomfort after sitting',
      'Pain or fatigue that worsens with phone use, laptop work, or long drives',
      'A feeling of being unable to sit comfortably upright for extended periods',
      'Neck and shoulder pain that is better on weekends and worse by Friday',
    ],
    howWeHelp: `We start with a postural and movement assessment — looking at the position of your head relative to your shoulders, the curvature of your cervical and thoracic spine, and the balance of muscles supporting your upper body. This gives us a clear picture of which structures are tight, which are weak, and which joints have lost normal movement.

Care for posture-related pain and tech neck at Banora Chiropractic may include cervical and thoracic adjustments to restore normal joint mobility and reduce the stiffness that makes good posture hard to maintain, soft tissue work on the tight structures — particularly the suboccipital muscles, chest, and anterior shoulder — that pull the head and shoulders forward, and a progressive exercise program targeting the deep neck flexors, rhomboids, and lower trapezius that support an upright position. Just as importantly, we provide practical ergonomic advice specific to your work setup — screen height, chair position, phone habits, and movement breaks — so that the improvements from care carry over into your daily life. Lasting posture improvement comes from a combination of structural correction and behavioural change, and we help you with both.`,
    whatToExpect: `Your first appointment includes a thorough postural assessment and movement analysis. We take time to understand how your working day is structured — how many hours you spend seated, what your typical posture looks like, and what you have already tried. We will then examine your neck, upper back, and shoulders, and explain what we find in plain, practical language.

Improvement in posture-related pain is usually noticeable within the first few weeks of care. Joint stiffness responds relatively quickly to chiropractic adjustments; muscle balance and strength takes longer to develop. We will give you a realistic timeline based on your assessment and keep track of how both your symptoms and your posture change over time. You will be given exercises at each visit that are appropriate to your current stage — not a long list to work through alone, but specific movements we can teach you properly and progress as you improve. Most people find that a combination of a focused care period followed by periodic maintenance visits — and the habit changes we help you establish — leads to sustained improvement.`,
    faqs: [
      {
        question: 'What is tech neck and how does it cause pain?',
        answer: 'Tech neck describes the neck and upper back strain that develops from prolonged forward-head posture during screen use. As the head tips forward, the load on the cervical spine increases significantly — muscles work harder, joints are compressed differently, and over time this produces stiffness, aching, and headaches. Chiropractic care addresses the joint stiffness and muscle imbalances involved, combined with ergonomic advice to reduce the strain going forward.',
      },
      {
        question: 'Can chiropractic improve my posture long-term?',
        answer: 'Chiropractic care can help address the joint stiffness and muscle imbalances that make good posture difficult to maintain. Combined with targeted exercises and changes to your daily habits and workspace setup, lasting improvement is achievable for most people. We are honest that this requires engagement beyond the clinic — but we make the process practical and achievable.',
      },
      {
        question: 'I sit at a desk all day — what can I do between appointments?',
        answer: 'Simple, consistent changes make a real difference: positioning your screen at eye level, keeping your phone higher when reading, taking short movement breaks every 45–60 minutes, and doing a few specific stretches and exercises we can show you. We will give you practical advice tailored to your actual work setup rather than generic guidance that is hard to apply.',
      },
      {
        question: 'Are my headaches related to my posture?',
        answer: 'They may well be. Forward-head posture places significant tension on the muscles and joints at the base of the skull — a common driver of cervicogenic and tension-type headaches. If your headaches tend to build through the working day and are accompanied by neck stiffness or upper back tension, posture is worth investigating as a contributing factor.',
      },
    ],
    relatedConditions: ['neck-pain', 'headaches-migraines'],
    relatedServices: ['posture-correction', 'chiropractic-adjustments'],
  },
];
