import React from "react";
import { AbsoluteFill } from "remotion";
import { useTheme } from "../../themes";

export const Background: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useTheme();

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.backgroundGradient,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {theme.colors.ambientGlows.map((glow, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            background: glow,
          }}
        />
      ))}
      {children}
    </AbsoluteFill>
  );
};
