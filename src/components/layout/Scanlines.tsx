import React from "react";
import { useTheme } from "../../themes";

export const Scanlines: React.FC = () => {
  const theme = useTheme();
  const { opacity, spacing } = theme.effects.scanlines;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, ${opacity}),
          rgba(0, 0, 0, ${opacity}) 1px,
          transparent 1px,
          transparent ${spacing + 1}px
        )`,
        pointerEvents: "none",
        zIndex: 100,
      }}
    />
  );
};
