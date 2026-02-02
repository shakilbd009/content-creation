import { SpringConfig } from "remotion";

export const SPRING_PRESETS = {
  snappy: { damping: 200 } as SpringConfig,
  gentle: { damping: 15, stiffness: 80 } as SpringConfig,
  smooth: { damping: 12, stiffness: 100 } as SpringConfig,
  bouncy: { damping: 15, stiffness: 200 } as SpringConfig,
} as const;

export type SpringPreset = keyof typeof SPRING_PRESETS;
