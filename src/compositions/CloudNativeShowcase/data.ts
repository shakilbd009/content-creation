// Cloud-Native Architecture Showcase - Data & Constants

export const COMMAND = "generate a cloud-native architecture diagram";

export const CLAUDE_RESPONSE =
  "I'll generate a cloud-native architecture. Here's the Mermaid:";

// ─── Mermaid Code Lines ──────────────────────────────────────────────────────

export interface MermaidLine {
  text: string;
  type: "keyword" | "node" | "connection" | "dotted" | "blank" | "fence";
}

export const MERMAID_LINES: MermaidLine[] = [
  { text: "```mermaid", type: "fence" },
  { text: "graph TB", type: "keyword" },
  { text: "    Users([Users/Clients])", type: "node" },
  { text: "    CDN[CDN / Edge Cache]", type: "node" },
  { text: "    LB[Load Balancer]", type: "node" },
  { text: "    GW[API Gateway]", type: "node" },
  { text: "", type: "blank" },
  { text: "    subgraph Service Mesh", type: "keyword" },
  { text: "        SvcA[Service A · Users]", type: "node" },
  { text: "        SvcB[Service B · Orders]", type: "node" },
  { text: "        SvcC[Service C · Payments]", type: "node" },
  { text: "        SvcD[Service D · Notif]", type: "node" },
  { text: "    end", type: "keyword" },
  { text: "", type: "blank" },
  { text: "    subgraph Data Layer", type: "keyword" },
  { text: "        DB1[(SQL DB)]", type: "node" },
  { text: "        DB2[(NoSQL DB)]", type: "node" },
  { text: "        Cache[(Redis Cache)]", type: "node" },
  { text: "        Queue[[Message Queue]]", type: "node" },
  { text: "        S3[(Object Storage)]", type: "node" },
  { text: "    end", type: "keyword" },
  { text: "", type: "blank" },
  { text: "    Users --> CDN --> LB --> GW", type: "connection" },
  { text: "    GW --> SvcA", type: "connection" },
  { text: "    GW --> SvcB", type: "connection" },
  { text: "    GW --> SvcC", type: "connection" },
  { text: "    SvcA --> DB1", type: "connection" },
  { text: "    SvcB --> DB2 & Cache", type: "connection" },
  { text: "    SvcC --> Queue --> SvcD", type: "connection" },
  { text: "    SvcD --> S3", type: "connection" },
  { text: "", type: "blank" },
  { text: "    SvcA -.-> Logs", type: "dotted" },
  { text: "    SvcB -.-> Metrics", type: "dotted" },
  { text: "    SvcC -.-> Traces", type: "dotted" },
  { text: "```", type: "fence" },
];

// ─── Architecture Nodes ──────────────────────────────────────────────────────

export type NodeCategory =
  | "entry"
  | "service"
  | "data"
  | "observability";

export interface ArchNodeData {
  id: string;
  label: string;
  emoji: string;
  category: NodeCategory;
  x: number;
  y: number;
}

// Positions within the 960x530 viz panel (scaled up for phone visibility)
export const ARCH_NODES: ArchNodeData[] = [
  // Entry layer
  { id: "users", label: "Users/Clients", emoji: "👥", category: "entry", x: 480, y: 0 },
  { id: "cdn", label: "CDN / Edge", emoji: "🌐", category: "entry", x: 175, y: 80 },
  { id: "lb", label: "Load Balancer", emoji: "⚖️", category: "entry", x: 435, y: 80 },
  { id: "gw", label: "API Gateway", emoji: "🚪", category: "entry", x: 695, y: 80 },

  // Service Mesh
  { id: "svcA", label: "Service A", emoji: "👤", category: "service", x: 125, y: 200 },
  { id: "svcB", label: "Service B", emoji: "📦", category: "service", x: 345, y: 200 },
  { id: "svcC", label: "Service C", emoji: "💳", category: "service", x: 565, y: 200 },
  { id: "svcD", label: "Service D", emoji: "🔔", category: "service", x: 785, y: 200 },

  // Data Layer
  { id: "db1", label: "SQL DB", emoji: "🗄️", category: "data", x: 90, y: 318 },
  { id: "db2", label: "NoSQL DB", emoji: "📊", category: "data", x: 270, y: 318 },
  { id: "cache", label: "Redis", emoji: "⚡", category: "data", x: 450, y: 318 },
  { id: "queue", label: "Queue", emoji: "📨", category: "data", x: 630, y: 318 },
  { id: "s3", label: "Storage", emoji: "💾", category: "data", x: 820, y: 318 },

  // Observability
  { id: "logs", label: "Logs · ELK", emoji: "📋", category: "observability", x: 180, y: 432 },
  { id: "metrics", label: "Metrics", emoji: "📈", category: "observability", x: 475, y: 432 },
  { id: "traces", label: "Traces", emoji: "🔍", category: "observability", x: 770, y: 432 },
];

// ─── Connections ─────────────────────────────────────────────────────────────

export interface ArchConnection {
  from: string;
  to: string;
  type: "solid" | "dotted";
  group: "entry" | "gateway" | "data" | "observability";
}

export const CONNECTIONS: ArchConnection[] = [
  // Entry flow
  { from: "users", to: "cdn", type: "solid", group: "entry" },
  { from: "cdn", to: "lb", type: "solid", group: "entry" },
  { from: "lb", to: "gw", type: "solid", group: "entry" },

  // Gateway to services
  { from: "gw", to: "svcA", type: "solid", group: "gateway" },
  { from: "gw", to: "svcB", type: "solid", group: "gateway" },
  { from: "gw", to: "svcC", type: "solid", group: "gateway" },

  // Services to data
  { from: "svcA", to: "db1", type: "solid", group: "data" },
  { from: "svcB", to: "db2", type: "solid", group: "data" },
  { from: "svcB", to: "cache", type: "solid", group: "data" },
  { from: "svcC", to: "queue", type: "solid", group: "data" },
  { from: "queue", to: "svcD", type: "solid", group: "data" },
  { from: "svcD", to: "s3", type: "solid", group: "data" },

  // Observability (dotted)
  { from: "svcA", to: "logs", type: "dotted", group: "observability" },
  { from: "svcB", to: "metrics", type: "dotted", group: "observability" },
  { from: "svcC", to: "traces", type: "dotted", group: "observability" },
];

// ─── Subgraph Boxes ──────────────────────────────────────────────────────────

export interface SubgraphBox {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  group: "services" | "data" | "observability";
}

export const SUBGRAPH_BOXES: SubgraphBox[] = [
  {
    label: "Service Mesh",
    x: 18,
    y: 168,
    width: 890,
    height: 115,
    color: "#A855F7",
    group: "services",
  },
  {
    label: "Data Layer",
    x: 18,
    y: 288,
    width: 890,
    height: 110,
    color: "#10B981",
    group: "data",
  },
  {
    label: "Observability",
    x: 18,
    y: 402,
    width: 890,
    height: 108,
    color: "#F59E0B",
    group: "observability",
  },
];

// ─── Colors ──────────────────────────────────────────────────────────────────

export const CLOUD_COLORS = {
  cyan: "#06B6D4",
  purple: "#A855F7",
  emerald: "#10B981",
  amber: "#F59E0B",
  blue: "#3B82F6",
  rose: "#F43F5E",
} as const;

export const NODE_COLORS: Record<NodeCategory, string> = {
  entry: CLOUD_COLORS.cyan,
  service: CLOUD_COLORS.purple,
  data: CLOUD_COLORS.emerald,
  observability: CLOUD_COLORS.amber,
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

  // Mermaid code generation phases
  CODE_BLOCK_START: 160,
  CODE_ENTRY: 172,
  CODE_SERVICES: 225,
  CODE_DATA: 290,
  CODE_CONNECTIONS: 355,
  CODE_OBSERVABILITY: 410,
  CODE_DONE: 445,

  // Architecture diagram (synced with code phases)
  ARCH_USERS: 178,
  ARCH_GATEWAY: 190,
  ARCH_SERVICES: 235,
  ARCH_DATA: 300,
  ARCH_CONNECTIONS: 360,
  ARCH_OBSERVABILITY: 418,

  // Final
  FINAL_MESSAGE: 460,
  HOLD_END: 540,
} as const;

// ─── Line Appearance Timing ──────────────────────────────────────────────────

const LINE_STAGGER = 4;

export function getLineAppearFrame(index: number): number {
  // fence + graph TB (lines 0-1)
  if (index <= 1) return PHASE.CODE_BLOCK_START + index * LINE_STAGGER;
  // Entry nodes (lines 2-6)
  if (index <= 6) return PHASE.CODE_ENTRY + (index - 2) * LINE_STAGGER;
  // Service mesh (lines 7-13)
  if (index <= 13) return PHASE.CODE_SERVICES + (index - 7) * LINE_STAGGER;
  // Data layer (lines 14-21)
  if (index <= 21) return PHASE.CODE_DATA + (index - 14) * LINE_STAGGER;
  // Connections (lines 22-30)
  if (index <= 30) return PHASE.CODE_CONNECTIONS + (index - 22) * 3;
  // Observability + closing fence (lines 31-34)
  return PHASE.CODE_OBSERVABILITY + (index - 31) * LINE_STAGGER;
}

// ─── Node Appearance Timing ──────────────────────────────────────────────────

export function getNodeAppearFrame(nodeId: string): number {
  switch (nodeId) {
    case "users":
      return PHASE.ARCH_USERS;
    case "cdn":
      return PHASE.ARCH_GATEWAY;
    case "lb":
      return PHASE.ARCH_GATEWAY + 6;
    case "gw":
      return PHASE.ARCH_GATEWAY + 12;
    case "svcA":
      return PHASE.ARCH_SERVICES;
    case "svcB":
      return PHASE.ARCH_SERVICES + 8;
    case "svcC":
      return PHASE.ARCH_SERVICES + 16;
    case "svcD":
      return PHASE.ARCH_SERVICES + 24;
    case "db1":
      return PHASE.ARCH_DATA;
    case "db2":
      return PHASE.ARCH_DATA + 6;
    case "cache":
      return PHASE.ARCH_DATA + 12;
    case "queue":
      return PHASE.ARCH_DATA + 18;
    case "s3":
      return PHASE.ARCH_DATA + 24;
    case "logs":
      return PHASE.ARCH_OBSERVABILITY;
    case "metrics":
      return PHASE.ARCH_OBSERVABILITY + 8;
    case "traces":
      return PHASE.ARCH_OBSERVABILITY + 16;
    default:
      return PHASE.CODE_DONE;
  }
}

export function getConnectionAppearFrame(
  group: ArchConnection["group"]
): number {
  switch (group) {
    case "entry":
      return PHASE.ARCH_GATEWAY + 18;
    case "gateway":
      return PHASE.ARCH_CONNECTIONS;
    case "data":
      return PHASE.ARCH_CONNECTIONS + 15;
    case "observability":
      return PHASE.ARCH_OBSERVABILITY + 10;
    default:
      return PHASE.CODE_DONE;
  }
}
