import type { AgentData, SeverityRow, CriticalIssueData } from "../../types";

export const AGENTS: AgentData[] = [
  { name: "security-sentinel", label: "Security validation", toolUses: 23, tokens: 50.5, color: "#ff6b6b", subTask: "Bash: Create validation directory" },
  { name: "architecture-strategist", label: "Architecture validation", toolUses: 19, tokens: 54.8, color: "#a29bfe", subTask: "Bash: Create validation directory if it doesn't exist" },
  { name: "performance-oracle", label: "Performance validation", toolUses: 15, tokens: 39.6, color: "#fdcb6e", subTask: "Bash: Create validation directory" },
  { name: "Task", label: "UX validation", toolUses: 15, tokens: 45.4, color: "#4ecdc4", subTask: "Bash: Check if validation folder exists" },
  { name: "devils-advocate", label: "Devils advocate validation", toolUses: 20, tokens: 48.7, color: "#ff9f43", subTask: "Bash: Create validation directory if it doesn't exist" },
];

export const SEVERITY_DATA: SeverityRow[] = [
  { label: "Critical", count: 19, color: "#ff6b6b" },
  { label: "High", count: 26, color: "#ff9f43" },
  { label: "Medium", count: 29, color: "#fdcb6e" },
  { label: "Low", count: 20, color: "#888888" },
];

export const CRITICAL_ISSUES: CriticalIssueData[] = [
  { validator: "Security", finding: "Auth/secrets/session management not specified" },
  { validator: "Architecture", finding: "Circular dependencies, missing LLM resilience" },
  { validator: "Performance", finding: "N+1 queries, unbounded memory, no circuit breakers" },
  { validator: "UX", finding: "No accessibility strategy, missing loading states" },
  { validator: "Devil's Advocate", finding: "LLM-judge reliability, cost explosion risk" },
];

export const NEXT_STEPS = [
  "Authentication + secrets management architecture",
  "LLM provider resilience (circuit breakers)",
  "EventBus pattern to break circular dependencies",
  "Cost controls and budget limits",
];

export const COMMAND = "/validate-design agent-forge";

export const PHASE = {
  HEADER: 0,
  COMMAND_START: 10,
  COMMAND_DONE: 50,
  SETUP_MSGS: 55,
  STEP1: 75,
  USER_QUESTION: 90,
  STEP2: 115,
  STEP3: 135,
  AGENTS_START: 145,
  LOADING: 200,
  RESULTS_START: 350,
  TABLES_START: 380,
  NEXT_STEPS: 460,
} as const;
