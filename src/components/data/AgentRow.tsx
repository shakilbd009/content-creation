import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { useTheme } from "../../themes";
import { SPRING_PRESETS } from "../../animations/springs";
import type { AgentData } from "../../types";

export interface AgentRowProps {
  agent: AgentData;
  index: number;
  isLast: boolean;
  startFrame: number;
  staggerInterval?: number;
  workEndFrame?: number;
}

export const AgentRow: React.FC<AgentRowProps> = ({
  agent,
  index,
  isLast,
  startFrame,
  staggerInterval = 6,
  workEndFrame = 180,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const localFrame = frame - startFrame;
  const staggerDelay = index * staggerInterval;

  const entryProgress = spring({
    frame: localFrame,
    fps,
    delay: staggerDelay,
    config: SPRING_PRESETS.snappy,
  });

  const tokenProgress = interpolate(
    localFrame,
    [staggerDelay + 20, workEndFrame],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );
  const displayTokens = (agent.tokens * tokenProgress).toFixed(1);
  const displayTools = Math.floor(agent.toolUses * tokenProgress);

  const treeChar = isLast ? "└─" : "├─";

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: theme.typography.sizes.md,
        marginBottom: 4,
        opacity: Math.max(0, entryProgress),
        transform: `translateX(${(1 - Math.max(0, entryProgress)) * 20}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            color: theme.colors.text.muted,
            marginRight: 8,
            width: 28,
          }}
        >
          {treeChar}
        </span>
        <span style={{ color: agent.color, fontWeight: 500 }}>
          {agent.name}
        </span>
        <span style={{ color: theme.colors.text.muted, marginLeft: 10 }}>
          ·
        </span>
        <span style={{ color: theme.colors.status.info, marginLeft: 10 }}>
          {displayTools} tools
        </span>
        <span style={{ color: theme.colors.text.muted, marginLeft: 10 }}>
          ·
        </span>
        <span style={{ color: theme.colors.status.warning, marginLeft: 10 }}>
          {displayTokens}k
        </span>
      </div>
    </div>
  );
};
