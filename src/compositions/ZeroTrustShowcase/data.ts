// Zero Trust Security Showcase - Data & Constants

export const COMMAND = "generate a zero trust security architecture diagram";

export const CLAUDE_RESPONSE =
  "I'll generate a Zero Trust security architecture. Here's the Mermaid:";

// ─── Mermaid Code Lines ──────────────────────────────────────────────────────

export interface MermaidLine {
  text: string;
  type: "keyword" | "node" | "connection" | "dotted" | "blank" | "fence";
}

export const MERMAID_LINES: MermaidLine[] = [
  { text: "```mermaid", type: "fence" },
  { text: "flowchart TB", type: "keyword" },
  { text: "    Ext([External Traffic])", type: "node" },
  { text: "    WAF[WAF / DDoS Protection]", type: "node" },
  { text: "    GW[API Gateway · Auth]", type: "node" },
  { text: "    mTLS[mTLS · Service Mesh]", type: "node" },
  { text: "", type: "blank" },
  { text: "    SvcA[Service A]", type: "node" },
  { text: "    SvcB[Service B]", type: "node" },
  { text: "    IAM[IAM / RBAC]", type: "node" },
  { text: "", type: "blank" },
  { text: "    Secrets[Secrets Manager]", type: "node" },
  { text: "    Encrypt[(Encrypted Data)]", type: "node" },
  { text: "", type: "blank" },
  { text: "    subgraph Continuous Security", type: "keyword" },
  { text: "        SAST[Static Analysis]", type: "node" },
  { text: "        DAST[Dynamic Testing]", type: "node" },
  { text: "        Audit[Audit Logs]", type: "node" },
  { text: "        Policy[Policy as Code]", type: "node" },
  { text: "    end", type: "keyword" },
  { text: "", type: "blank" },
  { text: "    Ext --> WAF --> GW", type: "connection" },
  { text: "    GW --> mTLS", type: "connection" },
  { text: "    mTLS --> SvcA", type: "connection" },
  { text: "    mTLS --> SvcB", type: "connection" },
  { text: "    SvcA --> IAM", type: "connection" },
  { text: "    SvcB --> IAM", type: "connection" },
  { text: "    IAM --> Secrets", type: "connection" },
  { text: "    IAM --> Encrypt", type: "connection" },
  { text: "", type: "blank" },
  { text: "    SvcA -.-> SAST", type: "dotted" },
  { text: "    SvcB -.-> DAST", type: "dotted" },
  { text: "    IAM -.-> Audit", type: "dotted" },
  { text: "    Secrets -.-> Policy", type: "dotted" },
  { text: "```", type: "fence" },
];

// ─── Architecture Nodes ──────────────────────────────────────────────────────

export type NodeCategory =
  | "external"
  | "perimeter"
  | "network"
  | "application"
  | "data"
  | "continuous";

export interface ArchNodeData {
  id: string;
  label: string;
  emoji: string;
  category: NodeCategory;
  x: number;
  y: number;
}

// Positions within the 960x530 viz panel
export const ARCH_NODES: ArchNodeData[] = [
  // External (above zones)
  { id: "external", label: "External", emoji: "🌍", category: "external", x: 480, y: 0 },

  // Perimeter Defense
  { id: "waf", label: "WAF / DDoS", emoji: "🛡️", category: "perimeter", x: 480, y: 55 },

  // Network Controls
  { id: "gateway", label: "API Gateway", emoji: "🚪", category: "network", x: 310, y: 135 },
  { id: "mtls", label: "mTLS Mesh", emoji: "🔒", category: "network", x: 650, y: 135 },

  // Application Security
  { id: "svcA", label: "Service A", emoji: "⚙️", category: "application", x: 280, y: 215 },
  { id: "svcB", label: "Service B", emoji: "⚙️", category: "application", x: 680, y: 215 },
  { id: "iam", label: "IAM / RBAC", emoji: "👤", category: "application", x: 480, y: 295 },

  // Data Protection
  { id: "secrets", label: "Secrets Vault", emoji: "🔑", category: "data", x: 370, y: 365 },
  { id: "encrypt", label: "Encrypted DB", emoji: "🔐", category: "data", x: 590, y: 365 },

  // Continuous Security
  { id: "sast", label: "SAST", emoji: "🔍", category: "continuous", x: 120, y: 440 },
  { id: "dast", label: "DAST", emoji: "🧪", category: "continuous", x: 360, y: 440 },
  { id: "audit", label: "Audit Logs", emoji: "📋", category: "continuous", x: 600, y: 440 },
  { id: "policy", label: "Policy Code", emoji: "📜", category: "continuous", x: 840, y: 440 },
];

// ─── Connections ─────────────────────────────────────────────────────────────

export interface ArchConnection {
  from: string;
  to: string;
  type: "solid" | "dotted";
  group: "perimeter" | "network" | "application" | "data" | "monitoring";
}

export const CONNECTIONS: ArchConnection[] = [
  // Perimeter flow
  { from: "external", to: "waf", type: "solid", group: "perimeter" },
  { from: "waf", to: "gateway", type: "solid", group: "perimeter" },

  // Network flow
  { from: "gateway", to: "mtls", type: "solid", group: "network" },

  // Application flow
  { from: "mtls", to: "svcA", type: "solid", group: "application" },
  { from: "mtls", to: "svcB", type: "solid", group: "application" },
  { from: "svcA", to: "iam", type: "solid", group: "application" },
  { from: "svcB", to: "iam", type: "solid", group: "application" },

  // Data flow
  { from: "iam", to: "secrets", type: "solid", group: "data" },
  { from: "iam", to: "encrypt", type: "solid", group: "data" },

  // Monitoring (dotted)
  { from: "svcA", to: "sast", type: "dotted", group: "monitoring" },
  { from: "svcB", to: "dast", type: "dotted", group: "monitoring" },
  { from: "iam", to: "audit", type: "dotted", group: "monitoring" },
  { from: "secrets", to: "policy", type: "dotted", group: "monitoring" },
];

// ─── Security Zone Bands ────────────────────────────────────────────────────

export interface SecurityZone {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  zone: "perimeter" | "network" | "application" | "data" | "continuous";
}

export const SECURITY_ZONES: SecurityZone[] = [
  { label: "Perimeter Defense", x: 18, y: 43, width: 890, height: 76, color: "#F59E0B", zone: "perimeter" },
  { label: "Network Controls", x: 18, y: 123, width: 890, height: 76, color: "#3B82F6", zone: "network" },
  { label: "Application Security", x: 18, y: 203, width: 890, height: 156, color: "#A855F7", zone: "application" },
  { label: "Data Protection", x: 18, y: 353, width: 890, height: 72, color: "#10B981", zone: "data" },
  { label: "Continuous Security", x: 18, y: 428, width: 890, height: 78, color: "#06B6D4", zone: "continuous" },
];

// ─── Colors ──────────────────────────────────────────────────────────────────

export const SECURITY_COLORS = {
  red: "#EF4444",
  orange: "#F59E0B",
  blue: "#3B82F6",
  purple: "#A855F7",
  emerald: "#10B981",
  cyan: "#06B6D4",
} as const;

export const NODE_COLORS: Record<NodeCategory, string> = {
  external: SECURITY_COLORS.red,
  perimeter: SECURITY_COLORS.orange,
  network: SECURITY_COLORS.blue,
  application: SECURITY_COLORS.purple,
  data: SECURITY_COLORS.emerald,
  continuous: SECURITY_COLORS.cyan,
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
  CODE_PERIMETER: 170,
  CODE_APPLICATION: 210,
  CODE_DATA: 245,
  CODE_CONTINUOUS: 270,
  CODE_CONNECTIONS: 310,
  CODE_DOTTED: 350,
  CODE_DONE: 380,

  // Architecture diagram (zone + node appearances)
  ARCH_EXTERNAL: 176,
  PERIMETER_ZONE: 180,
  NETWORK_ZONE: 200,
  APPLICATION_ZONE: 225,
  DATA_ZONE: 260,
  CONTINUOUS_ZONE: 290,

  // Connections
  PERIMETER_CONNECTIONS: 320,
  NETWORK_CONNECTIONS: 333,
  APP_CONNECTIONS: 343,
  DATA_CONNECTIONS: 358,
  MONITORING_CONNECTIONS: 375,

  // Shield verification animation
  SHIELD_VERIFY: 390,

  // Final
  FINAL_MESSAGE: 440,
  HOLD_END: 540,
} as const;

// ─── Line Appearance Timing ──────────────────────────────────────────────────

const LINE_STAGGER = 4;

export function getLineAppearFrame(index: number): number {
  // fence + flowchart (lines 0-1)
  if (index <= 1) return PHASE.CODE_BLOCK_START + index * LINE_STAGGER;
  // Perimeter/Network nodes + blank (lines 2-6)
  if (index <= 6) return PHASE.CODE_PERIMETER + (index - 2) * LINE_STAGGER;
  // Application nodes + blank (lines 7-10)
  if (index <= 10) return PHASE.CODE_APPLICATION + (index - 7) * LINE_STAGGER;
  // Data nodes + blank (lines 11-13)
  if (index <= 13) return PHASE.CODE_DATA + (index - 11) * LINE_STAGGER;
  // Continuous Security subgraph (lines 14-20)
  if (index <= 20) return PHASE.CODE_CONTINUOUS + (index - 14) * LINE_STAGGER;
  // Connection lines (lines 21-28)
  if (index <= 28) return PHASE.CODE_CONNECTIONS + (index - 21) * 3;
  // blank + dotted connections (lines 29-33)
  if (index <= 33) return PHASE.CODE_DOTTED + (index - 29) * LINE_STAGGER;
  // Closing fence (line 34)
  return PHASE.CODE_DONE;
}

// ─── Node Appearance Timing ──────────────────────────────────────────────────

export function getNodeAppearFrame(nodeId: string): number {
  switch (nodeId) {
    case "external":
      return PHASE.ARCH_EXTERNAL;
    case "waf":
      return PHASE.PERIMETER_ZONE + 4;
    case "gateway":
      return PHASE.NETWORK_ZONE + 4;
    case "mtls":
      return PHASE.NETWORK_ZONE + 12;
    case "svcA":
      return PHASE.APPLICATION_ZONE + 4;
    case "svcB":
      return PHASE.APPLICATION_ZONE + 12;
    case "iam":
      return PHASE.APPLICATION_ZONE + 20;
    case "secrets":
      return PHASE.DATA_ZONE + 4;
    case "encrypt":
      return PHASE.DATA_ZONE + 12;
    case "sast":
      return PHASE.CONTINUOUS_ZONE + 4;
    case "dast":
      return PHASE.CONTINUOUS_ZONE + 12;
    case "audit":
      return PHASE.CONTINUOUS_ZONE + 20;
    case "policy":
      return PHASE.CONTINUOUS_ZONE + 28;
    default:
      return PHASE.CODE_DONE;
  }
}

// ─── Connection Appearance Timing ────────────────────────────────────────────

export function getConnectionAppearFrame(
  group: ArchConnection["group"]
): number {
  switch (group) {
    case "perimeter":
      return PHASE.PERIMETER_CONNECTIONS;
    case "network":
      return PHASE.NETWORK_CONNECTIONS;
    case "application":
      return PHASE.APP_CONNECTIONS;
    case "data":
      return PHASE.DATA_CONNECTIONS;
    case "monitoring":
      return PHASE.MONITORING_CONNECTIONS;
    default:
      return PHASE.CODE_DONE;
  }
}

// ─── Shield Verification Order ──────────────────────────────────────────────

export const SHIELD_VERIFY_ORDER: SecurityZone["zone"][] = [
  "perimeter",
  "network",
  "application",
  "data",
  "continuous",
];

export const SHIELD_VERIFY_STAGGER = 8;
