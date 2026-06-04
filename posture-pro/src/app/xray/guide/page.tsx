'use client';

// ═══════════════════════════════════════════════════════════════
// SpineView — Cervical Lateral Landmark Placement Guide
// Visual reference showing exactly where each of the 17 points goes.
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import Link from 'next/link';

// ─── Landmark data ───────────────────────────────────────────────

interface GuideLandmark {
  id: string;
  label: string;
  cx: number;
  cy: number;
  type: 'posterior' | 'anterior' | 'atlas';
  description: string;
}

// All coordinates are in the 340×620 SVG viewBox.
// Anterior = left side, Posterior = right side (standard X-ray orientation).
// Vertebral body posterior face x ≈ 210; anterior face x ≈ 105.
const LANDMARKS: GuideLandmark[] = [
  // ── C1 (Atlas) ──────────────────────────────────────────────
  {
    id: 'C1_post', label: 'C1 Post. Arch', cx: 248, cy: 112,
    type: 'atlas',
    description: 'Posterior tubercle of the atlas ring — the most posterior point of the C1 bony ring, sitting just behind the spinal canal.',
  },
  // ── C2 posterior ────────────────────────────────────────────
  {
    id: 'C2_sup_post', label: 'C2 Sup-Post', cx: 210, cy: 147,
    type: 'posterior',
    description: 'Superior-posterior corner of C2 vertebral body — top-back corner where the posterior cortex meets the superior endplate.',
  },
  {
    id: 'C2_inf_post', label: 'C2 Inf-Post', cx: 210, cy: 200,
    type: 'posterior',
    description: 'Inferior-posterior corner of C2 — bottom-back corner of the C2 body.',
  },
  // ── C2 anterior (for AHC measurement) ───────────────────────
  {
    id: 'C2_sup_ant', label: 'C2 Sup-Ant', cx: 108, cy: 147,
    type: 'anterior',
    description: 'Superior-anterior corner of C2 — top-front corner of the C2 body (front of the dens base). Used with C7 inferior-anterior to measure Anterior Head Carriage.',
  },
  {
    id: 'C2_inf_ant', label: 'C2 Inf-Ant', cx: 108, cy: 200,
    type: 'anterior',
    description: 'Inferior-anterior corner of C2 — bottom-front corner of the C2 body.',
  },
  // ── C3 ──────────────────────────────────────────────────────
  {
    id: 'C3_sup_post', label: 'C3 Sup-Post', cx: 210, cy: 213,
    type: 'posterior',
    description: 'Superior-posterior corner of C3 vertebral body.',
  },
  {
    id: 'C3_inf_post', label: 'C3 Inf-Post', cx: 210, cy: 260,
    type: 'posterior',
    description: 'Inferior-posterior corner of C3 vertebral body.',
  },
  // ── C4 ──────────────────────────────────────────────────────
  {
    id: 'C4_sup_post', label: 'C4 Sup-Post', cx: 210, cy: 273,
    type: 'posterior',
    description: 'Superior-posterior corner of C4 vertebral body.',
  },
  {
    id: 'C4_inf_post', label: 'C4 Inf-Post', cx: 210, cy: 320,
    type: 'posterior',
    description: 'Inferior-posterior corner of C4 vertebral body.',
  },
  // ── C5 ──────────────────────────────────────────────────────
  {
    id: 'C5_sup_post', label: 'C5 Sup-Post', cx: 210, cy: 333,
    type: 'posterior',
    description: 'Superior-posterior corner of C5 vertebral body.',
  },
  {
    id: 'C5_inf_post', label: 'C5 Inf-Post', cx: 210, cy: 380,
    type: 'posterior',
    description: 'Inferior-posterior corner of C5 vertebral body.',
  },
  // ── C6 ──────────────────────────────────────────────────────
  {
    id: 'C6_sup_post', label: 'C6 Sup-Post', cx: 210, cy: 393,
    type: 'posterior',
    description: 'Superior-posterior corner of C6 vertebral body.',
  },
  {
    id: 'C6_inf_post', label: 'C6 Inf-Post', cx: 210, cy: 440,
    type: 'posterior',
    description: 'Inferior-posterior corner of C6 vertebral body.',
  },
  // ── C7 posterior ────────────────────────────────────────────
  {
    id: 'C7_sup_post', label: 'C7 Sup-Post', cx: 210, cy: 453,
    type: 'posterior',
    description: 'Superior-posterior corner of C7 vertebral body.',
  },
  {
    id: 'C7_inf_post', label: 'C7 Inf-Post', cx: 210, cy: 508,
    type: 'posterior',
    description: 'Inferior-posterior corner of C7 — bottom of the ARA (Cobb) measurement.',
  },
  // ── C7 anterior ─────────────────────────────────────────────
  {
    id: 'C7_inf_ant', label: 'C7 Inf-Ant', cx: 108, cy: 508,
    type: 'anterior',
    description: 'Inferior-anterior corner of C7 — bottom-front corner of C7. Combined with the C2 anterior points to calculate Anterior Head Carriage (horizontal offset in mm).',
  },
  // ── T1 ──────────────────────────────────────────────────────
  {
    id: 'T1_sup_post', label: 'T1 Sup-Post', cx: 210, cy: 522,
    type: 'posterior',
    description: 'Superior-posterior corner of T1 — the lowest landmark. Anchors George\'s Line and completes the C7/T1 segmental angle.',
  },
];

// George's Line path through posterior body points (C2 to T1)
const GEORGES_LINE_POINTS = LANDMARKS
  .filter(l => l.type === 'posterior' && l.id !== 'C1_post')
  .map(l => `${l.cx},${l.cy}`)
  .join(' ');

// ─── Vertebral body shapes ────────────────────────────────────
// Each body: { y_top, y_bot } — anterior x=108, posterior x=210
const BODIES = [
  { level: 'C2', y_top: 147, y_bot: 200 },
  { level: 'C3', y_top: 213, y_bot: 260 },
  { level: 'C4', y_top: 273, y_bot: 320 },
  { level: 'C5', y_top: 333, y_bot: 380 },
  { level: 'C6', y_top: 393, y_bot: 440 },
  { level: 'C7', y_top: 453, y_bot: 508 },
  { level: 'T1', y_top: 522, y_bot: 565 },
];

const ANT_X = 108;
const POST_X = 210;

// ─── Legend items ─────────────────────────────────────────────
const LEGEND = [
  { color: '#FFD232', label: 'Posterior body corners (14 pts) — George\'s Line / ARA / Segmental angles' },
  { color: '#E74C3C', label: 'Anterior body corners (3 pts — C2 ×2, C7 ×1) — Anterior Head Carriage' },
  { color: '#9B59B6', label: 'C1 posterior tubercle (1 pt) — not used in Cobb but anchors the arc' },
  { color: '#E74C3C', label: 'George\'s Line (red) — posterior body wall from C2–T1 (should be smooth curve)', isLine: true },
];

// ─── Component ───────────────────────────────────────────────────

export default function CervicalLateralGuidePage() {
  const [activeLandmark, setActiveLandmark] = useState<GuideLandmark | null>(null);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-[#1B3A5C] border-b-2 border-[#FFD232]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/xray" className="text-white/60 hover:text-white text-sm transition-colors">
            ← Back to SpineView
          </Link>
          <h1 className="text-xl font-semibold text-white">Cervical Lateral — Landmark Placement Guide</h1>
          <div className="text-sm text-white/40">17 points</div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-start">

          {/* ── SVG Diagram ── */}
          <div className="bg-[#0F1A2E] rounded-2xl p-4 shadow-xl">
            <svg
              width="340"
              height="620"
              viewBox="0 0 340 620"
              xmlns="http://www.w3.org/2000/svg"
              className="block"
            >
              {/* Orientation labels */}
              <text x="55" y="22" textAnchor="middle" fill="#5B9EC9" fontSize="11" fontFamily="sans-serif">ANTERIOR</text>
              <text x="250" y="22" textAnchor="middle" fill="#5B9EC9" fontSize="11" fontFamily="sans-serif">POSTERIOR</text>
              <line x1="108" y1="28" x2="108" y2="575" stroke="#5B9EC9" strokeWidth="0.5" strokeDasharray="3,4" opacity="0.3"/>
              <line x1="210" y1="28" x2="210" y2="575" stroke="#5B9EC9" strokeWidth="0.5" strokeDasharray="3,4" opacity="0.3"/>

              {/* ── C1 Atlas ring ── */}
              <ellipse cx="159" cy="113" rx="70" ry="27" fill="none" stroke="#3B6A9C" strokeWidth="8"/>
              {/* Spinal canal gap */}
              <ellipse cx="159" cy="113" rx="40" ry="14" fill="#0F1A2E"/>
              {/* Level label */}
              <text x="20" y="117" fill="#8BA4C4" fontSize="11" fontFamily="sans-serif" fontWeight="bold">C1</text>
              <line x1="35" y1="113" x2="90" y2="113" stroke="#8BA4C4" strokeWidth="0.5"/>

              {/* ── Vertebral bodies C2–T1 ── */}
              {BODIES.map(({ level, y_top, y_bot }) => (
                <g key={level}>
                  {/* Body rectangle */}
                  <rect
                    x={ANT_X} y={y_top}
                    width={POST_X - ANT_X} height={y_bot - y_top}
                    fill="#1E3A60" stroke="#2C5F8A" strokeWidth="1.5"
                    rx="2"
                  />
                  {/* Disc space above (except C2 which is below C1) */}
                  {level !== 'C2' && (
                    <rect
                      x={ANT_X + 4} y={y_top - 13}
                      width={POST_X - ANT_X - 8} height={10}
                      fill="#0F1A2E" rx="1"
                    />
                  )}
                  {/* Level label */}
                  <text x="20" y={(y_top + y_bot) / 2 + 4} fill="#8BA4C4" fontSize="11" fontFamily="sans-serif" fontWeight="bold">{level}</text>
                  <line x1="35" y1={(y_top + y_bot) / 2} x2={ANT_X - 4} y2={(y_top + y_bot) / 2} stroke="#8BA4C4" strokeWidth="0.5"/>
                  {/* Spinous process */}
                  <rect
                    x={POST_X} y={(y_top + y_bot) / 2 - 8}
                    width={40} height={16}
                    fill="#162440" stroke="#2C5F8A" strokeWidth="1"
                    rx="6"
                  />
                </g>
              ))}

              {/* Disc between C1 and C2 */}
              <rect x={ANT_X + 4} y={136} width={POST_X - ANT_X - 8} height={9} fill="#0F1A2E" rx="1"/>

              {/* ── George's Line ── */}
              <polyline
                points={GEORGES_LINE_POINTS}
                fill="none"
                stroke="#E74C3C"
                strokeWidth="1.5"
                strokeDasharray="5,3"
                opacity="0.7"
              />

              {/* ── Landmark dots ── */}
              {LANDMARKS.map((lm) => {
                const isActive = activeLandmark?.id === lm.id;
                const color = lm.type === 'posterior' ? '#FFD232' : lm.type === 'anterior' ? '#E74C3C' : '#9B59B6';
                return (
                  <g key={lm.id} style={{ cursor: 'pointer' }} onClick={() => setActiveLandmark(isActive ? null : lm)}>
                    {/* Hit area */}
                    <circle cx={lm.cx} cy={lm.cy} r={14} fill="transparent"/>
                    {/* Highlight ring on hover/active */}
                    {isActive && (
                      <circle cx={lm.cx} cy={lm.cy} r={10} fill="none" stroke={color} strokeWidth="2" opacity="0.6"/>
                    )}
                    {/* Dot */}
                    <circle
                      cx={lm.cx} cy={lm.cy} r={6}
                      fill={color}
                      stroke="#0F1A2E"
                      strokeWidth="1.5"
                    />
                    {/* Number label — posterior side */}
                    {lm.type === 'posterior' && (
                      <text x={lm.cx + 12} y={lm.cy + 4} fill={color} fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                        {lm.label.replace(/[A-Z]\d+ /, '')}
                      </text>
                    )}
                    {/* Anterior side — label to the left */}
                    {(lm.type === 'anterior' || lm.type === 'atlas') && (
                      <text x={lm.cx - 12} y={lm.cy + 4} fill={color} fontSize="9" fontFamily="sans-serif" fontWeight="bold" textAnchor="end">
                        {lm.label.replace(/[A-Z]\d+ /, '')}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* AHC measurement arrow */}
              <line x1="108" y1="530" x2="210" y2="530" stroke="#2ECC71" strokeWidth="1.5" markerEnd="url(#arrowR)" markerStart="url(#arrowL)"/>
              <text x="159" y="544" textAnchor="middle" fill="#2ECC71" fontSize="9" fontFamily="sans-serif">AHC offset</text>

              {/* Arrow markers */}
              <defs>
                <marker id="arrowR" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#2ECC71"/>
                </marker>
                <marker id="arrowL" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#2ECC71"/>
                </marker>
              </defs>

              {/* Click hint */}
              <text x="170" y="598" textAnchor="middle" fill="#5B9EC9" fontSize="10" fontFamily="sans-serif">Tap any dot for details</text>
            </svg>
          </div>

          {/* ── Right Panel ── */}
          <div className="space-y-4">

            {/* Active landmark detail */}
            {activeLandmark ? (
              <div className="rounded-xl border-2 border-[#FFD232] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`inline-block mb-2 rounded px-2 py-0.5 text-xs font-bold ${
                      activeLandmark.type === 'posterior' ? 'bg-amber-100 text-amber-800' :
                      activeLandmark.type === 'anterior' ? 'bg-red-100 text-red-700' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {activeLandmark.type === 'posterior' ? 'Posterior corner' :
                       activeLandmark.type === 'anterior' ? 'Anterior corner' : 'Atlas'}
                    </span>
                    <h2 className="text-xl font-bold text-[#1B3A5C]">{activeLandmark.label}</h2>
                  </div>
                  <button onClick={() => setActiveLandmark(null)} className="text-neutral-300 hover:text-neutral-500 text-lg leading-none">✕</button>
                </div>
                <p className="mt-2 text-neutral-700 leading-relaxed">{activeLandmark.description}</p>
              </div>
            ) : (
              <div className="rounded-xl bg-[#1B3A5C]/5 border border-[#1B3A5C]/20 p-4">
                <p className="text-sm text-neutral-500">← Tap any dot on the diagram to see placement instructions.</p>
              </div>
            )}

            {/* Legend */}
            <div className="rounded-xl bg-white border border-neutral-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3">Legend</h3>
              <div className="space-y-2">
                {[
                  { color: '#FFD232', label: 'Posterior body corners (14 pts)', sub: "Back corners of each vertebral body — forms George's Line. Used for ARA (Cobb C2–C7) and all segmental angles." },
                  { color: '#E74C3C', label: 'Anterior body corners (3 pts)', sub: 'C2 superior-anterior, C2 inferior-anterior, C7 inferior-anterior. Used to calculate Anterior Head Carriage (how far the head is forward).' },
                  { color: '#9B59B6', label: 'C1 posterior tubercle (1 pt)', sub: "Back of the atlas ring. Anchors the top of the Arc of Life curve." },
                ].map(item => (
                  <div key={item.color} className="flex gap-3">
                    <div className="mt-1 h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: item.color }}/>
                    <div>
                      <div className="text-sm font-semibold text-neutral-800">{item.label}</div>
                      <div className="text-xs text-neutral-500 leading-snug">{item.sub}</div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3">
                  <div className="mt-1.5 h-0.5 w-6 flex-shrink-0 bg-red-500 opacity-70"/>
                  <div>
                    <div className="text-sm font-semibold text-neutral-800">George's Line (dashed red)</div>
                    <div className="text-xs text-neutral-500 leading-snug">Connects all posterior body corners C2–T1. Should be a smooth unbroken curve. Breaks or steps indicate subluxation.</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1.5 h-0.5 w-6 flex-shrink-0 bg-green-500"/>
                  <div>
                    <div className="text-sm font-semibold text-neutral-800">AHC arrow (green)</div>
                    <div className="text-xs text-neutral-500 leading-snug">Horizontal distance from the posterior wall of C2 to the posterior wall of C7 at their inferior levels. Ideal &lt;15mm.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-xl bg-white border border-neutral-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3">Placement Tips</h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li className="flex gap-2">
                  <span className="text-[#FFD232] font-bold flex-shrink-0">1.</span>
                  <span>Posterior corners are the <strong>back edge of the vertebral body</strong> — NOT the spinous process tip. Look for where the posterior cortex of the body shadow meets the endplate line.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#FFD232] font-bold flex-shrink-0">2.</span>
                  <span>Work <strong>top to bottom</strong> in the order prompted. The app will step you through each one.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#FFD232] font-bold flex-shrink-0">3.</span>
                  <span>The posterior superior and inferior corners of adjacent vertebrae will be close together across the disc space — the superior corner of C3 sits just below the inferior corner of C2.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#FFD232] font-bold flex-shrink-0">4.</span>
                  <span>For the 3 <strong>anterior points</strong> (C2 and C7 only), place on the front face of the vertebral body at the corresponding endplate corner.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#FFD232] font-bold flex-shrink-0">5.</span>
                  <span>Use the <strong>AI auto-detect</strong> as a starting point — then drag any dot that looks off before confirming.</span>
                </li>
              </ul>
            </div>

            {/* All 17 landmarks list */}
            <div className="rounded-xl bg-white border border-neutral-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-3">All 17 Landmarks</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {LANDMARKS.map((lm, i) => {
                  const color = lm.type === 'posterior' ? '#FFD232' : lm.type === 'anterior' ? '#E74C3C' : '#9B59B6';
                  return (
                    <button
                      key={lm.id}
                      onClick={() => setActiveLandmark(activeLandmark?.id === lm.id ? null : lm)}
                      className={`flex items-center gap-2 rounded px-2 py-1 text-left text-xs transition-colors hover:bg-neutral-50 ${activeLandmark?.id === lm.id ? 'bg-amber-50' : ''}`}
                    >
                      <span className="flex-shrink-0 text-[10px] text-neutral-400 w-4">{i + 1}.</span>
                      <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: color }}/>
                      <span className="text-neutral-700 leading-tight">{lm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
