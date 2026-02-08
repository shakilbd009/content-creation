import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ThemeProvider, oceanTheme, useTheme, Theme } from "../../themes";
import {
  Background,
  TerminalWindow,
  Scanlines,
  CommandLine,
  StatusMessage,
  ThinkingDots,
} from "../../components";
import {
  COMMAND,
  CLAUDE_RESPONSE,
  MERMAID_LINES,
  MERMAID_SYNTAX_COLORS,
  ARCH_NODES,
  CONNECTIONS,
  SUBGRAPH_BOXES,
  NODE_COLORS,
  CLOUD_COLORS,
  PHASE,
  getLineAppearFrame,
  getNodeAppearFrame,
  getConnectionAppearFrame,
  type ArchNodeData,
  type ArchConnection,
  type SubgraphBox,
} from "./data";

// Flat version of modernTheme (no 3D perspective)
const flatOceanTheme: Theme = {
  ...oceanTheme,
  effects: {
    ...oceanTheme.effects,
    perspective: { enabled: false, rotateX: 0, rotateY: 0, distance: 0 },
  },
};

// ─── Hero Overlay ────────────────────────────────────────────────────────────

const HeroOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const opacity = interpolate(
    frame,
    [PHASE.HERO_END - 20, PHASE.HERO_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame > PHASE.HERO_END + 5) return null;

  const glowIntensity = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.5, 0.9]
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            fontSize: 80,
            textShadow: `0 0 60px rgba(6, 182, 212, ${glowIntensity})`,
          }}
        >
          ☁️
        </div>

        <div
          style={{
            fontSize: 82,
            fontWeight: 900,
            fontFamily: theme.typography.system,
            color: "#fff",
            textShadow: `0 0 80px rgba(6, 182, 212, ${glowIntensity}), 0 0 160px rgba(168, 85, 247, 0.3)`,
            letterSpacing: -2,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Cloud-Native Architecture
        </div>

        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            fontFamily: theme.typography.system,
            color: CLOUD_COLORS.cyan,
            textTransform: "uppercase",
            letterSpacing: 6,
            textShadow: `0 0 30px rgba(6, 182, 212, ${glowIntensity})`,
          }}
        >
          Mermaid → Visual in seconds
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Mermaid Code Block ──────────────────────────────────────────────────────

const MermaidCodeBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  if (frame < PHASE.CODE_BLOCK_START) return null;

  // Calculate visible lines
  const visibleLines = MERMAID_LINES.map((line, index) => ({
    ...line,
    index,
    appearFrame: getLineAppearFrame(index),
    visible: frame >= getLineAppearFrame(index),
  })).filter((l) => l.visible);

  // Scrolling: keep the latest lines visible in the container
  const LINE_HEIGHT = 21;
  const VISIBLE_HEIGHT = 280;
  const totalContentHeight = visibleLines.length * LINE_HEIGHT;
  const scrollTarget = Math.max(0, totalContentHeight - VISIBLE_HEIGHT);

  return (
    <div
      style={{
        marginTop: 16,
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        borderRadius: 8,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "10px 14px",
        height: VISIBLE_HEIGHT,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          transform: `translateY(-${scrollTarget}px)`,
        }}
      >
        {MERMAID_LINES.map((line, index) => {
          const appearFrame = getLineAppearFrame(index);
          if (frame < appearFrame) return null;

          const lineOpacity = interpolate(
            frame - appearFrame,
            [0, 6],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const color = MERMAID_SYNTAX_COLORS[line.type];

          return (
            <div
              key={index}
              style={{
                fontFamily: theme.typography.mono,
                fontSize: 16,
                lineHeight: `${LINE_HEIGHT}px`,
                color,
                opacity: lineOpacity,
                whiteSpace: "pre",
              }}
            >
              {line.text || "\u00A0"}
            </div>
          );
        })}
      </div>

      {/* Fade gradient at bottom for scroll hint */}
      {scrollTarget > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 30,
            background:
              "linear-gradient(transparent, rgba(0, 0, 0, 0.6))",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

// ─── Architecture Node ───────────────────────────────────────────────────────

interface ArchNodeComponentProps {
  node: ArchNodeData;
}

const ArchNodeComponent: React.FC<ArchNodeComponentProps> = ({ node }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const appearFrame = getNodeAppearFrame(node.id);
  const elapsed = frame - appearFrame;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const color = NODE_COLORS[node.category];
  const nodeWidth = 155;
  const nodeHeight = 52;

  return (
    <div
      style={{
        position: "absolute",
        left: node.x - nodeWidth / 2,
        top: node.y,
        width: nodeWidth,
        height: nodeHeight,
        backgroundColor: `${color}20`,
        border: `2.5px solid ${color}`,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: appear,
        transform: `scale(${appear})`,
        boxShadow: `0 0 24px ${color}40`,
      }}
    >
      <span style={{ fontSize: 20 }}>{node.emoji}</span>
      <span
        style={{
          fontSize: 16,
          fontFamily: theme.typography.mono,
          fontWeight: 600,
          color: "#fff",
          whiteSpace: "nowrap",
        }}
      >
        {node.label}
      </span>
    </div>
  );
};

// ─── Subgraph Box ────────────────────────────────────────────────────────────

interface SubgraphBoxComponentProps {
  box: SubgraphBox;
}

const SubgraphBoxComponent: React.FC<SubgraphBoxComponentProps> = ({
  box,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Box appears slightly before its contained nodes
  let appearFrame: number;
  switch (box.group) {
    case "services":
      appearFrame = PHASE.ARCH_SERVICES - 8;
      break;
    case "data":
      appearFrame = PHASE.ARCH_DATA - 8;
      break;
    case "observability":
      appearFrame = PHASE.ARCH_OBSERVABILITY - 8;
      break;
  }

  const elapsed = frame - appearFrame;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  return (
    <>
      {/* Box outline */}
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height,
          border: `1.5px solid ${box.color}35`,
          borderRadius: 14,
          backgroundColor: `${box.color}0a`,
          opacity: appear,
        }}
      />
      {/* Label */}
      <div
        style={{
          position: "absolute",
          left: box.x + 12,
          top: box.y - 10,
          fontSize: 15,
          fontWeight: 700,
          color: box.color,
          letterSpacing: 2,
          textTransform: "uppercase",
          opacity: appear * 0.8,
          backgroundColor: "#0a1628",
          padding: "0 8px",
        }}
      >
        {box.label}
      </div>
    </>
  );
};

// ─── Connection Line ─────────────────────────────────────────────────────────

interface ConnectionLineProps {
  connection: ArchConnection;
}

const NODE_WIDTH = 155;
const NODE_HEIGHT = 52;

const ConnectionLine: React.FC<ConnectionLineProps> = ({ connection }) => {
  const frame = useCurrentFrame();

  const appearFrame = getConnectionAppearFrame(connection.group);
  const elapsed = frame - appearFrame;
  if (elapsed < 0) return null;

  const drawProgress = interpolate(elapsed, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Find node positions
  const fromNode = ARCH_NODES.find((n) => n.id === connection.from);
  const toNode = ARCH_NODES.find((n) => n.id === connection.to);
  if (!fromNode || !toNode) return null;

  // Connection from bottom-center of source to top-center of target
  const fromX = fromNode.x;
  const fromY = fromNode.y + NODE_HEIGHT;
  const toX = toNode.x;
  const toY = toNode.y;

  // For same-row connections (horizontal), use side edges
  const sameRow = Math.abs(fromNode.y - toNode.y) < 20;
  let x1: number, y1: number, x2: number, y2: number;

  if (sameRow) {
    const goingRight = toNode.x > fromNode.x;
    x1 = fromNode.x + (goingRight ? NODE_WIDTH / 2 : -NODE_WIDTH / 2);
    y1 = fromNode.y + NODE_HEIGHT / 2;
    x2 = toNode.x + (goingRight ? -NODE_WIDTH / 2 : NODE_WIDTH / 2);
    y2 = toNode.y + NODE_HEIGHT / 2;
  } else {
    x1 = fromX;
    y1 = fromY;
    x2 = toX;
    y2 = toY;
  }

  const color = NODE_COLORS[fromNode.category];
  const isDotted = connection.type === "dotted";

  // L-shaped path for vertical connections
  const midY = y1 + (y2 - y1) * 0.5;
  const pathD = sameRow
    ? `M ${x1} ${y1} L ${x2} ${y2}`
    : `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;

  const pathLength = 300;

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <path
        d={pathD}
        stroke={color}
        strokeWidth={2.5}
        fill="none"
        strokeDasharray={
          isDotted
            ? `6 6`
            : `${drawProgress * pathLength} ${pathLength}`
        }
        opacity={isDotted ? drawProgress * 0.6 : drawProgress * 0.7}
      />
      {/* Arrow head */}
      {drawProgress > 0.8 && !sameRow && (
        <circle
          cx={x2}
          cy={y2}
          r={4}
          fill={color}
          opacity={(drawProgress - 0.8) * 5 * 0.7}
        />
      )}
    </svg>
  );
};

// ─── Architecture Diagram ────────────────────────────────────────────────────

const ArchDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < PHASE.ARCH_USERS - 10) return null;

  const appear = spring({
    frame: frame - (PHASE.ARCH_USERS - 10),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  return (
    <div
      style={{
        position: "absolute",
        right: 40,
        top: "50%",
        transform: "translateY(-50%)",
        width: 960,
        height: 530,
        opacity: appear,
      }}
    >
      {/* Subgraph boxes */}
      {SUBGRAPH_BOXES.map((box) => (
        <SubgraphBoxComponent key={box.label} box={box} />
      ))}

      {/* Connection lines (render behind nodes) */}
      {CONNECTIONS.map((conn) => (
        <ConnectionLine
          key={`${conn.from}-${conn.to}`}
          connection={conn}
        />
      ))}

      {/* Architecture nodes */}
      {ARCH_NODES.map((node) => (
        <ArchNodeComponent key={node.id} node={node} />
      ))}
    </div>
  );
};

// ─── Main Composition ────────────────────────────────────────────────────────

const CloudNativeShowcaseInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Terminal appearance
  const terminalAppear = spring({
    frame: frame - PHASE.TERMINAL_APPEAR,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const showTerminal = frame >= PHASE.TERMINAL_APPEAR - 10;
  const showCommand = frame >= PHASE.PROMPT_START;
  const showThinking =
    frame >= PHASE.CLAUDE_THINKING && frame < PHASE.CLAUDE_RESPONSE;
  const showResponse = frame >= PHASE.CLAUDE_RESPONSE;
  const showFinalMessage = frame >= PHASE.FINAL_MESSAGE;

  return (
    <Background>
      <HeroOverlay />

      {/* Terminal - positioned on the left */}
      {showTerminal && (
        <div
          style={{
            position: "absolute",
            left: 60,
            top: "50%",
            transform: `translateY(-50%) scale(${Math.min(1, terminalAppear)})`,
            opacity: terminalAppear,
            width: 750,
          }}
        >
          <TerminalWindow title="claude code · ~/cloud-project">
            <div style={{ padding: "8px 0" }}>
              {/* Header */}
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontFamily: theme.typography.mono,
                    fontSize: 24,
                  }}
                >
                  <span style={{ color: theme.colors.text.brand }}>
                    Claude Code
                  </span>
                  <span style={{ color: theme.colors.text.muted }}>
                    {" "}
                    v2.1.20
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: theme.typography.mono,
                    fontSize: 16,
                    color: theme.colors.text.muted,
                  }}
                >
                  Opus 4.5 · ~/cloud-project
                </div>
              </div>

              {/* User prompt */}
              {showCommand && (
                <CommandLine
                  command={COMMAND}
                  startFrame={PHASE.PROMPT_START}
                  hideCursorAfter={PHASE.PROMPT_DONE}
                  fontSize={24}
                />
              )}

              {/* Thinking dots */}
              {showThinking && (
                <ThinkingDots
                  delay={PHASE.CLAUDE_THINKING}
                  label="Thinking"
                  fontSize={22}
                />
              )}

              {/* Claude response */}
              {showResponse && (
                <StatusMessage
                  delay={PHASE.CLAUDE_RESPONSE}
                  fontSize={20}
                >
                  {CLAUDE_RESPONSE}
                </StatusMessage>
              )}

              {/* Mermaid code block */}
              <MermaidCodeBlock />

              {/* Final success message */}
              {showFinalMessage && (
                <div style={{ marginTop: 16 }}>
                  <StatusMessage
                    delay={PHASE.FINAL_MESSAGE}
                    fontSize={22}
                    color={theme.colors.status.success}
                  >
                    ✓ Architecture diagram generated
                  </StatusMessage>
                </div>
              )}
            </div>
          </TerminalWindow>
        </div>
      )}

      {/* Architecture Visualization */}
      <ArchDiagram />

      <Scanlines />
    </Background>
  );
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const CloudNativeShowcase: React.FC = () => (
  <ThemeProvider theme={flatOceanTheme}>
    <CloudNativeShowcaseInner />
  </ThemeProvider>
);
