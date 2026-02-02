import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { useTheme } from "../../themes";
import { SPRING_PRESETS } from "../../animations/springs";
import type { TaskItemData } from "../../types";

export interface TaskListItemProps {
  task: TaskItemData;
  startFrame: number;
  completeFrame: number;
  isActive: boolean;
  fontSize?: number;
}

export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  startFrame,
  completeFrame,
  isActive,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const entryProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_PRESETS.snappy,
  });

  const isComplete = frame >= completeFrame;
  const completionProgress = spring({
    frame: frame - completeFrame,
    fps,
    config: SPRING_PRESETS.bouncy,
  });

  const spinnerChars = ["◐", "◓", "◑", "◒"];
  const spinnerIndex = Math.floor((frame / 4) % 4);

  let checkIcon = "◻";
  let checkColor = "#444";
  if (isComplete) {
    checkIcon = "✔";
    checkColor = theme.colors.status.success;
  } else if (isActive) {
    checkIcon = spinnerChars[spinnerIndex];
    checkColor = theme.colors.status.warning;
  }

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: fontSize ?? theme.typography.sizes.md,
        marginBottom: 8,
        opacity: Math.max(0, entryProgress),
        transform: `translateX(${(1 - Math.max(0, entryProgress)) * 30}px)`,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <span
        style={{
          color: checkColor,
          transform: isComplete
            ? `scale(${1 + completionProgress * 0.2})`
            : undefined,
          display: "inline-block",
          width: 24,
          textAlign: "center",
        }}
      >
        {checkIcon}
      </span>
      <span style={{ color: task.color, fontWeight: 500 }}>
        {task.category} {task.id}
      </span>
      <span style={{ color: theme.colors.text.muted }}>-</span>
      <span
        style={{
          color: isComplete
            ? theme.colors.text.muted
            : theme.colors.text.secondary,
          textDecoration: isComplete ? "line-through" : "none",
        }}
      >
        {task.label}
      </span>
    </div>
  );
};
