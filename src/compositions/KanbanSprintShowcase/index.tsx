import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { ThemeProvider, modernTheme, useTheme } from "../../themes";
import type { Theme } from "../../themes";

const kanbanTheme: Theme = {
  ...modernTheme,
  effects: {
    ...modernTheme.effects,
    perspective: { enabled: false, rotateX: 0, rotateY: 0, distance: 2000 },
  },
};
import {
  Background,
  TerminalWindow,
  CommandLine,
  StatusMessage,
  Scanlines,
} from "../../components";
import { useSpringEntrance, calculateScroll } from "../../animations";
import {
  AGENTS,
  CARDS,
  COLUMNS,
  CARD_TRANSITIONS,
  AGENT_TASK_UPDATES,
  COMMAND,
  PHASE,
} from "./data";
import type { ColumnId, KanbanCard } from "./data";

// ─── HeroOverlay (thumbnail / first-frame hook) ─────────────────────

const HeroOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Fully visible at frame 0, fades out as terminal content appears
  const opacity = interpolate(frame, [40, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (opacity <= 0) return null;

  const pulseGlow = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.6, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        zIndex: 50,
      }}
    >
      {/* Big number + label */}
      <div
        style={{
          fontFamily: theme.typography.system,
          fontSize: 120,
          fontWeight: 700,
          color: "white",
          lineHeight: 1,
          textShadow: `0 0 ${60 * pulseGlow}px rgba(150, 100, 255, 0.6), 0 0 120px rgba(150, 100, 255, 0.3)`,
        }}
      >
        5 AI Agents
      </div>
      <div
        style={{
          fontFamily: theme.typography.system,
          fontSize: 56,
          fontWeight: 500,
          color: "rgba(255, 255, 255, 0.7)",
          marginTop: 16,
        }}
      >
        ship a feature sprint
      </div>

      {/* Colored agent dots as visual hook */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginTop: 40,
        }}
      >
        {AGENTS.map((agent) => (
          <div
            key={agent.name}
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: agent.color,
              boxShadow: `0 0 ${12 * pulseGlow}px ${agent.color}`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Helpers ────────────────────────────────────────────────────────

function getCardColumn(cardIndex: number, frame: number): ColumnId {
  let column: ColumnId = "backlog";
  for (const [ci, target, transFrame] of CARD_TRANSITIONS) {
    if (ci === cardIndex && frame >= transFrame) {
      column = target;
    }
  }
  return column;
}

function getAgentSubTask(agentIndex: number, frame: number): string {
  let task = AGENTS[agentIndex].subTask ?? "";
  for (const [ai, newTask, updateFrame] of AGENT_TASK_UPDATES) {
    if (ai === agentIndex && frame >= updateFrame) {
      task = newTask;
    }
  }
  return task;
}

function getTransitionFrame(cardIndex: number, targetColumn: ColumnId): number | null {
  for (const [ci, col, f] of CARD_TRANSITIONS) {
    if (ci === cardIndex && col === targetColumn) return f;
  }
  return null;
}

// ─── ClaudeHeader ───────────────────────────────────────────────────

const ClaudeHeader: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ marginBottom: 24, opacity }}>
      <div
        style={{
          fontFamily: theme.typography.mono,
          fontSize: theme.typography.sizes.xl,
        }}
      >
        <span style={{ color: theme.colors.text.brand }}>Claude Code</span>
        <span style={{ color: theme.colors.text.muted }}> v2.1.20</span>
      </div>
      <div
        style={{
          fontFamily: theme.typography.mono,
          fontSize: theme.typography.sizes.md,
          color: theme.colors.text.muted,
        }}
      >
        Opus 4.5 · Claude Max · ~/project/feature-sprint
      </div>
    </div>
  );
};

// ─── KanbanBoard ────────────────────────────────────────────────────

const COLUMN_WIDTH = 400;
const CARD_HEIGHT = 36;
const COLUMN_HEADER_HEIGHT = 44;
const BOARD_PADDING = 12;

const columnAccents: Record<ColumnId, string> = {
  backlog: "#888",
  in_progress: "#4ecdc4",
  review: "#fdcb6e",
  done: "#27ca3f",
};

const KanbanBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const boardOpacity = interpolate(
    frame,
    [PHASE.BOARD_APPEAR, PHASE.BOARD_APPEAR + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: theme.typography.sizes.sm,
        opacity: boardOpacity,
        marginBottom: 20,
        marginTop: 8,
      }}
    >
      {/* Top border */}
      <div style={{ color: theme.colors.text.muted, whiteSpace: "pre" }}>
        {"┌" +
          COLUMNS.map(
            (_, i) =>
              "─".repeat(COLUMN_WIDTH / 10) +
              (i < COLUMNS.length - 1 ? "┬" : "")
          ).join("") +
          "┐"}
      </div>

      {/* Column headers */}
      <div style={{ display: "flex" }}>
        {COLUMNS.map((col, i) => {
          const cardsInCol = CARDS.filter(
            (_, ci) => getCardColumn(ci, frame) === col.id
          ).length;
          return (
            <div
              key={col.id}
              style={{
                width: COLUMN_WIDTH,
                borderLeft:
                  i === 0 ? `1px solid ${theme.colors.text.muted}` : "none",
                borderRight: `1px solid ${theme.colors.text.muted}`,
                textAlign: "center",
                padding: "8px 0",
                height: COLUMN_HEADER_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  color: columnAccents[col.id],
                  fontWeight: 600,
                  fontSize: theme.typography.sizes.sm,
                }}
              >
                {col.label}
              </span>
              <span
                style={{
                  color: theme.colors.text.muted,
                  fontSize: theme.typography.sizes.xs,
                }}
              >
                ({cardsInCol})
              </span>
            </div>
          );
        })}
      </div>

      {/* Separator */}
      <div style={{ color: theme.colors.text.muted, whiteSpace: "pre" }}>
        {"├" +
          COLUMNS.map(
            (_, i) =>
              "─".repeat(COLUMN_WIDTH / 10) +
              (i < COLUMNS.length - 1 ? "┼" : "")
          ).join("") +
          "┤"}
      </div>

      {/* Card area */}
      <div style={{ display: "flex" }}>
        {COLUMNS.map((col, colIdx) => (
          <KanbanColumn key={col.id} columnId={col.id} colIdx={colIdx} />
        ))}
      </div>

      {/* Bottom border */}
      <div style={{ color: theme.colors.text.muted, whiteSpace: "pre" }}>
        {"└" +
          COLUMNS.map(
            (_, i) =>
              "─".repeat(COLUMN_WIDTH / 10) +
              (i < COLUMNS.length - 1 ? "┴" : "")
          ).join("") +
          "┘"}
      </div>
    </div>
  );
};

const KanbanColumn: React.FC<{ columnId: ColumnId; colIdx: number }> = ({
  columnId,
  colIdx,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const maxCards = 6;

  const cardsInColumn: { card: KanbanCard; cardIndex: number }[] = [];
  CARDS.forEach((card, ci) => {
    if (getCardColumn(ci, frame) === columnId) {
      cardsInColumn.push({ card, cardIndex: ci });
    }
  });

  return (
    <div
      style={{
        width: COLUMN_WIDTH,
        minHeight: maxCards * CARD_HEIGHT + BOARD_PADDING * 2,
        borderLeft:
          colIdx === 0 ? `1px solid ${theme.colors.text.muted}` : "none",
        borderRight: `1px solid ${theme.colors.text.muted}`,
        padding: `${BOARD_PADDING}px 16px`,
      }}
    >
      {cardsInColumn.map(({ card, cardIndex }) => {
        const transFrame = getTransitionFrame(cardIndex, columnId);
        const cardOpacity =
          transFrame !== null
            ? interpolate(frame, [transFrame, transFrame + 12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })
            : 1; // backlog cards are visible from board appear

        return (
          <div
            key={card.id}
            style={{
              height: CARD_HEIGHT,
              display: "flex",
              alignItems: "center",
              opacity: cardOpacity,
              gap: 8,
            }}
          >
            <span style={{ color: card.color, fontSize: 18 }}>{"▪"}</span>
            <span style={{ color: theme.colors.text.secondary }}>
              {card.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── AgentStatusSection ─────────────────────────────────────────────

const AgentStatusSection: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const sectionOpacity = interpolate(
    frame,
    [PHASE.AGENTS_APPEAR, PHASE.AGENTS_APPEAR + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: theme.typography.sizes.md,
        opacity: sectionOpacity,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          color: theme.colors.text.secondary,
          marginBottom: 10,
          fontSize: theme.typography.sizes.sm,
        }}
      >
        <span style={{ color: theme.colors.bullet }}>{"⏺"}</span>{" "}
        Running 5 agents in parallel
      </div>
      <div style={{ marginLeft: 8 }}>
        {AGENTS.map((agent, i) => (
          <AgentStatusRow
            key={agent.name}
            agentIndex={i}
            isLast={i === AGENTS.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

const AgentStatusRow: React.FC<{
  agentIndex: number;
  isLast: boolean;
}> = ({ agentIndex, isLast }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  const agent = AGENTS[agentIndex];

  const staggerDelay = PHASE.AGENTS_APPEAR + 10 + agentIndex * 6;
  const entryOpacity = useSpringEntrance(staggerDelay);

  const currentTask = getAgentSubTask(agentIndex, frame);

  // Animate tool uses counter
  const workStart = PHASE.WAVE1_START;
  const workEnd = PHASE.SUMMARY;
  const toolProgress = interpolate(frame, [workStart, workEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const displayTools = Math.floor(agent.toolUses * toolProgress);

  const treeChar = isLast ? "└─" : "├─";

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: theme.typography.sizes.sm,
        marginBottom: 4,
        opacity: Math.max(0, entryOpacity),
        transform: `translateX(${(1 - Math.max(0, entryOpacity)) * 20}px)`,
        display: "flex",
        alignItems: "center",
      }}
    >
      <span
        style={{ color: theme.colors.text.muted, marginRight: 8, width: 28 }}
      >
        {treeChar}
      </span>
      <span style={{ color: agent.color, fontWeight: 500, minWidth: 200 }}>
        {agent.name}
      </span>
      <span style={{ color: theme.colors.text.muted, marginLeft: 10 }}>·</span>
      <span
        style={{
          color: theme.colors.text.secondary,
          marginLeft: 10,
          minWidth: 180,
        }}
      >
        {currentTask}
      </span>
      <span style={{ color: theme.colors.text.muted, marginLeft: 10 }}>·</span>
      <span style={{ color: theme.colors.status.info, marginLeft: 10 }}>
        {displayTools} tools
      </span>
    </div>
  );
};

// ─── SprintSummary ──────────────────────────────────────────────────

const SprintSummary: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const opacity = useSpringEntrance(PHASE.SUMMARY);
  const verdictGlow = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.7, 1]);

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        opacity,
        marginTop: 8,
      }}
    >
      <div
        style={{
          fontSize: theme.typography.sizes.lg,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            color: theme.colors.status.success,
            fontWeight: 600,
            textShadow: `0 0 ${20 * verdictGlow}px rgba(39, 202, 63, 0.5)`,
          }}
        >
          Sprint complete
        </span>
      </div>
      <div
        style={{
          fontSize: theme.typography.sizes.sm,
          color: theme.colors.text.muted,
        }}
      >
        6 tasks · 5 agents · 87 tool calls · 238.5k tokens
      </div>
    </div>
  );
};

// ─── Main Composition ───────────────────────────────────────────────

const KanbanSprintShowcaseInner: React.FC = () => {
  const frame = useCurrentFrame();

  const scrollAmount = calculateScroll(frame, [
    {
      startFrame: PHASE.BOARD_APPEAR,
      endFrame: PHASE.AGENTS_APPEAR + 40,
      distance: 100,
    },
    {
      startFrame: PHASE.WAVE1_START,
      endFrame: PHASE.WAVE2_START,
      distance: 80,
    },
    {
      startFrame: PHASE.WAVE2_DONE,
      endFrame: PHASE.SUMMARY + 30,
      distance: 100,
      easing: Easing.inOut(Easing.quad),
    },
  ]);

  const showBoard = frame >= PHASE.BOARD_APPEAR;
  const showAgents = frame >= PHASE.AGENTS_APPEAR;
  const showSummary = frame >= PHASE.SUMMARY;

  return (
    <Background>
      <HeroOverlay />

      <TerminalWindow>
        <div style={{ transform: `translateY(-${scrollAmount}px)` }}>
          <ClaudeHeader />
          <CommandLine
            command={COMMAND}
            startFrame={PHASE.COMMAND_START}
            hideCursorAfter={PHASE.COMMAND_DONE}
          />

          {frame >= PHASE.COMMAND_DONE && (
            <StatusMessage delay={PHASE.COMMAND_DONE}>
              Initializing sprint with 5 agents · 6 tasks queued
            </StatusMessage>
          )}

          {showBoard && <KanbanBoard />}
          {showAgents && <AgentStatusSection />}
          {showSummary && <SprintSummary />}
        </div>
      </TerminalWindow>

      <Scanlines />
    </Background>
  );
};

export const KanbanSprintShowcase: React.FC = () => (
  <ThemeProvider theme={kanbanTheme}>
    <KanbanSprintShowcaseInner />
  </ThemeProvider>
);
