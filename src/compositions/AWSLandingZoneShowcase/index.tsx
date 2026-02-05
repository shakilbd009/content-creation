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
  BUILD_STEPS,
  OPTION_PILLS,
  ORG_TREE,
  NODE_APPEARANCE_ORDER,
  PHASE,
  type OrgNodeData,
  type BuildStep,
} from "./data";

// Flat version of modernTheme (no 3D perspective)
const flatModernTheme: Theme = {
  ...modernTheme,
  effects: {
    ...modernTheme.effects,
    perspective: { enabled: false, rotateX: 0, rotateY: 0, distance: 0 },
  },
};

// AWS brand colors
const AWS_COLORS = {
  orange: "#FF9900",
  blue: "#232F3E",
  lightOrange: "#FFAD33",
  security: "#E02D4E",
  workloads: "#3B82F6",
  sandbox: "#10B981",
};

// ─── Hero Overlay ────────────────────────────────────────────────────────────

const HeroOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  // No fps needed - hero is fully visible at frame 0 for thumbnail

  const opacity = interpolate(
    frame,
    [PHASE.HERO_END - 20, PHASE.HERO_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scale is 1 at frame 0 (for thumbnail), then stays 1
  const scale = 1;

  if (frame > PHASE.HERO_END + 5) return null;

  // Pulsing glow effect with AWS orange/blue (starts at max for thumbnail)
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
          gap: 30,
          transform: `scale(${scale})`,
        }}
      >
        {/* Cloud icon */}
        <div
          style={{
            fontSize: 80,
            textShadow: `0 0 60px rgba(255, 153, 0, ${glowIntensity})`,
          }}
        >
          ☁️
        </div>

        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            fontFamily: theme.typography.system,
            color: "#fff",
            textShadow: `0 0 80px rgba(255, 153, 0, ${glowIntensity}), 0 0 160px rgba(255, 153, 0, 0.3)`,
            letterSpacing: -2,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          AWS Landing Zone
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            fontFamily: theme.typography.system,
            color: AWS_COLORS.orange,
            textTransform: "uppercase",
            letterSpacing: 6,
            textShadow: `0 0 30px rgba(255, 153, 0, ${glowIntensity})`,
          }}
        >
          From zero to enterprise-ready
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Option Pills ─────────────────────────────────────────────────────────────

interface OptionPillProps {
  label: string;
  emoji: string;
  index: number;
  isSelected: boolean;
  showSelection: boolean;
}

const OptionPill: React.FC<OptionPillProps> = ({
  label,
  emoji,
  index,
  isSelected,
  showSelection,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const staggerDelay = PHASE.PILLS_APPEAR + index * 6;
  const elapsed = frame - staggerDelay;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  // Selection animation
  const selectProgress = showSelection
    ? spring({
        frame: frame - PHASE.PILL_SELECT,
        fps,
        config: { damping: 12, stiffness: 150 },
      })
    : 0;

  const pillScale = isSelected
    ? 1 + selectProgress * 0.1
    : 1 - selectProgress * 0.1;
  const pillOpacity = isSelected ? 1 : 1 - selectProgress * 0.6;

  // Hover-like glow for unselected
  const glowIntensity = interpolate(
    Math.sin(frame * 0.1 + index * 2),
    [-1, 1],
    [0.2, 0.4]
  );

  const baseColor = isSelected && showSelection ? AWS_COLORS.orange : theme.colors.text.accent;
  const bgColor = isSelected && showSelection
    ? "rgba(255, 153, 0, 0.25)"
    : "rgba(162, 155, 254, 0.15)";

  return (
    <div
      style={{
        opacity: appear * pillOpacity,
        transform: `scale(${appear * pillScale})`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "16px 28px",
        backgroundColor: bgColor,
        border: `2px solid ${baseColor}`,
        borderRadius: 50,
        boxShadow: isSelected && showSelection
          ? `0 0 30px rgba(255, 153, 0, 0.5)`
          : `0 0 20px rgba(162, 155, 254, ${glowIntensity})`,
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 28 }}>{emoji}</span>
      <span
        style={{
          fontSize: 22,
          fontFamily: theme.typography.system,
          fontWeight: 600,
          color: isSelected && showSelection ? AWS_COLORS.orange : theme.colors.text.primary,
        }}
      >
        {label}
      </span>
      {isSelected && showSelection && (
        <span
          style={{
            fontSize: 22,
            marginLeft: 8,
            opacity: selectProgress,
          }}
        >
          ✓
        </span>
      )}
    </div>
  );
};

const OptionPillsGroup: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < PHASE.PILLS_APPEAR) return null;

  // Fade out pills after selection
  const fadeOut = interpolate(
    frame,
    [PHASE.PILLS_FADE, PHASE.PILLS_FADE + 20],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (fadeOut <= 0) return null;

  const showSelection = frame >= PHASE.PILL_SELECT;
  const selectedId = "soc2"; // Always select SOC2

  return (
    <div
      style={{
        position: "absolute",
        bottom: 140,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 20,
        opacity: fadeOut,
      }}
    >
      {OPTION_PILLS.map((pill, index) => (
        <OptionPill
          key={pill.id}
          label={pill.label}
          emoji={pill.emoji}
          index={index}
          isSelected={pill.id === selectedId}
          showSelection={showSelection}
        />
      ))}
    </div>
  );
};

// ─── Org Tree Visualization ──────────────────────────────────────────────────

const getNodeColor = (type: OrgNodeData["type"]): string => {
  switch (type) {
    case "root":
      return AWS_COLORS.orange;
    case "security":
      return AWS_COLORS.security;
    case "workloads":
      return AWS_COLORS.workloads;
    case "sandbox":
      return AWS_COLORS.sandbox;
    case "account":
      return "#a29bfe";
    default:
      return "#fff";
  }
};

interface OrgNodeProps {
  node: OrgNodeData;
  x: number;
  y: number;
  appearFrame: number;
}

const OrgNode: React.FC<OrgNodeProps> = ({ node, x, y, appearFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const elapsed = frame - appearFrame;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  const color = getNodeColor(node.type);
  const isAccount = node.type === "account";
  const nodeWidth = isAccount ? 145 : 170;
  const nodeHeight = isAccount ? 55 : 65;

  return (
    <div
      style={{
        position: "absolute",
        left: x - nodeWidth / 2,
        top: y,
        width: nodeWidth,
        height: nodeHeight,
        backgroundColor: `${color}20`,
        border: `2px solid ${color}`,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: appear,
        transform: `scale(${appear})`,
        boxShadow: `0 0 20px ${color}40`,
      }}
    >
      <span style={{ fontSize: isAccount ? 20 : 24 }}>{node.emoji}</span>
      <span
        style={{
          fontSize: isAccount ? 15 : 16,
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

interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  appearFrame: number;
  color: string;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({
  x1,
  y1,
  x2,
  y2,
  appearFrame,
  color,
}) => {
  const frame = useCurrentFrame();

  const elapsed = frame - (appearFrame + 10); // Slight delay after node
  if (elapsed < 0) return null;

  const drawProgress = interpolate(elapsed, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate the line with L-shape (down then across)
  const midY = y1 + (y2 - y1) * 0.5;

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
        d={`M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeDasharray={`${drawProgress * 200} 200`}
        opacity={0.6}
      />
    </svg>
  );
};

const OrgTreeViz: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Only show after build starts
  if (frame < PHASE.BUILD_STEP_1) return null;

  const appear = spring({
    frame: frame - PHASE.BUILD_STEP_1,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Calculate node appearance times based on build steps
  const getNodeAppearFrame = (nodeId: string): number => {
    const order = NODE_APPEARANCE_ORDER.indexOf(nodeId as typeof NODE_APPEARANCE_ORDER[number]);
    if (order === -1) return PHASE.BUILD_DONE;

    if (nodeId === "root") return PHASE.BUILD_STEP_1;
    if (nodeId === "security-ou") return PHASE.BUILD_STEP_3;
    if (nodeId === "log-archive" || nodeId === "security-tooling") return PHASE.BUILD_STEP_3 + 15;
    if (nodeId === "workloads-ou") return PHASE.BUILD_STEP_4;
    if (nodeId === "production" || nodeId === "development") return PHASE.BUILD_STEP_4 + 15;
    if (nodeId === "sandbox-ou") return PHASE.BUILD_STEP_5;

    return PHASE.BUILD_DONE;
  };

  // Tree layout positions (spread out with more spacing)
  // Node widths: OU=155, Account=130 (centered on x)
  const positions: Record<string, { x: number; y: number }> = {
    root: { x: 360, y: 10 },
    "security-ou": { x: 100, y: 105 },
    "log-archive": { x: 30, y: 205 },
    "security-tooling": { x: 180, y: 205 },
    "workloads-ou": { x: 360, y: 105 },
    production: { x: 310, y: 205 },
    development: { x: 470, y: 205 },
    "sandbox-ou": { x: 620, y: 105 },
  };

  // Connection definitions
  const connections = [
    { from: "root", to: "security-ou" },
    { from: "root", to: "workloads-ou" },
    { from: "root", to: "sandbox-ou" },
    { from: "security-ou", to: "log-archive" },
    { from: "security-ou", to: "security-tooling" },
    { from: "workloads-ou", to: "production" },
    { from: "workloads-ou", to: "development" },
  ];

  // Flatten tree for rendering
  const allNodes: OrgNodeData[] = [];
  const flattenTree = (node: OrgNodeData) => {
    allNodes.push(node);
    node.children?.forEach(flattenTree);
  };
  flattenTree(ORG_TREE);

  return (
    <div
      style={{
        position: "absolute",
        right: 220,
        top: "50%",
        transform: "translateY(-50%)",
        width: 720,
        height: 290,
        opacity: appear,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: -40,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 20,
          fontWeight: 600,
          color: AWS_COLORS.orange,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        AWS Organization
      </div>

      {/* Connection lines */}
      {connections.map((conn) => {
        const fromPos = positions[conn.from];
        const toPos = positions[conn.to];
        const toNode = allNodes.find((n) => n.id === conn.to);
        const toNodeAppear = getNodeAppearFrame(conn.to);

        return (
          <ConnectionLine
            key={`${conn.from}-${conn.to}`}
            x1={fromPos.x}
            y1={fromPos.y + 30}
            x2={toPos.x}
            y2={toPos.y}
            appearFrame={toNodeAppear}
            color={getNodeColor(toNode?.type || "account")}
          />
        );
      })}

      {/* Nodes */}
      {allNodes.map((node) => {
        const pos = positions[node.id];
        if (!pos) return null;

        return (
          <OrgNode
            key={node.id}
            node={node}
            x={pos.x}
            y={pos.y}
            appearFrame={getNodeAppearFrame(node.id)}
          />
        );
      })}
    </div>
  );
};

// ─── Build Step Message ───────────────────────────────────────────────────────

interface BuildStepProps {
  text: string;
  indent?: boolean;
  icon: "checkmark" | "arrow";
  delay: number;
}

const BuildStep: React.FC<BuildStepProps> = ({ text, indent, icon, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const elapsed = frame - delay;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  const iconSymbol = icon === "checkmark" ? "✓" : "→";
  const iconColor = icon === "checkmark" ? theme.colors.status.success : theme.colors.text.muted;

  return (
    <div
      style={{
        opacity: appear,
        transform: `translateX(${(1 - appear) * 20}px)`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginLeft: indent ? 28 : 0,
        marginTop: 8,
        fontFamily: theme.typography.mono,
        fontSize: 22,
      }}
    >
      <span style={{ color: iconColor, fontWeight: 700 }}>{iconSymbol}</span>
      <span style={{ color: theme.colors.text.primary }}>{text}</span>
    </div>
  );
};

// ─── Main Composition ────────────────────────────────────────────────────────

const AWSLandingZoneShowcaseInner: React.FC = () => {
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
  const showThinking = frame >= PHASE.CLAUDE_THINKING && frame < PHASE.CLAUDE_RESPONSE;
  const showResponse = frame >= PHASE.CLAUDE_RESPONSE;
  const showBuildPhase = frame >= PHASE.BUILD_START;
  const showFinalMessage = frame >= PHASE.FINAL_MESSAGE;

  // Calculate which build steps to show
  const getBuildStepDelay = (index: number): number => {
    // Distribute steps across the build phase
    const step1Indices = [0, 1]; // Creating org, Control Tower
    const step2Indices = [2, 3, 4]; // Security OU + accounts
    const step3Indices = [5, 6, 7]; // Workloads OU + accounts
    const step4Indices = [8, 9, 10]; // SCPs, CloudTrail, IAM

    if (step1Indices.includes(index)) {
      return PHASE.BUILD_STEP_1 + (index - step1Indices[0]) * 15;
    }
    if (step2Indices.includes(index)) {
      return PHASE.BUILD_STEP_3 + (index - step2Indices[0]) * 12;
    }
    if (step3Indices.includes(index)) {
      return PHASE.BUILD_STEP_4 + (index - step3Indices[0]) * 12;
    }
    if (step4Indices.includes(index)) {
      return PHASE.BUILD_STEP_5 + (index - step4Indices[0]) * 12;
    }
    return PHASE.BUILD_DONE;
  };

  return (
    <Background>
      <HeroOverlay />

      {/* Terminal - positioned on the left to make room for org tree */}
      {showTerminal && (
        <div
          style={{
            position: "absolute",
            left: 80,
            top: "50%",
            transform: `translateY(-50%) scale(${Math.min(1, terminalAppear)})`,
            opacity: terminalAppear,
            width: 800,
          }}
        >
          <TerminalWindow title="claude code · ~/infrastructure">
            <div style={{ padding: "8px 0" }}>
              {/* Header */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: theme.typography.mono, fontSize: 26 }}>
                  <span style={{ color: theme.colors.text.brand }}>Claude Code</span>
                  <span style={{ color: theme.colors.text.muted }}> v2.1.20</span>
                </div>
                <div style={{ fontFamily: theme.typography.mono, fontSize: 18, color: theme.colors.text.muted }}>
                  Opus 4.5 · ~/infrastructure
                </div>
              </div>

              {/* User prompt */}
              {showCommand && (
                <CommandLine
                  command={COMMAND}
                  startFrame={PHASE.PROMPT_START}
                  hideCursorAfter={PHASE.PROMPT_DONE}
                  fontSize={28}
                />
              )}

              {/* Thinking dots */}
              {showThinking && (
                <ThinkingDots delay={PHASE.CLAUDE_THINKING} label="Thinking" fontSize={24} />
              )}

              {/* Claude response */}
              {showResponse && (
                <StatusMessage delay={PHASE.CLAUDE_RESPONSE} fontSize={24}>
                  {CLAUDE_RESPONSE}
                </StatusMessage>
              )}

              {/* Build phase */}
              {showBuildPhase && (
                <div style={{ marginTop: 24 }}>
                  <StatusMessage delay={PHASE.BUILD_START} fontSize={22} color={theme.colors.text.accent}>
                    Setting up SOC2-compliant landing zone...
                  </StatusMessage>

                  <div style={{ marginTop: 16 }}>
                    {BUILD_STEPS.map((step, index) => (
                      <BuildStep
                        key={index}
                        text={step.text}
                        indent={step.indent}
                        icon={step.icon}
                        delay={getBuildStepDelay(index)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Final message */}
              {showFinalMessage && (
                <div style={{ marginTop: 24 }}>
                  <StatusMessage delay={PHASE.FINAL_MESSAGE} fontSize={26} color={theme.colors.status.success}>
                    ✓ Landing zone ready
                  </StatusMessage>
                </div>
              )}
            </div>
          </TerminalWindow>
        </div>
      )}

      {/* Option Pills */}
      <OptionPillsGroup />

      {/* AWS Org Tree Visualization */}
      <OrgTreeViz />

      <Scanlines />
    </Background>
  );
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const AWSLandingZoneShowcase: React.FC = () => (
  <ThemeProvider theme={flatModernTheme}>
    <AWSLandingZoneShowcaseInner />
  </ThemeProvider>
);
