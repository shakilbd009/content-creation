import { Theme } from "./types";

export const telegramTheme: Theme = {
  name: "telegram",
  colors: {
    background: "#0F1923",
    backgroundGradient:
      "linear-gradient(180deg, #0F1923 0%, #0d1620 30%, #162230 60%, #1a2d42 100%)",
    ambientGlows: [
      "radial-gradient(ellipse at 50% 30%, rgba(42, 171, 238, 0.12) 0%, transparent 60%)",
      "radial-gradient(ellipse at 70% 70%, rgba(42, 171, 238, 0.06) 0%, transparent 40%)",
    ],
    terminal: {
      bg: "rgba(10, 15, 20, 0.65)",
      titleBarBg: "rgba(15, 20, 28, 0.6)",
      border: "1px solid rgba(42, 171, 238, 0.15)",
      titleBarBorder: "1px solid rgba(42, 171, 238, 0.08)",
      glow: "0 40px 100px rgba(0, 0, 0, 0.5), 0 0 1px rgba(42, 171, 238, 0.2)",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#8B9DAF",
      muted: "#5A6A7A",
      accent: "#2AABEE",
      brand: "#2AABEE",
    },
    syntax: {
      keyword: "#2AABEE",
      react: "#34D058",
      string: "#FFD866",
      jsx: "#2AABEE",
      bracket: "#8B9DAF",
      arrow: "#FF4757",
      default: "#FFFFFF",
    },
    status: {
      success: "#34D058",
      error: "#FF4757",
      warning: "#FFD866",
      info: "#2AABEE",
    },
    severity: {
      critical: "#FF4757",
      high: "#FF6B6B",
      medium: "#FFD866",
      low: "#5A6A7A",
    },
    bullet: "#2AABEE",
    cursor: "#2AABEE",
    prompt: "#34D058",
  },
  effects: {
    scanlines: { opacity: 0, spacing: 0 },
    vignette: { enabled: false, opacity: 0 },
    flicker: { enabled: false, tint: "transparent", intensity: 0 },
    backdrop: { blur: 20 },
    perspective: { enabled: false, rotateX: 0, rotateY: 0, distance: 2000 },
  },
  typography: {
    mono: "Monaco, Consolas, monospace",
    system: "system-ui, -apple-system, sans-serif",
    sizes: { xs: 22, sm: 26, md: 30, lg: 34, xl: 38, xxl: 44 },
  },
  spacing: {
    terminal: {
      width: 1200,
      height: 920,
      titleBarHeight: 48,
      padding: 36,
      borderRadius: 16,
      trafficLightSize: 16,
    },
  },
};
