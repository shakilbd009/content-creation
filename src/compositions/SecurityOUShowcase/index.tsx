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
  SECURITY_TREE,
  SECURITY_COLORS,
  PHASE,
  type SecurityNodeData,
  type BuildStep,
} from "./data";

// Security-themed dark teal variant
const securityTheme: Theme = {
  ...modernTheme,
  colors: {
    ...modernTheme.colors,
    background: "#0a1a18",
    backgroundGradient:
      "linear-gradient(180deg, #0a1a18 0%, #0e2420 25%, #102d28 50%, #143d35 75%, #184a40 100%)",
    ambientGlows: [
      "radial-gradient(ellipse at 50% -20%, rgba(16, 185, 129, 0.12) 0%, transparent 60%)",
      "radial-gradient(ellipse at 30% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 40%), radial-gradient(ellipse at 70% 90%, rgba(224, 45, 78, 0.06) 0%, transparent 35%)",
    ],
  },
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

  // Pulsing glow effect with security red/orange
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
        }}
      >
        {/* Shield icon */}
        <div
          style={{
            fontSize: 80,
            textShadow: `0 0 60px rgba(224, 45, 78, ${glowIntensity}), 0 0 120px rgba(255, 153, 0, ${glowIntensity * 0.5})`,
          }}
        >
          🛡️
        </div>

        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            fontFamily: theme.typography.system,
            color: "#fff",
            textShadow: `0 0 80px rgba(224, 45, 78, ${glowIntensity}), 0 0 160px rgba(255, 153, 0, 0.3)`,
            letterSpacing: -2,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Security-First AWS
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            fontFamily: theme.typography.system,
            color: SECURITY_COLORS.securityOU,
            textTransform: "uppercase",
            letterSpacing: 6,
            textShadow: `0 0 30px rgba(224, 45, 78, ${glowIntensity})`,
          }}
        >
          SOC2-ready in seconds
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

  const baseColor =
    isSelected && showSelection
      ? SECURITY_COLORS.securityOU
      : theme.colors.text.accent;
  const bgColor =
    isSelected && showSelection
      ? "rgba(224, 45, 78, 0.25)"
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
        boxShadow:
          isSelected && showSelection
            ? `0 0 30px rgba(224, 45, 78, 0.5)`
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
          color:
            isSelected && showSelection
              ? SECURITY_COLORS.securityOU
              : theme.colors.text.primary,
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
  const selectedId = "soc2";

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

// ─── Security Tree Visualization ─────────────────────────────────────────────

interface ServiceNodeProps {
  node: SecurityNodeData;
  x: number;
  y: number;
  appearFrame: number;
}

const ServiceNode: React.FC<ServiceNodeProps> = ({
  node,
  x,
  y,
  appearFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const elapsed = frame - appearFrame;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 12, stiffness: 160 },
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: appear,
        transform: `scale(${appear})`,
        transformOrigin: "left center",
        padding: "6px 14px",
        backgroundColor: `${node.color}15`,
        border: `1px solid ${node.color}40`,
        borderRadius: 8,
      }}
    >
      <span style={{ fontSize: 28 }}>{node.emoji}</span>
      <span
        style={{
          fontSize: 24,
          fontFamily: theme.typography.mono,
          fontWeight: 700,
          color: node.color,
          whiteSpace: "nowrap",
        }}
      >
        {node.label}
      </span>
    </div>
  );
};

interface AccountNodeProps {
  node: SecurityNodeData;
  x: number;
  y: number;
  appearFrame: number;
}

const AccountNode: React.FC<AccountNodeProps> = ({
  node,
  x,
  y,
  appearFrame,
}) => {
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

  const isOU = node.type === "ou";
  const nodeWidth = isOU ? 260 : 230;
  const nodeHeight = isOU ? 80 : 68;

  return (
    <div
      style={{
        position: "absolute",
        left: x - nodeWidth / 2,
        top: y,
        width: nodeWidth,
        height: nodeHeight,
        backgroundColor: `${node.color}20`,
        border: `2px solid ${node.color}`,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: appear,
        transform: `scale(${appear})`,
        boxShadow: `0 0 20px ${node.color}40`,
      }}
    >
      <span style={{ fontSize: isOU ? 34 : 28 }}>{node.emoji}</span>
      <span
        style={{
          fontSize: isOU ? 24 : 20,
          fontFamily: theme.typography.mono,
          fontWeight: 700,
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

  const elapsed = frame - (appearFrame + 10);
  if (elapsed < 0) return null;

  const drawProgress = interpolate(elapsed, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
        strokeWidth={3}
        fill="none"
        strokeDasharray={`${drawProgress * 300} 300`}
        opacity={0.6}
      />
    </svg>
  );
};

const SecurityTreeViz: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < PHASE.BUILD_STEP_1) return null;

  const appear = spring({
    frame: frame - PHASE.BUILD_STEP_1,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Layout positions for the tree — scaled up for mobile visibility
  const rootX = 440;
  const rootY = 10;
  const accountY = 140;
  const serviceStartY = 260;
  const serviceSpacing = 48;

  const accountPositions = {
    "log-archive": { x: 140, y: accountY },
    "security-tooling": { x: 440, y: accountY },
    audit: { x: 740, y: accountY },
  };

  // Get appearance frame for nodes synced to build steps
  const getNodeAppearFrame = (nodeId: string): number => {
    switch (nodeId) {
      case "security-ou":
        return PHASE.BUILD_STEP_1;
      case "log-archive":
        return PHASE.BUILD_STEP_2;
      case "cloudtrail":
        return PHASE.BUILD_STEP_2 + 8;
      case "config-logs":
        return PHASE.BUILD_STEP_2 + 16;
      case "vpc-logs":
        return PHASE.BUILD_STEP_2 + 24;
      case "security-tooling":
        return PHASE.BUILD_STEP_3;
      case "guardduty":
        return PHASE.BUILD_STEP_3 + 8;
      case "securityhub":
        return PHASE.BUILD_STEP_3 + 16;
      case "iam-analyzer":
        return PHASE.BUILD_STEP_3 + 24;
      case "audit":
        return PHASE.BUILD_STEP_4;
      case "config-rules":
        return PHASE.BUILD_STEP_4 + 8;
      case "cloudwatch":
        return PHASE.BUILD_STEP_4 + 16;
      case "sns-alerts":
        return PHASE.BUILD_STEP_4 + 24;
      default:
        return PHASE.BUILD_DONE;
    }
  };

  // Ambient glow on completed state
  const allDone = frame >= PHASE.BUILD_DONE;
  const doneGlow = allDone
    ? interpolate(Math.sin(frame * 0.08), [-1, 1], [0.3, 0.6])
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        right: 40,
        top: "50%",
        transform: "translateY(-50%)",
        width: 880,
        height: 580,
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
          fontSize: 28,
          fontWeight: 700,
          color: SECURITY_COLORS.securityOU,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        Security OU
      </div>

      {/* Ambient glow when complete */}
      {allDone && (
        <div
          style={{
            position: "absolute",
            inset: -40,
            borderRadius: 24,
            background: `radial-gradient(ellipse at center, rgba(224, 45, 78, ${doneGlow * 0.15}) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Connection lines: root to accounts */}
      {SECURITY_TREE.children?.map((account) => {
        const accPos =
          accountPositions[account.id as keyof typeof accountPositions];
        if (!accPos) return null;
        return (
          <ConnectionLine
            key={`root-${account.id}`}
            x1={rootX}
            y1={rootY + 80}
            x2={accPos.x}
            y2={accPos.y}
            appearFrame={getNodeAppearFrame(account.id)}
            color={account.color}
          />
        );
      })}

      {/* Root OU node */}
      <AccountNode
        node={SECURITY_TREE}
        x={rootX}
        y={rootY}
        appearFrame={getNodeAppearFrame("security-ou")}
      />

      {/* Account nodes + their service nodes */}
      {SECURITY_TREE.children?.map((account) => {
        const accPos =
          accountPositions[account.id as keyof typeof accountPositions];
        if (!accPos) return null;

        return (
          <React.Fragment key={account.id}>
            <AccountNode
              node={account}
              x={accPos.x}
              y={accPos.y}
              appearFrame={getNodeAppearFrame(account.id)}
            />

            {/* Service nodes listed below account */}
            {account.children?.map((service, sIdx) => (
              <ServiceNode
                key={service.id}
                node={service}
                x={accPos.x - 80}
                y={serviceStartY + sIdx * serviceSpacing}
                appearFrame={getNodeAppearFrame(service.id)}
              />
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── Build Step Message ───────────────────────────────────────────────────────

interface BuildStepMessageProps {
  text: string;
  indent?: boolean;
  icon: "checkmark" | "arrow";
  delay: number;
}

const BuildStepMessage: React.FC<BuildStepMessageProps> = ({
  text,
  indent,
  icon,
  delay,
}) => {
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
  const iconColor =
    icon === "checkmark" ? theme.colors.status.success : theme.colors.text.muted;

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

const SecurityOUShowcaseInner: React.FC = () => {
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
  const showBuildPhase = frame >= PHASE.BUILD_START;
  const showFinalMessage = frame >= PHASE.FINAL_MESSAGE;

  // Distribute build steps across the build phase
  const getBuildStepDelay = (index: number): number => {
    // Step 0: Creating Security OU
    if (index === 0) return PHASE.BUILD_STEP_1;

    // Steps 1-4: Log Archive + services
    if (index >= 1 && index <= 4) {
      return PHASE.BUILD_STEP_2 + (index - 1) * 10;
    }

    // Steps 5-8: Security Tooling + services
    if (index >= 5 && index <= 8) {
      return PHASE.BUILD_STEP_3 + (index - 5) * 10;
    }

    // Steps 9-12: Audit + services
    if (index >= 9 && index <= 12) {
      return PHASE.BUILD_STEP_4 + (index - 9) * 10;
    }

    // Step 13: Applying SOC2 SCPs
    if (index === 13) return PHASE.BUILD_STEP_5;

    return PHASE.BUILD_DONE;
  };

  return (
    <Background>
      <HeroOverlay />

      {/* Terminal - positioned on the left to make room for security tree */}
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
          <TerminalWindow title="claude code · ~/security">
            <div style={{ padding: "8px 0" }}>
              {/* Header */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontFamily: theme.typography.mono,
                    fontSize: 26,
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
                    fontSize: 18,
                    color: theme.colors.text.muted,
                  }}
                >
                  Opus 4.5 · ~/security
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
                <ThinkingDots
                  delay={PHASE.CLAUDE_THINKING}
                  label="Thinking"
                  fontSize={24}
                />
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
                  <StatusMessage
                    delay={PHASE.BUILD_START}
                    fontSize={22}
                    color={theme.colors.text.accent}
                  >
                    Setting up SOC2-compliant Security OU...
                  </StatusMessage>

                  <div style={{ marginTop: 16 }}>
                    {BUILD_STEPS.map((step, index) => (
                      <BuildStepMessage
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
                  <StatusMessage
                    delay={PHASE.FINAL_MESSAGE}
                    fontSize={26}
                    color={theme.colors.status.success}
                  >
                    Security OU hardened ✓
                  </StatusMessage>
                </div>
              )}
            </div>
          </TerminalWindow>
        </div>
      )}

      {/* Option Pills */}
      <OptionPillsGroup />

      {/* Security OU Tree Visualization */}
      <SecurityTreeViz />

      <Scanlines />
    </Background>
  );
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const SecurityOUShowcase: React.FC = () => (
  <ThemeProvider theme={securityTheme}>
    <SecurityOUShowcaseInner />
  </ThemeProvider>
);
