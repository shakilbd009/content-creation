import { Theme } from "./types";

export const oceanTheme: Theme = {
  name: "ocean",
  colors: {
    background: "#0a1628",
    backgroundGradient:
      "linear-gradient(180deg, #0a1628 0%, #0d2137 25%, #0f4c75 50%, #1a7f8e 75%, #3dc1d3 100%)",
    ambientGlows: [
      "radial-gradient(ellipse at 50% -20%, rgba(100, 200, 255, 0.15) 0%, transparent 60%)",
      "radial-gradient(ellipse at 30% 80%, rgba(60, 180, 200, 0.1) 0%, transparent 40%), radial-gradient(ellipse at 70% 90%, rgba(80, 200, 220, 0.08) 0%, transparent 35%)",
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
