import React from "react";
import { useTheme } from "../../themes";

export const Vignette: React.FC = () => {
  const theme = useTheme();

  if (!theme.effects.vignette.enabled) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(
          ellipse at center,
          transparent 50%,
          rgba(0, 0, 0, ${theme.effects.vignette.opacity}) 100%
        )`,
        pointerEvents: "none",
        zIndex: 8,
      }}
    />
  );
};
