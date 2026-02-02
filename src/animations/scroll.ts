import { interpolate, Easing } from "remotion";

export interface ScrollPhase {
  startFrame: number;
  endFrame: number;
  distance: number;
  easing?: (t: number) => number;
}

export function calculateScroll(frame: number, phases: ScrollPhase[]): number {
  let total = 0;
  for (const phase of phases) {
    total += interpolate(
      frame,
      [phase.startFrame, phase.endFrame],
      [0, phase.distance],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: phase.easing ?? Easing.out(Easing.quad),
      }
    );
  }
  return total;
}
