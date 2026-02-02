export interface ThemeColors {
  background: string;
  backgroundGradient: string;
  ambientGlows: string[];
  terminal: {
    bg: string;
    titleBarBg: string;
    border: string;
    titleBarBorder: string;
    glow: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
    brand: string;
  };
  syntax: {
    keyword: string;
    react: string;
    string: string;
    jsx: string;
    bracket: string;
    arrow: string;
    default: string;
  };
  status: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  severity: {
    critical: string;
    high: string;
    medium: string;
    low: string;
  };
  bullet: string;
  cursor: string;
  prompt: string;
}

export interface ThemeEffects {
  scanlines: {
    opacity: number;
    spacing: number;
  };
  vignette: {
    enabled: boolean;
    opacity: number;
  };
  flicker: {
    enabled: boolean;
    tint: string;
    intensity: number;
  };
  backdrop: {
    blur: number;
  };
  perspective: {
    enabled: boolean;
    rotateX: number;
    rotateY: number;
    distance: number;
  };
}

export interface ThemeTypography {
  mono: string;
  system: string;
  sizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

export interface ThemeSpacing {
  terminal: {
    width: number;
    height: number;
    titleBarHeight: number;
    padding: number;
    borderRadius: number;
    trafficLightSize: number;
  };
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  effects: ThemeEffects;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
}
