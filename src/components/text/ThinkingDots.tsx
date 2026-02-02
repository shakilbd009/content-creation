import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../../themes";
import { useSpringEntrance } from "../../animations";
import { getDotsString } from "../../animations";

export interface ThinkingDotsProps {
  delay: number;
  label: string;
  showTimer?: boolean;
  timerMultiplier?: number;
  icon?: string;
  hint?: string;
  fontSize?: number;
}

export const ThinkingDots: React.FC<ThinkingDotsProps> = ({
  delay,
  label,
  showTimer = false,
  timerMultiplier = 2,
  icon = "✳",
  hint,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const localFrame = Math.max(0, frame - delay);
  const opacity = useSpringEntrance(delay);
  const dotString = getDotsString(localFrame);

  let timeStr: string | undefined;
  if (showTimer) {
    const seconds = Math.min(
      123,
      Math.floor((localFrame / fps) * timerMultiplier)
    );
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timeStr = `${mins}m ${secs}s`;
  }

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: fontSize ?? theme.typography.sizes.md,
        color: theme.colors.text.muted,
        marginTop: 12,
        marginBottom: 12,
        opacity,
      }}
    >
      <span style={{ color: theme.colors.status.warning }}>{icon}</span>
      <span style={{ marginLeft: 8 }}>
        {label}
        {dotString}
      </span>
      {timeStr && (
        <span
          style={{
            color: theme.colors.text.muted,
            marginLeft: 12,
            fontSize: (fontSize ?? theme.typography.sizes.md) - 6,
          }}
        >
          ({timeStr})
        </span>
      )}
      {hint && (
        <span
          style={{
            color: theme.colors.text.muted,
            marginLeft: 16,
            fontSize: (fontSize ?? theme.typography.sizes.md) - 6,
          }}
        >
          ({hint})
        </span>
      )}
    </div>
  );
};
