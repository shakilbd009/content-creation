import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../themes";

export interface BrandingProps {
  label?: string;
  sublabel?: string;
}

export const Branding: React.FC<BrandingProps> = ({
  label = "Claude Code",
  sublabel,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        fontFamily: theme.typography.system,
        textAlign: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 36,
          color: "rgba(255, 255, 255, 0.5)",
          marginBottom: sublabel ? 8 : 0,
        }}
      >
        Powered by{" "}
        <span style={{ color: theme.colors.text.brand, fontWeight: 500 }}>
          {label}
        </span>
      </div>
      {sublabel && (
        <div style={{ fontSize: 26, color: "rgba(255, 255, 255, 0.35)" }}>
          {sublabel}
        </div>
      )}
    </div>
  );
};
