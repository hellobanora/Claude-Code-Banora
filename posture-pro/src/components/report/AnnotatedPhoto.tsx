'use client';

import type { Landmark, PostureView } from '@/lib/models/landmark';
import { findLandmark } from '@/lib/models/landmark';

/**
 * Renders the patient's photo with overlaid annotations:
 *   • Green plumb line (vertical reference)
 *   • Red horizontal lines connecting paired landmarks (eyes, shoulders, hips)
 *   • Red diagonal segment lines showing the posture chain on lateral view
 *   • Yellow landmark dots
 *
 * Matches the PostureScreen visual idiom: green = ideal, red = patient's actual.
 * The annotation overlay is an SVG sized to the image, so it scales cleanly for
 * both the page-1 thumbnail and the full-page version.
 */
export function AnnotatedPhoto({
  imageUrl,
  landmarks,
  view,
  thumbnail = false,
}: {
  imageUrl: string;
  landmarks: Landmark[];
  view: PostureView;
  thumbnail?: boolean;
}) {
  const className = thumbnail
    ? 'relative w-full max-w-[260px]'
    : 'relative mx-auto w-full max-w-[600px]';

  return (
    <div className={className}>
      {/* The photo itself */}
      <img
        src={imageUrl}
        alt={`${view} posture`}
        className="block h-auto w-full"
        draggable={false}
      />
      {/* Overlay in normalised 0..1 coordinate space — scales with the image */}
      <svg
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {view === 'ap' ? <APOverlay lm={landmarks} /> : <LateralOverlay lm={landmarks} />}
      </svg>
    </div>
  );
}

// ─── AP overlay ──────────────────────────────────────────────────────

function APOverlay({ lm }: { lm: Landmark[] }) {
  // Vertical plumb line from the midpoint of the two ASIS or ankles.
  const asisL = findLandmark(lm, 'asisL');
  const asisR = findLandmark(lm, 'asisR');
  const ankleL = findLandmark(lm, 'ankleCentreL');
  const ankleR = findLandmark(lm, 'ankleCentreR');
  const plumbX =
    asisL && asisR
      ? (asisL.position.x + asisR.position.x) / 2
      : ankleL && ankleR
        ? (ankleL.position.x + ankleR.position.x) / 2
        : 0.5;

  return (
    <>
      {/* Green plumb line */}
      <line x1={plumbX} y1={0} x2={plumbX} y2={1} stroke="#2ECC71" strokeWidth="0.005" strokeDasharray="0.012 0.006" />

      {/* Horizontal red lines between paired landmarks */}
      <PairedHorizontalLine left={findLandmark(lm, 'eyeOuterL')} right={findLandmark(lm, 'eyeOuterR')} />
      <PairedHorizontalLine left={findLandmark(lm, 'acromionL')} right={findLandmark(lm, 'acromionR')} />
      <PairedHorizontalLine left={asisL} right={asisR} />
      <PairedHorizontalLine left={findLandmark(lm, 'iliacCrestL')} right={findLandmark(lm, 'iliacCrestR')} />
      <PairedHorizontalLine left={ankleL} right={ankleR} />

      {/* Landmark dots */}
      {lm.map((l) => (
        <LandmarkDot key={l.id} x={l.position.x} y={l.position.y} />
      ))}
    </>
  );
}

// ─── Lateral overlay ─────────────────────────────────────────────────

function LateralOverlay({ lm }: { lm: Landmark[] }) {
  const ankle = findLandmark(lm, 'lateralMalleolus');
  const plumbX = ankle ? ankle.position.x : 0.5;

  // Red posture chain: tragus → acromion → trochanter → knee → ankle
  const chain = [
    findLandmark(lm, 'tragus'),
    findLandmark(lm, 'acromionLat'),
    findLandmark(lm, 'greaterTrochanter'),
    findLandmark(lm, 'lateralKnee'),
    findLandmark(lm, 'lateralMalleolus'),
  ].filter((x): x is Landmark => x !== undefined);

  const path =
    chain.length >= 2
      ? `M ${chain[0].position.x} ${chain[0].position.y} ` +
        chain
          .slice(1)
          .map((p) => `L ${p.position.x} ${p.position.y}`)
          .join(' ')
      : undefined;

  return (
    <>
      {/* Green plumb line */}
      <line x1={plumbX} y1={0} x2={plumbX} y2={1} stroke="#2ECC71" strokeWidth="0.005" strokeDasharray="0.012 0.006" />
      {/* Red posture chain */}
      {path && <path d={path} fill="none" stroke="#C0392B" strokeWidth="0.003" />}
      {/* Landmark dots */}
      {lm.map((l) => (
        <LandmarkDot key={l.id} x={l.position.x} y={l.position.y} />
      ))}
    </>
  );
}

// ─── Shared primitives ───────────────────────────────────────────────

function PairedHorizontalLine({
  left,
  right,
}: {
  left: Landmark | undefined;
  right: Landmark | undefined;
}) {
  if (!left || !right) return null;
  return (
    <line
      x1={left.position.x}
      y1={left.position.y}
      x2={right.position.x}
      y2={right.position.y}
      stroke="#C0392B"
      strokeWidth="0.003"
    />
  );
}

function LandmarkDot({ x, y }: { x: number; y: number }) {
  return (
    <circle cx={x} cy={y} r="0.004" fill="#FFD232" stroke="#806400" strokeWidth="0.001" />
  );
}
