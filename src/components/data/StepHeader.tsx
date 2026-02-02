import React from "react";
import { useTheme } from "../../themes";
import { useSpringEntrance } from "../../animations";

export interface StepHeaderProps {
  step: number;
  title: string;
  delay: number;
  fontSize?: number;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  step,
  title,
  delay,
  fontSize,
}) => {
  const theme = useTheme();
  const opacity = useSpringEntrance(delay);

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: fontSize ?? theme.typography.sizes.lg,
        color: theme.colors.text.secondary,
        marginTop: 16,
        marginBottom: 12,
        opacity,
      }}
    >
      <span style={{ color: theme.colors.text.muted }}>Step {step}:</span>{" "}
      {title}
    </div>
  );
};
