import { Theme } from "./types";

export const terminalTheme: Theme = {
  name: "terminal",
  colors: {
    background: "#0d0d0d",
    backgroundGradient: "linear-gradient(180deg, #0d0d0d 0%, #0d0d0d 100%)",
    ambientGlows: [
      "radial-gradient(circle, rgba(255,180,100,0.1) 0%, transparent 70%)",
    ],
    terminal: {
      bg: "#0a0a0a",
      titleBarBg: "#1a1a1a",
      border: "3px solid #333",
      titleBarBorder: "none",
      glow: "0 0 60px rgba(255, 180, 100, 0.3), inset 0 0 100px rgba(255, 180, 100, 0.05)",
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
    scanlines: { opacity: 0.15, spacing: 2 },
    vignette: { enabled: true, opacity: 0.5 },
    flicker: { enabled: true, tint: "rgba(255, 200, 100, 0.02)", intensity: 0.02 },
    backdrop: { blur: 0 },
    perspective: { enabled: false, rotateX: 0, rotateY: 0, distance: 2000 },
  },
  typography: {
    mono: "Monaco, Consolas, monospace",
    system: "system-ui, -apple-system, sans-serif",
    sizes: { xs: 18, sm: 22, md: 24, lg: 32, xl: 38, xxl: 44 },
  },
  spacing: {
    terminal: {
      width: 980,
      height: 1400,
      titleBarHeight: 50,
      padding: 30,
      borderRadius: 20,
      trafficLightSize: 16,
    },
  },
};
