import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { useTheme } from "../../themes";
import {
  getTypewriterCommandProgress,
  getCursorVisible,
} from "../../animations";

export interface CommandLineProps {
  command: string;
  startFrame: number;
  charsPerSecond?: number;
  hideCursorAfter?: number;
  promptSymbol?: string;
  fontSize?: number;
}

export const CommandLine: React.FC<CommandLineProps> = ({
  command,
  startFrame,
  charsPerSecond = 25,
  hideCursorAfter = 999,
  promptSymbol = "❯",
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const charsToShow = getTypewriterCommandProgress(
    frame,
    startFrame,
    command.length,
    fps,
    charsPerSecond
  );

  const visibleCommand = command.slice(0, charsToShow);
  const isTypingDone = charsToShow >= command.length;

  const shouldShowCursor =
    !isTypingDone || (frame < hideCursorAfter && getCursorVisible(frame, 0.3));

  const opacity = interpolate(frame - startFrame, [-10, 0], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: fontSize ?? theme.typography.sizes.xxl,
        opacity,
        marginBottom: 24,
      }}
    >
      <span style={{ color: theme.colors.prompt }}>{promptSymbol}</span>
      <span style={{ color: theme.colors.text.primary }}>
        {" "}
        {visibleCommand}
      </span>
      {shouldShowCursor && (
        <span
          style={{
            backgroundColor: theme.colors.cursor,
            marginLeft: 2,
            display: "inline-block",
            width: 20,
            height: 40,
            verticalAlign: "middle",
          }}
        />
      )}
    </div>
  );
};
