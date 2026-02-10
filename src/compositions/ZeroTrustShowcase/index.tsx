import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ThemeProvider, modernTheme, useTheme, Theme } from "../../themes";
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
  SECURITY_ZONES,
  NODE_COLORS,
  SECURITY_COLORS,
  SHIELD_VERIFY_ORDER,
  SHIELD_VERIFY_STAGGER,
  PHASE,
  getLineAppearFrame,
  getNodeAppearFrame,
  getConnectionAppearFrame,
  type ArchNodeData,
  type ArchConnection,
  type SecurityZone,
} from "./data";

// Flat version of modernTheme (no 3D perspective)
const flatModernTheme: Theme = {
  ...modernTheme,
  effects: {
    ...modernTheme.effects,
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
            textShadow: `0 0 60px rgba(168, 85, 247, ${glowIntensity})`,
          }}
        >
          🔐
        </div>

        <div
          style={{
            fontSize: 82,
            fontWeight: 900,
            fontFamily: theme.typography.system,
            color: "#fff",
            textShadow: `0 0 80px rgba(168, 85, 247, ${glowIntensity}), 0 0 160px rgba(239, 68, 68, 0.3)`,
            letterSpacing: -2,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Zero Trust Security
        </div>

        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            fontFamily: theme.typography.system,
            color: SECURITY_COLORS.purple,
            textTransform: "uppercase",
            letterSpacing: 6,
            textShadow: `0 0 30px rgba(168, 85, 247, ${glowIntensity})`,
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

// ─── Security Zone Band ─────────────────────────────────────────────────────

interface SecurityZoneComponentProps {
  zone: SecurityZone;
}

const SecurityZoneComponent: React.FC<SecurityZoneComponentProps> = ({
  zone,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let appearFrame: number;
  switch (zone.zone) {
    case "perimeter":
      appearFrame = PHASE.PERIMETER_ZONE;
      break;
    case "network":
      appearFrame = PHASE.NETWORK_ZONE;
      break;
    case "application":
      appearFrame = PHASE.APPLICATION_ZONE;
      break;
    case "data":
      appearFrame = PHASE.DATA_ZONE;
      break;
    case "continuous":
      appearFrame = PHASE.CONTINUOUS_ZONE;
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
      <div
        style={{
          position: "absolute",
          left: zone.x,
          top: zone.y,
          width: zone.width,
          height: zone.height,
          border: `1.5px solid ${zone.color}35`,
          borderRadius: 14,
          backgroundColor: `${zone.color}0a`,
          opacity: appear,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: zone.x + 12,
          top: zone.y - 10,
          fontSize: 15,
          fontWeight: 700,
          color: zone.color,
          letterSpacing: 2,
          textTransform: "uppercase",
          opacity: appear * 0.8,
          backgroundColor: "#0f0a1a",
          padding: "0 8px",
        }}
      >
        {zone.label}
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

  // Same-row detection
  const sameRow = Math.abs(fromNode.y - toNode.y) < 20;

  let x1: number, y1: number, x2: number, y2: number;

  if (sameRow) {
    const goingRight = toNode.x > fromNode.x;
    x1 = fromNode.x + (goingRight ? NODE_WIDTH / 2 : -NODE_WIDTH / 2);
    y1 = fromNode.y + NODE_HEIGHT / 2;
    x2 = toNode.x + (goingRight ? -NODE_WIDTH / 2 : NODE_WIDTH / 2);
    y2 = toNode.y + NODE_HEIGHT / 2;
  } else {
    x1 = fromNode.x;
    y1 = fromNode.y + NODE_HEIGHT;
    x2 = toNode.x;
    y2 = toNode.y;
  }

  // L-shaped path for cross-zone connections
  const midY = y1 + (y2 - y1) * 0.5;
  const pathD = sameRow
    ? `M ${x1} ${y1} L ${x2} ${y2}`
    : `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;

  const pathLength = 400;

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
      {/* Arrow dot at target */}
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

// ─── Shield Verification Animation ──────────────────────────────────────────

const ShieldVerifyAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < PHASE.SHIELD_VERIFY) return null;

  return (
    <>
      {SHIELD_VERIFY_ORDER.map((zoneName, index) => {
        const checkAppear = PHASE.SHIELD_VERIFY + index * SHIELD_VERIFY_STAGGER;
        const elapsed = frame - checkAppear;
        if (elapsed < 0) return null;

        const zone = SECURITY_ZONES.find((z) => z.zone === zoneName);
        if (!zone) return null;

        const pop = spring({
          frame: elapsed,
          fps,
          config: { damping: 10, stiffness: 200 },
        });

        // Position shield icon at the right edge of the zone band
        const cx = zone.x + zone.width - 16;
        const cy = zone.y + zone.height / 2;

        return (
          <div
            key={zoneName}
            style={{
              position: "absolute",
              left: cx - 13,
              top: cy - 13,
              width: 26,
              height: 26,
              borderRadius: "50%",
              backgroundColor: "#22C55E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${pop})`,
              opacity: pop,
              boxShadow: "0 0 14px rgba(34, 197, 94, 0.6)",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: 14,
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

  if (frame < PHASE.ARCH_EXTERNAL - 10) return null;

  const appear = spring({
    frame: frame - (PHASE.ARCH_EXTERNAL - 10),
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
      {/* Security zone bands */}
      {SECURITY_ZONES.map((zone) => (
        <SecurityZoneComponent key={zone.zone} zone={zone} />
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

      {/* Shield verification checkmarks */}
      <ShieldVerifyAnimation />
    </div>
  );
};

// ─── Main Composition ────────────────────────────────────────────────────────

const ZeroTrustShowcaseInner: React.FC = () => {
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
          <TerminalWindow title="claude code · ~/zero-trust">
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
                  Opus 4.5 · ~/zero-trust
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
                    ✓ Zero Trust architecture generated
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

export const ZeroTrustShowcase: React.FC = () => (
  <ThemeProvider theme={flatModernTheme}>
    <ZeroTrustShowcaseInner />
  </ThemeProvider>
);
