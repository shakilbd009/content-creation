import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { useTheme } from "../../themes";
import { useSpringEntrance } from "../../animations";

export interface DataTableColumn {
  key: string;
  label: string;
  width: number;
}

export interface DataTableRow {
  [key: string]: string | number | undefined;
  _color?: string;
}

export interface DataTableProps {
  columns: DataTableColumn[];
  rows: DataTableRow[];
  delay: number;
  rowStagger?: number;
  animateValues?: boolean;
  title?: string;
  fontSize?: number;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  delay,
  rowStagger = 4,
  animateValues = true,
  title,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const opacity = useSpringEntrance(delay);

  return (
    <div
      style={{
        fontFamily: theme.typography.mono,
        fontSize: fontSize ?? theme.typography.sizes.md,
        opacity,
      }}
    >
      {title && (
        <div
          style={{
            color: theme.colors.text.secondary,
            marginBottom: 12,
          }}
        >
          {title}
        </div>
      )}
      <div
        style={{
          border: "2px solid #333",
          borderRadius: 8,
          overflow: "hidden",
          display: "inline-block",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#1a1a1a",
            borderBottom: "2px solid #333",
          }}
        >
          {columns.map((col, i) => (
            <div
              key={col.key}
              style={{
                width: col.width,
                padding: "12px 20px",
                color: theme.colors.text.muted,
                ...(i > 0 && { borderLeft: "2px solid #333" }),
              }}
            >
              {col.label}
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map((row, i) => {
          const rowDelay = delay + i * rowStagger;
          const rowOpacity = interpolate(frame - rowDelay, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const countProgress = animateValues
            ? interpolate(frame - rowDelay, [5, 25], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.quad),
              })
            : 1;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                borderBottom: i < rows.length - 1 ? "2px solid #333" : "none",
                opacity: rowOpacity,
              }}
            >
              {columns.map((col, j) => {
                const value = row[col.key];
                const isNumber = typeof value === "number";
                const displayValue = isNumber
                  ? Math.floor((value as number) * countProgress)
                  : value;

                return (
                  <div
                    key={col.key}
                    style={{
                      width: col.width,
                      padding: "10px 20px",
                      color:
                        j === 0
                          ? (row._color as string) ??
                            theme.colors.text.primary
                          : "#ccc",
                      ...(j > 0 && { borderLeft: "2px solid #333" }),
                    }}
                  >
                    {displayValue}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
