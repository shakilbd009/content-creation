import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { ThemeProvider, modernTheme, useTheme, Theme } from "../../themes";

// Flat version of modernTheme (no 3D perspective)
const flatModernTheme: Theme = {
  ...modernTheme,
  effects: {
    ...modernTheme.effects,
    perspective: { enabled: false, rotateX: 0, rotateY: 0, distance: 0 },
  },
};
import {
  Background,
  TerminalWindow,
  Scanlines,
  CommandLine,
  StatusMessage,
  StepHeader,
} from "../../components";
import { calculateScroll } from "../../animations";
import { COMMAND, BAD_CODE, FIXED_CODE, PHASE } from "./data";

// ─── Hero Overlay ────────────────────────────────────────────────────────────

const HeroOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const opacity = interpolate(
    frame,
    [PHASE.HERO_END - 20, PHASE.HERO_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 1 },
  });

  if (frame > PHASE.HERO_END + 5) return null;

  // Pulsing glow effect
  const glowIntensity = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.4, 0.8]
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
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            fontFamily: theme.typography.system,
            color: theme.colors.status.warning,
            textTransform: "uppercase",
            letterSpacing: 8,
            textShadow: `0 0 30px rgba(253, 203, 110, ${glowIntensity})`,
          }}
        >
          PR Code Review
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            fontFamily: theme.typography.system,
            color: "#fff",
            textShadow: `0 0 80px rgba(162, 155, 254, ${glowIntensity}), 0 0 160px rgba(162, 155, 254, 0.3)`,
            letterSpacing: -2,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Catching N+1
          <br />
          Before It Ships
        </div>
        <div
          style={{
            fontSize: 28,
            fontFamily: theme.typography.mono,
            color: theme.colors.text.muted,
            marginTop: 10,
          }}
        >
          100 queries → 1 query
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Database Query Visualization ────────────────────────────────────────────

const DatabaseViz: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const elapsed = frame - PHASE.QUERY_VIZ_START;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Are we in "fixed" mode?
  const isFixed = frame >= PHASE.TRANSFORM_START;
  const transformProgress = interpolate(
    frame,
    [PHASE.TRANSFORM_START, PHASE.TRANSFORM_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Query arrows - show many arrows firing in bad mode, collapse to 1 in good mode
  const firingElapsed = frame - PHASE.QUERY_VIZ_FIRING;
  const numArrowsToShow = isFixed
    ? 1
    : Math.min(12, Math.max(0, Math.floor(firingElapsed / 4)));

  const arrowPositions = Array.from({ length: 12 }, (_, i) => ({
    y: -120 + i * 20,
    delay: i * 4,
  }));

  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        top: "50%",
        transform: `translateY(-50%)`,
        opacity: appear,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 22,
          fontFamily: theme.typography.mono,
          color: isFixed ? theme.colors.status.success : theme.colors.status.error,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        {isFixed ? "1 Batch Query" : "N+1 Queries"}
      </div>

      {/* Visualization container */}
      <div
        style={{
          width: 300,
          height: 300,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Loop/Code icon on left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 80,
            height: isFixed ? 60 : 240,
            backgroundColor: "rgba(162, 155, 254, 0.15)",
            border: `2px solid ${theme.colors.text.accent}`,
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            transition: "height 0.5s ease",
          }}
        >
          <div style={{ fontSize: 24 }}>{isFixed ? "[ ]" : "for"}</div>
          {!isFixed && (
            <div
              style={{
                fontSize: 16,
                fontFamily: theme.typography.mono,
                color: theme.colors.text.muted,
              }}
            >
              ×{numArrowsToShow > 0 ? Math.min(100, numArrowsToShow * 8) : 0}
            </div>
          )}
        </div>

        {/* Arrows */}
        <div
          style={{
            position: "absolute",
            left: 90,
            width: 100,
            height: 240,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isFixed ? (
            // Single thick green arrow
            <div
              style={{
                width: 100,
                height: 8,
                backgroundColor: theme.colors.status.success,
                borderRadius: 4,
                boxShadow: `0 0 20px ${theme.colors.status.success}`,
                opacity: transformProgress,
              }}
            />
          ) : (
            // Multiple red arrows
            arrowPositions.slice(0, numArrowsToShow).map((pos, i) => {
              const arrowElapsed = firingElapsed - pos.delay;
              const arrowOpacity = interpolate(arrowElapsed, [0, 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const arrowX = interpolate(arrowElapsed, [0, 12], [0, 100], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.quad),
              });

              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: `${50 + pos.y / 3}%`,
                    left: 0,
                    width: arrowX,
                    height: 3,
                    backgroundColor: theme.colors.status.error,
                    borderRadius: 2,
                    opacity: arrowOpacity * (1 - transformProgress),
                    boxShadow: `0 0 10px ${theme.colors.status.error}60`,
                  }}
                />
              );
            })
          )}
        </div>

        {/* Database icon */}
        <div
          style={{
            position: "absolute",
            right: 0,
            width: 90,
            height: 110,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Database cylinder */}
          <div
            style={{
              width: 80,
              height: 30,
              backgroundColor: isFixed ? "rgba(39, 202, 63, 0.3)" : "rgba(255, 107, 107, 0.3)",
              border: `2px solid ${isFixed ? theme.colors.status.success : theme.colors.status.error}`,
              borderRadius: "50%",
              position: "relative",
              zIndex: 2,
              transition: "all 0.3s ease",
            }}
          />
          <div
            style={{
              width: 80,
              height: 60,
              backgroundColor: isFixed ? "rgba(39, 202, 63, 0.2)" : "rgba(255, 107, 107, 0.2)",
              borderLeft: `2px solid ${isFixed ? theme.colors.status.success : theme.colors.status.error}`,
              borderRight: `2px solid ${isFixed ? theme.colors.status.success : theme.colors.status.error}`,
              borderBottom: `2px solid ${isFixed ? theme.colors.status.success : theme.colors.status.error}`,
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              marginTop: -2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
          >
            <span style={{ fontSize: 28 }}>🗄️</span>
          </div>
        </div>
      </div>

      {/* Query count */}
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          fontFamily: theme.typography.mono,
          color: isFixed ? theme.colors.status.success : theme.colors.status.error,
          textShadow: isFixed
            ? `0 0 30px ${theme.colors.status.success}`
            : `0 0 30px ${theme.colors.status.error}`,
        }}
      >
        {isFixed ? "1" : Math.min(100, numArrowsToShow * 8)} {isFixed ? "query" : "queries"}
      </div>
    </div>
  );
};

// ─── Performance Meter ───────────────────────────────────────────────────────

const PerformanceMeter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const elapsed = frame - PHASE.METER_APPEAR;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const isFixed = frame >= PHASE.TRANSFORM_START;
  const meterValue = interpolate(
    frame,
    [PHASE.METER_APPEAR, PHASE.METER_APPEAR + 30, PHASE.TRANSFORM_START, PHASE.TRANSFORM_END],
    [0, 0.85, 0.85, 0.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  // Meter color based on value (0 = green, 1 = red)
  const meterColor = meterValue > 0.5 ? theme.colors.status.error : theme.colors.status.success;

  // Needle rotation (0 = -90deg pointing left/green, 1 = 90deg pointing right/red)
  const needleRotation = interpolate(meterValue, [0, 1], [-90, 90]);

  return (
    <div
      style={{
        position: "absolute",
        right: 100,
        top: 80,
        opacity: appear,
        transform: `scale(${appear})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontFamily: theme.typography.mono,
          color: theme.colors.text.muted,
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        Response Time
      </div>

      {/* Gauge */}
      <div
        style={{
          width: 160,
          height: 90,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Arc background */}
        <div
          style={{
            position: "absolute",
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: `conic-gradient(
              from 180deg,
              ${theme.colors.status.success} 0deg,
              ${theme.colors.status.warning} 90deg,
              ${theme.colors.status.error} 180deg,
              transparent 180deg
            )`,
            opacity: 0.3,
          }}
        />

        {/* Needle */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: 4,
            height: 70,
            backgroundColor: meterColor,
            borderRadius: 2,
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${needleRotation}deg)`,
            boxShadow: `0 0 15px ${meterColor}`,
          }}
        />

        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            bottom: -8,
            left: "50%",
            width: 20,
            height: 20,
            backgroundColor: meterColor,
            borderRadius: "50%",
            transform: "translateX(-50%)",
            boxShadow: `0 0 20px ${meterColor}`,
          }}
        />
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          fontFamily: theme.typography.mono,
          color: meterColor,
        }}
      >
        {isFixed ? "FAST" : "SLOW"}
      </div>
    </div>
  );
};

// ─── Loop Counter Card ───────────────────────────────────────────────────────

const LoopCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const elapsed = frame - PHASE.BAD_CODE_APPEAR;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const isFixed = frame >= PHASE.TRANSFORM_START;

  // Counter animation
  const firingElapsed = frame - PHASE.QUERY_VIZ_FIRING;
  const counter = isFixed
    ? 1
    : Math.min(100, Math.max(1, Math.floor(firingElapsed / 2)));

  const transformProgress = interpolate(
    frame,
    [PHASE.TRANSFORM_START, PHASE.TRANSFORM_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 100,
        opacity: appear,
        transform: `translateX(${(1 - appear) * -30}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          border: `2px solid ${isFixed ? theme.colors.status.success : theme.colors.status.error}`,
          borderRadius: 16,
          padding: "20px 28px",
          backdropFilter: "blur(10px)",
          boxShadow: isFixed
            ? `0 0 40px ${theme.colors.status.success}40`
            : `0 0 40px ${theme.colors.status.error}40`,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontFamily: theme.typography.mono,
            color: theme.colors.text.muted,
            marginBottom: 12,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {isFixed ? "Batch Query" : "Loop Iteration"}
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            fontFamily: theme.typography.mono,
            color: isFixed ? theme.colors.status.success : theme.colors.status.error,
            textShadow: isFixed
              ? `0 0 30px ${theme.colors.status.success}`
              : `0 0 30px ${theme.colors.status.error}`,
            lineHeight: 1,
          }}
        >
          {counter}
        </div>

        <div
          style={{
            fontSize: 18,
            fontFamily: theme.typography.mono,
            color: theme.colors.text.secondary,
            marginTop: 8,
          }}
        >
          {isFixed ? "of 1 total" : `of 100`}
        </div>
      </div>
    </div>
  );
};

// ─── Warning Callout ─────────────────────────────────────────────────────────

const WarningCallout: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const elapsed = frame - delay;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Pulsing border
  const pulse = interpolate(Math.sin(frame * 0.2), [-1, 1], [0.6, 1]);

  return (
    <div
      style={{
        opacity: appear,
        transform: `translateY(${(1 - appear) * 15}px) scale(${0.95 + appear * 0.05})`,
        marginTop: 16,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(253, 203, 110, 0.1)",
          border: `3px solid rgba(253, 203, 110, ${pulse})`,
          borderRadius: 12,
          padding: "18px 24px",
          fontFamily: theme.typography.mono,
          boxShadow: `0 0 30px rgba(253, 203, 110, ${pulse * 0.3})`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 32 }}>⚠️</span>
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: theme.colors.status.warning,
            }}
          >
            N+1 Query Pattern Detected
          </span>
        </div>
        <div style={{ fontSize: 22, color: theme.colors.text.secondary, lineHeight: 1.5 }}>
          <span style={{ color: theme.colors.text.accent }}>src/api/handlers.py:42</span>
          {" · "}
          <span style={{ color: theme.colors.severity.high }}>High Severity</span>
        </div>
      </div>
    </div>
  );
};

// ─── Code Block ──────────────────────────────────────────────────────────────

interface CodeBlockProps {
  code: string;
  delay: number;
  variant: "bad" | "good";
  label: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, delay, variant, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const elapsed = frame - delay;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  const borderColor = variant === "bad" ? theme.colors.status.error : theme.colors.status.success;
  const bgTint = variant === "bad" ? "rgba(255, 107, 107, 0.08)" : "rgba(39, 202, 63, 0.08)";

  return (
    <div
      style={{
        opacity: appear,
        transform: `translateX(${(1 - appear) * 20}px)`,
        marginTop: 12,
        marginBottom: 16,
      }}
    >
      {/* Label */}
      <div
        style={{
          fontSize: 18,
          fontFamily: theme.typography.mono,
          color: borderColor,
          marginBottom: 8,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>{variant === "bad" ? "❌" : "✅"}</span>
        {label}
      </div>

      <div
        style={{
          backgroundColor: bgTint,
          border: `2px solid ${borderColor}60`,
          borderLeft: `4px solid ${borderColor}`,
          borderRadius: 10,
          padding: "16px 20px",
          fontFamily: theme.typography.mono,
          fontSize: 22,
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          color: theme.colors.text.primary,
        }}
      >
        {code}
      </div>
    </div>
  );
};

// ─── Main Composition ────────────────────────────────────────────────────────

const CodeReviewShowcaseInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Terminal appearance
  const terminalAppear = spring({
    frame: frame - PHASE.TERMINAL_APPEAR,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Scroll as content grows
  const scrollAmount = calculateScroll(frame, [
    { startFrame: PHASE.SCROLL_1_START, endFrame: PHASE.SCROLL_1_END, distance: 100 },
    { startFrame: PHASE.SCROLL_2_START, endFrame: PHASE.SCROLL_2_END, distance: 150 },
    { startFrame: PHASE.SCROLL_3_START, endFrame: PHASE.SCROLL_3_END, distance: 180 },
  ]);

  const showTerminal = frame >= PHASE.TERMINAL_APPEAR - 10;
  const showCommand = frame >= PHASE.COMMAND_START;
  const showStatus1 = frame >= PHASE.STATUS_1;
  const showStatus2 = frame >= PHASE.STATUS_2;
  const showStep1 = frame >= PHASE.STEP_1;
  const showFoundIssue = frame >= PHASE.FOUND_ISSUE;
  const showWarning = frame >= PHASE.WARNING_APPEAR;
  const showBadCode = frame >= PHASE.BAD_CODE_APPEAR;
  const showFixStatus = frame >= PHASE.FIX_STATUS;
  const showFixedCode = frame >= PHASE.FIXED_CODE_APPEAR;
  const showFinalStatus = frame >= PHASE.FINAL_STATUS;
  const showVisuals = frame >= PHASE.QUERY_VIZ_START;

  return (
    <Background>
      <HeroOverlay />

      {/* Floating visuals */}
      {showVisuals && (
        <>
          <LoopCounter />
          <DatabaseViz />
          <PerformanceMeter />
        </>
      )}

      {/* Terminal - centered but slightly left to make room for visuals */}
      {showTerminal && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-55%, -50%) scale(${Math.min(1, terminalAppear)})`,
            opacity: terminalAppear,
            width: 1100,
          }}
        >
          <TerminalWindow title="claude code · ~/api-service">
            <div style={{ transform: `translateY(-${scrollAmount}px)` }}>
              {/* Header */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: theme.typography.mono, fontSize: 28 }}>
                  <span style={{ color: theme.colors.text.brand }}>Claude Code</span>
                  <span style={{ color: theme.colors.text.muted }}> v2.1.20</span>
                </div>
                <div style={{ fontFamily: theme.typography.mono, fontSize: 20, color: theme.colors.text.muted }}>
                  Opus 4.5 · ~/api-service
                </div>
              </div>

              {showCommand && (
                <CommandLine
                  command={COMMAND}
                  startFrame={PHASE.COMMAND_START}
                  hideCursorAfter={PHASE.COMMAND_DONE}
                  fontSize={32}
                />
              )}

              {showStatus1 && (
                <StatusMessage delay={PHASE.STATUS_1} fontSize={24}>
                  Using code-reviewer to analyze PR #247
                </StatusMessage>
              )}

              {showStatus2 && (
                <StatusMessage delay={PHASE.STATUS_2} color={theme.colors.text.muted} fontSize={22}>
                  Read 3 files · src/api/handlers.py, models.py, tests/
                </StatusMessage>
              )}

              {showStep1 && <StepHeader step={1} title="Analyzing changes" delay={PHASE.STEP_1} fontSize={26} />}

              {showFoundIssue && (
                <StatusMessage delay={PHASE.FOUND_ISSUE} color={theme.colors.status.warning} fontSize={24}>
                  Found 1 potential performance issue
                </StatusMessage>
              )}

              {showWarning && <WarningCallout delay={PHASE.WARNING_APPEAR} />}

              {showBadCode && (
                <CodeBlock
                  code={BAD_CODE}
                  delay={PHASE.BAD_CODE_APPEAR}
                  variant="bad"
                  label="Current Code (N+1 Pattern)"
                />
              )}

              {showFixStatus && (
                <StatusMessage delay={PHASE.FIX_STATUS} fontSize={24}>
                  Suggesting optimized approach...
                </StatusMessage>
              )}

              {showFixedCode && (
                <CodeBlock
                  code={FIXED_CODE}
                  delay={PHASE.FIXED_CODE_APPEAR}
                  variant="good"
                  label="Recommended Fix (Batch Query)"
                />
              )}

              {showFinalStatus && (
                <StatusMessage delay={PHASE.FINAL_STATUS} color={theme.colors.status.success} fontSize={26}>
                  ✓ Suggested fix added to review · 100 queries → 1 query
                </StatusMessage>
              )}
            </div>
          </TerminalWindow>
        </div>
      )}

      <Scanlines />
    </Background>
  );
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const CodeReviewShowcase: React.FC = () => (
  <ThemeProvider theme={flatModernTheme}>
    <CodeReviewShowcaseInner />
  </ThemeProvider>
);
