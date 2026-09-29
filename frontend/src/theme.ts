import { useMemo } from "react";
import { Appearance, StyleSheet, useColorScheme } from "react-native";

export type ColorScheme = "light" | "dark";

const light = {
  surface: "#FFF9FA",
  onSurface: "#3D1C2A",
  surfaceSecondary: "#FFFFFF",
  onSurfaceSecondary: "#3D1C2A",
  surfaceTertiary: "#FEEAF1",
  onSurfaceTertiary: "#3D1C2A",
  surfaceInverse: "#3D1C2A",
  onSurfaceInverse: "#FFF9FA",
  muted: "#8D7A84",

  brand: "#E6A8D7",
  onBrand: "#3D1C2A",
  brandPrimary: "#D198E5",
  onBrandPrimary: "#33163E",
  brandSecondary: "#FFB7C5",
  onBrandSecondary: "#4A1525",
  brandTertiary: "#F3E8FF",
  onBrandTertiary: "#5C2B80",

  success: "#A5D6A7",
  onSuccess: "#003300",
  warning: "#FFE082",
  onWarning: "#4D3300",
  error: "#EF9A9A",
  onError: "#4A0000",
  info: "#81D4FA",
  onInfo: "#002B4A",

  border: "#F5E1E8",
  borderStrong: "#E3B8C8",
  divider: "#F5E1E8",
};

export type ThemeColors = typeof light;

export const defaultScheme = "light" satisfies ColorScheme;

export const themes: { light: ThemeColors; dark?: ThemeColors } = { light };

export function setColorScheme(scheme: ColorScheme | null) {
  Appearance.setColorScheme?.(scheme ?? "unspecified");
}

setColorScheme?.(themes.dark ? null : defaultScheme);

export function useTheme(): { scheme: ColorScheme; colors: ThemeColors } {
  const system = useColorScheme();
  const scheme: ColorScheme = system && themes[system] ? system : defaultScheme;
  return { scheme, colors: themes[scheme] ?? themes.light };
}

export function makeStyles<T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  factory: (colors: ThemeColors) => T & StyleSheet.NamedStyles<any>,
): () => T {
  return function useStyles(): T {
    const { colors } = useTheme();
    return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
  };
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 24,
  pill: 999,
};
