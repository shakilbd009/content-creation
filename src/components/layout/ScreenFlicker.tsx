import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../themes";

export const ScreenFlicker: React.FC = () => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  if (!theme.effects.flicker.enabled) return null;

  const opacity = interpolate(
    Math.sin(frame * 0.5),
    [-1, 1],
    [1 - theme.effects.flicker.intensity, 1]
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: theme.effects.flicker.tint,
        opacity,
        pointerEvents: "none",
        zIndex: 5,
      }}
    />
  );
};
