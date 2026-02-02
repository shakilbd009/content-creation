import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { useTheme } from "../../themes";
import { SPRING_PRESETS } from "../../animations/springs";

export interface TitleBadgeProps {
  accentText: string;
  mainText: string;
  fadeOutStart?: number;
  fadeOutEnd?: number;
}

export const TitleBadge: React.FC<TitleBadgeProps> = ({
  accentText,
  mainText,
  fadeOutStart = 90,
  fadeOutEnd = 120,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [fadeOutStart, fadeOutEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  const slideIn = spring({
    frame,
    fps,
    config: SPRING_PRESETS.snappy,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontFamily: theme.typography.system,
          fontSize: 42,
          color: "rgba(255, 255, 255, 0.9)",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "20px 40px",
          borderRadius: 12,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          transform: `scale(${slideIn})`,
        }}
      >
        <span style={{ color: theme.colors.text.accent, fontWeight: 600 }}>
          {accentText}
        </span>
        <span style={{ color: theme.colors.text.muted, margin: "0 16px" }}>
          ·
        </span>
        <span>{mainText}</span>
      </div>
    </div>
  );
};
