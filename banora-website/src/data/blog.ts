export type BlogCategory =
  | 'Back Pain'
  | 'Neck Pain'
  | 'Posture'
  | 'Sports'
  | 'Pregnancy'
  | 'Wellness'
  | 'Lifestyle';

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  updatedDate?: string;
  status: 'published' | 'draft';
  category: BlogCategory;
  tags: string[];
  heroImage: string;
  heroImageAlt: string;
  readTime: number;
  relatedServices: string[];
  relatedConditions: string[];
  relatedPosts: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'desk-workers-guide-to-a-healthier-back',
    title: "A Desk Worker's Guide to a Healthier Back",
    metaTitle: "Desk Worker's Guide to a Healthier Back | Banora Chiropractic Blog",
    metaDescription: 'Spending long hours at a desk? Here are practical tips from our Tweed Heads South chiropractors to help reduce back discomfort and improve your posture at work.',
    excerpt: 'If you spend most of your day sitting at a desk, your back is probably telling you about it. Here are some practical things you can do today.',
    content: `
      <p>If you spend most of your day sitting at a desk, you're not alone. Most of us are doing it — and most of us are feeling the effects. Stiffness in the lower back, tightness between the shoulder blades, that nagging ache that kicks in around 3pm. Sound familiar?</p>

      <p>The good news is, a few simple changes to how you sit, move, and set up your workspace can make a real difference.</p>

      <h2>Why sitting may contribute to back discomfort</h2>

      <p>Your spine is designed to move. When you sit in the same position for hours, the muscles that support your spine can become tight and fatigued. Your hip flexors shorten, your glutes switch off, and your lower back ends up bearing more load than it should.</p>

      <p>Over time, this can lead to postural changes that may contribute to ongoing discomfort. It's not that sitting is inherently bad — it's the <em>prolonged, static</em> nature of it that tends to cause problems.</p>

      <h2>5 things you can do at your desk today</h2>

      <ol>
        <li><strong>Set a movement timer.</strong> Every 30 minutes, stand up. Even a quick stretch or a walk to the kitchen counts. Your spine needs regular position changes to stay happy.</li>
        <li><strong>Check your screen height.</strong> The top of your monitor should be roughly at eye level. If you're looking down at a laptop all day, that's a lot of extra load on your neck. A simple laptop stand or stack of books can help.</li>
        <li><strong>Sit back in your chair.</strong> Most people perch on the front edge of their seat. Slide your hips right to the back so the chair's lumbar support (if it has one) is actually doing its job.</li>
        <li><strong>Uncross your legs.</strong> Crossing your legs can twist your pelvis and put uneven pressure on your lower back. Feet flat on the floor, knees roughly at hip height.</li>
        <li><strong>Relax your shoulders.</strong> Right now, as you read this — are your shoulders up near your ears? Drop them. Breathe. This is something most desk workers do without realising it.</li>
      </ol>

      <h2>When your back needs more than ergonomic tips</h2>

      <p>If you've tried the desk setup changes and you're still dealing with persistent <a href="/conditions/back-pain">back pain</a>, it might be worth getting it assessed. Sometimes what feels like a simple posture problem can have underlying causes that benefit from hands-on care.</p>

      <p>A <a href="/services/chiropractic-adjustments">chiropractic assessment</a> can help identify what's going on — whether it's joint stiffness, muscle tension, or postural habits that need addressing. From there, we can work with you on a plan that fits your situation.</p>

      <h2>The bottom line</h2>

      <p>You don't need a standing desk or a fancy ergonomic setup to start feeling better. Small, consistent changes to how you move throughout the day can go a long way. And if your back's been bothering you for a while, don't just push through it — get it checked out.</p>

      <p>We see desk workers every week at <a href="/about">Banora Chiropractic</a> in Tweed Heads South. If that's you, we're here to help.</p>
    `,
    author: 'dr-james-shipway',
    publishDate: '2026-03-24',
    status: 'published' as const,
    category: 'Posture',
    tags: ['desk workers', 'posture', 'ergonomics', 'lower back', 'office workers'],
    heroImage: '/images/pexels-karola-g-4506108.webp',
    heroImageAlt: 'Person holding neck in pain from desk work',
    readTime: 4,
    relatedServices: ['posture-correction', 'chiropractic-adjustments'],
    relatedConditions: ['back-pain', 'neck-pain'],
    relatedPosts: ['understanding-back-pain', 'why-your-posture-matters-more-than-you-think'],
  },
  {
    slug: 'understanding-back-pain',
    title: 'Understanding Back Pain: What Your Body Might Be Telling You',
    metaTitle: 'Understanding Back Pain | Chiropractor Tweed Heads South | Banora Chiropractic',
    metaDescription: 'Back pain affects most Australians at some point. Our Tweed Heads South chiropractors explain common causes, when to seek help, and how chiropractic care may assist.',
    excerpt: "Back pain is incredibly common — around 4 million Australians are dealing with it right now. Here's what might be going on and when it's worth getting checked.",
    content: `
      <p>If you're dealing with back pain, you're in good company. It's one of the most common reasons Australians visit a healthcare provider, and it's something we see every single day at the clinic.</p>

      <p>The tricky thing about back pain is that it can show up in so many different ways. A dull ache that builds through the day. A sharp twinge when you bend over. Stiffness first thing in the morning that takes half an hour to ease. Each of these can point to different things going on in your body.</p>

      <h2>Common contributors to back pain</h2>

      <p>While every person's situation is different, some of the more common factors we see include:</p>

      <ul>
        <li><strong>Joint stiffness or restriction</strong> — when the joints in your spine aren't moving as freely as they should, the surrounding muscles often tighten up to compensate.</li>
        <li><strong>Muscle tension and fatigue</strong> — overworked or underused muscles (especially in the core and glutes) can contribute to pain in the lower back.</li>
        <li><strong>Postural habits</strong> — how you sit, stand, and move throughout the day has a cumulative effect on your spine. Small habits can add up over time.</li>
        <li><strong>Disc-related issues</strong> — disc bulges or irritation can cause localised back pain, and sometimes <a href="/conditions/sciatica">referred pain into the legs (sciatica)</a>.</li>
        <li><strong>Stress and tension</strong> — physical and emotional stress can both contribute to muscle tightness and pain, particularly in the upper back and shoulders.</li>
      </ul>

      <h2>When should you get it checked?</h2>

      <p>A general rule of thumb: if your back pain has been hanging around for more than a week or two, or if it's affecting your ability to work, exercise, sleep, or enjoy daily activities — it's worth getting a professional opinion.</p>

      <p>You should seek care sooner if you're experiencing:</p>

      <ul>
        <li>Pain that radiates into your legs or feet</li>
        <li>Numbness, tingling, or weakness</li>
        <li>Pain that wakes you up at night</li>
        <li>Back pain following an injury or accident</li>
      </ul>

      <h2>How chiropractic care may help</h2>

      <p>Chiropractic care aims to address the underlying cause of your back pain — not just mask the symptoms. Through <a href="/services/chiropractic-adjustments">hands-on adjustments</a>, soft tissue work, and personalised advice, we can work to improve how your spine moves and functions.</p>

      <p>At <a href="/about">Banora Chiropractic</a>, we take the time to do a thorough assessment before recommending any treatment. We want to understand what's going on, explain it clearly, and give you honest advice about whether we can help.</p>

      <p>If you're in the Tweed Heads South area and you've been putting up with back pain, come in and let us have a look. The sooner you address it, the easier it usually is to manage.</p>
    `,
    author: 'dr-paul-cater',
    publishDate: '2026-03-17',
    status: 'published' as const,
    category: 'Back Pain',
    tags: ['back pain', 'lower back', 'spine health', 'when to see a chiropractor'],
    heroImage: '/images/pexels-kindelmedia-7298427.webp',
    heroImageAlt: 'Man experiencing lower back pain',
    readTime: 5,
    relatedServices: ['chiropractic-adjustments', 'posture-correction'],
    relatedConditions: ['back-pain', 'sciatica'],
    relatedPosts: ['desk-workers-guide-to-a-healthier-back', 'why-your-posture-matters-more-than-you-think'],
  },
  {
    slug: 'why-your-posture-matters-more-than-you-think',
    title: 'Why Your Posture Matters More Than You Think',
    metaTitle: 'Why Posture Matters | Posture Correction Tweed Heads | Banora Chiropractic',
    metaDescription: 'Poor posture affects more than just your back. Our Tweed Heads South chiropractors explain how posture impacts your health and what you can do about it.',
    excerpt: "Posture isn't just about standing up straight — it affects your energy, your breathing, and how your whole body functions. Here's why it matters.",
    content: `
      <p>When someone says "posture", most people think of their mum telling them to sit up straight. But posture is about much more than appearances — it affects how your body moves, how you breathe, and even how much energy you have through the day.</p>

      <h2>What good posture actually looks like</h2>

      <p>Good posture isn't about being rigid or holding yourself in some perfect military stance. It's about your body being in a balanced, efficient position where your muscles and joints aren't working harder than they need to.</p>

      <p>When you're standing, that generally means:</p>

      <ul>
        <li>Your ears are roughly over your shoulders</li>
        <li>Your shoulders are relaxed and level (not hunched forward)</li>
        <li>Your spine has its natural curves — a slight inward curve in your lower back, a gentle outward curve in your mid-back</li>
        <li>Your weight is evenly distributed through both feet</li>
      </ul>

      <p>When you're sitting, it means your hips are back in the chair, your feet are on the floor, and you're not slumping forward to look at a screen.</p>

      <h2>What happens when posture goes off track</h2>

      <p>Poor posture doesn't just cause <a href="/conditions/back-pain">back pain</a>. It can contribute to a whole range of issues:</p>

      <ul>
        <li><strong><a href="/conditions/neck-pain">Neck pain</a> and stiffness</strong> — forward head posture puts extra strain on the muscles at the back of your neck. For every inch your head moves forward, the effective weight on your neck roughly doubles.</li>
        <li><strong><a href="/conditions/headaches-migraines">Headaches</a></strong> — tension in the neck and upper back muscles is one of the most common contributors to tension-type headaches.</li>
        <li><strong>Reduced breathing capacity</strong> — a slumped posture compresses your rib cage, making it harder for your lungs to fully expand.</li>
        <li><strong>Fatigue</strong> — when your muscles are constantly working to hold you in an inefficient position, you burn more energy. That afternoon slump might be partly postural.</li>
        <li><strong><a href="/conditions/shoulder-pain">Shoulder problems</a></strong> — rounded shoulders can change how your shoulder joint moves, potentially contributing to impingement and discomfort.</li>
      </ul>

      <h2>What you can do about it</h2>

      <p>The first step is awareness. Pay attention to how you're sitting right now. Are you slumped? Is your head forward? Just noticing is half the battle.</p>

      <p>Beyond that:</p>

      <ul>
        <li><strong>Move more.</strong> The best posture is your next posture. Regular movement throughout the day is more important than any single "perfect" position.</li>
        <li><strong>Strengthen your core.</strong> A strong core supports your spine and makes it easier to maintain good posture without thinking about it.</li>
        <li><strong>Get assessed.</strong> If you've had poor posture for years, there may be structural changes that benefit from professional support. A <a href="/services/posture-correction">posture assessment</a> can identify specific areas to work on.</li>
      </ul>

      <h2>How we can help</h2>

      <p>At Banora Chiropractic, <a href="/services/posture-correction">posture correction</a> is something we work on with a lot of our patients. It's not about forcing your body into a position — it's about improving how your spine moves and helping your body find a more balanced alignment naturally.</p>

      <p>We use a combination of <a href="/services/chiropractic-adjustments">chiropractic adjustments</a>, soft tissue work, and practical advice to help you make lasting changes. If posture is something you've been meaning to address, we're here to help you get started.</p>
    `,
    author: 'dr-james-shipway',
    publishDate: '2026-03-10',
    status: 'published' as const,
    category: 'Posture',
    tags: ['posture', 'posture correction', 'ergonomics', 'spine health', 'desk posture'],
    heroImage: '/images/pexels-shvetsa-4226205.webp',
    heroImageAlt: 'Doctor pointing at spine X-ray to explain posture and spinal health',
    readTime: 5,
    relatedServices: ['posture-correction', 'chiropractic-adjustments'],
    relatedConditions: ['back-pain', 'neck-pain', 'headaches-migraines'],
    relatedPosts: ['desk-workers-guide-to-a-healthier-back', 'understanding-back-pain'],
  },
  {
    slug: '5-warmup-mistakes-setting-you-up-for-injury',
    title: '5 Warm-Up Mistakes That Could Be Setting You Up for Injury',
    metaTitle: '5 Warm-Up Mistakes & Injury Prevention | Chiropractor Tweed Heads South',
    metaDescription: 'Common warm-up mistakes that may lead to sports injuries. Practical tips from our Tweed Heads South chiropractors to help you train smarter and stay active.',
    excerpt: "Whether you're hitting the surf at Coolangatta or training at the gym, how you warm up matters more than you think. Here are 5 common mistakes and what to do instead.",
    content: `
      <p>Whether you're a weekend surfer, a gym regular, or someone who just likes a solid morning run along the Tweed Coast — how you warm up before exercise matters more than most people realise.</p>

      <p>We see a lot of active people at Banora Chiropractic, and one pattern comes up again and again: the warm-up gets skipped, rushed, or done in a way that doesn't actually prepare the body for what's coming. Here are five of the most common mistakes and what to do instead.</p>

      <h2>1. Skipping the warm-up entirely</h2>

      <p>This is the big one. You're short on time, you feel fine, so you jump straight into your workout or hit the waves cold. The problem is, your muscles, joints, and nervous system aren't ready for the load you're about to put on them. A cold muscle is a less elastic muscle — and that can mean strains, pulls, or joint niggles that build up over time.</p>

      <p><strong>What to do instead:</strong> Even 5 minutes makes a difference. Start with some light movement that raises your heart rate — a brisk walk, some star jumps, a light jog. Get the blood flowing before you ask your body to perform.</p>

      <h2>2. Only stretching statically before exercise</h2>

      <p>Touching your toes for 30 seconds and calling it a warm-up is something most of us learned at school. But static stretching on cold muscles doesn't actually prepare you well for dynamic movements like running, lifting, or surfing. Some research even suggests it may temporarily reduce muscle power output.</p>

      <p><strong>What to do instead:</strong> Save static stretching for after your workout. Before exercise, use dynamic warm-up movements — leg swings, arm circles, walking lunges, hip openers. These take your joints through their range of motion while getting everything warmed up.</p>

      <h2>3. Doing the same warm-up for every activity</h2>

      <p>A warm-up for a surf session should look different to a warm-up for a heavy deadlift session. Your body needs to be prepared for the specific movements and demands you're about to put on it. A generic jog on the treadmill before an upper body weights session misses the mark.</p>

      <p><strong>What to do instead:</strong> Think about what you're about to do, and warm up the areas that'll be working hardest. Hitting the surf? Focus on shoulder mobility, thoracic rotation, and hip flexors. Leg day at the gym? Bodyweight squats, hip circles, and ankle mobility work.</p>

      <h2>4. Ignoring niggles during warm-up</h2>

      <p>Your warm-up is actually a great diagnostic tool. If something feels tight, restricted, or a bit off during your warm-up — that's your body giving you information. Pushing through and hoping it loosens up during the workout is how minor niggles can become bigger problems.</p>

      <p><strong>What to do instead:</strong> Listen to what your body is telling you. Spend extra time on the area that feels off. If a joint feels restricted or a muscle feels unusually tight, adjust your session accordingly. And if it's been coming up consistently, it might be worth getting a <a href="/services/chiropractic-adjustments">chiropractic assessment</a> to see what's going on.</p>

      <h2>5. Rushing through it</h2>

      <p>A 60-second warm-up before an hour-long training session isn't giving your body enough time to transition. Your cardiovascular system, your muscles, your joints — they all need a few minutes to shift from resting state to performance mode.</p>

      <p><strong>What to do instead:</strong> Aim for 5–10 minutes of warm-up for a standard workout. If you're doing something intense — a comp, a heavy session, a long surf — give yourself closer to 10–15 minutes. Think of it as part of your training, not something that eats into it.</p>

      <h2>When warm-ups aren't enough</h2>

      <p>If you're warming up properly and still dealing with recurring tightness, stiffness, or pain during exercise, there might be something else going on. Joint restrictions, muscle imbalances, or postural issues can all affect how your body handles load — and they don't always resolve on their own.</p>

      <p>A <a href="/services/sports-chiropractic">sports chiropractic assessment</a> can help identify what's going on and give you a plan to address it. At <a href="/about">Banora Chiropractic</a> in Tweed Heads South, we work with runners, surfers, gym-goers, and weekend warriors to help keep them doing what they love.</p>

      <p>If something's been holding you back, come in and let us have a look.</p>
    `,
    author: 'dr-paul-cater',
    publishDate: '2026-03-30',
    status: 'published' as const,
    category: 'Sports',
    tags: ['warm-up', 'injury prevention', 'sports', 'exercise', 'surfing', 'gym', 'Gold Coast'],
    heroImage: '/images/pexels-airamdphoto-29881488.webp',
    heroImageAlt: 'Woman warming up and stretching before exercise',
    readTime: 5,
    relatedServices: ['sports-chiropractic', 'chiropractic-adjustments'],
    relatedConditions: ['back-pain', 'shoulder-pain'],
    relatedPosts: ['desk-workers-guide-to-a-healthier-back', 'understanding-back-pain'],
  },
  {
    slug: 'chiropractic-care-during-pregnancy',
    title: 'When Should You See a Chiropractor During Pregnancy?',
    metaTitle: 'Chiropractic Care During Pregnancy | Banora Chiropractic Tweed Heads South',
    metaDescription: 'Wondering if chiropractic care is safe during pregnancy? Our Tweed Heads South chiropractors explain when to seek care, what to expect, and how it may help you feel more comfortable.',
    excerpt: "Pregnancy puts a lot of demand on your body. Chiropractic care can be a gentle way to stay comfortable — but many expecting mums aren't sure when or whether to come in. Here's what you need to know.",
    content: `
      <p>Pregnancy is one of the most physically demanding things the body goes through. Your centre of gravity shifts, your ligaments loosen, your posture changes — and all of this happens over just nine months. It's no wonder so many expecting mums experience lower back pain, pelvic discomfort, and general achiness along the way.</p>

      <p>Chiropractic care during pregnancy is something we're asked about a lot at Banora Chiropractic. So let's clear up the common questions.</p>

      <h2>Is chiropractic care safe during pregnancy?</h2>

      <p>Yes — chiropractic care is widely considered safe during pregnancy when performed by a qualified practitioner who uses techniques appropriate for expectant mothers. We use specially designed pregnancy pillows and modified adjustments that avoid pressure on the abdomen at every stage.</p>

      <p>Our chiropractors are trained to work with pregnant patients and will always take the time to understand where you are in your pregnancy and how you're feeling before recommending any care.</p>

      <h2>When do most women start coming in?</h2>

      <p>There's no single "right" time to start. Some women come in early in their first trimester for a check-up and to get ahead of any postural changes. Others start seeing us in the second or third trimester when discomfort becomes more noticeable.</p>

      <p>Common reasons expecting mums visit us include:</p>

      <ul>
        <li><strong><a href="/conditions/back-pain">Lower back pain</a></strong> — particularly as the bump grows and your lower back has to work harder to support the extra weight out front.</li>
        <li><strong>Pelvic girdle pain (PGP)</strong> — a common pregnancy complaint involving pain around the pelvis, hips, and groin, often made worse by walking, climbing stairs, or turning over in bed.</li>
        <li><strong><a href="/conditions/sciatica">Sciatica</a></strong> — the growing uterus can put pressure on the sciatic nerve, causing pain that runs from the lower back into the leg.</li>
        <li><strong>Upper back and rib pain</strong> — as your rib cage expands and your centre of gravity changes, the mid-back can come under more strain.</li>
        <li><strong>General stiffness and discomfort</strong> — some women simply find that regular care helps them feel more comfortable throughout pregnancy.</li>
      </ul>

      <h2>What does a treatment session look like?</h2>

      <p>At your first visit, we'll chat about your pregnancy, your health history, and what you're experiencing. We use special pregnancy pillows that allow you to lie face down comfortably — many of our pregnant patients say it's the first time they've been able to do that in months.</p>

      <p>Adjustments are gentle and modified for pregnancy. We also provide advice on stretches, sleeping positions, and movement habits that may help manage discomfort between visits.</p>

      <h2>Are there times when chiropractic care isn't appropriate?</h2>

      <p>There are some situations where we would not provide care, or where we would refer you back to your obstetrician or midwife first. These include placenta praevia, pre-eclampsia, or any high-risk pregnancy concerns. We will always ask the right questions before beginning care, and we communicate openly with your other healthcare providers when needed.</p>

      <h2>What about after birth?</h2>

      <p>The postnatal period is another time when chiropractic care can be helpful. Labour and delivery place significant demands on the body — and then the feeding, carrying, and sleep deprivation of early parenthood add their own load. Many of our patients continue care after birth, and we also offer gentle checks for newborns.</p>

      <p>If you're expecting and wondering whether chiropractic care might help you stay comfortable, come in for a chat. We see many pregnant patients at our <a href="/areas/tweed-heads-south">Tweed Heads South</a> clinic and would love to support you through your pregnancy.</p>
    `,
    author: 'dr-james-shipway',
    publishDate: '2026-04-22',
    status: 'published' as const,
    category: 'Pregnancy',
    tags: ['pregnancy', 'pregnancy chiropractic', 'lower back pain', 'pelvic pain', 'expecting mums', 'postnatal'],
    heroImage: '/images/hero-pregnancy.webp',
    heroImageAlt: 'Pregnant woman receiving gentle chiropractic care',
    readTime: 5,
    relatedServices: ['pregnancy-chiropractic', 'chiropractic-adjustments', 'paediatric-chiropractic'],
    relatedConditions: ['back-pain', 'sciatica'],
    relatedPosts: ['chiropractic-care-for-kids', 'understanding-back-pain'],
  },
  {
    slug: 'chiropractor-or-physio-understanding-the-difference',
    title: 'Chiropractor or Physio? Understanding the Difference',
    metaTitle: 'Chiropractor vs Physio: What\'s the Difference? | Banora Chiropractic',
    metaDescription: 'Not sure whether to see a chiropractor or a physiotherapist? Our Tweed Heads South chiropractors explain the differences and help you decide which is right for you.',
    excerpt: "It's one of the most common questions we get: what's the difference between a chiropractor and a physio? Here's an honest breakdown to help you make the right choice.",
    content: `
      <p>If you're dealing with back pain, neck stiffness, or a niggling injury, you've probably wondered whether to see a chiropractor or a physiotherapist. It's a genuinely good question — and one we hear often. The honest answer is that there's overlap between the two, but there are also some meaningful differences.</p>

      <h2>What does a chiropractor do?</h2>

      <p>Chiropractors focus on the relationship between the spine, the nervous system, and the musculoskeletal system. We're trained to assess and treat conditions involving the spine, joints, and surrounding muscles — using hands-on techniques to help restore movement and function.</p>

      <p>The main treatment tool is the chiropractic adjustment — a precise, controlled movement applied to a joint to help restore its range of motion. But modern chiropractic care also includes soft tissue therapy, dry needling, exercise prescription, and lifestyle advice. It's not just about cracking backs.</p>

      <p>Chiropractors complete a five-year university degree (typically a Bachelor of Science combined with a Master of Chiropractic) and are registered with AHPRA — the same national registration body that regulates doctors, nurses, and physiotherapists.</p>

      <h2>What does a physiotherapist do?</h2>

      <p>Physiotherapists also work with the musculoskeletal system, but their training and approach often has a broader scope. Physios work across a wide range of areas including cardiorespiratory and neurological rehabilitation, as well as sport and musculoskeletal conditions.</p>

      <p>In terms of musculoskeletal care, physios tend to focus more on rehabilitation, exercise-based therapy, and movement retraining. Many also use manual therapy, dry needling, and hands-on techniques similar to what a chiropractor uses.</p>

      <h2>Where they overlap</h2>

      <p>For many common complaints — lower back pain, neck pain, sports injuries, postural issues — a good chiropractor and a good physio will often be working toward the same goals using similar tools. Both will assess you thoroughly, both will provide hands-on care, and both will give you advice and exercises to support your recovery.</p>

      <h2>How to decide which is right for you</h2>

      <p>Here's a practical way to think about it:</p>

      <ul>
        <li><strong>Spinal and joint-focused complaints</strong> — if your main concern is your spine, joints, or something that feels like it needs "cracking" or mobilising, a chiropractor is a natural first choice. We specialise in exactly this.</li>
        <li><strong>Post-surgical rehabilitation or complex injury recovery</strong> — a physiotherapist's rehabilitation focus may be more appropriate here.</li>
        <li><strong>Ongoing muscular weakness or movement retraining</strong> — physios tend to have a stronger focus on structured exercise rehabilitation programs.</li>
        <li><strong>When you're not sure</strong> — just pick one. A good practitioner — whether chiropractor or physio — will tell you honestly if someone else would serve you better, and refer you accordingly.</li>
      </ul>

      <h2>Can you see both?</h2>

      <p>Absolutely. Many patients see both a chiropractor and a physio as part of their overall care — using each for what they do best. We're happy to work alongside other healthcare providers and communicate with your treatment team when needed.</p>

      <h2>Our honest take</h2>

      <p>We're chiropractors, so we're obviously going to say chiropractic care is great — but we also believe the best practitioner for you is the one who will give you an honest assessment, explain what's going on clearly, and put your health first. If we can't help you, we'll tell you, and we'll point you in the right direction.</p>

      <p>If you'd like to find out whether chiropractic care might be right for your situation, book a consultation at <a href="/about">Banora Chiropractic</a> in <a href="/areas/tweed-heads-south">Tweed Heads South</a>. We're always happy to have an honest conversation.</p>
    `,
    author: 'dr-paul-cater',
    publishDate: '2026-05-06',
    status: 'published' as const,
    category: 'Wellness',
    tags: ['chiropractor vs physio', 'physiotherapy', 'chiropractic', 'which is right for me', 'musculoskeletal'],
    heroImage: '/images/clinic-adjustment-wide.webp',
    heroImageAlt: 'Chiropractor performing a spinal adjustment on a patient',
    readTime: 5,
    relatedServices: ['chiropractic-adjustments', 'posture-correction', 'sports-chiropractic'],
    relatedConditions: ['back-pain', 'neck-pain'],
    relatedPosts: ['understanding-back-pain', 'why-your-posture-matters-more-than-you-think'],
  },
  {
    slug: 'how-to-set-up-your-home-office-to-protect-your-back',
    title: 'How to Set Up Your Home Office to Protect Your Back',
    metaTitle: 'Home Office Setup for Back Health | Chiropractor Tweed Heads South',
    metaDescription: 'Working from home and dealing with back or neck pain? Our Tweed Heads South chiropractors share practical tips for setting up a home office that supports your spine.',
    excerpt: "More Australians are working from home than ever — and we're seeing the results in the clinic. Here's how to set up your workspace so your back doesn't pay the price.",
    content: `
      <p>Working from home has become normal for a lot of us. And while it has plenty of upsides, one consistent downside we see at the clinic is this: home office setups are often far worse for the body than office ones.</p>

      <p>Kitchen tables. Laptops on couches. Dining chairs that weren't designed for eight hours of sitting. We see the results in the form of <a href="/conditions/back-pain">back pain</a>, <a href="/conditions/neck-pain">neck stiffness</a>, and <a href="/conditions/headaches-migraines">tension headaches</a> that have crept in since people started working from home.</p>

      <p>The good news is, a few targeted changes can make a real difference — and you don't need to spend a lot of money to do it.</p>

      <h2>Start with your chair</h2>

      <p>Your chair is the foundation of your setup. You don't need an expensive ergonomic chair, but you do need one that lets you sit with your:</p>

      <ul>
        <li>Feet flat on the floor (or on a footrest)</li>
        <li>Knees at roughly 90 degrees</li>
        <li>Hips pushed back to the rear of the seat</li>
        <li>Lower back supported — either by the chair's lumbar support, or a small rolled towel placed behind your lower back</li>
      </ul>

      <p>If your chair is too low or too high, that alone can cause significant strain on your lower back and hips.</p>

      <h2>Raise your screen</h2>

      <p>This is the single most impactful change most laptop users can make. When your screen is sitting on a desk, you're looking down at it — and that forward head position puts enormous strain on the muscles and joints of your neck. For every inch your head moves forward from its neutral position, the effective load on your neck roughly doubles.</p>

      <p>A simple laptop stand (or a stack of books) can raise your screen to eye level in minutes. Pair it with an external keyboard and mouse and you've essentially created a proper workstation for under $50.</p>

      <h2>Position your keyboard and mouse correctly</h2>

      <p>Your keyboard should sit close enough that your elbows stay near your sides when you type — not reaching forward. Your mouse should be at the same level as the keyboard, close enough that you're not stretching your arm out to use it. Reaching repetitively for a mouse that's too far away is a common cause of shoulder and upper back tension.</p>

      <h2>Think about your lighting</h2>

      <p>Eye strain from poor lighting leads to leaning forward toward the screen — which in turn causes neck and upper back strain. Ideally, your main light source should be to the side of your screen, not behind it (causing glare) or in front of it (causing your screen to appear darker). If you're squinting or leaning in, your lighting might be contributing to your discomfort.</p>

      <h2>Move — regularly and deliberately</h2>

      <p>Even the best ergonomic setup doesn't overcome the problem of sitting still for hours. Your spine is designed to move, and prolonged static postures — however "correct" — cause muscles to fatigue and joints to stiffen.</p>

      <p>A practical approach: set a timer for every 30–45 minutes. When it goes off, stand up, stretch, take a short walk. It sounds simple because it is — and it genuinely makes a difference.</p>

      <h2>The floor and the couch</h2>

      <p>We know that sometimes the couch just calls to you. If you do work from the couch occasionally, try to at least support your lower back with a cushion and keep your screen at a reasonable height. Avoid lying back with a laptop balanced on your chest — that's one of the most strain-inducing positions for your neck.</p>

      <h2>When the setup fix isn't enough</h2>

      <p>If you've made changes to your workspace and you're still dealing with persistent <a href="/conditions/back-pain">back pain</a>, <a href="/conditions/neck-pain">neck stiffness</a>, or headaches, it might be worth getting your spine assessed. Sometimes the discomfort you're feeling has an underlying cause that ergonomic changes alone won't resolve.</p>

      <p>At <a href="/about">Banora Chiropractic</a> in <a href="/areas/tweed-heads-south">Tweed Heads South</a>, we work with a lot of remote workers and desk-based professionals. If that's you, we're here to help.</p>
    `,
    author: 'dr-james-shipway',
    publishDate: '2026-05-20',
    status: 'published' as const,
    category: 'Lifestyle',
    tags: ['home office', 'working from home', 'ergonomics', 'desk setup', 'back pain', 'posture', 'neck pain'],
    heroImage: '/images/pexels-karola-g-4506108.webp',
    heroImageAlt: 'Person working at a home desk setup with good posture',
    readTime: 5,
    relatedServices: ['posture-correction', 'chiropractic-adjustments'],
    relatedConditions: ['back-pain', 'neck-pain', 'headaches-migraines'],
    relatedPosts: ['desk-workers-guide-to-a-healthier-back', 'why-your-posture-matters-more-than-you-think'],
  },
  {
    slug: 'chiropractic-care-for-kids',
    title: 'Chiropractic Care for Kids: What Parents Need to Know',
    metaTitle: 'Chiropractic Care for Kids | Paediatric Chiropractor Tweed Heads South',
    metaDescription: 'Is chiropractic care safe for children? Our Tweed Heads South chiropractors explain what paediatric chiropractic involves, who it may help, and what to expect at your child\'s first visit.',
    excerpt: "Many parents are curious about chiropractic care for their kids but aren't sure where to start. Here's an honest guide to what paediatric chiropractic is — and isn't.",
    content: `
      <p>We see children of all ages at Banora Chiropractic — from newborns to teenagers. And while paediatric chiropractic is increasingly common, it's still something many parents have questions about. Is it safe? What does it involve? When might it help?</p>

      <p>Here's what we'd tell any parent who's curious.</p>

      <h2>Is chiropractic care safe for children?</h2>

      <p>Yes — paediatric chiropractic care uses techniques that are specifically adapted for children's bodies. The pressure used for a baby or young child is nothing like the adjustments you might have seen or experienced yourself. For a newborn, we use about the same pressure you'd use to test if a piece of fruit is ripe — very gentle, very precise.</p>

      <p>Our chiropractors have experience working with children and babies, and we always take time to explain what we're doing so your child (and you) feel comfortable and informed throughout the visit.</p>

      <h2>What brings children to see a chiropractor?</h2>

      <p>Parents bring their children in for a range of reasons. Some of the more common ones include:</p>

      <ul>
        <li><strong>Postural concerns</strong> — with school bags, screen time, and prolonged sitting becoming part of daily life earlier and earlier, we're seeing more children with forward head posture and rounded shoulders.</li>
        <li><strong>Growing pains</strong> — while "growing pains" are common in children, persistent leg, back, or joint discomfort is worth having assessed.</li>
        <li><strong>Sports injuries</strong> — active kids put their bodies through a lot. Chiropractic care may help with recovery from minor injuries and keeping the body moving well.</li>
        <li><strong>Post-birth checks</strong> — some parents bring their babies in after birth, particularly after a difficult or assisted delivery (forceps, ventouse), to check that the spine and neck are moving freely.</li>
        <li><strong>General wellness checks</strong> — many families who receive chiropractic care themselves simply bring their children in for regular check-ups, the same way they would with a dentist.</li>
      </ul>

      <h2>What does a child's first visit look like?</h2>

      <p>We start with a thorough chat — asking about your child's health history, any concerns you have, and how they're generally feeling. If your child is old enough, we'll talk to them directly too.</p>

      <p>The assessment is gentle and non-invasive. We look at posture, movement, and how the spine and joints are functioning. For babies, we assess how they move their head and neck, whether they prefer turning to one side, and how they feed and settle.</p>

      <p>We explain everything as we go. No surprises. And we always check in to make sure your child is comfortable — if they're not happy at any point, we stop.</p>

      <h2>How is care different for different ages?</h2>

      <p>Paediatric chiropractic isn't one-size-fits-all. The approach for a newborn is completely different to the approach for a ten-year-old or a teenager. We adapt our assessment and treatment to what's appropriate for your child's age, size, and specific needs.</p>

      <ul>
        <li><strong>Babies (0–12 months):</strong> Extremely gentle assessment and soft tissue techniques. Adjustments, if used, involve very light fingertip pressure.</li>
        <li><strong>Toddlers and young children:</strong> Often a mix of gentle mobilisation and soft tissue work. Many young children find it fun and relaxing.</li>
        <li><strong>Older children and teens:</strong> More similar to adult care, but adapted. We work with adolescents dealing with sports injuries, growing pains, posture issues from screen time, and the general demands of a busy school life.</li>
      </ul>

      <h2>Should I bring my child in?</h2>

      <p>If you have concerns about your child's posture, movement, comfort, or general wellbeing — it's always worth getting them assessed. The worst case is that everything's fine and you have peace of mind. The best case is that we identify something worth addressing early, before it becomes a bigger issue.</p>

      <p>If you're in the Tweed Heads South area and would like to book a check-up for your child, we'd love to meet them. <a href="/services/paediatric-chiropractic">Learn more about our paediatric chiropractic services</a> or book a consultation at <a href="/about">Banora Chiropractic</a>.</p>
    `,
    author: 'dr-paul-cater',
    publishDate: '2026-06-03',
    status: 'published' as const,
    category: 'Wellness',
    tags: ['paediatric chiropractic', 'chiropractic for kids', 'children', 'babies', 'newborn', 'posture', 'growing pains'],
    heroImage: '/images/hero-all-ages.webp',
    heroImageAlt: 'Chiropractor gently assessing a young child',
    readTime: 5,
    relatedServices: ['paediatric-chiropractic', 'pregnancy-chiropractic', 'chiropractic-adjustments'],
    relatedConditions: ['back-pain', 'neck-pain'],
    relatedPosts: ['chiropractic-care-during-pregnancy', 'why-your-posture-matters-more-than-you-think'],
  },
  {
    slug: 'headache-or-migraine-how-to-tell-the-difference',
    title: 'Headache or Migraine? How to Tell the Difference (and What May Help)',
    metaTitle: 'Headache vs Migraine: What\'s the Difference? | Banora Chiropractic',
    metaDescription: 'Not sure if you\'re dealing with a headache or a migraine? Our Tweed Heads South chiropractors explain the differences, common triggers, and how chiropractic care may help.',
    excerpt: "Most of us know what a headache feels like — but migraines are something else entirely. Here's how to tell the two apart, and what might actually help.",
    content: `
      <p>Headaches are one of the most common complaints we see at Banora Chiropractic. But not all headaches are created equal. Understanding what type of headache you're dealing with is an important first step toward managing it effectively — because the causes, and the best approach, can be quite different.</p>

      <h2>What's the difference between a headache and a migraine?</h2>

      <p>A headache is pain in the head, scalp, or neck. There are many different types — tension headaches, cervicogenic headaches (coming from the neck), cluster headaches, and more. Most are uncomfortable but manageable.</p>

      <p>A migraine is a neurological condition that causes a specific type of severe, often debilitating headache. It's not just a bad headache — it's a distinct medical condition with its own set of symptoms, triggers, and patterns.</p>

      <h2>Signs it might be a migraine</h2>

      <p>Migraines tend to have some distinguishing features:</p>

      <ul>
        <li><strong>Pulsing or throbbing pain</strong> — often on one side of the head (though not always)</li>
        <li><strong>Moderate to severe intensity</strong> — enough to interfere with daily activities</li>
        <li><strong>Nausea or vomiting</strong></li>
        <li><strong>Sensitivity to light and sound</strong> — many people need to lie down in a dark, quiet room</li>
        <li><strong>Aura</strong> — around a third of migraine sufferers experience an aura: visual disturbances like zigzag lines, blind spots, or flashing lights before the headache begins</li>
        <li><strong>Duration</strong> — migraines typically last between 4 and 72 hours without treatment</li>
      </ul>

      <h2>Signs it might be a tension headache</h2>

      <p>Tension headaches are the most common type and tend to feel quite different:</p>

      <ul>
        <li>A dull, aching, pressure-like pain — often described as a tight band around the head</li>
        <li>Pain that affects both sides of the head</li>
        <li>Tenderness in the scalp, neck, and shoulders</li>
        <li>Usually mild to moderate in intensity — you can often still function, though uncomfortably</li>
        <li>No nausea or light sensitivity (or much milder versions)</li>
      </ul>

      <h2>What about cervicogenic headaches?</h2>

      <p>A cervicogenic headache is one that originates from the neck. It's often caused by stiffness or dysfunction in the joints of the upper cervical spine, and can sometimes be confused with both tension headaches and migraines.</p>

      <p>These headaches typically:</p>
      <ul>
        <li>Start at the base of the skull and radiate forward</li>
        <li>Are associated with <a href="/conditions/neck-pain">neck pain</a> or stiffness</li>
        <li>May be triggered or worsened by certain neck movements or positions</li>
        <li>Are often worse after sleeping in an awkward position or sitting at a screen for a long time</li>
      </ul>

      <p>Cervicogenic headaches are something chiropractors see frequently — and they respond particularly well to hands-on care.</p>

      <h2>Common triggers</h2>

      <p>Regardless of headache type, some common triggers include:</p>

      <ul>
        <li>Stress and tension (especially held in the neck and shoulders)</li>
        <li>Poor sleep or irregular sleep patterns</li>
        <li>Dehydration</li>
        <li>Screen time and eye strain</li>
        <li>Poor posture — especially prolonged forward head posture</li>
        <li>Dietary factors (more relevant to migraines — common culprits include caffeine, alcohol, aged cheese, and processed foods)</li>
        <li>Hormonal changes (particularly relevant for women)</li>
        <li>Bright lights, strong smells, or loud noise (migraine triggers)</li>
      </ul>

      <h2>How chiropractic care may help</h2>

      <p>Chiropractic care isn't a treatment for all headache types — but it may be genuinely helpful for certain kinds, particularly:</p>

      <ul>
        <li><strong>Cervicogenic headaches</strong> — where there's a clear neck component, <a href="/services/chiropractic-adjustments">chiropractic adjustments</a> and soft tissue therapy targeting the upper cervical spine may help reduce both the frequency and intensity of headaches.</li>
        <li><strong>Tension headaches</strong> — addressing muscle tension and joint stiffness in the neck and upper back may help reduce the frequency of tension-type headaches.</li>
        <li><strong>Migraines with a cervical component</strong> — some migraine sufferers have found that addressing neck dysfunction helps reduce the frequency of their migraines, though the evidence is more variable here.</li>
      </ul>

      <p>We always assess thoroughly before making any recommendations. If your headaches are frequent, severe, or changing in character, we would also encourage you to speak with your GP to rule out other causes.</p>

      <h2>When to seek urgent care</h2>

      <p>Most headaches are not dangerous — but some warrant prompt medical attention. See a doctor urgently if you experience:</p>

      <ul>
        <li>A sudden, severe headache that comes on very rapidly ("thunderclap" headache)</li>
        <li>Headache with fever, stiff neck, or rash</li>
        <li>Headache following a head injury</li>
        <li>Headache with vision changes, weakness, difficulty speaking, or confusion</li>
      </ul>

      <p>If you're dealing with <a href="/conditions/headaches-migraines">frequent headaches</a> and haven't been able to get on top of them, come in and see us at <a href="/about">Banora Chiropractic</a> in <a href="/areas/tweed-heads-south">Tweed Heads South</a>. We'll assess what's going on and give you an honest picture of whether we can help.</p>
    `,
    author: 'dr-james-shipway',
    publishDate: '2026-06-17',
    status: 'published' as const,
    category: 'Neck Pain',
    tags: ['headaches', 'migraines', 'tension headache', 'cervicogenic headache', 'neck pain', 'headache treatment'],
    heroImage: '/images/hero-back-neck.webp',
    heroImageAlt: 'Person experiencing a headache holding their temples',
    readTime: 6,
    relatedServices: ['chiropractic-adjustments', 'posture-correction'],
    relatedConditions: ['headaches-migraines', 'neck-pain'],
    relatedPosts: ['why-your-posture-matters-more-than-you-think', 'how-to-set-up-your-home-office-to-protect-your-back'],
  },
  {
    slug: 'sciatica-exercises-and-stretches',
    title: '6 Sciatica Stretches and Exercises That May Help Relieve Your Pain',
    metaTitle: '6 Sciatica Exercises & Stretches for Pain Relief | Banora Chiropractic',
    metaDescription: 'Suffering from sciatica? Our Tweed Heads South chiropractors share 6 stretches and exercises for sciatica that may help relieve sciatic nerve pain. Safe, practical, AHPRA-compliant advice.',
    excerpt: 'Sciatica pain can be relentless. Here are six stretches and exercises that may help ease sciatic nerve pain — along with guidance on what to avoid and when to get assessed.',
    content: `
      <p>If you have sciatica, you already know the pain. That deep ache in the buttock, the shooting sensation down the back of your leg, the numbness or tingling that makes it hard to get comfortable — it is not something you can just ignore.</p>

      <p>The good news is that movement is usually your friend when it comes to sciatica. The right stretches and exercises can help reduce pressure on the sciatic nerve, ease muscle tension, and restore some of the mobility that pain takes away. The key word there is <em>right</em> — not every exercise is helpful for every type of sciatica, which is why a proper assessment matters.</p>

      <p>That said, these six movements are among the most commonly recommended for sciatic nerve pain, and most people find at least some of them helpful. Try them gently, and stop anything that significantly increases your pain or causes symptoms to travel further down the leg.</p>

      <h2>A quick note before you start</h2>

      <p>Sciatica is a symptom, not a diagnosis. It means something is irritating your sciatic nerve — and that something could be a disc bulge, joint restriction, tight piriformis muscle, or something else entirely. The exercises below are general in nature. If your pain is severe, getting worse, or accompanied by weakness or bowel and bladder changes, see a healthcare provider before attempting these. If you have not had your sciatica properly assessed, it is worth doing so — the right approach depends on the cause.</p>

      <h2>1. Piriformis stretch (figure-four)</h2>

      <p>The piriformis muscle sits deep in the buttock, right next to the sciatic nerve. When it is tight or in spasm, it can compress the nerve and cause or worsen sciatica symptoms. This stretch targets it directly.</p>

      <p><strong>How to do it:</strong> Lie on your back with both knees bent and feet flat on the floor. Cross your right ankle over your left knee, creating a figure-four shape. Gently draw your left knee toward your chest until you feel a stretch in the right buttock. Hold for 30 seconds, then switch sides. Repeat 2–3 times each side.</p>

      <p><strong>What you should feel:</strong> A stretch deep in the buttock of the crossed leg. Not pain shooting down the leg.</p>

      <h2>2. Knee-to-chest stretch</h2>

      <p>This gentle sciatica stretch helps decompress the lower lumbar spine and relieve some of the pressure that may be aggravating the sciatic nerve.</p>

      <p><strong>How to do it:</strong> Lie on your back with both knees bent. Gently draw one knee toward your chest with both hands and hold for 20–30 seconds. Lower and repeat on the other side. You can also draw both knees to your chest at the same time for a more general lower back release.</p>

      <p><strong>Tip:</strong> This is often a good first movement in the morning before getting out of bed.</p>

      <h2>3. Supine spinal rotation</h2>

      <p>A gentle rotational stretch for the lower back that can help ease stiffness and reduce nerve tension without loading the spine.</p>

      <p><strong>How to do it:</strong> Lie on your back with your knees bent. Keeping your shoulders flat on the floor, gently let both knees fall to one side. Hold for 20–30 seconds, breathing slowly. Bring your knees back to centre and repeat on the other side.</p>

      <p><strong>Go gently:</strong> If rotating toward one side significantly increases your pain, avoid that direction and stick to the more comfortable side for now.</p>

      <h2>4. Cat-cow</h2>

      <p>A classic movement that mobilises the entire spine, encourages fluid movement through the lumbar discs, and gently activates the deep core muscles. It is one of the best exercises for sciatica because it is low-load and can be modified easily.</p>

      <p><strong>How to do it:</strong> Start on all fours with your hands under your shoulders and knees under your hips. Breathe in, let your belly drop toward the floor, and lift your head and tailbone (cow). Breathe out, tuck your chin and tailbone, and round your back toward the ceiling (cat). Move slowly and rhythmically for 10–15 repetitions.</p>

      <h2>5. Bird-dog</h2>

      <p>This exercise builds stability in the deep core and lower back without compression — making it one of the more useful exercises for sciatica relief when the pain has started to ease a little.</p>

      <p><strong>How to do it:</strong> On all fours, brace your core gently, then slowly extend your right arm and left leg until both are roughly parallel with the floor. Hold for 3–5 seconds, then return and repeat on the other side. Aim for 8–10 repetitions on each side. Keep your back flat — avoid letting your hips rotate or your lower back arch.</p>

      <h2>6. Sciatic nerve floss</h2>

      <p>Nerve flossing (or neural mobilisation) is a technique that gently moves the sciatic nerve through its surrounding tissues, which can reduce neural tension and sensitivity. It should feel like a stretch — not sharp pain.</p>

      <p><strong>How to do it:</strong> Sit upright on a chair. Straighten one knee so your leg is extended in front of you, then gently flex your foot (toes toward you). Hold for 3–5 seconds, then relax the knee back down. Repeat on the other side. Do 10–15 repetitions each side, moving slowly and smoothly. If you notice a significant increase in symptoms down the leg, ease off the range and try again more gently.</p>

      <h2>Exercises and positions to avoid with sciatica</h2>

      <p>Just as some movements help, others can aggravate sciatic nerve pain — at least in the acute phase. Common ones to be cautious with include:</p>

      <ul>
        <li>Sitting for prolonged periods without getting up</li>
        <li>Heavy deadlifts or bent-over rows</li>
        <li>Full sit-ups or double leg raises</li>
        <li>Any movement that causes sharp pain to shoot into the leg</li>
      </ul>

      <p>This is not forever — once the nerve settles and you have addressed the underlying cause, most exercises can be reintroduced gradually. But in the acute stage, less is more.</p>

      <h2>How long will these exercises take to work?</h2>

      <p>There is no universal answer — it depends on how long you have had sciatica and what is causing it. Some people notice improvement within a few sessions of consistent gentle exercise. Others find that exercises alone are not enough, and that the underlying cause (a restricted joint, a disc bulge, tight piriformis) needs hands-on attention before the exercises become effective.</p>

      <p>If you have been doing sciatica stretches and exercises for a couple of weeks without improvement, that is a good signal to get a proper assessment rather than just adding more exercises to your routine.</p>

      <h2>When to see a chiropractor for sciatica</h2>

      <p>A <a href="/conditions/sciatica">chiropractic assessment for sciatica</a> will identify what is actually irritating your sciatic nerve — and from there, we can recommend the specific movements and approaches most likely to help <em>your</em> situation. This might include spinal adjustments to restore joint mobility, targeted soft tissue work on the piriformis or surrounding hip muscles, personalised exercise guidance, and advice on managing your symptoms day-to-day.</p>

      <p>If your sciatica is affecting your sleep, your work, or your ability to get around comfortably — do not just keep stretching and hoping for the best. Come and see us at <a href="/about">Banora Chiropractic</a> in Tweed Heads South. We will work out what is going on and help you get on top of it.</p>
    `,
    author: 'dr-paul-cater',
    publishDate: '2026-04-24',
    status: 'published' as const,
    category: 'Back Pain',
    tags: ['sciatica', 'sciatica exercises', 'sciatica stretches', 'sciatic nerve pain', 'lower back pain', 'piriformis stretch', 'nerve pain'],
    heroImage: '/images/clinic-adjustment-wide.webp',
    heroImageAlt: 'Chiropractor assessing a patient with lower back and sciatica pain',
    readTime: 7,
    relatedServices: ['chiropractic-adjustments', 'sports-chiropractic'],
    relatedConditions: ['sciatica', 'back-pain', 'hip-pain'],
    relatedPosts: ['understanding-back-pain', 'chiropractic-care-during-pregnancy'],
  },
  {
    slug: 'sciatica-during-pregnancy',
    title: 'Sciatica During Pregnancy: Why It Happens and What May Help',
    metaTitle: 'Sciatica During Pregnancy: Causes & Relief | Banora Chiropractic',
    metaDescription: 'Sciatica pain during pregnancy is common but not something you have to just put up with. Our Tweed Heads South chiropractors explain why it happens and what may help.',
    excerpt: 'Shooting pain down your leg during pregnancy? Sciatica is one of the most common complaints in the second and third trimester. Here is what is going on — and what may help.',
    content: `
      <p>Growing a baby is hard work. And somewhere between the morning sickness and the sleepless nights, many pregnant women develop another unwelcome companion: sciatica. That deep, shooting pain that starts in the lower back or buttock and travels down one leg.</p>

      <p>If this sounds familiar, you are not alone. Sciatica during pregnancy is very common — particularly from the second trimester onwards. The good news is that it is usually very manageable with the right approach, and you do not have to just push through it.</p>

      <h2>Why does sciatica happen during pregnancy?</h2>

      <p>A few things are happening at once that can irritate the sciatic nerve:</p>

      <p><strong>Your centre of gravity shifts.</strong> As your belly grows, your posture changes significantly. Your lower back curves more, your pelvis tilts forward, and your hips take on a different load. This can place pressure on the lumbar spine and sacroiliac joint — both of which sit close to the sciatic nerve roots.</p>

      <p><strong>Relaxin is doing its job — a little too well.</strong> During pregnancy, your body releases a hormone called relaxin that softens the ligaments around your pelvis to prepare for birth. This is necessary and helpful, but it also means your joints have less stability than usual. The sacroiliac joint in particular can become irritated and contribute to sciatica-like symptoms.</p>

      <p><strong>The uterus grows into your sciatic nerve's neighbourhood.</strong> In some pregnancies — particularly where the baby is positioned a certain way — the expanding uterus can directly compress the sciatic nerve or the nerves feeding into it, causing that familiar shooting pain into the buttock and leg.</p>

      <p><strong>Piriformis tightness.</strong> The piriformis muscle, which sits deep in the buttock right next to the sciatic nerve, often tightens during pregnancy as the body compensates for changing posture and weight distribution. When it goes into spasm, it can compress the nerve directly.</p>

      <h2>What does sciatica feel like during pregnancy?</h2>

      <p>Pregnancy sciatica typically presents as:</p>

      <ul>
        <li>A shooting, burning, or electric-shock pain that travels from the lower back or buttock into one leg</li>
        <li>Numbness or tingling in the leg, thigh, or foot</li>
        <li>Pain that worsens when sitting for long periods, rolling over in bed, or walking</li>
        <li>Deep buttock pain on one side</li>
        <li>Difficulty finding a comfortable sleeping position</li>
      </ul>

      <p>It is worth noting that not all leg pain during pregnancy is true sciatica. Round ligament pain, pelvic girdle pain (PGP), and sacroiliac joint dysfunction can all produce similar symptoms. Getting a proper assessment helps ensure you are managing the right thing — and the right way.</p>

      <h2>What may help sciatica during pregnancy</h2>

      <h3>Gentle stretches</h3>

      <p>Some of the most effective sciatica stretches for pregnancy are positions that open the hip and release the piriformis without putting pressure on the belly:</p>

      <p><strong>Seated figure-four stretch:</strong> Sit upright on a chair. Cross one ankle over the opposite knee. Gently lean forward from the hips (not the back) until you feel a stretch in the outer buttock. Hold for 30 seconds each side.</p>

      <p><strong>Cat-cow on all fours:</strong> A gentle spinal mobilisation that relieves lower back compression. Breathe in, let your belly drop and lift your head (cow). Breathe out, tuck your chin and round your back (cat). Repeat slowly 10–15 times.</p>

      <p><strong>Child's pose (modified):</strong> Kneel on the floor with your knees wide apart to accommodate your belly. Sit your hips back toward your heels and stretch your arms forward along the floor. Hold for 30–60 seconds.</p>

      <p>Always move slowly and stop anything that increases leg symptoms.</p>

      <h3>Movement and position changes</h3>

      <p>Prolonged sitting is one of the most common aggravators of pregnancy sciatica. Getting up and moving every 30–45 minutes — even just a short walk — can make a significant difference. When sitting, a small pillow behind the lower back helps maintain the lumbar curve. When sleeping, lying on your side with a pillow between your knees takes pressure off the pelvis and lower back.</p>

      <h3>Warm (not hot) heat</h3>

      <p>A warm heat pack applied to the lower back or buttock — not hot, and kept away from the abdomen — may help ease muscle tension contributing to sciatica pain. Avoid ice packs directly over the belly.</p>

      <h3>Chiropractic care during pregnancy</h3>

      <p>Chiropractic care is a common approach to managing <a href="/conditions/sciatica">sciatica</a> and <a href="/conditions/hip-pain">hip pain during pregnancy</a>. At Banora Chiropractic, we use gentle, pregnancy-safe techniques that do not require you to lie on your stomach. Treatment is adapted to each trimester and each individual.</p>

      <p>Care may include gentle sacroiliac and pelvic adjustments to restore joint alignment, soft tissue work on tight hip and piriformis muscles, guidance on positions and movements to avoid during flare-ups, and specific exercises tailored to pregnancy.</p>

      <p>Both Dr Paul and Dr James have experience caring for pregnant patients across all trimesters. We see many mums-to-be from Tweed Heads South, Banora Point, Kingscliff, and across the Tweed–Gold Coast area who come in specifically for pregnancy-related back, hip, and sciatic pain.</p>

      <h2>When to seek help sooner</h2>

      <p>Most pregnancy sciatica is manageable and resolves after birth. But do seek care promptly if you experience:</p>

      <ul>
        <li>Significant weakness in one leg</li>
        <li>Any loss of bladder or bowel control</li>
        <li>Pain that is rapidly worsening rather than fluctuating</li>
        <li>Sciatica on both sides simultaneously</li>
      </ul>

      <p>These are less common but warrant prompt assessment by your midwife, obstetrician, or GP as well as your chiropractor.</p>

      <h2>Will sciatica go away after birth?</h2>

      <p>For most women, yes — pregnancy sciatica significantly improves or resolves after birth as posture normalises and relaxin levels drop. However, if the underlying cause (a disc issue, for example) is not just pregnancy-related, it may persist. Getting it properly assessed and managed during pregnancy gives you the best chance of a smooth recovery postpartum.</p>

      <p>If you are pregnant and struggling with sciatica or hip pain, we would love to help. <a href="/contact">Get in touch</a> or book online — we will take good care of you.</p>
    `,
    author: 'dr-paul-cater',
    publishDate: '2026-04-24',
    status: 'published' as const,
    category: 'Pregnancy',
    tags: ['sciatica', 'pregnancy', 'sciatica during pregnancy', 'pregnant and sciatica', 'hip pain pregnancy', 'pregnancy back pain', 'piriformis', 'pelvic pain'],
    heroImage: '/images/clinic-adjustment-wide.webp',
    heroImageAlt: 'Pregnant woman receiving gentle chiropractic care for sciatica and back pain',
    readTime: 6,
    relatedServices: ['chiropractic-adjustments', 'pregnancy-chiropractic'],
    relatedConditions: ['sciatica', 'back-pain', 'hip-pain'],
    relatedPosts: ['sciatica-exercises-and-stretches', 'chiropractic-care-during-pregnancy'],
  },
  {
    slug: 'cervicogenic-headache-causes-and-treatment',
    title: 'Cervicogenic Headache: What It Is, Why It Happens, and How Chiropractic May Help',
    metaTitle: 'Cervicogenic Headache: Causes & Chiropractic Treatment | Banora Chiropractic',
    metaDescription: 'Cervicogenic headaches start in the neck — not the head. Our Tweed Heads South chiropractors explain the causes, symptoms, and how chiropractic headache treatment may help.',
    excerpt: 'If your headaches always seem to start at the base of your skull, your neck may be the real culprit. Here is what cervicogenic headache is and what may help.',
    content: `
      <p>Not all headaches are created equal. Some start in the blood vessels. Some are triggered by hormones or food. But a significant number — far more than most people realise — actually originate in the neck. These are called cervicogenic headaches, and they are one of the most common types we see at Banora Chiropractic.</p>

      <p>If you have ever noticed that your headaches always seem to start at the back of your head, get worse when you turn your neck, or come on after a long day at a desk — there is a good chance your neck is involved.</p>

      <h2>What is a cervicogenic headache?</h2>

      <p>The word "cervicogenic" simply means "originating from the cervical spine" — the neck. A cervicogenic headache is a headache that is caused by a problem in the upper neck: stiff or restricted joints, tight muscles, or irritated nerves that refer pain up into the skull.</p>

      <p>The pain usually starts at the base of the skull (the occipital region) and can spread forward to the forehead, temples, or behind one eye. It is often felt on one side of the head. Unlike tension headaches, which tend to feel like a band of pressure around the head, cervicogenic headache pain tends to feel like it is travelling — starting at the back and moving forward.</p>

      <h2>What causes cervicogenic headaches?</h2>

      <p>The upper three cervical vertebrae (C1, C2, and C3) share nerve pathways with the nerves that supply parts of the head and face. When these joints become restricted or irritated, they can refer pain upward into the skull — producing what feels like a headache, but is actually coming from the neck.</p>

      <p>Common contributors include:</p>

      <ul>
        <li><strong>Joint restriction in the upper cervical spine</strong> — stiff or poorly moving joints at C1, C2, or C3 are a primary driver of cervicogenic headache</li>
        <li><strong>Forward head posture</strong> — for every centimetre your head sits forward of your shoulders, the effective load on your neck roughly doubles. This compresses the upper cervical joints and tightens the suboccipital muscles</li>
        <li><strong>Suboccipital muscle tension</strong> — the small muscles at the base of the skull are often chronically tight in people with desk jobs or heavy screen use</li>
        <li><strong>Old whiplash or neck injury</strong> — prior trauma to the neck can leave residual joint restriction that contributes to ongoing headaches</li>
        <li><strong>Sustained postures</strong> — driving for long periods, working at a poorly set up workstation, or sleeping in an awkward position</li>
      </ul>

      <h2>How do I know if my headache is cervicogenic?</h2>

      <p>There is no single test that definitively diagnoses cervicogenic headache, but some features that suggest a cervical origin include:</p>

      <ul>
        <li>Pain that starts at the base of the skull and spreads toward the forehead or eye</li>
        <li>Headache triggered or worsened by certain neck positions or movements</li>
        <li>Reduced neck range of motion on the side of the headache</li>
        <li>Tenderness at the base of the skull or upper neck when pressed</li>
        <li>Headache that follows a predictable pattern linked to posture or activity</li>
        <li>Pain that is usually one-sided and does not switch sides</li>
      </ul>

      <p>Cervicogenic headaches can be confused with tension headaches, migraines, and occipital neuralgia. A thorough assessment by a chiropractor or other qualified practitioner can help clarify what you are dealing with.</p>

      <h2>How chiropractic care may help cervicogenic headache</h2>

      <p>Chiropractic care is one of the most well-researched approaches to cervicogenic headache treatment. Because the headache originates in the neck, addressing the dysfunction in the neck is a logical approach — and research supports this.</p>

      <p>At Banora Chiropractic, assessment and treatment for cervicogenic headache typically includes:</p>

      <ul>
        <li><strong>Cervical and upper thoracic adjustments</strong> — gentle, targeted mobilisation of restricted joints in the upper neck to restore normal movement and reduce referred pain</li>
        <li><strong>Suboccipital soft tissue work</strong> — manual release of the tight muscles at the base of the skull that often contribute to headache symptoms</li>
        <li><strong>Postural assessment and advice</strong> — identifying the habits and positions that are loading your upper neck, and addressing them</li>
        <li><strong>Specific neck exercises</strong> — strengthening the deep cervical flexors and improving neck mobility to support lasting improvement</li>
      </ul>

      <p>Many patients notice a reduction in headache frequency and intensity with consistent chiropractic care. Results vary depending on how long the issue has been present and what is driving it, but cervicogenic headache is one of the conditions that tends to respond well.</p>

      <h2>What about tension headaches and migraines?</h2>

      <p>Tension-type headaches often have a cervical component — tight neck muscles and restricted upper neck joints can contribute even when the headache is not purely cervicogenic. Similarly, many migraines are preceded by or associated with neck stiffness, suggesting cervical involvement.</p>

      <p>If you have been managing <a href="/conditions/headaches-migraines">headaches or migraines</a> with medication alone and finding it only partially helpful, it may be worth exploring whether the neck is a contributing factor. A chiropractic assessment can help answer that question.</p>

      <h2>Self-care between appointments</h2>

      <p>In addition to hands-on care, some things that may help manage cervicogenic headaches day-to-day:</p>

      <ul>
        <li><strong>Chin tucks:</strong> Sitting upright, gently draw your chin straight back (not down). Hold for 5 seconds, relax, repeat 10 times. This engages the deep cervical flexors and counteracts forward head posture.</li>
        <li><strong>Upper trap stretch:</strong> Drop one ear toward your shoulder and gently apply light pressure with the same-side hand. Hold 30 seconds, repeat other side. Helps release lateral neck tension.</li>
        <li><strong>Screen height:</strong> The top of your monitor should be at eye level. Looking down — even slightly — adds significant load to the upper cervical spine over a full day.</li>
        <li><strong>Regular movement breaks:</strong> Every 45–60 minutes, get up, move your neck gently through range, and reset your posture.</li>
      </ul>

      <p>If you are dealing with recurring headaches and have not had your neck properly assessed, we would encourage you to come in. We can usually tell you fairly quickly whether the neck is involved — and if it is, that is actually good news, because it is something we can address. <a href="/contact">Book an appointment</a> at Banora Chiropractic in Tweed Heads South.</p>
    `,
    author: 'dr-james-shipway',
    publishDate: '2026-04-24',
    status: 'published' as const,
    category: 'Neck Pain',
    tags: ['cervicogenic headache', 'headache treatment', 'chiropractic headache treatment', 'tension headache', 'neck pain', 'headaches', 'forward head posture'],
    heroImage: '/images/hero-back-neck.webp',
    heroImageAlt: 'Person with neck pain and headache holding the base of their skull',
    readTime: 7,
    relatedServices: ['chiropractic-adjustments', 'posture-correction'],
    relatedConditions: ['headaches-migraines', 'neck-pain'],
    relatedPosts: ['headache-or-migraine-how-to-tell-the-difference', 'why-your-posture-matters-more-than-you-think'],
  },
  {
    slug: 'lower-back-pain-exercises',
    title: 'Lower Back Pain Exercises: 7 Movements That May Help You Feel Better',
    metaTitle: 'Lower Back Pain Exercises That Actually Help | Banora Chiropractic',
    metaDescription: 'Lower back pain exercises recommended by our Tweed Heads South chiropractors. Safe, practical movements for lower back pain relief — with guidance on what to avoid.',
    excerpt: 'Lower back pain responds well to the right movement — but the wrong exercises can make things worse. Here are seven that are commonly recommended and why they work.',
    content: `
      <p>When your lower back is playing up, the temptation is to rest. And while a day or two of reduced activity can help in the very acute phase, staying still for too long usually makes lower back pain worse, not better. Movement — the right movement — is one of the best things you can do for your back.</p>

      <p>The challenge is knowing which exercises are actually helpful, and which might aggravate what is already uncomfortable. This list covers seven commonly recommended lower back pain exercises that most people find beneficial — along with some guidance on what to avoid and when to get a proper assessment.</p>

      <h2>Before you start</h2>

      <p>Lower back pain has many causes — joint restriction, disc irritation, muscle strain, lumbar facet issues — and the best exercises depend on what is actually going on in your spine. These movements are general and appropriate for most types of uncomplicated lower back pain. If your pain is severe, radiating into your legs, or accompanied by numbness, weakness, or bladder changes, see a healthcare professional before beginning any exercise program.</p>

      <h2>1. Knee-to-chest stretch</h2>

      <p>A gentle decompression exercise that reduces lumbar load and eases stiffness. Great first thing in the morning before getting out of bed.</p>

      <p><strong>How:</strong> Lie on your back with both knees bent. Draw one knee toward your chest with both hands and hold 20–30 seconds. Repeat on the other side, then draw both knees to your chest simultaneously. Do 2–3 repetitions each side.</p>

      <h2>2. Pelvic tilts</h2>

      <p>A subtle but effective movement that activates the deep core muscles and gently mobilises the lumbar spine without loading it. A foundational lower back pain exercise.</p>

      <p><strong>How:</strong> Lie on your back with knees bent and feet flat on the floor. Gently flatten your lower back against the floor by tightening your abdominals and tilting your pelvis — think of drawing your belly button toward your spine. Hold 5 seconds, release. Repeat 10–15 times.</p>

      <h2>3. Bridges</h2>

      <p>Bridges activate the glutes and hamstrings — two muscle groups that are often weak or switched off in people with persistent lower back pain. Strengthening them reduces the load on the lumbar spine.</p>

      <p><strong>How:</strong> Lie on your back with knees bent and feet hip-width apart. Press through your heels and lift your hips until your body forms a straight line from shoulders to knees. Hold 3–5 seconds, lower slowly. Repeat 10–15 times. Avoid letting your lower back arch excessively at the top.</p>

      <h2>4. Cat-cow</h2>

      <p>A rhythmic spinal mobilisation that moves the lumbar spine through flexion and extension, encourages disc hydration, and helps ease morning stiffness. One of the most universally useful exercises for lower back pain.</p>

      <p><strong>How:</strong> Start on all fours, hands under shoulders, knees under hips. Breathe in, let your belly drop and lift your tailbone (cow). Breathe out, round your back toward the ceiling and tuck your pelvis (cat). Move slowly for 10–15 repetitions.</p>

      <h2>5. Bird-dog</h2>

      <p>This challenges core stability without loading the lumbar spine — making it ideal for lower back pain rehabilitation. It trains the back extensors and core to work together.</p>

      <p><strong>How:</strong> On all fours, brace your core gently. Slowly extend your right arm and left leg until both are roughly parallel with the floor. Hold 3–5 seconds, return slowly. Alternate sides for 8–10 repetitions each. Keep your hips level — do not rotate.</p>

      <h2>6. Child's pose</h2>

      <p>A passive stretch for the lower back, hips, and thoracic spine that most people find immediately relieving.</p>

      <p><strong>How:</strong> Kneel on the floor and sit your hips back toward your heels. Extend your arms forward along the floor and let your forehead rest down. Hold 30–60 seconds, breathing slowly and allowing the lower back to release. If your hips do not reach your heels, place a folded blanket between them.</p>

      <h2>7. Walking</h2>

      <p>Simple but genuinely one of the most effective lower back pain exercises. Walking loads the spine gently and rhythmically, activates the core and glutes, and promotes the natural movement your spine is designed for. It is also one of the most sustainable — you do not need any equipment or a gym membership.</p>

      <p>Aim for 20–30 minutes of comfortable walking daily. If walking aggravates your pain, start shorter and build up gradually.</p>

      <h2>Exercises to avoid in the acute phase</h2>

      <p>When your lower back is flared up, some movements tend to make things worse:</p>

      <ul>
        <li>Heavy deadlifts or squats with load</li>
        <li>Full sit-ups or crunches (these load the lumbar flexors aggressively)</li>
        <li>Double leg raises from lying</li>
        <li>Any movement that sends pain shooting into the leg</li>
      </ul>

      <p>This is not permanent avoidance — once the pain settles and the underlying cause is addressed, most exercises can be reintroduced. But pushing through aggravating movements in the acute phase tends to prolong recovery.</p>

      <h2>How long before exercises help lower back pain?</h2>

      <p>Most people notice some improvement in mobility and pain within one to two weeks of consistent, appropriate exercise. If you have been doing these movements daily for two weeks without improvement, that is a signal to get a proper assessment rather than simply adding more exercises.</p>

      <p>Sometimes what feels like a straightforward muscle strain has a joint or disc component that needs hands-on care before exercises become effective. A <a href="/conditions/back-pain">chiropractic assessment for lower back pain</a> can identify what is actually going on — and from there we can personalise your exercise plan to match your specific situation.</p>

      <p>We see people with lower back pain every day at Banora Chiropractic in Tweed Heads South. If your back has been bothering you for more than a week or two, <a href="/contact">come in and see us</a>. We will give you a clear picture of what is going on and a practical plan to address it.</p>
    `,
    author: 'dr-james-shipway',
    publishDate: '2026-04-24',
    status: 'published' as const,
    category: 'Back Pain',
    tags: ['lower back pain', 'back pain exercises', 'lower back pain exercises', 'back pain relief', 'lumbar pain', 'back stretches', 'core exercises'],
    heroImage: '/images/pexels-karola-g-4506108.webp',
    heroImageAlt: 'Person doing lower back pain exercises on a yoga mat',
    readTime: 7,
    relatedServices: ['chiropractic-adjustments', 'posture-correction'],
    relatedConditions: ['back-pain', 'sciatica', 'hip-pain'],
    relatedPosts: ['desk-workers-guide-to-a-healthier-back', 'sciatica-exercises-and-stretches'],
  },
  {
    slug: 'forward-head-posture-causes-and-exercises',
    title: 'Forward Head Posture: What It Is, Why It Matters, and How to Fix It',
    metaTitle: 'Forward Head Posture: Causes, Effects & Exercises | Banora Chiropractic',
    metaDescription: 'Forward head posture causes neck pain, headaches, and upper back tension. Our Tweed Heads South chiropractors explain how to correct bad posture with exercises and care.',
    excerpt: 'Every centimetre your head sits forward of your shoulders adds significant load to your neck. Here is what forward head posture is doing to your body — and what you can do about it.',
    content: `
      <p>Take a moment to notice where your head is right now. Is it sitting directly over your shoulders — or is it jutting forward, chin out, as you read this screen?</p>

      <p>If it is the latter, you are in good company. Forward head posture is one of the most common postural problems we see at Banora Chiropractic, and it is becoming increasingly prevalent thanks to our screen-dominated lives. It is also responsible for far more discomfort than most people realise.</p>

      <h2>What is forward head posture?</h2>

      <p>Forward head posture (sometimes called "text neck" or "tech neck") is a postural pattern where the head sits forward of the body's centre of gravity rather than directly above the shoulders. In a neutral, well-aligned posture, your ear should line up over your shoulder when viewed from the side. In forward head posture, the ear is noticeably in front of the shoulder.</p>

      <p>This might not sound like a big deal, but the physics are significant. The average adult head weighs around 4.5 to 5 kilograms. In a neutral position, the muscles of the neck can support this comfortably. But for every 2.5 centimetres that the head moves forward, the effective load on the neck roughly doubles. At a 7.5 centimetre forward position — not uncommon — your neck muscles are effectively managing 20–25 kilograms of force.</p>

      <p>All day. Every day.</p>

      <h2>What causes forward head posture?</h2>

      <p>The causes are mostly modern and mostly habitual:</p>

      <ul>
        <li><strong>Prolonged screen use</strong> — leaning toward monitors, looking down at phones and laptops, and the slow drift toward screens that most of us do without realising</li>
        <li><strong>Poorly set up workstations</strong> — a screen that is too low, a chair that is too high or too low, or working from a laptop without a separate monitor</li>
        <li><strong>Driving</strong> — leaning forward to see better, or simply the habitual position many people adopt at the wheel</li>
        <li><strong>Carrying heavy bags</strong> — particularly school bags or backpacks worn on one shoulder, which shifts the body's balance and affects head position</li>
        <li><strong>Weak deep cervical flexors</strong> — the small muscles at the front of the neck that hold the head in its correct position often become weak over time, allowing the head to drift forward</li>
      </ul>

      <h2>What does forward head posture do to your body?</h2>

      <p>Beyond the cosmetic appearance of a protruding chin and rounded upper back, forward head posture can contribute to a range of symptoms:</p>

      <ul>
        <li><strong>Neck pain and stiffness</strong> — chronic overloading of the posterior neck muscles and cervical joints</li>
        <li><strong>Headaches</strong> — particularly cervicogenic headaches that originate from the upper cervical spine and radiate toward the skull</li>
        <li><strong>Upper back and shoulder tension</strong> — the upper trapezius and levator scapulae work overtime to support the forward-weighted head</li>
        <li><strong>Jaw pain</strong> — changes in head and neck position can affect the temporomandibular joint (jaw)</li>
        <li><strong>Reduced lung capacity</strong> — in significant cases, forward head posture and the associated rounded upper back can restrict chest expansion</li>
      </ul>

      <h2>Can forward head posture be corrected?</h2>

      <p>Yes — and the earlier it is addressed, the easier it is. Forward head posture is a habit and an adaptation. Like most postural habits, it can be changed with consistent, targeted effort. For longer-standing postural changes, hands-on care combined with exercise tends to produce the best results.</p>

      <h2>Exercises to help correct forward head posture</h2>

      <h3>1. Chin tucks</h3>

      <p>The single most important exercise for forward head posture. It directly activates the deep cervical flexors — the muscles that hold your head in its correct position.</p>

      <p><strong>How:</strong> Sitting upright, gently draw your chin straight back — as if making a double chin. Do not tilt your head up or down. Hold 5 seconds, release. Repeat 10–15 times. Do this several times throughout the day, especially after prolonged screen use. You can also do this lying on your back for a more gravity-assisted version.</p>

      <h3>2. Upper trapezius stretch</h3>

      <p><strong>How:</strong> Sitting tall, drop your right ear toward your right shoulder. Place your right hand lightly on top of your head for a gentle overpressure. Hold 30 seconds. Repeat on the other side. This releases the chronically tight lateral neck muscles that accompany forward head posture.</p>

      <h3>3. Doorway chest stretch</h3>

      <p>Forward head posture is usually accompanied by a tight chest and rounded shoulders. Opening the chest helps bring the shoulders back and supports better head position.</p>

      <p><strong>How:</strong> Stand in a doorway with your arms at 90 degrees (elbows bent, forearms on the doorframe). Step one foot forward and gently lean through the doorway until you feel a stretch across the chest. Hold 30 seconds, repeat 2–3 times.</p>

      <h3>4. Wall angels</h3>

      <p>This retrains proper shoulder blade movement and upper back mobility — both of which are important for sustainable posture correction.</p>

      <p><strong>How:</strong> Stand with your back flat against a wall, feet a few centimetres from the base. Press your lower back, upper back, and head gently into the wall. Raise your arms to form a "W" shape, then slowly slide them up into a "Y" shape — keeping your arms and elbows in contact with the wall throughout. Repeat 10–12 times.</p>

      <h2>What about chiropractic care for posture correction?</h2>

      <p>Exercise is essential, but forward head posture often involves joint restrictions in the cervical and thoracic spine that reduce your ability to achieve and maintain neutral posture — no matter how many exercises you do. Addressing these restrictions directly through <a href="/services/posture-correction">chiropractic posture correction</a> allows the exercises to work more effectively.</p>

      <p>At Banora Chiropractic, we assess your entire spinal alignment and identify the specific areas contributing to your postural pattern. From there, we combine targeted adjustments with a personalised exercise program — and practical advice on workstation setup, sleeping position, and daily habits that either help or hinder your progress.</p>

      <p>If you have been dealing with <a href="/conditions/neck-pain">neck pain</a>, recurring <a href="/conditions/headaches-migraines">headaches</a>, or upper back tension that you suspect is posture-related, a chiropractic assessment is a good place to start. We see patients for posture correction regularly at our Tweed Heads South clinic. <a href="/contact">Book in</a> and let us take a proper look.</p>
    `,
    author: 'dr-james-shipway',
    publishDate: '2026-04-24',
    status: 'published' as const,
    category: 'Posture',
    tags: ['forward head posture', 'posture correction', 'tech neck', 'text neck', 'neck pain', 'posture exercises', 'how to fix posture', 'bad posture'],
    heroImage: '/images/pexels-karola-g-4506108.webp',
    heroImageAlt: 'Person with forward head posture looking at a phone screen',
    readTime: 8,
    relatedServices: ['posture-correction', 'chiropractic-adjustments'],
    relatedConditions: ['neck-pain', 'headaches-migraines', 'shoulder-pain'],
    relatedPosts: ['why-your-posture-matters-more-than-you-think', 'desk-workers-guide-to-a-healthier-back'],
  },
];

// Helper functions

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return blogPosts
    .filter(p => p.category === category)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

export function getRecentPosts(count: number = 3, excludeSlug?: string): BlogPost[] {
  return blogPosts
    .filter(p => p.slug !== excludeSlug)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, count);
}

export function getAllCategories(): BlogCategory[] {
  return ['Back Pain', 'Neck Pain', 'Posture', 'Sports', 'Pregnancy', 'Wellness', 'Lifestyle'];
}

export function getCategorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}


 
 
 
