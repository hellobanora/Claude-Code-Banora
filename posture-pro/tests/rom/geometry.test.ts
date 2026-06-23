// tests/rom/geometry.test.ts
import { describe, it, expect } from "vitest";
import { angleFromVertical, threePointAngle, KalmanAngleFilter, movingAverageSmooth } from "@/lib/rom/geometry";
import { scoreTrafficLight, percentOfNormal } from "@/lib/rom/scoring";

describe("angleFromVertical", () => {
  it("returns 0 when the second point is directly above the first", () => {
    const from = { x: 0.5, y: 0.5 };
    const to = { x: 0.5, y: 0.3 }; // smaller y = higher on screen
    expect(angleFromVertical(from, to)).toBeCloseTo(0, 1);
  });

  it("returns ~45 degrees for a 45-degree forward lean", () => {
    const from = { x: 0.5, y: 0.5 };
    const to = { x: 0.6, y: 0.4 }; // equal x and y displacement
    expect(angleFromVertical(from, to)).toBeCloseTo(45, 0);
  });
});

describe("threePointAngle", () => {
  it("returns 180 for a straight line", () => {
    const a = { x: 0, y: 0 };
    const b = { x: 1, y: 0 };
    const c = { x: 2, y: 0 };
    expect(threePointAngle(a, b, c)).toBeCloseTo(180, 1);
  });

  it("returns 90 for a right angle", () => {
    const a = { x: 0, y: 0 };
    const b = { x: 0, y: 1 };
    const c = { x: 1, y: 1 };
    expect(threePointAngle(a, b, c)).toBeCloseTo(90, 1);
  });
});

describe("KalmanAngleFilter", () => {
  it("smooths noisy input toward a stable underlying value", () => {
    const filter = new KalmanAngleFilter();
    const noisySignal = [40, 44, 39, 42, 41, 43, 40];
    const smoothed = noisySignal.map((v) => filter.next(v));
    // Later values should cluster more tightly than the raw input did.
    const rawSpread = Math.max(...noisySignal) - Math.min(...noisySignal);
    const smoothedSpread = Math.max(...smoothed.slice(3)) - Math.min(...smoothed.slice(3));
    expect(smoothedSpread).toBeLessThan(rawSpread);
  });
});

describe("movingAverageSmooth", () => {
  it("reduces a single-frame spike", () => {
    const values = [10, 10, 10, 50, 10, 10, 10];
    const smoothed = movingAverageSmooth(values, 3);
    expect(smoothed[3]).toBeLessThan(50);
    expect(smoothed[3]).toBeGreaterThan(10);
  });
});

describe("scoreTrafficLight", () => {
  // Cervical flexion normal range used as the test reference: 45-60°, midpoint 52.5
  const normalRange: [number, number] = [45, 60];

  it("scores green for ROM at or above 85% of midpoint", () => {
    expect(scoreTrafficLight(50, normalRange)).toBe("green"); // ~95%
  });

  it("scores yellow for ROM in the 60-85% band", () => {
    expect(scoreTrafficLight(35, normalRange)).toBe("yellow"); // ~67%
  });

  it("scores red for ROM below 60% of midpoint", () => {
    expect(scoreTrafficLight(20, normalRange)).toBe("red"); // ~38%
  });

  it("flags marked hypermobility as yellow, not green", () => {
    expect(scoreTrafficLight(90, normalRange)).toBe("yellow");
  });

  it("falls back to yellow when no valid reference range is configured", () => {
    expect(scoreTrafficLight(40, [0, 0])).toBe("yellow");
  });
});

describe("percentOfNormal", () => {
  it("calculates percentage relative to range midpoint", () => {
    expect(percentOfNormal(52.5, [45, 60])).toBe(100);
    expect(percentOfNormal(26.25, [45, 60])).toBe(50);
  });
});
