import { Theme } from "./types";

export const modernTheme: Theme = {
  name: "modern",
  colors: {
    background: "#0f0a1a",
    backgroundGradient:
      "linear-gradient(180deg, #0f0a1a 0%, #1a1028 25%, #2d1f4a 50%, #4a2c7a 75%, #6b3fa0 100%)",
    ambientGlows: [
      "radial-gradient(ellipse at 50% -20%, rgba(150, 100, 255, 0.15) 0%, transparent 60%)",
      "radial-gradient(ellipse at 30% 80%, rgba(180, 100, 255, 0.1) 0%, transparent 40%), radial-gradient(ellipse at 70% 90%, rgba(200, 150, 255, 0.08) 0%, transparent 35%)",
    ],
    terminal: {
      bg: "rgba(10, 10, 10, 0.55)",
      titleBarBg: "rgba(20, 20, 20, 0.5)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      titleBarBorder: "1px solid rgba(255, 255, 255, 0.05)",
      glow: "0 40px 100px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1)",
    },
    text: {
      primary: "#ffbe76",
      secondary: "#888",
      muted: "#666",
      accent: "#a29bfe",
      brand: "#d4a574",
    },
    syntax: {
      keyword: "#ff6b6b",
      react: "#4ecdc4",
      string: "#f9ca24",
      jsx: "#a29bfe",
      bracket: "#fdcb6e",
      arrow: "#ff6b6b",
      default: "#ffbe76",
    },
    status: {
      success: "#27ca3f",
      error: "#ff6b6b",
      warning: "#fdcb6e",
      info: "#4ecdc4",
    },
    severity: {
      critical: "#ff6b6b",
      high: "#ff9f43",
      medium: "#fdcb6e",
      low: "#888888",
    },
    bullet: "#a29bfe",
    cursor: "#ffbe76",
    prompt: "#27ca3f",
  },
  effects: {
    scanlines: { opacity: 0.06, spacing: 3 },
    vignette: { enabled: false, opacity: 0 },
    flicker: { enabled: false, tint: "transparent", intensity: 0 },
    backdrop: { blur: 30 },
    perspective: { enabled: true, rotateX: 8, rotateY: -3, distance: 2000 },
  },
  typography: {
    mono: "Monaco, Consolas, monospace",
    system: "system-ui, -apple-system, sans-serif",
    sizes: { xs: 22, sm: 26, md: 30, lg: 34, xl: 38, xxl: 44 },
  },
  spacing: {
    terminal: {
      width: 1820,
      height: 980,
      titleBarHeight: 56,
      padding: 48,
      borderRadius: 20,
      trafficLightSize: 18,
    },
  },
};
