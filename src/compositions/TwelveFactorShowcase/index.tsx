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
  FACTOR_NODES,
  CONNECTIONS,
  CENTER_NODE,
  CATEGORY_COLORS,
  TWELVE_FACTOR_COLORS,
  PHASE,
  getLineAppearFrame,
  getFactorNodeAppearFrame,
  getConnectionAppearFrame,
  type FactorNode,
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
          12-Factor App
        </div>

        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            fontFamily: theme.typography.system,
            color: TWELVE_FACTOR_COLORS.cyan,
            textTransform: "uppercase",
            letterSpacing: 6,
            textShadow: `0 0 30px rgba(6, 182, 212, ${glowIntensity})`,
          }}
        >
          Mindmap → Visual in seconds
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

// ─── Center Node ────────────────────────────────────────────────────────────

const CenterNodeComponent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const elapsed = frame - PHASE.CENTER_NODE;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.4, 0.8]
  );

  return (
    <div
      style={{
        position: "absolute",
        left: CENTER_NODE.x - CENTER_NODE.width / 2,
        top: CENTER_NODE.y - CENTER_NODE.height / 2,
        width: CENTER_NODE.width,
        height: CENTER_NODE.height,
        borderRadius: CENTER_NODE.height / 2,
        background: `linear-gradient(135deg, ${TWELVE_FACTOR_COLORS.cyan}30, ${TWELVE_FACTOR_COLORS.purple}30)`,
        border: `3px solid ${TWELVE_FACTOR_COLORS.cyan}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: appear,
        transform: `scale(${appear})`,
        boxShadow: `0 0 40px rgba(6, 182, 212, ${glowIntensity}), 0 0 80px rgba(168, 85, 247, ${glowIntensity * 0.4})`,
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontFamily: theme.typography.mono,
          fontWeight: 800,
          color: "#fff",
          textAlign: "center",
          lineHeight: 1.2,
          whiteSpace: "pre-line",
        }}
      >
        {CENTER_NODE.label}
      </span>
    </div>
  );
};

// ─── Factor Node Component ──────────────────────────────────────────────────

interface FactorNodeComponentProps {
  node: FactorNode;
}

const FactorNodeComponent: React.FC<FactorNodeComponentProps> = ({ node }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const appearFrame = getFactorNodeAppearFrame(node);
  const elapsed = frame - appearFrame;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const color = CATEGORY_COLORS[node.category];
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
        gap: 6,
        opacity: appear,
        transform: `scale(${appear})`,
        boxShadow: `0 0 24px ${color}40`,
      }}
    >
      {/* Number badge */}
      <div
        style={{
          position: "absolute",
          top: -10,
          left: -10,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 800,
          fontFamily: theme.typography.mono,
          color: "#000",
          boxShadow: `0 0 12px ${color}80`,
        }}
      >
        {node.number}
      </div>

      <span style={{ fontSize: 18 }}>{node.emoji}</span>
      <span
        style={{
          fontSize: 15,
          fontFamily: theme.typography.mono,
          fontWeight: 600,
          color: "#fff",
          whiteSpace: "nowrap",
        }}
      >
        {node.title}
      </span>
    </div>
  );
};

// ─── Connection Line ─────────────────────────────────────────────────────────

interface ConnectionLineProps {
  node: FactorNode;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ node }) => {
  const frame = useCurrentFrame();

  const appearFrame = getConnectionAppearFrame(node);
  const elapsed = frame - appearFrame;
  if (elapsed < 0) return null;

  const drawProgress = interpolate(elapsed, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const color = CATEGORY_COLORS[node.category];

  // Center node edges
  const cx = CENTER_NODE.x;
  const cy = CENTER_NODE.y;

  // Factor node center
  const nodeWidth = 155;
  const nodeHeight = 52;
  const fx = node.x;
  const fy = node.y + nodeHeight / 2;

  // Determine start point at center node edge
  const isLeft = node.x < CENTER_NODE.x;
  const startX = isLeft ? cx - CENTER_NODE.width / 2 : cx + CENTER_NODE.width / 2;
  const startY = cy;

  // Determine end point at factor node edge
  const endX = isLeft ? fx + nodeWidth / 2 : fx - nodeWidth / 2;
  const endY = fy;

  // Curved Bezier control points
  const cpOffset = Math.abs(startX - endX) * 0.4;
  const cp1x = isLeft ? startX - cpOffset : startX + cpOffset;
  const cp1y = startY;
  const cp2x = isLeft ? endX + cpOffset : endX - cpOffset;
  const cp2y = endY;

  const pathD = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
  const pathLength = 600;

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
        strokeWidth={2}
        fill="none"
        strokeDasharray={`${drawProgress * pathLength} ${pathLength}`}
        opacity={drawProgress * 0.6}
      />
    </svg>
  );
};

// ─── Mindmap Diagram ─────────────────────────────────────────────────────────

const MindmapDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < PHASE.CENTER_NODE - 10) return null;

  const appear = spring({
    frame: frame - (PHASE.CENTER_NODE - 10),
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
      {/* Connection lines (render behind nodes) */}
      {FACTOR_NODES.map((node) => (
        <ConnectionLine key={`conn-${node.id}`} node={node} />
      ))}

      {/* Center node */}
      <CenterNodeComponent />

      {/* Factor nodes */}
      {FACTOR_NODES.map((node) => (
        <FactorNodeComponent key={node.id} node={node} />
      ))}
    </div>
  );
};

// ─── Main Composition ────────────────────────────────────────────────────────

const TwelveFactorShowcaseInner: React.FC = () => {
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
          <TerminalWindow title="claude code · ~/cloud-project">
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
                  Opus 4.5 · ~/cloud-project
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
                    ✓ Mindmap diagram generated
                  </StatusMessage>
                </div>
              )}
            </div>
          </TerminalWindow>
        </div>
      )}

      <MindmapDiagram />

      <Scanlines />
    </Background>
  );
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const TwelveFactorShowcase: React.FC = () => (
  <ThemeProvider theme={flatOceanTheme}>
    <TwelveFactorShowcaseInner />
  </ThemeProvider>
);
