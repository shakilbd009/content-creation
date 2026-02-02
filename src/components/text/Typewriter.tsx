import React from "react";
import { useCurrentFrame } from "remotion";
import { useTheme } from "../../themes";
import { getTypewriterProgress, getCursorVisible } from "../../animations";

export interface HighlightedChar {
  char: string;
  color: string;
}

export interface TypewriterProps {
  chars: HighlightedChar[];
  startFrame: number;
  charsPerFrame?: number;
  fontSize?: number;
  lineHeight?: number;
  showGlow?: boolean;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  chars,
  startFrame,
  charsPerFrame = 1.5,
  fontSize,
  lineHeight = 1.6,
  showGlow = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const charIndex = getTypewriterProgress(
    frame,
    startFrame,
    chars.length,
    charsPerFrame
  );

  const visibleChars = chars.slice(0, charIndex);
  const cursorVisible = getCursorVisible(frame);
  const isTyping = charIndex < chars.length;

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: fontSize ?? theme.typography.sizes.sm,
        lineHeight,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {visibleChars.map((item, i) => (
        <span
          key={i}
          style={{
            color: item.color,
            ...(showGlow && {
              textShadow: `0 0 8px ${item.color}40`,
            }),
          }}
        >
          {item.char}
        </span>
      ))}
      {isTyping && (
        <span
          style={{
            backgroundColor: cursorVisible ? theme.colors.cursor : "transparent",
            color: theme.colors.terminal.bg,
            textShadow: cursorVisible
              ? `0 0 15px ${theme.colors.cursor}`
              : "none",
          }}
        >
          {" "}
        </span>
      )}
    </div>
  );
};
