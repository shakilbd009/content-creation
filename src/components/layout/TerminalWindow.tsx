import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { useTheme } from "../../themes";
import { SPRING_PRESETS } from "../../animations/springs";
import { Scanlines } from "./Scanlines";
import { ScreenFlicker } from "./ScreenFlicker";
import { Vignette } from "./Vignette";

export interface TerminalWindowProps {
  children: React.ReactNode;
  title?: string;
  innerEffects?: boolean;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  children,
  title,
  innerEffects = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  const { perspective, backdrop } = theme.effects;
  const { terminal } = theme.spacing;

  const springConfig = perspective.enabled
    ? SPRING_PRESETS.snappy
    : SPRING_PRESETS.gentle;

  const scale = spring({ frame, fps, config: springConfig });

  const opacity = perspective.enabled
    ? interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" })
    : 1;

  const transform = perspective.enabled
    ? `perspective(${perspective.distance}px) rotateX(${perspective.rotateX}deg) rotateY(${perspective.rotateY}deg) scale(${scale})`
    : `scale(${scale})`;

  return (
    <div
      style={{
        width: terminal.width,
        height: terminal.height,
        backgroundColor: theme.colors.terminal.bg,
        ...(backdrop.blur > 0 && {
          backdropFilter: `blur(${backdrop.blur}px)`,
          WebkitBackdropFilter: `blur(${backdrop.blur}px)`,
        }),
        borderRadius: terminal.borderRadius,
        overflow: "hidden",
        transform,
        ...(perspective.enabled && { transformStyle: "preserve-3d" as const }),
        opacity,
        boxShadow: theme.colors.terminal.glow,
        border: theme.colors.terminal.border,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: terminal.titleBarHeight,
          backgroundColor: theme.colors.terminal.titleBarBg,
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 12,
          ...(theme.colors.terminal.titleBarBorder !== "none" && {
            borderBottom: theme.colors.terminal.titleBarBorder,
          }),
        }}
      >
        <div
          style={{
            width: terminal.trafficLightSize,
            height: terminal.trafficLightSize,
            borderRadius: "50%",
            backgroundColor: "#ff5f56",
          }}
        />
        <div
          style={{
            width: terminal.trafficLightSize,
            height: terminal.trafficLightSize,
            borderRadius: "50%",
            backgroundColor: "#ffbd2e",
          }}
        />
        <div
          style={{
            width: terminal.trafficLightSize,
            height: terminal.trafficLightSize,
            borderRadius: "50%",
            backgroundColor: "#27ca3f",
          }}
        />
        {title && (
          <span
            style={{
              marginLeft: 20,
              color: theme.colors.text.secondary,
              fontSize: theme.typography.sizes.xs,
              fontFamily: theme.typography.mono,
            }}
          >
            {title}
          </span>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: terminal.padding,
          height: `calc(100% - ${terminal.titleBarHeight}px)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {children}
        {innerEffects && (
          <>
            <Scanlines />
            <ScreenFlicker />
            <Vignette />
          </>
        )}
      </div>
    </div>
  );
};
