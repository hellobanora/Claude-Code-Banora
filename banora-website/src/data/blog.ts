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
    category: 'Posture',
    tags: ['desk workers', 'posture', 'ergonomics', 'lower back', 'office workers'],
    heroImage: '/images/pexels-karola-g-4506108.jpg',
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
    category: 'Back Pain',
    tags: ['back pain', 'lower back', 'spine health', 'when to see a chiropractor'],
    heroImage: '/images/pexels-kindelmedia-7298427.jpg',
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
    category: 'Posture',
    tags: ['posture', 'posture correction', 'ergonomics', 'spine health', 'desk posture'],
    heroImage: '/images/pexels-shvetsa-4226205.jpg',
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
    category: 'Sports',
    tags: ['warm-up', 'injury prevention', 'sports', 'exercise', 'surfing', 'gym', 'Gold Coast'],
    heroImage: '/images/pexels-airamdphoto-29881488.jpg',
    heroImageAlt: 'Woman warming up and stretching before exercise',
    readTime: 5,
    relatedServices: ['sports-chiropractic', 'chiropractic-adjustments'],
    relatedConditions: ['back-pain', 'shoulder-pain'],
    relatedPosts: ['desk-workers-guide-to-a-healthier-back', 'understanding-back-pain'],
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
