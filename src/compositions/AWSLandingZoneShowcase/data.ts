// AWS Landing Zone Showcase - Data & Constants

export const COMMAND = "build me an aws landing zone";

export const CLAUDE_RESPONSE = "I'll set up your AWS Landing Zone. Quick question:";

export interface BuildStep {
  text: string;
  icon: "checkmark" | "arrow";
  indent?: boolean;
}

export const BUILD_STEPS: BuildStep[] = [
  { text: "Creating Organization structure", icon: "checkmark" },
  { text: "Enabling AWS Control Tower", icon: "checkmark" },
  { text: "Configuring Security OU", icon: "checkmark" },
  { text: "Log Archive account", icon: "arrow", indent: true },
  { text: "Security Tooling account", icon: "arrow", indent: true },
  { text: "Configuring Workloads OU", icon: "checkmark" },
  { text: "Production account", icon: "arrow", indent: true },
  { text: "Development account", icon: "arrow", indent: true },
  { text: "Applying SCPs for SOC2 compliance", icon: "checkmark" },
  { text: "Enabling CloudTrail org-wide", icon: "checkmark" },
  { text: "Setting up IAM Identity Center", icon: "checkmark" },
];

export const OPTION_PILLS = [
  { id: "enterprise", label: "Enterprise Multi-Region", emoji: "🏢" },
  { id: "soc2", label: "SOC2 Compliant", emoji: "🔒" },
  { id: "startup", label: "Startup / Dev", emoji: "🚀" },
] as const;

export interface OrgNodeData {
  id: string;
  label: string;
  type: "root" | "security" | "workloads" | "sandbox" | "account";
  emoji: string;
  children?: OrgNodeData[];
}

export const ORG_TREE: OrgNodeData = {
  id: "root",
  label: "Root (Management)",
  type: "root",
  emoji: "🏛️",
  children: [
    {
      id: "security-ou",
      label: "Security OU",
      type: "security",
      emoji: "🛡️",
      children: [
        { id: "log-archive", label: "Log Archive", type: "account", emoji: "📋" },
        { id: "security-tooling", label: "Security Tooling", type: "account", emoji: "🔧" },
      ],
    },
    {
      id: "workloads-ou",
      label: "Workloads OU",
      type: "workloads",
      emoji: "⚙️",
      children: [
        { id: "production", label: "Production", type: "account", emoji: "🚀" },
        { id: "development", label: "Development", type: "account", emoji: "💻" },
      ],
    },
    {
      id: "sandbox-ou",
      label: "Sandbox OU",
      type: "sandbox",
      emoji: "🧪",
      children: [],
    },
  ],
};

// Node appearance order (synced to build steps)
export const NODE_APPEARANCE_ORDER = [
  "root",           // BUILD_STEP_1: Organization structure
  "security-ou",    // BUILD_STEP_3: Security OU
  "log-archive",    // BUILD_STEP_3: Security OU accounts
  "security-tooling",
  "workloads-ou",   // BUILD_STEP_4: Workloads OU
  "production",     // BUILD_STEP_4: Workloads OU accounts
  "development",
  "sandbox-ou",     // Appears with final step
] as const;

export const PHASE = {
  // Hero
  HERO_START: 0,
  HERO_END: 60,

  // Terminal & Prompt
  TERMINAL_APPEAR: 40,
  PROMPT_START: 55,
  PROMPT_DONE: 110,

  // Claude Response
  CLAUDE_THINKING: 115,
  CLAUDE_RESPONSE: 130,

  // Option Pills
  PILLS_APPEAR: 160,
  PILL_SELECT: 210,
  PILLS_FADE: 240,

  // Build Phase
  BUILD_START: 240,
  BUILD_STEP_1: 260,   // Organization structure
  BUILD_STEP_2: 290,   // Control Tower
  BUILD_STEP_3: 320,   // Security OU + accounts
  BUILD_STEP_4: 360,   // Workloads OU + accounts
  BUILD_STEP_5: 400,   // SCPs, CloudTrail, IAM
  BUILD_DONE: 440,

  // Final status
  FINAL_MESSAGE: 450,

  // Hold & End
  HOLD_END: 540,
} as const;
