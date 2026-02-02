import React from "react";
import { interpolate } from "remotion";
import { useTheme } from "../../themes";
import { useSpringEntrance } from "../../animations";

export interface ProgressBarProps {
  delay: number;
  completed: number;
  total: number;
  barWidth?: number;
  fontSize?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  delay,
  completed,
  total,
  barWidth = 400,
  fontSize,
}) => {
  const theme = useTheme();
  const opacity = useSpringEntrance(delay);

  const percentage = Math.round((completed / total) * 100);
  const fillWidth = interpolate(completed, [0, total], [0, barWidth], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: fontSize ?? theme.typography.sizes.lg,
        marginTop: 24,
        marginBottom: 16,
        opacity,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 12,
        }}
      >
        <span style={{ color: theme.colors.text.secondary }}>Progress:</span>
        <span style={{ color: theme.colors.status.info }}>
          {completed}/{total}
        </span>
        <span style={{ color: theme.colors.text.muted }}>({percentage}%)</span>
      </div>
      <div
        style={{
          width: barWidth,
          height: 8,
          backgroundColor: "#333",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: fillWidth,
            height: "100%",
            backgroundColor:
              percentage === 100
                ? theme.colors.status.success
                : theme.colors.status.info,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
};
