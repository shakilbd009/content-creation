import React from "react";
import { useTheme } from "../../themes";
import { useSpringEntrance } from "../../animations";

export interface StatusMessageProps {
  children: React.ReactNode;
  delay: number;
  color?: string;
  bulletSymbol?: string;
  fontSize?: number;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  children,
  delay,
  color,
  bulletSymbol = "⏺",
  fontSize,
}) => {
  const theme = useTheme();
  const opacity = useSpringEntrance(delay);

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: fontSize ?? theme.typography.sizes.lg,
        color: color ?? theme.colors.text.secondary,
        marginBottom: 14,
        opacity,
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <span style={{ color: theme.colors.bullet }}>{bulletSymbol}</span>
      <span>{children}</span>
    </div>
  );
};
