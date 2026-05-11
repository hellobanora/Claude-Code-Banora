export const clinic = {
  name: 'Banora Chiropractic',
  legalName: 'Banora Chiropractic',
  phone: '(07) 5599 2322',
  phoneFull: '+61755992322',
  email: 'info@banorachiropractic.com.au',
  website: 'https://www.banorachiropractic.com.au',
  bookingUrl: 'https://www.iconpractice.com/ob/7138/banorachiropractic/245386/2',
  address: {
    street: '2/44 Greenway Drive',
    suburb: 'Tweed Heads South',
    state: 'NSW',
    postcode: '2486',
    full: '2/44 Greenway Drive, Tweed Heads South NSW 2486',
  },
  geo: {
    latitude: -28.1894,
    longitude: 153.5375,
  },
  hours: [
    { day: 'Monday', open: '8:30am', close: '6:00pm' },
    { day: 'Tuesday', open: '8:30am', close: '6:00pm' },
    { day: 'Wednesday', open: '2:00pm', close: '6:00pm' },
    { day: 'Thursday', open: '8:30am', close: '6:00pm' },
    { day: 'Friday', open: '12:00pm', close: '2:00pm' },
    { day: 'Saturday', open: '8:00am', close: '12:00pm' },
    { day: 'Sunday', open: 'Closed', close: 'Closed' },
  ],
  hoursSchema: [
    'Mo 08:30-18:00',
    'Tu 08:30-18:00',
    'We 14:00-18:00',
    'Th 08:30-18:00',
    'Fr 12:00-14:00',
    'Sa 08:00-12:00',
  ],
  social: {
    facebook: 'https://www.facebook.com/banorachiro',
    instagram: 'https://www.instagram.com/banorachiropractic',
  },
  parking: 'On-site parking available, ground level, no steps',
  accessibility: 'Wheelchair accessible, no steps',
  landmark: 'Between Reece Plumbing and Border Bikes',
  payment: ['HICAPS', 'EFTPOS', 'EPC Medicare', 'DVA', 'WorkCover', 'Insurance'],
  formspreeEndpoint: 'https://formspree.io/f/mpqjeego',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3523.8!2d153.537!3d-28.189!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBanora+Chiropractic!5e0!3m2!1sen!2sau!4v1',
};

export const practitioners = [
  {
    name: 'Dr James Shipway',
    slug: 'dr-james-shipway',
    photo: '/images/dr-james-shipway-v2.webp',
    qualifications: 'B.Sc.Chiro. & M.Chiro',
    role: 'Chiropractor & Co-founder',
    initials: 'JS',
    techniques: ['Diversified', 'Thompson Drop-Piece', 'Sacro-Occipital Technique (SOT)', 'Soft Tissue Therapy', 'Arthrostim', 'Pregnancy', 'Sports Injuries'],
    bio: 'Dr James Shipway brings extensive experience and a genuine passion for helping people move and feel better. With qualifications in both science and chiropractic, James takes a thorough, evidence-based approach to care. He works with patients managing both acute and chronic conditions — from a sudden injury to pain that has been building for years — and tailors his approach to where you are right now. James has a special interest in sciatica, headaches, and neck pain, alongside family chiropractic, sports injuries, and posture correction. Originally based in Sydney, James relocated to the Tweed Coast eight years ago and has loved every minute of it. Over lunch you will likely find him at the gym or down at the beach, and on weekends he enjoys spending time with his wife and four children.',
    shortBio: 'Experienced chiropractor using Diversified, Thompson, Soft Tissue Therapy, and Arthrostim techniques.',
  },
  {
    name: 'Dr Paul Cater',
    slug: 'dr-paul-cater',
    photo: '/images/dr-paul-cater-v2.webp',
    qualifications: 'B.Sc.Chiro. & M.Chiro',
    role: 'Chiropractor & Co-founder',
    initials: 'PC',
    techniques: ['Diversified', 'Gonstead', 'Thompson Drop-Piece', 'Sacro-Occipital Technique (SOT)', 'Pregnancy & Paediatric-Specific'],
    bio: 'Dr Paul Cater is the founder and principal chiropractor at Banora Chiropractic, bringing over 20 years of experience helping the Tweed Heads community move, feel, and live better. Paul\'s clinical interests cover the full spectrum of family care — from acute spinal pain and dysfunction, posture, and sports injuries through to supporting older patients to stay active and independent, and caring for pregnant women and children of all ages. He takes time to understand each patient\'s story, ensuring everyone leaves with a clear picture of their condition and a confident path forward. Outside the clinic, Paul is most at home in the water — surfing, foiling, kiteboarding, and diving are all fair game. When the family escapes the Tweed Coast, snow trips are a firm favourite.',
    shortBio: 'Founder of Banora Chiropractic with a passion for family care — from acute spinal pain and sports injuries to pregnancy, paediatrics, and healthy ageing.',
  },
];

export const pricing = {
  newPatient: { price: 100, studentChild: 92, duration: '30-45 minutes' },
  regularAdjustment: { price: 72, studentChild: 62, duration: '15 minutes' },
  babyNewborn: { priceFrom: 62, initial: 92, followUp: 62, duration: 'Gentle assessment' },
};
