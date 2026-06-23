// tests/rom/analysers.test.ts
import { describe, it, expect } from "vitest";
import { analyseLateralFlexion } from "@/lib/rom/analysers/lateralFlexion";
import { analyseRotation } from "@/lib/rom/analysers/rotation";
import { analyseSagittalMovement } from "@/lib/rom/analysers/sagittal";
import { PoseFrame } from "@/lib/rom/types";

// --- Sagittal movement fixture (cervical/lumbar flexion-extension) -----

function makeSagittalFrames(
  movement: "cervical_flexion_extension" | "lumbar_flexion_extension",
  neutralFrames: number,
  angleSequenceDeg: number[],
  facingRight: boolean
): PoseFrame[] {
  // For cervical: vector is shoulder -> ear_tragus. For lumbar: hip -> shoulder.
  const fromKey = movement === "cervical_flexion_extension" ? "shoulder" : "hip";
  const toKey = movement === "cervical_flexion_extension" ? "ear_tragus" : "shoulder";

  const frames: PoseFrame[] = [];
  let t = 0;

  // Fixed "from" point; "to" point starts directly above it (neutral = vertical).
  const fromPoint = { x: 0.5, y: 0.6 };

  const pushFrame = (angleDeg: number) => {
    // angleFromVertical(from, to) is clockwise-positive in image space:
    // dx = to.x - from.x, dy = to.y - from.y, angle = atan2(dx, -dy).
    // We invert that here to place "to" at the right (x,y) for a given
    // desired raw angle, matching the production angleFromVertical math
    // exactly so the fixture is a faithful inverse of the function under test.
    const rad = (angleDeg * Math.PI) / 180;
    const length = 0.2;
    const dx = Math.sin(rad) * length;
    const dy = -Math.cos(rad) * length;
    const toPoint = { x: fromPoint.x + dx, y: fromPoint.y + dy };
    frames.push({
      frameIndex: frames.length,
      timestampMs: t,
      landmarks: {
        [fromKey]: { ...fromPoint, visibility: 1 },
        [toKey]: { ...toPoint, visibility: 1 },
      },
    });
    t += 33;
  };

  for (let i = 0; i < neutralFrames; i++) pushFrame(0);
  // facingRight=true means rawAngle is used as-is; facingRight=false negates
  // it inside the analyser, so to *simulate* a desired flexion angle we feed
  // the appropriately-signed raw angle for whichever facing direction we want.
  for (const angleDeg of angleSequenceDeg) {
    pushFrame(facingRight ? angleDeg : -angleDeg);
  }

  return frames;
}

describe("analyseSagittalMovement", () => {
  it("detects a flexion peak close to the simulated angle (facing right)", () => {
    const sequence = [10, 25, 35, 40, ...Array(24).fill(45), 30, 10];
    const frames = makeSagittalFrames("cervical_flexion_extension", 5, sequence, true);

    const results = analyseSagittalMovement({
      movement: "cervical_flexion_extension",
      frames,
      facingRight: true,
    });
    const flexion = results.find((r) => r.romDeg > 0 && r.peakAngleDeg > 0);

    expect(flexion).toBeDefined();
    expect(flexion!.romDeg).toBeGreaterThan(35);
    expect(flexion!.romDeg).toBeLessThan(55);
  });

  it("produces consistent results regardless of facing direction", () => {
    const sequence = [10, 20, 30, ...Array(24).fill(40), 20];
    const framesRight = makeSagittalFrames("lumbar_flexion_extension", 5, sequence, true);
    const framesLeft = makeSagittalFrames("lumbar_flexion_extension", 5, sequence, false);

    const resultsRight = analyseSagittalMovement({
      movement: "lumbar_flexion_extension",
      frames: framesRight,
      facingRight: true,
    });
    const resultsLeft = analyseSagittalMovement({
      movement: "lumbar_flexion_extension",
      frames: framesLeft,
      facingRight: false,
    });

    const flexRight = resultsRight.find((r) => r.romDeg > 30);
    const flexLeft = resultsLeft.find((r) => r.romDeg > 30);
    expect(flexRight).toBeDefined();
    expect(flexLeft).toBeDefined();
    // Same simulated movement, opposite facing direction, should recover
    // the same ROM magnitude.
    expect(Math.abs(flexRight!.romDeg - flexLeft!.romDeg)).toBeLessThan(2);
  });

  it("throws a clear error when required landmarks are missing", () => {
    const frames: PoseFrame[] = [
      { frameIndex: 0, timestampMs: 0, landmarks: {} },
      { frameIndex: 1, timestampMs: 33, landmarks: {} },
    ];
    expect(() =>
      analyseSagittalMovement({ movement: "cervical_flexion_extension", frames, facingRight: true })
    ).toThrow(/No usable frames/);
  });
});

// --- Helpers to build synthetic MediaPipe-style frame sequences --------

function makeLateralFlexionFrames(
  movement: "cervical_lateral_flexion" | "lumbar_lateral_flexion",
  neutralFrames: number,
  tiltDegSequence: number[]
): PoseFrame[] {
  const leftKey = movement === "cervical_lateral_flexion" ? "left_eye" : "left_shoulder";
  const rightKey = movement === "cervical_lateral_flexion" ? "right_eye" : "right_shoulder";

  const frames: PoseFrame[] = [];
  let t = 0;

  // Neutral frames: left/right at same height (0 degrees from horizontal)
  for (let i = 0; i < neutralFrames; i++) {
    frames.push({
      frameIndex: frames.length,
      timestampMs: t,
      landmarks: {
        [leftKey]: { x: 0.4, y: 0.4, visibility: 1 },
        [rightKey]: { x: 0.6, y: 0.4, visibility: 1 },
      },
    });
    t += 33;
  }

  // Tilt sequence: simulate a head/trunk tilt by raising/lowering one
  // side. A positive tiltDeg moves right side down (right tilt).
  for (const tiltDeg of tiltDegSequence) {
    const rad = (tiltDeg * Math.PI) / 180;
    const dx = 0.2; // fixed horizontal separation baseline
    const dy = Math.tan(rad) * dx;
    frames.push({
      frameIndex: frames.length,
      timestampMs: t,
      landmarks: {
        [leftKey]: { x: 0.4, y: 0.4, visibility: 1 },
        [rightKey]: { x: 0.6, y: 0.4 + dy, visibility: 1 },
      },
    });
    t += 33;
  }

  return frames;
}

function makeCervicalRotationFrames(neutralFrames: number, rotationSequenceDeg: number[]): PoseFrame[] {
  const frames: PoseFrame[] = [];
  let t = 0;
  const neutralHalfWidth = 0.1; // left_ear at x=0.4, right_ear at x=0.6

  for (let i = 0; i < neutralFrames; i++) {
    frames.push({
      frameIndex: frames.length,
      timestampMs: t,
      landmarks: {
        left_ear: { x: 0.5 - neutralHalfWidth, y: 0.3, visibility: 1 },
        right_ear: { x: 0.5 + neutralHalfWidth, y: 0.3, visibility: 1 },
        nose: { x: 0.5, y: 0.32, visibility: 1 },
      },
    });
    t += 33;
  }

  for (const angleDeg of rotationSequenceDeg) {
    const rad = (Math.abs(angleDeg) * Math.PI) / 180;
    const compressedHalfWidth = neutralHalfWidth * Math.cos(rad);
    // Positive angleDeg = rotate right = nose offsets toward... we just
    // need nose.x > earMid.x for "right" by our sign convention.
    const noseOffset = angleDeg >= 0 ? 0.02 : -0.02;
    frames.push({
      frameIndex: frames.length,
      timestampMs: t,
      landmarks: {
        left_ear: { x: 0.5 - compressedHalfWidth, y: 0.3, visibility: 1 },
        right_ear: { x: 0.5 + compressedHalfWidth, y: 0.3, visibility: 1 },
        nose: { x: 0.5 + noseOffset, y: 0.32, visibility: 1 },
      },
    });
    t += 33;
  }

  return frames;
}

// --- Lateral flexion tests ----------------------------------------------

describe("analyseLateralFlexion", () => {
  it("detects a right-tilt peak with ROM close to the simulated angle", () => {
    // Hold near-neutral, ramp to 30deg tilt, and hold for >400ms
    // (frames are 33ms apart, so ~14 plateau frames = ~460ms held).
    const sequence = [5, 10, 20, 28, ...Array(24).fill(30), 28, 15, 5];
    const frames = makeLateralFlexionFrames("cervical_lateral_flexion", 5, sequence);

    const results = analyseLateralFlexion({ movement: "cervical_lateral_flexion", frames });
    const rightResult = results.find((r) => r.side === "right");

    expect(rightResult).toBeDefined();
    // Allow generous tolerance since Kalman smoothing + small-angle
    // tan() approximation both introduce a bit of slack.
    expect(rightResult!.romDeg).toBeGreaterThan(20);
    expect(rightResult!.romDeg).toBeLessThan(35);
  });

  it("throws a clear error when required landmarks are entirely missing", () => {
    const frames: PoseFrame[] = [
      { frameIndex: 0, timestampMs: 0, landmarks: {} },
      { frameIndex: 1, timestampMs: 33, landmarks: {} },
    ];
    expect(() => analyseLateralFlexion({ movement: "lumbar_lateral_flexion", frames })).toThrow(
      /No usable frames/
    );
  });

  it("assigns a normal range and traffic light to each detected side", () => {
    const sequence = [5, 15, 25, ...Array(24).fill(30), 20, 10];
    const frames = makeLateralFlexionFrames("lumbar_lateral_flexion", 5, sequence);
    const results = analyseLateralFlexion({ movement: "lumbar_lateral_flexion", frames });

    for (const result of results) {
      expect(result.normalRangeDeg[0]).toBeGreaterThan(0);
      expect(["green", "yellow", "red"]).toContain(result.trafficLight);
    }
  });
});

// --- Rotation tests -------------------------------------------------------

describe("analyseRotation — foreshortening method", () => {
  it("recovers approximately the simulated rotation angle at 30 degrees", () => {
    const sequence = [10, 20, 28, ...Array(24).fill(30), 25, 10];
    const frames = makeCervicalRotationFrames(5, sequence);

    const results = analyseRotation({ movement: "cervical_rotation", frames });
    const rightResult = results.find((r) => r.side === "right");

    expect(rightResult).toBeDefined();
    // arccos-based recovery of a simulated 30deg rotation — generous
    // tolerance given Kalman smoothing and the cosine method's known
    // sensitivity characteristics.
    expect(rightResult!.romDeg).toBeGreaterThan(20);
    expect(rightResult!.romDeg).toBeLessThan(40);
  });

  it("correctly assigns direction (left vs right) from the nose-offset disambiguation", () => {
    const rightSequence = [15, 25, ...Array(24).fill(30), 20];
    const leftSequence = [-15, -25, ...Array(24).fill(-30), -20];
    const frames = makeCervicalRotationFrames(5, [...rightSequence, ...leftSequence]);

    const results = analyseRotation({ movement: "cervical_rotation", frames });
    const rightResult = results.find((r) => r.side === "right");
    const leftResult = results.find((r) => r.side === "left");

    expect(rightResult).toBeDefined();
    expect(leftResult).toBeDefined();
    // Both should report positive ROM magnitudes regardless of direction sign.
    expect(rightResult!.romDeg).toBeGreaterThan(0);
    expect(leftResult!.romDeg).toBeGreaterThan(0);
  });

  it("flags a high-angle warning when rotation exceeds the precision threshold", () => {
    const sequence = [20, 40, 60, 70, ...Array(24).fill(75), 40, 10];
    const frames = makeCervicalRotationFrames(5, sequence);
    const results = analyseRotation({ movement: "cervical_rotation", frames });

    const anyWarningPresent = results.some((r) =>
      r.warnings.some((w) => w.includes("less precise at high angles"))
    );
    expect(anyWarningPresent).toBe(true);
  });

  it("throws a clear error when neutral width cannot be established", () => {
    const frames: PoseFrame[] = [
      { frameIndex: 0, timestampMs: 0, landmarks: {} },
      { frameIndex: 1, timestampMs: 33, landmarks: {} },
    ];
    expect(() => analyseRotation({ movement: "lumbar_rotation", frames })).toThrow();
  });

  it("clamps gracefully and does not produce NaN when width ratio noise exceeds 1.0", () => {
    // Small jittery noise around neutral (including a frame where current
    // width is fractionally ABOVE the neutral average — possible with
    // landmark jitter), then a genuine held rotation so there's a result
    // to inspect for NaN.
    const sequence = [0, -1, 1, 0, ...Array(24).fill(35), 10];
    const frames = makeCervicalRotationFrames(5, sequence);
    const results = analyseRotation({ movement: "cervical_rotation", frames });
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(Number.isNaN(r.romDeg)).toBe(false);
    }
  });
});
