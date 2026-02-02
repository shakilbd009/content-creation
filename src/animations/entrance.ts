import { spring, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SpringConfig } from "remotion";
import { SPRING_PRESETS, SpringPreset } from "./springs";

function resolveConfig(config: SpringConfig | SpringPreset): SpringConfig {
  if (typeof config === "string") return SPRING_PRESETS[config];
  return config;
}

export function useSpringEntrance(
  delay: number = 0,
  config: SpringConfig | SpringPreset = "snappy"
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: resolveConfig(config),
  });

  return Math.max(0, progress);
}

export function useSlideIn(
  delay: number = 0,
  distance: number = 20,
  config: SpringConfig | SpringPreset = "snappy"
) {
  const progress = useSpringEntrance(delay, config);

  return {
    opacity: progress,
    transform: `translateX(${(1 - progress) * distance}px)`,
  };
}

export function useScaleEntrance(
  delay: number = 0,
  config: SpringConfig | SpringPreset = "gentle"
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: resolveConfig(config),
  });

  return { transform: `scale(${scale})` };
}

export function useFadeIn(
  delay: number = 0,
  duration: number = 15
) {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return { opacity };
}
