import type { AgentData } from "../../types";

export interface KanbanCard {
  id: string;
  label: string;
  agentName: string;
  color: string;
}

export const AGENTS: AgentData[] = [
  {
    name: "security-sentinel",
    label: "Security & Auth",
    toolUses: 23,
    tokens: 50.5,
    color: "#ff6b6b",
    subTask: "Auth API",
  },
  {
    name: "frontend-dev",
    label: "Frontend UI",
    toolUses: 19,
    tokens: 54.8,
    color: "#4ecdc4",
    subTask: "Button Component",
  },
  {
    name: "backend-dev",
    label: "Backend Systems",
    toolUses: 15,
    tokens: 39.6,
    color: "#a29bfe",
    subTask: "DB Schema",
  },
  {
    name: "test-runner",
    label: "Testing",
    toolUses: 15,
    tokens: 45.4,
    color: "#fdcb6e",
    subTask: "Unit Tests",
  },
  {
    name: "reviewer",
    label: "Code Review",
    toolUses: 15,
    tokens: 48.2,
    color: "#ff9f43",
    subTask: "API Docs",
  },
];

export const CARDS: KanbanCard[] = [
  { id: "auth-api", label: "Auth API", agentName: "security-sentinel", color: "#ff6b6b" },
  { id: "button-component", label: "Button Component", agentName: "frontend-dev", color: "#4ecdc4" },
  { id: "db-schema", label: "DB Schema", agentName: "backend-dev", color: "#a29bfe" },
  { id: "unit-tests", label: "Unit Tests", agentName: "test-runner", color: "#fdcb6e" },
  { id: "nav-bar", label: "Nav Bar", agentName: "frontend-dev", color: "#4ecdc4" },
  { id: "api-docs", label: "API Docs", agentName: "reviewer", color: "#ff9f43" },
];

export const COMMAND = "/sprint run --agents 5 --parallel";

export type ColumnId = "backlog" | "in_progress" | "review" | "done";

export const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: "backlog", label: "BACKLOG" },
  { id: "in_progress", label: "IN PROGRESS" },
  { id: "review", label: "REVIEW" },
  { id: "done", label: "DONE" },
];

// Card transitions: [cardIndex, targetColumn, frame]
export const CARD_TRANSITIONS: [number, ColumnId, number][] = [
  // Wave 1: first 4 cards → IN PROGRESS
  [0, "in_progress", 130],
  [1, "in_progress", 140],
  [2, "in_progress", 150],
  [3, "in_progress", 160],
  // Wave 1 review: first 2 → REVIEW
  [0, "review", 210],
  [1, "review", 220],
  // Wave 2: remaining 2 cards → IN PROGRESS
  [4, "in_progress", 250],
  [5, "in_progress", 260],
  // Wave 1 done: first 2 → DONE
  [0, "done", 300],
  [1, "done", 310],
  // Wave 2 review: next 2 → REVIEW
  [2, "review", 340],
  [3, "review", 350],
  // Wave 3 review: last 2 → REVIEW
  [4, "review", 380],
  [5, "review", 390],
  // Wave 2 done: next 2 → DONE
  [2, "done", 420],
  [3, "done", 430],
  // Wave 3 done: last 2 → DONE
  [4, "done", 480],
  [5, "done", 490],
];

// Agent sub-task updates: [agentIndex, newSubTask, frame]
export const AGENT_TASK_UPDATES: [number, string, number][] = [
  // Wave 2: frontend-dev picks up Nav Bar, reviewer picks up API Docs
  [1, "Nav Bar", 250],
  [4, "API Docs", 260],
];

export const PHASE = {
  HEADER: 0,
  COMMAND_START: 10,
  COMMAND_DONE: 55,
  BOARD_APPEAR: 65,
  AGENTS_APPEAR: 95,
  WAVE1_START: 130,
  WAVE1_REVIEW: 210,
  WAVE2_START: 250,
  WAVE1_DONE: 300,
  WAVE2_REVIEW: 340,
  WAVE3_REVIEW: 380,
  WAVE2_DONE: 420,
  WAVE3_DONE: 480,
  SUMMARY: 510,
  END: 600,
} as const;
