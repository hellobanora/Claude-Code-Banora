/**
 * Reference "Normal" posture silhouette shown beside the patient's photo in the
 * summary report. AP and lateral variants. Modelled on the PostureScreen
 * grey-figure visual with anatomical reference dots and the green plumb line.
 */
export function NormalSilhouette({ view }: { view: 'ap' | 'lateral' }) {
  return view === 'ap' ? <APNormal /> : <LateralNormal />;
}

function APNormal() {
  return (
    <svg viewBox="0 0 80 200" className="h-40 w-20" aria-label="Normal anterior posture reference">
      {/* Plumb line */}
      <line x1="40" y1="5" x2="40" y2="195" stroke="#2C8A3B" strokeWidth="1.2" />
      {/* Body silhouette — simplified figure */}
      <g fill="#cdd5dd" stroke="#9aa5b2" strokeWidth="0.6">
        <ellipse cx="40" cy="20" rx="9" ry="11" />               {/* head */}
        <rect x="36" y="29" width="8" height="6" rx="2" />        {/* neck */}
        <path d="M22 35 L58 35 L62 95 L18 95 Z" />                {/* torso */}
        <rect x="22" y="95" width="36" height="10" rx="2" />      {/* hips */}
        <rect x="25" y="105" width="12" height="70" rx="3" />     {/* left leg */}
        <rect x="43" y="105" width="12" height="70" rx="3" />     {/* right leg */}
        <rect x="24" y="175" width="14" height="6" rx="2" />      {/* left foot */}
        <rect x="42" y="175" width="14" height="6" rx="2" />      {/* right foot */}
      </g>
      {/* Anatomical reference dots (yellow, matching PostureScreen) */}
      <g fill="#FFD232" stroke="#806400" strokeWidth="0.4">
        <circle cx="36" cy="18" r="1.4" />
        <circle cx="44" cy="18" r="1.4" />
        <circle cx="25" cy="38" r="1.4" />
        <circle cx="55" cy="38" r="1.4" />
        <circle cx="25" cy="98" r="1.4" />
        <circle cx="55" cy="98" r="1.4" />
        <circle cx="31" cy="145" r="1.4" />
        <circle cx="49" cy="145" r="1.4" />
        <circle cx="31" cy="178" r="1.4" />
        <circle cx="49" cy="178" r="1.4" />
      </g>
    </svg>
  );
}

function LateralNormal() {
  return (
    <svg viewBox="0 0 80 200" className="h-40 w-20" aria-label="Normal lateral posture reference">
      <line x1="40" y1="5" x2="40" y2="195" stroke="#2C8A3B" strokeWidth="1.2" />
      <g fill="#cdd5dd" stroke="#9aa5b2" strokeWidth="0.6">
        {/* Head with slight forward profile */}
        <path d="M34 10 Q50 10 50 22 Q50 32 42 33 L36 33 Q32 28 32 22 Q32 14 34 10 Z" />
        {/* Neck */}
        <path d="M38 32 L44 32 L42 40 L38 40 Z" />
        {/* Torso — slight curve */}
        <path d="M36 40 Q30 60 32 90 L48 90 Q50 60 44 40 Z" />
        {/* Pelvis */}
        <rect x="34" y="90" width="14" height="10" rx="2" />
        {/* Leg */}
        <rect x="36" y="100" width="10" height="78" rx="3" />
        {/* Foot — profile */}
        <path d="M32 178 L52 178 L52 184 L32 184 Z" />
      </g>
      <g fill="#FFD232" stroke="#806400" strokeWidth="0.4">
        <circle cx="42" cy="22" r="1.5" />   {/* tragus */}
        <circle cx="40" cy="40" r="1.5" />   {/* acromion */}
        <circle cx="40" cy="95" r="1.5" />   {/* hip */}
        <circle cx="40" cy="140" r="1.5" />  {/* knee */}
        <circle cx="40" cy="178" r="1.5" />  {/* ankle */}
      </g>
    </svg>
  );
}
