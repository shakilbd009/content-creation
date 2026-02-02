import type { TaskItemData, CodeSnippetData } from "../../types";

export const TASKS: TaskItemData[] = [
  { id: "C1", category: "Security", label: "CSRF Token Validation", color: "#ff6b6b" },
  { id: "C2", category: "Security", label: "Input Sanitization at Data Layer", color: "#ff6b6b" },
  { id: "C3", category: "Security", label: "Session Invalidation", color: "#ff6b6b" },
  { id: "C1", category: "Performance", label: "Event History Partitioning", color: "#fdcb6e" },
  { id: "C2", category: "Performance", label: "Query Projections", color: "#fdcb6e" },
  { id: "C3", category: "Performance", label: "Async Event Bus", color: "#fdcb6e" },
  { id: "C1", category: "Devils Advocate", label: "Hybrid LLM Validation", color: "#ff9f43" },
  { id: "C2", category: "Devils Advocate", label: "Cost Transparency", color: "#ff9f43" },
  { id: "C3", category: "Devils Advocate", label: "Agent SLAs", color: "#ff9f43" },
  { id: "C4", category: "Devils Advocate", label: "Defense in Depth for Sandbox", color: "#ff9f43" },
];

export const CODE_SNIPPETS: CodeSnippetData[] = [
  { task: 0, code: "CSRFMiddleware(next http.Handler)", file: "authentication.md" },
  { task: 1, code: "SanitizeInput(input string) string", file: "data-layer.md" },
  { task: 2, code: "InvalidateAllSessions(userID)", file: "session.md" },
  { task: 3, code: "PartitionByTimeRange(events)", file: "event-store.md" },
  { task: 4, code: "ProjectionBuilder.Select()", file: "queries.md" },
  { task: 5, code: "AsyncEventBus.Publish(event)", file: "event-bus.md" },
];

export const COMMAND = "address Critical issues for @ideas/agent-forge/";

export const PHASE = {
  HEADER: 0,
  COMMAND_START: 10,
  COMMAND_DONE: 60,
  INIT_MSG: 70,
  TASK_LIST_START: 100,
  TASK_COMPLETE_INTERVAL: 45,
  FIRST_COMPLETE: 160,
} as const;
