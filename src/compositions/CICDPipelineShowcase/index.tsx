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
  PIPELINE_COLORS,
  PIPELINE_RUN_ORDER,
  PIPELINE_RUN_STAGGER,
  PHASE,
  getLineAppearFrame,
  getNodeAppearFrame,
  getConnectionAppearFrame,
  type ArchNodeData,
  type ArchConnection,
  type SubgraphBox,
} from "./data";

// Flat version of oceanTheme (no 3D perspective)
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
            textShadow: `0 0 60px rgba(59, 130, 246, ${glowIntensity})`,
          }}
        >
          🚀
        </div>

        <div
          style={{
            fontSize: 82,
            fontWeight: 900,
            fontFamily: theme.typography.system,
            color: "#fff",
            textShadow: `0 0 80px rgba(59, 130, 246, ${glowIntensity}), 0 0 160px rgba(139, 92, 246, 0.3)`,
            letterSpacing: -2,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          CI/CD Pipeline
        </div>

        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            fontFamily: theme.typography.system,
            color: PIPELINE_COLORS.blue,
            textTransform: "uppercase",
            letterSpacing: 6,
            textShadow: `0 0 30px rgba(59, 130, 246, ${glowIntensity})`,
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

  const visibleLines = MERMAID_LINES.map((line, index) => ({
    ...line,
    index,
    appearFrame: getLineAppearFrame(index),
    visible: frame >= getLineAppearFrame(index),
  })).filter((l) => l.visible);

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

const NODE_WIDTH = 155;
const NODE_HEIGHT = 52;
const DIAMOND_SIZE = 80;

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

  if (node.shape === "diamond") {
    return (
      <div
        style={{
          position: "absolute",
          left: node.x - DIAMOND_SIZE / 2,
          top: node.y + (NODE_HEIGHT - DIAMOND_SIZE) / 2,
          width: DIAMOND_SIZE,
          height: DIAMOND_SIZE,
          opacity: appear,
          transform: `scale(${appear})`,
        }}
      >
        {/* Rotated diamond background */}
        <div
          style={{
            position: "absolute",
            width: DIAMOND_SIZE,
            height: DIAMOND_SIZE,
            backgroundColor: `${color}20`,
            border: `2.5px solid ${color}`,
            borderRadius: 8,
            transform: "rotate(45deg)",
            boxShadow: `0 0 24px ${color}40`,
          }}
        />
        {/* Counter-rotated label */}
        <div
          style={{
            position: "absolute",
            width: DIAMOND_SIZE,
            height: DIAMOND_SIZE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontFamily: theme.typography.mono,
              fontWeight: 700,
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            {node.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: node.x - NODE_WIDTH / 2,
        top: node.y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
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

  const appearFrame = box.group === "ci" ? PHASE.CI_BOX : PHASE.CD_BOX;

  const elapsed = frame - appearFrame;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  return (
    <>
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

const ConnectionLine: React.FC<ConnectionLineProps> = ({ connection }) => {
  const frame = useCurrentFrame();

  const appearFrame = getConnectionAppearFrame(connection.group);
  const elapsed = frame - appearFrame;
  if (elapsed < 0) return null;

  const drawProgress = interpolate(elapsed, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fromNode = ARCH_NODES.find((n) => n.id === connection.from);
  const toNode = ARCH_NODES.find((n) => n.id === connection.to);
  if (!fromNode || !toNode) return null;

  const color = NODE_COLORS[fromNode.category];
  const isDotted = connection.type === "dotted";

  let pathD: string;

  if (connection.path) {
    pathD = connection.path;
  } else {
    // Same-row horizontal connection
    const sameRow = Math.abs(fromNode.y - toNode.y) < 20;

    if (sameRow) {
      const goingRight = toNode.x > fromNode.x;
      const fromIsDiamond = fromNode.shape === "diamond";
      const toIsDiamond = toNode.shape === "diamond";

      const x1 = fromIsDiamond
        ? fromNode.x + DIAMOND_SIZE / 2
        : fromNode.x + (goingRight ? NODE_WIDTH / 2 : -NODE_WIDTH / 2);
      const y1 = fromNode.y + NODE_HEIGHT / 2;
      const x2 = toIsDiamond
        ? toNode.x - DIAMOND_SIZE / 2
        : toNode.x + (goingRight ? -NODE_WIDTH / 2 : NODE_WIDTH / 2);
      const y2 = toNode.y + NODE_HEIGHT / 2;

      pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
    } else {
      // Vertical connection (monitor → rollback)
      const x1 = fromNode.x;
      const y1 = fromNode.y + NODE_HEIGHT;
      const x2 = toNode.x;
      const y2 = toNode.y;

      pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
    }
  }

  const pathLength = 600;

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
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
      {/* Edge label */}
      {connection.label && drawProgress > 0.5 && (
        <EdgeLabel pathD={pathD} label={connection.label} color={color} opacity={(drawProgress - 0.5) * 2} />
      )}
    </svg>
  );
};

// ─── Edge Label ──────────────────────────────────────────────────────────────

interface EdgeLabelProps {
  pathD: string;
  label: string;
  color: string;
  opacity: number;
}

const EdgeLabel: React.FC<EdgeLabelProps> = ({ pathD, label, color, opacity }) => {
  // Parse the path to find midpoint
  const coords = pathD.match(/[-\d.]+/g)?.map(Number) || [];
  if (coords.length < 4) return null;

  // Use midpoint of first segment
  const midX = (coords[0] + coords[2]) / 2;
  const midY = (coords[1] + coords[3]) / 2;

  const textWidth = label.length * 11 + 18;

  return (
    <g opacity={opacity}>
      <rect
        x={midX - textWidth / 2}
        y={midY - 14}
        width={textWidth}
        height={28}
        rx={6}
        fill="#0a1628"
        stroke={color}
        strokeWidth={1.5}
        opacity={0.9}
      />
      <text
        x={midX}
        y={midY + 6}
        textAnchor="middle"
        fill={color}
        fontSize={18}
        fontWeight={700}
        fontFamily="monospace"
      >
        {label}
      </text>
    </g>
  );
};

// ─── Pipeline Run Animation ──────────────────────────────────────────────────

const PipelineRunAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < PHASE.PIPELINE_RUN) return null;

  return (
    <>
      {PIPELINE_RUN_ORDER.map((nodeId, index) => {
        const checkAppear = PHASE.PIPELINE_RUN + index * PIPELINE_RUN_STAGGER;
        const elapsed = frame - checkAppear;
        if (elapsed < 0) return null;

        const node = ARCH_NODES.find((n) => n.id === nodeId);
        if (!node) return null;

        const pop = spring({
          frame: elapsed,
          fps,
          config: { damping: 10, stiffness: 200 },
        });

        const isDiamond = node.shape === "diamond";
        const cx = isDiamond ? node.x + DIAMOND_SIZE / 2 + 4 : node.x + NODE_WIDTH / 2 - 4;
        const cy = node.y - 4;

        return (
          <div
            key={nodeId}
            style={{
              position: "absolute",
              left: cx - 11,
              top: cy - 11,
              width: 22,
              height: 22,
              borderRadius: "50%",
              backgroundColor: "#22C55E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${pop})`,
              opacity: pop,
              boxShadow: "0 0 12px rgba(34, 197, 94, 0.6)",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: 13,
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              ✓
            </span>
          </div>
        );
      })}
    </>
  );
};

// ─── Architecture Diagram ────────────────────────────────────────────────────

const ArchDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < PHASE.CI_BOX - 10) return null;

  const appear = spring({
    frame: frame - (PHASE.CI_BOX - 10),
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

      {/* Pipeline run checkmarks */}
      <PipelineRunAnimation />
    </div>
  );
};

// ─── Main Composition ────────────────────────────────────────────────────────

const CICDPipelineShowcaseInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

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
          <TerminalWindow title="claude code · ~/pipeline">
            <div style={{ padding: "8px 0" }}>
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
                  Opus 4.5 · ~/pipeline
                </div>
              </div>

              {showCommand && (
                <CommandLine
                  command={COMMAND}
                  startFrame={PHASE.PROMPT_START}
                  hideCursorAfter={PHASE.PROMPT_DONE}
                  fontSize={24}
                />
              )}

              {showThinking && (
                <ThinkingDots
                  delay={PHASE.CLAUDE_THINKING}
                  label="Thinking"
                  fontSize={22}
                />
              )}

              {showResponse && (
                <StatusMessage
                  delay={PHASE.CLAUDE_RESPONSE}
                  fontSize={20}
                >
                  {CLAUDE_RESPONSE}
                </StatusMessage>
              )}

              <MermaidCodeBlock />

              {showFinalMessage && (
                <div style={{ marginTop: 16 }}>
                  <StatusMessage
                    delay={PHASE.FINAL_MESSAGE}
                    fontSize={22}
                    color={theme.colors.status.success}
                  >
                    ✓ Pipeline diagram generated
                  </StatusMessage>
                </div>
              )}
            </div>
          </TerminalWindow>
        </div>
      )}

      <ArchDiagram />

      <Scanlines />
    </Background>
  );
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const CICDPipelineShowcase: React.FC = () => (
  <ThemeProvider theme={flatOceanTheme}>
    <CICDPipelineShowcaseInner />
  </ThemeProvider>
);
