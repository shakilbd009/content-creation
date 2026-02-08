// CI/CD Pipeline Showcase - Data & Constants

export const COMMAND = "create a ci/cd pipeline diagram";

export const CLAUDE_RESPONSE =
  "I'll generate a CI/CD pipeline diagram. Here's the Mermaid:";

// ─── Mermaid Code Lines ──────────────────────────────────────────────────────

export interface MermaidLine {
  text: string;
  type: "keyword" | "node" | "connection" | "dotted" | "blank" | "fence";
}

export const MERMAID_LINES: MermaidLine[] = [
  { text: "```mermaid", type: "fence" },
  { text: "flowchart LR", type: "keyword" },
  { text: "    Dev[Developer Git Push]", type: "node" },
  { text: "    Build[Build Container Image]", type: "node" },
  { text: "    Test[Run Tests]", type: "node" },
  { text: "    Scan[Security Scan]", type: "node" },
  { text: "", type: "blank" },
  { text: "    Registry[Container Registry]", type: "node" },
  { text: "    Staging[Deploy to Staging]", type: "node" },
  { text: "    Approve{Manual Approval?}", type: "node" },
  { text: "    Prod[Deploy to Production]", type: "node" },
  { text: "    Monitor[Monitor & Alert]", type: "node" },
  { text: "    Rollback[Auto Rollback]", type: "node" },
  { text: "", type: "blank" },
  { text: "    Dev --> Build --> Test --> Scan", type: "connection" },
  { text: "    Scan --> Registry --> Staging", type: "connection" },
  { text: "    Staging --> Approve", type: "connection" },
  { text: "    Approve -->|Yes| Prod", type: "connection" },
  { text: "    Approve -.->|No| Dev", type: "dotted" },
  { text: "    Prod --> Monitor", type: "connection" },
  { text: "    Monitor -->|Issue| Rollback", type: "connection" },
  { text: "```", type: "fence" },
];

// ─── Architecture Nodes ──────────────────────────────────────────────────────

export type NodeCategory =
  | "source"
  | "build"
  | "test"
  | "security"
  | "registry"
  | "deploy"
  | "decision"
  | "production"
  | "ops"
  | "rollback";

export type NodeShape = "rect" | "diamond";

export interface ArchNodeData {
  id: string;
  label: string;
  emoji: string;
  category: NodeCategory;
  x: number;
  y: number;
  shape: NodeShape;
}

// Positions within the 960x530 viz panel
export const ARCH_NODES: ArchNodeData[] = [
  // CI Row (y=50)
  { id: "dev", label: "Dev Push", emoji: "👨‍💻", category: "source", x: 120, y: 50, shape: "rect" },
  { id: "build", label: "Build Image", emoji: "🔨", category: "build", x: 340, y: 50, shape: "rect" },
  { id: "test", label: "Run Tests", emoji: "🧪", category: "test", x: 560, y: 50, shape: "rect" },
  { id: "scan", label: "Sec Scan", emoji: "🛡️", category: "security", x: 780, y: 50, shape: "rect" },

  // CD Row (y=230)
  { id: "registry", label: "Registry", emoji: "📦", category: "registry", x: 120, y: 230, shape: "rect" },
  { id: "staging", label: "Staging", emoji: "🚧", category: "deploy", x: 310, y: 230, shape: "rect" },
  { id: "approve", label: "Approve?", emoji: "", category: "decision", x: 500, y: 230, shape: "diamond" },
  { id: "prod", label: "Production", emoji: "🚀", category: "production", x: 700, y: 230, shape: "rect" },
  { id: "monitor", label: "Monitor", emoji: "📊", category: "ops", x: 870, y: 230, shape: "rect" },

  // Row 3 (y=390)
  { id: "rollback", label: "Rollback", emoji: "⏪", category: "rollback", x: 870, y: 390, shape: "rect" },
];

// ─── Connections ─────────────────────────────────────────────────────────────

export interface ArchConnection {
  from: string;
  to: string;
  type: "solid" | "dotted";
  group: "ci" | "transition" | "cd" | "feedback" | "rollback";
  label?: string;
  path?: string; // Custom SVG path for non-straight connections
}

export const CONNECTIONS: ArchConnection[] = [
  // CI flow (horizontal)
  { from: "dev", to: "build", type: "solid", group: "ci" },
  { from: "build", to: "test", type: "solid", group: "ci" },
  { from: "test", to: "scan", type: "solid", group: "ci" },

  // Transition: Scan → Registry (L-shape down then left then down)
  {
    from: "scan",
    to: "registry",
    type: "solid",
    group: "transition",
    path: "M 858 102 L 858 166 L 120 166 L 120 230",
  },

  // CD flow (horizontal)
  { from: "registry", to: "staging", type: "solid", group: "cd" },
  { from: "staging", to: "approve", type: "solid", group: "cd" },
  { from: "approve", to: "prod", type: "solid", group: "cd", label: "Yes" },
  { from: "prod", to: "monitor", type: "solid", group: "cd" },

  // Feedback: Approve → Dev (dotted loop above row 1)
  {
    from: "approve",
    to: "dev",
    type: "dotted",
    group: "feedback",
    label: "No",
    path: "M 500 216 L 500 -15 L 120 -15 L 120 50",
  },

  // Rollback
  {
    from: "monitor",
    to: "rollback",
    type: "solid",
    group: "rollback",
    label: "Issue",
  },
];

// ─── Subgraph Boxes ──────────────────────────────────────────────────────────

export interface SubgraphBox {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  group: "ci" | "cd";
}

export const SUBGRAPH_BOXES: SubgraphBox[] = [
  {
    label: "Continuous Integration",
    x: 18,
    y: 18,
    width: 890,
    height: 118,
    color: "#3B82F6",
    group: "ci",
  },
  {
    label: "Continuous Deployment",
    x: 18,
    y: 198,
    width: 890,
    height: 118,
    color: "#F59E0B",
    group: "cd",
  },
];

// ─── Colors ──────────────────────────────────────────────────────────────────

export const PIPELINE_COLORS = {
  purple: "#8B5CF6",
  blue: "#3B82F6",
  cyan: "#06B6D4",
  emerald: "#10B981",
  indigo: "#6366F1",
  amber: "#F59E0B",
  yellow: "#EAB308",
  green: "#22C55E",
  red: "#EF4444",
  rose: "#F43F5E",
} as const;

export const NODE_COLORS: Record<NodeCategory, string> = {
  source: PIPELINE_COLORS.purple,
  build: PIPELINE_COLORS.blue,
  test: PIPELINE_COLORS.cyan,
  security: PIPELINE_COLORS.emerald,
  registry: PIPELINE_COLORS.indigo,
  deploy: PIPELINE_COLORS.amber,
  decision: PIPELINE_COLORS.yellow,
  production: PIPELINE_COLORS.green,
  ops: PIPELINE_COLORS.red,
  rollback: PIPELINE_COLORS.rose,
};

// ─── Mermaid Syntax Colors ───────────────────────────────────────────────────

export const MERMAID_SYNTAX_COLORS: Record<MermaidLine["type"], string> = {
  keyword: "#A855F7",
  node: "#06B6D4",
  connection: "#10B981",
  dotted: "#F59E0B",
  blank: "transparent",
  fence: "#888",
};

// ─── Phase Timing ────────────────────────────────────────────────────────────

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
  CODE_BLOCK_START: 158,
  CODE_CI_NODES: 170,
  CODE_CD_NODES: 220,
  CODE_CONNECTIONS: 275,
  CODE_DONE: 325,

  // Architecture diagram — CI
  CI_BOX: 168,
  CI_NODES: 176,

  // Architecture diagram — CD
  CD_BOX: 218,
  CD_NODES: 226,

  // Connections
  CI_CONNECTIONS: 280,
  TRANSITION_CONNECTION: 295,
  CD_CONNECTIONS: 310,
  FEEDBACK_LOOP: 330,
  ROLLBACK: 340,

  // Pipeline run animation
  PIPELINE_RUN: 370,

  // Final
  FINAL_MESSAGE: 430,
  HOLD_END: 510,
} as const;

// ─── Line Appearance Timing ──────────────────────────────────────────────────

const LINE_STAGGER = 4;

export function getLineAppearFrame(index: number): number {
  // fence + flowchart LR (lines 0-1)
  if (index <= 1) return PHASE.CODE_BLOCK_START + index * LINE_STAGGER;
  // CI nodes (lines 2-5) + blank (line 6)
  if (index <= 6) return PHASE.CODE_CI_NODES + (index - 2) * LINE_STAGGER;
  // CD nodes (lines 7-12) + blank (line 13)
  if (index <= 13) return PHASE.CODE_CD_NODES + (index - 7) * LINE_STAGGER;
  // Connection lines (lines 14-20)
  if (index <= 20) return PHASE.CODE_CONNECTIONS + (index - 14) * LINE_STAGGER;
  // Closing fence (line 21)
  return PHASE.CODE_DONE;
}

// ─── Node Appearance Timing ──────────────────────────────────────────────────

const CI_NODE_STAGGER = 8;
const CD_NODE_STAGGER = 8;

export function getNodeAppearFrame(nodeId: string): number {
  switch (nodeId) {
    // CI row
    case "dev":
      return PHASE.CI_NODES;
    case "build":
      return PHASE.CI_NODES + CI_NODE_STAGGER;
    case "test":
      return PHASE.CI_NODES + CI_NODE_STAGGER * 2;
    case "scan":
      return PHASE.CI_NODES + CI_NODE_STAGGER * 3;

    // CD row
    case "registry":
      return PHASE.CD_NODES;
    case "staging":
      return PHASE.CD_NODES + CD_NODE_STAGGER;
    case "approve":
      return PHASE.CD_NODES + CD_NODE_STAGGER * 2;
    case "prod":
      return PHASE.CD_NODES + CD_NODE_STAGGER * 3;
    case "monitor":
      return PHASE.CD_NODES + CD_NODE_STAGGER * 4;

    // Rollback
    case "rollback":
      return PHASE.ROLLBACK;

    default:
      return PHASE.CODE_DONE;
  }
}

// ─── Connection Appearance Timing ────────────────────────────────────────────

export function getConnectionAppearFrame(
  group: ArchConnection["group"]
): number {
  switch (group) {
    case "ci":
      return PHASE.CI_CONNECTIONS;
    case "transition":
      return PHASE.TRANSITION_CONNECTION;
    case "cd":
      return PHASE.CD_CONNECTIONS;
    case "feedback":
      return PHASE.FEEDBACK_LOOP;
    case "rollback":
      return PHASE.ROLLBACK;
    default:
      return PHASE.CODE_DONE;
  }
}

// ─── Pipeline Run Order ──────────────────────────────────────────────────────

export const PIPELINE_RUN_ORDER = [
  "dev",
  "build",
  "test",
  "scan",
  "registry",
  "staging",
  "approve",
  "prod",
  "monitor",
];

export const PIPELINE_RUN_STAGGER = 8;
