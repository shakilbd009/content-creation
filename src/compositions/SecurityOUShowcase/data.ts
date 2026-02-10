// Security OU Showcase - Data & Constants

export const COMMAND = "set up a security-hardened aws organization";

export const CLAUDE_RESPONSE =
  "I'll configure your Security OU. What compliance framework?";

// Security accent colors
export const SECURITY_COLORS = {
  securityOU: "#E02D4E", // Red/crimson
  logArchive: "#3B82F6", // Blue
  securityTooling: "#FF9900", // Orange (AWS)
  audit: "#10B981", // Green
};

export interface BuildStep {
  text: string;
  icon: "checkmark" | "arrow";
  indent?: boolean;
}

export const BUILD_STEPS: BuildStep[] = [
  { text: "Creating Security OU", icon: "checkmark" },
  { text: "Provisioning Log Archive account", icon: "checkmark" },
  { text: "CloudTrail Logs", icon: "arrow", indent: true },
  { text: "Config Logs", icon: "arrow", indent: true },
  { text: "VPC Flow Logs", icon: "arrow", indent: true },
  { text: "Provisioning Security Tooling account", icon: "checkmark" },
  { text: "GuardDuty enabled", icon: "arrow", indent: true },
  { text: "SecurityHub enabled", icon: "arrow", indent: true },
  { text: "IAM Access Analyzer enabled", icon: "arrow", indent: true },
  { text: "Provisioning Audit account", icon: "checkmark" },
  { text: "AWS Config Rules", icon: "arrow", indent: true },
  { text: "CloudWatch Alarms", icon: "arrow", indent: true },
  { text: "SNS Alerts", icon: "arrow", indent: true },
  { text: "Applying SOC2 SCPs", icon: "checkmark" },
];

export const OPTION_PILLS = [
  { id: "soc2", label: "SOC2 Compliant", emoji: "🔒" },
  { id: "hipaa", label: "HIPAA Ready", emoji: "🏥" },
  { id: "pci", label: "PCI-DSS", emoji: "💳" },
] as const;

export interface SecurityNodeData {
  id: string;
  label: string;
  type: "ou" | "account" | "service";
  emoji: string;
  color: string;
  children?: SecurityNodeData[];
}

export const SECURITY_TREE: SecurityNodeData = {
  id: "security-ou",
  label: "Security OU",
  type: "ou",
  emoji: "🛡️",
  color: SECURITY_COLORS.securityOU,
  children: [
    {
      id: "log-archive",
      label: "Log Archive",
      type: "account",
      emoji: "📋",
      color: SECURITY_COLORS.logArchive,
      children: [
        {
          id: "cloudtrail",
          label: "CloudTrail",
          type: "service",
          emoji: "📝",
          color: SECURITY_COLORS.logArchive,
        },
        {
          id: "config-logs",
          label: "Config Logs",
          type: "service",
          emoji: "⚙️",
          color: SECURITY_COLORS.logArchive,
        },
        {
          id: "vpc-logs",
          label: "VPC Flow Logs",
          type: "service",
          emoji: "🌐",
          color: SECURITY_COLORS.logArchive,
        },
      ],
    },
    {
      id: "security-tooling",
      label: "Security Tooling",
      type: "account",
      emoji: "🔧",
      color: SECURITY_COLORS.securityTooling,
      children: [
        {
          id: "guardduty",
          label: "GuardDuty",
          type: "service",
          emoji: "👁️",
          color: SECURITY_COLORS.securityTooling,
        },
        {
          id: "securityhub",
          label: "SecurityHub",
          type: "service",
          emoji: "🛡️",
          color: SECURITY_COLORS.securityTooling,
        },
        {
          id: "iam-analyzer",
          label: "IAM Analyzer",
          type: "service",
          emoji: "🔍",
          color: SECURITY_COLORS.securityTooling,
        },
      ],
    },
    {
      id: "audit",
      label: "Audit Account",
      type: "account",
      emoji: "✅",
      color: SECURITY_COLORS.audit,
      children: [
        {
          id: "config-rules",
          label: "Config Rules",
          type: "service",
          emoji: "📋",
          color: SECURITY_COLORS.audit,
        },
        {
          id: "cloudwatch",
          label: "CloudWatch",
          type: "service",
          emoji: "⏰",
          color: SECURITY_COLORS.audit,
        },
        {
          id: "sns-alerts",
          label: "SNS Alerts",
          type: "service",
          emoji: "📢",
          color: SECURITY_COLORS.audit,
        },
      ],
    },
  ],
};

// Node appearance order synced to build steps
export const NODE_APPEARANCE_ORDER = [
  "security-ou", // BUILD_STEP_1: Security OU
  "log-archive", // BUILD_STEP_2: Log Archive account
  "cloudtrail", // BUILD_STEP_2: services
  "config-logs",
  "vpc-logs",
  "security-tooling", // BUILD_STEP_3: Security Tooling account
  "guardduty", // BUILD_STEP_3: services
  "securityhub",
  "iam-analyzer",
  "audit", // BUILD_STEP_4: Audit account
  "config-rules", // BUILD_STEP_4: services
  "cloudwatch",
  "sns-alerts",
] as const;

export const PHASE = {
  // Hero
  HERO_START: 0,
  HERO_END: 60,

  // Terminal & Prompt
  TERMINAL_APPEAR: 40,
  PROMPT_START: 55,
  PROMPT_DONE: 120,

  // Claude Response
  CLAUDE_THINKING: 125,
  CLAUDE_RESPONSE: 140,

  // Option Pills
  PILLS_APPEAR: 170,
  PILL_SELECT: 220,
  PILLS_FADE: 250,

  // Build Phase
  BUILD_START: 250,
  BUILD_STEP_1: 270, // Security OU
  BUILD_STEP_2: 300, // Log Archive + services
  BUILD_STEP_3: 350, // Security Tooling + services
  BUILD_STEP_4: 400, // Audit + services
  BUILD_STEP_5: 440, // SCPs
  BUILD_DONE: 460,

  // Final
  FINAL_MESSAGE: 470,
  HOLD_END: 540,
} as const;
