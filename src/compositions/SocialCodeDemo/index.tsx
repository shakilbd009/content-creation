import React from "react";
import { Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ThemeProvider, terminalTheme, useTheme } from "../../themes";
import {
  Background,
  TerminalWindow,
  Typewriter,
  Branding,
} from "../../components";
import { getDotsString } from "../../animations";
import { CODE_TO_TYPE, highlightCode, PROMPT_TEXT, PHASE } from "./data";

const PromptLine: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const opacity = interpolate(frame, [0, 15], [0, 1]);

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: theme.typography.sizes.sm,
        marginBottom: 15,
        opacity,
      }}
    >
      <span style={{ color: theme.colors.prompt }}>➜</span>
      <span style={{ color: theme.colors.status.info }}> ~/project</span>
      <span style={{ color: theme.colors.text.secondary }}> $</span>
      <span style={{ color: theme.colors.text.primary }}> {PROMPT_TEXT}</span>
    </div>
  );
};

const ClaudeThinking: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const dotString = getDotsString(frame);

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: theme.typography.sizes.md,
        color: theme.colors.text.primary,
        marginBottom: 20,
        textShadow: `0 0 10px rgba(255, 190, 118, 0.5)`,
      }}
    >
      <span style={{ color: theme.colors.text.accent }}>Claude</span>
      <span style={{ color: theme.colors.text.muted }}> is writing code{dotString}</span>
    </div>
  );
};

const SuccessMessage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const glow = interpolate(Math.sin(frame * 0.2), [-1, 1], [0.5, 1]);

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: theme.typography.sizes.md,
        color: theme.colors.status.success,
        marginTop: 30,
        transform: `scale(${scale})`,
        textShadow: `0 0 ${20 * glow}px rgba(39, 202, 63, 0.8)`,
      }}
    >
      ✓ Component created successfully!
    </div>
  );
};

const SocialCodeDemoInner: React.FC = () => {
  const theme = useTheme();
  const highlightedCode = highlightCode(CODE_TO_TYPE, theme.colors.syntax);

  return (
    <Background>
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,180,100,0.1) 0%, transparent 70%)",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <TerminalWindow title="claude@terminal ~" innerEffects>
        <Sequence from={PHASE.PROMPT}>
          <PromptLine />
        </Sequence>

        <Sequence from={PHASE.THINKING_START} durationInFrames={PHASE.THINKING_END - PHASE.THINKING_START}>
          <ClaudeThinking />
        </Sequence>

        <Sequence from={PHASE.CODE_START}>
          <Typewriter
            chars={highlightedCode}
            startFrame={PHASE.CODE_START}
            charsPerFrame={1.5}
          />
        </Sequence>

        <Sequence from={PHASE.SUCCESS}>
          <SuccessMessage />
        </Sequence>
      </TerminalWindow>

      <Sequence from={0}>
        <Branding label="Claude" />
      </Sequence>
    </Background>
  );
};

export const SocialCodeDemo: React.FC = () => (
  <ThemeProvider theme={terminalTheme}>
    <SocialCodeDemoInner />
  </ThemeProvider>
);
