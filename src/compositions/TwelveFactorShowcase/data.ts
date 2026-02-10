// Twelve-Factor App Showcase - Data & Constants

export const COMMAND = "build a 12-factor app mindmap diagram";

export const CLAUDE_RESPONSE =
  "I'll create a 12-Factor App mindmap. Here's the Mermaid:";

// ─── Mermaid Code Lines ──────────────────────────────────────────────────────

export interface MermaidLine {
  text: string;
  type: "keyword" | "node" | "subnode" | "blank" | "fence";
}

export const MERMAID_LINES: MermaidLine[] = [
  { text: "```mermaid", type: "fence" },
  { text: "mindmap", type: "keyword" },
  { text: "  root((Cloud Native 12-Factor App))", type: "keyword" },
  { text: "    Codebase", type: "node" },
  { text: "      One repo per service", type: "subnode" },
  { text: "      Tracked in Git", type: "subnode" },
  { text: "    Dependencies", type: "node" },
  { text: "      Explicitly declared", type: "subnode" },
  { text: "      Isolated per service", type: "subnode" },
  { text: "    Config", type: "node" },
  { text: "      Stored in env vars", type: "subnode" },
  { text: "      Never in code", type: "subnode" },
  { text: "    Backing Services", type: "node" },
  { text: "      Attached resources", type: "subnode" },
  { text: "      DB, Cache, Queue", type: "subnode" },
  { text: "    Build Release Run", type: "node" },
  { text: "      Strict separation", type: "subnode" },
  { text: "      Immutable releases", type: "subnode" },
  { text: "    Processes", type: "node" },
  { text: "      Stateless", type: "subnode" },
  { text: "      Share-nothing", type: "subnode" },
  { text: "    Port Binding", type: "node" },
  { text: "      Self-contained", type: "subnode" },
  { text: "      Export via port", type: "subnode" },
  { text: "    Concurrency", type: "node" },
  { text: "      Scale out via processes", type: "subnode" },
  { text: "      Horizontal scaling", type: "subnode" },
  { text: "    Disposability", type: "node" },
  { text: "      Fast startup", type: "subnode" },
  { text: "      Graceful shutdown", type: "subnode" },
  { text: "    Dev/Prod Parity", type: "node" },
  { text: "      Keep envs similar", type: "subnode" },
  { text: "      Same backing services", type: "subnode" },
  { text: "    Logs", type: "node" },
  { text: "      Treat as event streams", type: "subnode" },
  { text: "      Stdout/Stderr", type: "subnode" },
  { text: "    Admin Processes", type: "node" },
  { text: "      Run as one-off tasks", type: "subnode" },
  { text: "      Same environment", type: "subnode" },
  { text: "```", type: "fence" },
];

// ─── Mermaid Syntax Colors ───────────────────────────────────────────────────

export const MERMAID_SYNTAX_COLORS: Record<MermaidLine["type"], string> = {
  keyword: "#A855F7",
  node: "#06B6D4",
  subnode: "#10B981",
  blank: "transparent",
  fence: "#888",
};

// ─── Factor Categories & Colors ─────────────────────────────────────────────

export type FactorCategory = "code" | "infra" | "runtime" | "ops";

export const CATEGORY_COLORS: Record<FactorCategory, string> = {
  code: "#06B6D4",    // Cyan — Codebase, Dependencies, Config
  infra: "#A855F7",   // Purple — Backing Services, Build/Release/Run, Processes
  runtime: "#10B981", // Green — Port Binding, Concurrency, Disposability
  ops: "#F59E0B",     // Amber — Dev/Prod Parity, Logs, Admin Processes
};

export const TWELVE_FACTOR_COLORS = {
  cyan: "#06B6D4",
  purple: "#A855F7",
  emerald: "#10B981",
  amber: "#F59E0B",
  blue: "#3B82F6",
} as const;

// ─── Factor Nodes ───────────────────────────────────────────────────────────

export interface FactorNode {
  id: string;
  number: number;
  title: string;
  emoji: string;
  category: FactorCategory;
  x: number;
  y: number;
}

// Positions within the 960x530 viz panel
// Left column (factors 1–6): x=70
// Right column (factors 7–12): x=735
// Evenly spaced vertically with ~80px gaps
export const FACTOR_NODES: FactorNode[] = [
  // Left column — factors 1–6
  { id: "f1",  number: 1,  title: "Codebase",      emoji: "📦", category: "code",    x: 110, y: 18 },
  { id: "f2",  number: 2,  title: "Dependencies",   emoji: "🔗", category: "code",    x: 110, y: 110 },
  { id: "f3",  number: 3,  title: "Config",         emoji: "⚙️", category: "code",    x: 110, y: 202 },
  { id: "f4",  number: 4,  title: "Backing Svc",    emoji: "🗄️", category: "infra",   x: 110, y: 294 },
  { id: "f5",  number: 5,  title: "Build/Release",  emoji: "🚀", category: "infra",   x: 110, y: 386 },
  { id: "f6",  number: 6,  title: "Processes",      emoji: "⚡", category: "infra",   x: 110, y: 478 },

  // Right column — factors 7–12
  { id: "f7",  number: 7,  title: "Port Binding",   emoji: "🔌", category: "runtime", x: 850, y: 18 },
  { id: "f8",  number: 8,  title: "Concurrency",    emoji: "📈", category: "runtime", x: 850, y: 110 },
  { id: "f9",  number: 9,  title: "Disposability",  emoji: "♻️", category: "runtime", x: 850, y: 202 },
  { id: "f10", number: 10, title: "Dev/Prod",       emoji: "🔄", category: "ops",     x: 850, y: 294 },
  { id: "f11", number: 11, title: "Logs",           emoji: "📋", category: "ops",     x: 850, y: 386 },
  { id: "f12", number: 12, title: "Admin Proc",     emoji: "🛠️", category: "ops",     x: 850, y: 478 },
];

// ─── Center Node ────────────────────────────────────────────────────────────

export const CENTER_NODE = {
  x: 480,
  y: 265,
  width: 180,
  height: 60,
  label: "12-Factor\nApp",
} as const;

// ─── Connections ────────────────────────────────────────────────────────────

export interface MindmapConnection {
  from: "center";
  to: string;
}

export const CONNECTIONS: MindmapConnection[] = FACTOR_NODES.map((node) => ({
  from: "center" as const,
  to: node.id,
}));

// ─── Phase Timing ───────────────────────────────────────────────────────────

export const PHASE = {
  // Hero overlay
  HERO_START: 0,
  HERO_END: 65,

  // Terminal
  TERMINAL_APPEAR: 45,
  PROMPT_START: 60,
  PROMPT_DONE: 115,

  // Claude response
  CLAUDE_THINKING: 120,
  CLAUDE_RESPONSE: 140,

  // Mermaid code generation
  CODE_BLOCK_START: 160,

  // Mindmap diagram
  CENTER_NODE: 180,
  LEFT_COL_START: 195,
  RIGHT_COL_START: 245,

  // Final
  FINAL_MESSAGE: 420,
  HOLD_END: 540,
} as const;

// ─── Line Appearance Timing ────────────────────────────────────────────────

const LINE_STAGGER = 4;

export function getLineAppearFrame(index: number): number {
  return PHASE.CODE_BLOCK_START + index * LINE_STAGGER;
}

// ─── Factor Node Appearance Timing ─────────────────────────────────────────

const FACTOR_STAGGER = 8;

export function getFactorNodeAppearFrame(node: FactorNode): number {
  if (node.number <= 6) {
    // Left column: factors 1–6
    return PHASE.LEFT_COL_START + (node.number - 1) * FACTOR_STAGGER;
  }
  // Right column: factors 7–12
  return PHASE.RIGHT_COL_START + (node.number - 7) * FACTOR_STAGGER;
}

// ─── Connection Appearance Timing ──────────────────────────────────────────

const CONNECTION_DELAY = 3;

export function getConnectionAppearFrame(node: FactorNode): number {
  return getFactorNodeAppearFrame(node) + CONNECTION_DELAY;
}
