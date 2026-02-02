import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../../themes";
import { useSpringEntrance } from "../../animations";

export interface CodeBlockProps {
  code: string;
  file?: string;
  delay: number;
  prefix?: string;
  fontSize?: number;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  file,
  delay,
  prefix = "+",
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const opacity = useSpringEntrance(delay);
  const slideIn = interpolate(frame - delay, [0, 15], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: fontSize ?? theme.typography.sizes.sm,
        marginBottom: 10,
        opacity,
        transform: `translateX(${slideIn}px)`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginLeft: 36,
      }}
    >
      <span style={{ color: theme.colors.status.success }}>{prefix}</span>
      <span style={{ color: theme.colors.status.info }}>{code}</span>
      {file && (
        <span
          style={{
            color: theme.colors.text.muted,
            fontSize: (fontSize ?? theme.typography.sizes.sm) - 4,
          }}
        >
          // {file}
        </span>
      )}
    </div>
  );
};
