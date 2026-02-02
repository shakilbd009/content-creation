import React, { createContext, useContext } from "react";
import { Theme } from "./types";
import { terminalTheme } from "./terminal";
import { oceanTheme } from "./ocean";
import { modernTheme } from "./modern";

export { terminalTheme } from "./terminal";
export { oceanTheme } from "./ocean";
export { modernTheme } from "./modern";
export type { Theme } from "./types";

const ThemeContext = createContext<Theme>(oceanTheme);

export const ThemeProvider: React.FC<{
  theme: Theme;
  children: React.ReactNode;
}> = ({ theme, children }) => {
  return React.createElement(ThemeContext.Provider, { value: theme }, children);
};

export const useTheme = (): Theme => {
  return useContext(ThemeContext);
};

export const themes = {
  terminal: terminalTheme,
  ocean: oceanTheme,
  modern: modernTheme,
} as const;
