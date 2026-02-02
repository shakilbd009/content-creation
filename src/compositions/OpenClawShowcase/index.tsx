import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThemeProvider, telegramTheme, useTheme } from "../../themes";
import { Background } from "../../components/layout/Background";
import { TerminalWindow } from "../../components/layout/TerminalWindow";
import {
  CHAT_MESSAGES,
  TEST_RESULTS,
  TEST_COMMAND,
  PHASE,
  ChatMessage,
} from "./data";

// ─── Hero Overlay ────────────────────────────────────────────────────────────

const HeroOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const opacity = interpolate(
    frame,
    [PHASE.HERO_START, PHASE.HERO_START + 10, PHASE.HERO_END - 15, PHASE.HERO_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame > PHASE.HERO_END + 5) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            fontFamily: theme.typography.system,
            color: theme.colors.text.primary,
            textShadow: `0 0 60px rgba(42, 171, 238, 0.6), 0 0 120px rgba(42, 171, 238, 0.3)`,
            letterSpacing: -1,
          }}
        >
          Claude From Your Phone
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 500,
            fontFamily: theme.typography.system,
            color: theme.colors.text.accent,
            opacity: 0.9,
          }}
        >
          OpenClaw + Hermes
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Typing Indicator ────────────────────────────────────────────────────────

const TypingIndicator: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;
  if (elapsed < 0) return null;

  return (
    <div style={{ display: "flex", gap: 6, padding: "12px 0" }}>
      {[0, 1, 2].map((i) => {
        const bounce = Math.sin((elapsed * 0.3 + i * 1.2) % (Math.PI * 2));
        return (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#8B9DAF",
              transform: `translateY(${bounce * -4}px)`,
              opacity: 0.7,
            }}
          />
        );
      })}
    </div>
  );
};

// ─── Chat Bubble ─────────────────────────────────────────────────────────────

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isUser = message.from === "user";
  const elapsed = frame - message.appearAt;
  if (elapsed < 0) return null;

  const slideUp = spring({
    frame: elapsed,
    fps,
    config: { damping: 15, stiffness: 180, mass: 0.8 },
  });

  // Typewriter: reveal 3 chars per frame
  const charsVisible = Math.min(message.text.length, elapsed * 3);
  const displayText = message.text.slice(0, charsVisible);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        opacity: slideUp,
        transform: `translateY(${(1 - slideUp) * 15}px)`,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          maxWidth: "82%",
          padding: "14px 18px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          backgroundColor: isUser ? "#2AABEE" : "#1C2B3A",
          color: "#FFFFFF",
          fontSize: 22,
          fontFamily: "system-ui, -apple-system, sans-serif",
          lineHeight: 1.4,
        }}
      >
        {displayText}
      </div>
    </div>
  );
};

// ─── Phone Mockup ────────────────────────────────────────────────────────────

const PhoneMockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearProgress = spring({
    frame: frame - PHASE.PHONE_APPEAR,
    fps,
    config: { damping: 14, stiffness: 120, mass: 1 },
  });

  if (frame < PHASE.PHONE_APPEAR - 5) return null;

  // Show typing indicator before Hermes replies
  const showTyping1 =
    frame >= PHASE.HERMES_REPLY - 30 && frame < PHASE.HERMES_REPLY;

  // Show typing indicator before report messages
  const showTyping2 =
    frame >= PHASE.REPORT_START - 25 && frame < PHASE.REPORT_START;

  return (
    <div
      style={{
        width: 420,
        height: 780,
        borderRadius: 44,
        backgroundColor: "#0E1621",
        border: "3px solid rgba(255,255,255,0.1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        opacity: Math.max(0, appearProgress),
        transform: `scale(${Math.max(0.8, 0.8 + appearProgress * 0.2)})`,
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.6), 0 0 1px rgba(42,171,238,0.3)",
      }}
    >
      {/* Notch */}
      <div
        style={{
          height: 36,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          backgroundColor: "#0E1621",
        }}
      >
        <div
          style={{
            width: 140,
            height: 28,
            borderRadius: "0 0 18px 18px",
            backgroundColor: "#000",
          }}
        />
      </div>

      {/* Telegram Header */}
      <div
        style={{
          height: 64,
          backgroundColor: "#17212B",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 14,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Back arrow */}
        <div
          style={{
            color: "#2AABEE",
            fontSize: 24,
            fontFamily: "system-ui",
          }}
        >
          &larr;
        </div>
        {/* Avatar */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #2AABEE 0%, #229ED9 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          H
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 20,
              fontWeight: 600,
              fontFamily: "system-ui",
            }}
          >
            Hermes
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              color: "#8B9DAF",
              fontFamily: "system-ui",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#34D058",
              }}
            />
            online
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
      >
        {CHAT_MESSAGES.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {showTyping1 && (
          <TypingIndicator startFrame={PHASE.HERMES_REPLY - 30} />
        )}
        {showTyping2 && (
          <TypingIndicator startFrame={PHASE.REPORT_START - 25} />
        )}
      </div>

      {/* Input Bar */}
      <div
        style={{
          height: 56,
          backgroundColor: "#17212B",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#0E1621",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            color: "#5A6A7A",
            fontSize: 16,
            fontFamily: "system-ui",
          }}
        >
          Message
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: "#2AABEE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            color: "#fff",
          }}
        >
          &uarr;
        </div>
      </div>
    </div>
  );
};

// ─── Test Output Panel ───────────────────────────────────────────────────────

const TestOutputPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  return (
    <TerminalWindow title="~/project">
      <div
        style={{
          fontFamily: theme.typography.mono,
          fontSize: 20,
          lineHeight: 1.7,
          color: theme.colors.text.primary,
        }}
      >
        {/* Command line */}
        {frame >= PHASE.TERMINAL_IN + 10 && (
          <div style={{ marginBottom: 12 }}>
            <span style={{ color: theme.colors.prompt }}>$ </span>
            <span>{TEST_COMMAND}</span>
          </div>
        )}

        {/* Test results */}
        {TEST_RESULTS.map((test) => {
          if (frame < test.appearAt) return null;
          const isPass = test.status === "pass";
          const icon = isPass ? "\u2713" : "\u2717";
          const color = isPass
            ? theme.colors.status.success
            : theme.colors.status.error;

          return (
            <div key={test.name} style={{ display: "flex", gap: 10 }}>
              <span style={{ color }}>{icon}</span>
              <span style={{ color: theme.colors.text.secondary }}>
                {test.name}
              </span>
              <span style={{ color: theme.colors.text.muted }}>
                ({test.testCount} tests)
              </span>
              {test.failedTest && (
                <span style={{ color: theme.colors.status.error }}>
                  &mdash; {test.failedTest}
                </span>
              )}
            </div>
          );
        })}

        {/* Summary line */}
        {frame >= PHASE.TESTS_END && (
          <div style={{ marginTop: 16 }}>
            <span style={{ color: theme.colors.status.success }}>
              23 passed
            </span>
            <span style={{ color: theme.colors.text.muted }}>, </span>
            <span style={{ color: theme.colors.status.error }}>1 failed</span>
          </div>
        )}
      </div>
    </TerminalWindow>
  );
};

// ─── Scene Orchestration ─────────────────────────────────────────────────────

const OpenClawShowcaseInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 3D tilt: interpolate rotateX from 0 to 12, rotateY from 0 to -3
  const tiltIn = interpolate(
    frame,
    [PHASE.TILT_START, PHASE.TILT_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tiltOut = interpolate(
    frame,
    [PHASE.UNTILT_START, PHASE.UNTILT_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const tilt = tiltIn - tiltOut;

  const rotateX = tilt * 12;
  const rotateY = tilt * -3;

  // Phone position: centered → shift left when terminal appears
  const phoneShift = interpolate(
    frame,
    [PHASE.TILT_START, PHASE.TILT_END],
    [0, -280],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const phoneReturn = interpolate(
    frame,
    [PHASE.UNTILT_START, PHASE.UNTILT_END],
    [0, 280],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const phoneX = phoneShift + phoneReturn;

  // Phone scale: shrink slightly during tilt
  const phoneScale = interpolate(
    frame,
    [PHASE.TILT_START, PHASE.TILT_END, PHASE.UNTILT_START, PHASE.UNTILT_END],
    [1, 0.88, 0.88, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Terminal slide in from right
  const terminalSlide = spring({
    frame: frame - PHASE.TERMINAL_IN,
    fps,
    config: { damping: 14, stiffness: 100, mass: 1 },
  });
  const terminalX = interpolate(
    Math.max(0, terminalSlide),
    [0, 1],
    [500, 0]
  );

  // Terminal slide out
  const terminalOut = interpolate(
    frame,
    [PHASE.TERMINAL_OUT, PHASE.TERMINAL_OUT + 25],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const terminalOpacity = 1 - terminalOut;

  const showTerminal = frame >= PHASE.TERMINAL_IN - 5 && terminalOpacity > 0;

  return (
    <Background>
      <HeroOverlay />

      {/* 3D Scene Wrapper */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
          transform: `perspective(1800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Phone */}
        <div
          style={{
            transform: `translateX(${phoneX}px) scale(${phoneScale})`,
          }}
        >
          <PhoneMockup />
        </div>

        {/* Terminal */}
        {showTerminal && (
          <div
            style={{
              transform: `translateX(${terminalX}px)`,
              opacity: terminalOpacity,
            }}
          >
            <TestOutputPanel />
          </div>
        )}
      </div>
    </Background>
  );
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const OpenClawShowcase: React.FC = () => (
  <ThemeProvider theme={telegramTheme}>
    <OpenClawShowcaseInner />
  </ThemeProvider>
);
