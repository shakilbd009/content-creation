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
import { calculateScroll } from "../../animations";
import {
  CHAT_MESSAGES,
  TERMINAL_LINES,
  CODE_CHANGE,
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
            textShadow:
              "0 0 60px rgba(42, 171, 238, 0.6), 0 0 120px rgba(42, 171, 238, 0.3)",
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
          fontSize: 26,
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

  const showTyping1 =
    frame >= PHASE.HERMES_REPLY - 30 && frame < PHASE.HERMES_REPLY;
  const showTyping2 =
    frame >= PHASE.FAILURE_REPORT - 25 && frame < PHASE.FAILURE_REPORT;
  const showTyping3 =
    frame >= PHASE.FIX_REPORT - 25 && frame < PHASE.FIX_REPORT;

  return (
    <div
      style={{
        width: 480,
        height: 880,
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
        <div
          style={{ color: "#2AABEE", fontSize: 24, fontFamily: "system-ui" }}
        >
          &larr;
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2AABEE 0%, #229ED9 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          🦀
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
          <TypingIndicator startFrame={PHASE.FAILURE_REPORT - 25} />
        )}
        {showTyping3 && (
          <TypingIndicator startFrame={PHASE.FIX_REPORT - 25} />
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

// ─── Code Diff View ──────────────────────────────────────────────────────────

const CodeDiffView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const elapsed = frame - CODE_CHANGE.appearAt;
  if (elapsed < 0) return null;

  const appear = spring({
    frame: elapsed,
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.8 },
  });

  const colorMap = {
    context: theme.colors.text.secondary,
    removed: theme.colors.status.error,
    added: theme.colors.status.success,
  };

  const prefixMap = {
    context: "  ",
    removed: "- ",
    added: "+ ",
  };

  const bgMap = {
    context: "transparent",
    removed: "rgba(255, 71, 87, 0.08)",
    added: "rgba(52, 208, 88, 0.08)",
  };

  return (
    <div
      style={{
        opacity: appear,
        transform: `translateY(${(1 - appear) * 12}px)`,
        marginTop: 16,
      }}
    >
      {/* Filename header */}
      <div
        style={{
          fontSize: 24,
          color: theme.colors.text.accent,
          fontFamily: theme.typography.mono,
          marginBottom: 8,
          opacity: 0.8,
        }}
      >
        {CODE_CHANGE.filename}
      </div>

      {/* Diff lines */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.3)",
          borderRadius: 8,
          padding: "10px 14px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {CODE_CHANGE.lines.map((line, i) => {
          // Stagger each line by 3 frames
          const lineElapsed = elapsed - i * 3;
          if (lineElapsed < 0) return null;

          return (
            <div
              key={i}
              style={{
                fontFamily: theme.typography.mono,
                fontSize: 24,
                lineHeight: 1.6,
                color: colorMap[line.type],
                backgroundColor: bgMap[line.type],
                padding: "1px 6px",
                borderRadius: 3,
                whiteSpace: "pre",
              }}
            >
              <span style={{ opacity: 0.5 }}>{prefixMap[line.type]}</span>
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Terminal Panel ──────────────────────────────────────────────────────────

const TerminalPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const colorMap: Record<string, string> = {
    prompt: theme.colors.prompt,
    default: theme.colors.text.primary,
    success: theme.colors.status.success,
    error: theme.colors.status.error,
    muted: theme.colors.text.muted,
    accent: theme.colors.text.accent,
  };

  // Scroll as content overflows: scroll during test results, then again for fix + diff
  const scrollAmount = calculateScroll(frame, [
    { startFrame: 280, endFrame: 340, distance: 120 },
    { startFrame: 400, endFrame: 440, distance: 100 },
    { startFrame: 455, endFrame: 480, distance: 160 },
  ]);

  return (
    <TerminalWindow title="hermes@openclaw ~">
      <div
        style={{
          fontFamily: theme.typography.mono,
          fontSize: 26,
          lineHeight: 1.7,
          color: theme.colors.text.primary,
          overflow: "hidden",
        }}
      >
        <div style={{ transform: `translateY(-${scrollAmount}px)` }}>
          {TERMINAL_LINES.map((line, i) => {
            if (frame < line.appearAt) return null;
            return (
              <div key={i} style={{ color: colorMap[line.color || "default"] }}>
                {line.text || "\u00A0"}
              </div>
            );
          })}

          <CodeDiffView />
        </div>
      </div>
    </TerminalWindow>
  );
};

// ─── Scene Orchestration ─────────────────────────────────────────────────────

const OpenClawShowcaseInner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone: centered (50%) at first, slides to left (22%) when terminal appears
  const phoneLeft = interpolate(
    frame,
    [PHASE.TERMINAL_IN, PHASE.TERMINAL_IN + 30, PHASE.TERMINAL_OUT, PHASE.TERMINAL_OUT + 30],
    [50, 22, 22, 50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phone scale: no shrinking — keep it big for mobile viewers
  const phoneScale = 1;

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

  // Terminal fade out
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

      {/* Phone — absolute positioned so it can slide without pushing layout */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${phoneLeft}%`,
          transform: `translate(-50%, -50%) scale(${phoneScale})`,
          zIndex: 2,
        }}
      >
        <PhoneMockup />
      </div>

      {/* Terminal — absolute positioned on right side */}
      {showTerminal && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 50,
            transform: `translate(${terminalX}px, -50%)`,
            opacity: terminalOpacity,
            zIndex: 1,
          }}
        >
          <TerminalPanel />
        </div>
      )}
    </Background>
  );
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const OpenClawShowcase: React.FC = () => (
  <ThemeProvider theme={telegramTheme}>
    <OpenClawShowcaseInner />
  </ThemeProvider>
);
