"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";

// ============================================================================
// Types
// ============================================================================

type OKLCHColor = {
  l: number; // Lightness: 0-1
  c: number; // Chroma: 0-0.4
  h: number; // Hue: 0-360
};

type ColorCategory = {
  name: string;
  description: string;
  colors: ColorItem[];
};

type ColorItem = {
  name: string;
  variable: string;
  usage: string;
  contrast?: string;
};

type ColorSet = {
  // Brand foundation
  "navy-900": OKLCHColor;
  "emerald-600": OKLCHColor;
  "sky-blue": OKLCHColor;
  // Background
  "bg-dark": OKLCHColor;
  bg: OKLCHColor;
  "bg-light": OKLCHColor;
  // Text
  text: OKLCHColor;
  "text-muted": OKLCHColor;
  // Borders
  highlight: OKLCHColor;
  border: OKLCHColor;
  "border-muted": OKLCHColor;
  // Actions
  primary: OKLCHColor;
  "primary-foreground": OKLCHColor;
  secondary: OKLCHColor;
  "secondary-foreground": OKLCHColor;
  // Alerts
  danger: OKLCHColor;
  "danger-foreground": OKLCHColor;
  warning: OKLCHColor;
  "warning-foreground": OKLCHColor;
  success: OKLCHColor;
  "success-foreground": OKLCHColor;
  info: OKLCHColor;
  "info-foreground": OKLCHColor;
};

type BrandTheme = {
  id: string;
  name: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    family: string;
    weights: number[];
    url: string;
  };
  lightColors: ColorSet;
  darkColors: ColorSet;
  radius: number; // Base radius in px
  spacing: number; // Base spacing in px
};

type DesignTokens = {
  colors: {
    // Brand foundation
    "navy-900": OKLCHColor;
    "emerald-600": OKLCHColor;
    "sky-blue": OKLCHColor;
    // Background (light mode)
    "bg-dark": OKLCHColor;
    bg: OKLCHColor;
    "bg-light": OKLCHColor;
    // Text (light mode)
    text: OKLCHColor;
    "text-muted": OKLCHColor;
    // Borders
    highlight: OKLCHColor;
    border: OKLCHColor;
    "border-muted": OKLCHColor;
    // Actions
    primary: OKLCHColor;
    "primary-foreground": OKLCHColor;
    secondary: OKLCHColor;
    "secondary-foreground": OKLCHColor;
    // Alerts
    danger: OKLCHColor;
    "danger-foreground": OKLCHColor;
    warning: OKLCHColor;
    "warning-foreground": OKLCHColor;
    success: OKLCHColor;
    "success-foreground": OKLCHColor;
    info: OKLCHColor;
    "info-foreground": OKLCHColor;
  };
  radius: number; // Base radius in px
  spacing: number; // Base spacing in px
};

// ============================================================================
// Default Tokens (from globals.css)
// ============================================================================

const DEFAULT_TOKENS: DesignTokens = {
  colors: {
    // Brand foundation
    "navy-900": { l: 0.205, c: 0.043, h: 264.052 },
    "emerald-600": { l: 0.617, c: 0.153, h: 166.108 },
    "sky-blue": { l: 0.699, c: 0.126, h: 232.661 },
    // Background (light mode)
    "bg-dark": { l: 0.97, c: 0, h: 0 },
    bg: { l: 1, c: 0, h: 0 },
    "bg-light": { l: 0.985, c: 0, h: 0 },
    // Text (light mode)
    text: { l: 0.145, c: 0, h: 0 },
    "text-muted": { l: 0.556, c: 0, h: 0 },
    // Borders
    highlight: { l: 0.617, c: 0.153, h: 166.108 },
    border: { l: 0.922, c: 0, h: 0 },
    "border-muted": { l: 0.97, c: 0, h: 0 },
    // Actions
    primary: { l: 0.205, c: 0.043, h: 264.052 },
    "primary-foreground": { l: 0.985, c: 0, h: 0 },
    secondary: { l: 0.617, c: 0.153, h: 166.108 },
    "secondary-foreground": { l: 1, c: 0, h: 0 },
    // Alerts
    danger: { l: 0.577, c: 0.245, h: 27.325 },
    "danger-foreground": { l: 1, c: 0, h: 0 },
    warning: { l: 0.78, c: 0.155, h: 85 },
    "warning-foreground": { l: 0.205, c: 0, h: 0 },
    success: { l: 0.617, c: 0.153, h: 166.108 },
    "success-foreground": { l: 1, c: 0, h: 0 },
    info: { l: 0.699, c: 0.126, h: 232.661 },
    "info-foreground": { l: 1, c: 0, h: 0 },
  },
  radius: 10,
  spacing: 8,
};

// ============================================================================
// Preset Brand Themes
// ============================================================================

const PRESET_THEMES: BrandTheme[] = [
  {
    id: "google-material",
    name: "Google Material",
    description: "Clean, modern, corporate",
    preview: {
      primary: "#4285F4",
      secondary: "#EA4335",
      accent: "#34A853",
    },
    fonts: {
      family: "Roboto",
      weights: [400, 500, 700],
      url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
    },
    lightColors: {
      // Brand foundation - Google colors
      "navy-900": { l: 0.53, c: 0.17, h: 264 },
      "emerald-600": { l: 0.62, c: 0.16, h: 145 },
      "sky-blue": { l: 0.53, c: 0.17, h: 264 },
      // Background (light mode) - Clean whites
      "bg-dark": { l: 0.98, c: 0, h: 0 },
      bg: { l: 1, c: 0, h: 0 },
      "bg-light": { l: 0.99, c: 0, h: 0 },
      // Text
      text: { l: 0.2, c: 0, h: 0 },
      "text-muted": { l: 0.5, c: 0, h: 0 },
      // Borders
      highlight: { l: 0.53, c: 0.17, h: 264 },
      border: { l: 0.9, c: 0, h: 0 },
      "border-muted": { l: 0.95, c: 0, h: 0 },
      // Actions - Google Blue primary
      primary: { l: 0.53, c: 0.17, h: 264 },
      "primary-foreground": { l: 1, c: 0, h: 0 },
      secondary: { l: 0.62, c: 0.16, h: 145 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.54, c: 0.22, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.8, c: 0.14, h: 85 },
      "warning-foreground": { l: 0.2, c: 0, h: 0 },
      success: { l: 0.62, c: 0.16, h: 145 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.53, c: 0.17, h: 264 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    darkColors: {
      // Brand foundation - Same brand colors
      "navy-900": { l: 0.53, c: 0.17, h: 264 },
      "emerald-600": { l: 0.62, c: 0.16, h: 145 },
      "sky-blue": { l: 0.63, c: 0.17, h: 264 },
      // Background - Dark surfaces
      "bg-dark": { l: 0.15, c: 0, h: 0 },
      bg: { l: 0.20, c: 0, h: 0 },
      "bg-light": { l: 0.25, c: 0, h: 0 },
      // Text - Light on dark
      text: { l: 0.97, c: 0, h: 0 },
      "text-muted": { l: 0.70, c: 0, h: 0 },
      // Borders
      highlight: { l: 0.63, c: 0.17, h: 264 },
      border: { l: 0.35, c: 0, h: 0 },
      "border-muted": { l: 0.25, c: 0, h: 0 },
      // Actions - Lighter blue for visibility
      primary: { l: 0.63, c: 0.17, h: 264 },
      "primary-foreground": { l: 1, c: 0, h: 0 },
      secondary: { l: 0.72, c: 0.16, h: 145 },
      "secondary-foreground": { l: 0.15, c: 0, h: 0 },
      // Alerts - Lighter for contrast
      danger: { l: 0.64, c: 0.22, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.85, c: 0.14, h: 85 },
      "warning-foreground": { l: 0.15, c: 0, h: 0 },
      success: { l: 0.72, c: 0.16, h: 145 },
      "success-foreground": { l: 0.15, c: 0, h: 0 },
      info: { l: 0.63, c: 0.17, h: 264 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    radius: 8,
    spacing: 8,
  },
  {
    id: "indie-maker",
    name: "Indie Maker",
    description: "Approachable, warm, personal",
    preview: {
      primary: "#FF6B35",
      secondary: "#2C3E50",
      accent: "#FFA07A",
    },
    fonts: {
      family: "Inter",
      weights: [400, 500, 700],
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap",
    },
    lightColors: {
      // Brand foundation - Warm palette
      "navy-900": { l: 0.25, c: 0.05, h: 240 },
      "emerald-600": { l: 0.65, c: 0.18, h: 25 },
      "sky-blue": { l: 0.7, c: 0.15, h: 25 },
      // Background - Cream/warm tones
      "bg-dark": { l: 0.96, c: 0.01, h: 40 },
      bg: { l: 0.99, c: 0.01, h: 40 },
      "bg-light": { l: 0.97, c: 0.01, h: 40 },
      // Text
      text: { l: 0.2, c: 0.02, h: 240 },
      "text-muted": { l: 0.5, c: 0.02, h: 240 },
      // Borders
      highlight: { l: 0.65, c: 0.18, h: 25 },
      border: { l: 0.88, c: 0.01, h: 40 },
      "border-muted": { l: 0.94, c: 0.01, h: 40 },
      // Actions - Warm orange
      primary: { l: 0.65, c: 0.18, h: 25 },
      "primary-foreground": { l: 1, c: 0, h: 0 },
      secondary: { l: 0.25, c: 0.05, h: 240 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.55, c: 0.22, h: 25 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.75, c: 0.15, h: 70 },
      "warning-foreground": { l: 0.2, c: 0, h: 0 },
      success: { l: 0.6, c: 0.15, h: 145 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.6, c: 0.14, h: 220 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    darkColors: {
      // Brand foundation - Warm palette
      "navy-900": { l: 0.35, c: 0.05, h: 240 },
      "emerald-600": { l: 0.75, c: 0.18, h: 25 },
      "sky-blue": { l: 0.80, c: 0.15, h: 25 },
      // Background - Dark warm tones
      "bg-dark": { l: 0.16, c: 0.01, h: 40 },
      bg: { l: 0.21, c: 0.01, h: 40 },
      "bg-light": { l: 0.26, c: 0.01, h: 40 },
      // Text - Light on dark
      text: { l: 0.98, c: 0.01, h: 40 },
      "text-muted": { l: 0.68, c: 0.02, h: 40 },
      // Borders
      highlight: { l: 0.75, c: 0.18, h: 25 },
      border: { l: 0.36, c: 0.01, h: 40 },
      "border-muted": { l: 0.26, c: 0.01, h: 40 },
      // Actions - Brighter orange for dark mode
      primary: { l: 0.75, c: 0.18, h: 25 },
      "primary-foreground": { l: 0.16, c: 0, h: 0 },
      secondary: { l: 0.45, c: 0.05, h: 240 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts - Lighter for visibility
      danger: { l: 0.65, c: 0.22, h: 25 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.82, c: 0.15, h: 70 },
      "warning-foreground": { l: 0.16, c: 0, h: 0 },
      success: { l: 0.70, c: 0.15, h: 145 },
      "success-foreground": { l: 0.16, c: 0, h: 0 },
      info: { l: 0.70, c: 0.14, h: 220 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    radius: 12,
    spacing: 8,
  },
  {
    id: "fintech",
    name: "Fintech Bold",
    description: "Sharp, precise, high-contrast",
    preview: {
      primary: "#00C805",
      secondary: "#1A1A1A",
      accent: "#FF3B30",
    },
    fonts: {
      family: "DM Sans",
      weights: [400, 500, 700],
      url: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap",
    },
    lightColors: {
      // Brand foundation - Bold fintech
      "navy-900": { l: 0.15, c: 0, h: 0 },
      "emerald-600": { l: 0.65, c: 0.2, h: 145 },
      "sky-blue": { l: 0.65, c: 0.2, h: 145 },
      // Background - High contrast
      "bg-dark": { l: 0.95, c: 0, h: 0 },
      bg: { l: 1, c: 0, h: 0 },
      "bg-light": { l: 0.98, c: 0, h: 0 },
      // Text - Strong contrast
      text: { l: 0.1, c: 0, h: 0 },
      "text-muted": { l: 0.45, c: 0, h: 0 },
      // Borders - Sharp
      highlight: { l: 0.65, c: 0.2, h: 145 },
      border: { l: 0.88, c: 0, h: 0 },
      "border-muted": { l: 0.93, c: 0, h: 0 },
      // Actions - Bold green
      primary: { l: 0.65, c: 0.2, h: 145 },
      "primary-foreground": { l: 0.1, c: 0, h: 0 },
      secondary: { l: 0.15, c: 0, h: 0 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts - Bold red/green
      danger: { l: 0.55, c: 0.26, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.78, c: 0.16, h: 80 },
      "warning-foreground": { l: 0.1, c: 0, h: 0 },
      success: { l: 0.65, c: 0.2, h: 145 },
      "success-foreground": { l: 0.1, c: 0, h: 0 },
      info: { l: 0.6, c: 0.15, h: 240 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    darkColors: {
      // Brand foundation - Bold fintech
      "navy-900": { l: 0.25, c: 0, h: 0 },
      "emerald-600": { l: 0.75, c: 0.2, h: 145 },
      "sky-blue": { l: 0.75, c: 0.2, h: 145 },
      // Background - Dark high contrast
      "bg-dark": { l: 0.12, c: 0, h: 0 },
      bg: { l: 0.17, c: 0, h: 0 },
      "bg-light": { l: 0.22, c: 0, h: 0 },
      // Text - High contrast white
      text: { l: 1, c: 0, h: 0 },
      "text-muted": { l: 0.65, c: 0, h: 0 },
      // Borders - Sharp visible
      highlight: { l: 0.75, c: 0.2, h: 145 },
      border: { l: 0.32, c: 0, h: 0 },
      "border-muted": { l: 0.22, c: 0, h: 0 },
      // Actions - Bright green
      primary: { l: 0.75, c: 0.2, h: 145 },
      "primary-foreground": { l: 0.12, c: 0, h: 0 },
      secondary: { l: 0.85, c: 0, h: 0 },
      "secondary-foreground": { l: 0.12, c: 0, h: 0 },
      // Alerts - High visibility
      danger: { l: 0.68, c: 0.26, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.85, c: 0.16, h: 80 },
      "warning-foreground": { l: 0.12, c: 0, h: 0 },
      success: { l: 0.75, c: 0.2, h: 145 },
      "success-foreground": { l: 0.12, c: 0, h: 0 },
      info: { l: 0.70, c: 0.15, h: 240 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    radius: 4,
    spacing: 6,
  },
  {
    id: "hospitality",
    name: "Hospitality",
    description: "Warm, inviting, welcoming",
    preview: {
      primary: "#FF5A5F",
      secondary: "#767676",
      accent: "#FFB400",
    },
    fonts: {
      family: "Poppins",
      weights: [400, 500, 700],
      url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap",
    },
    lightColors: {
      // Brand foundation - Warm coral
      "navy-900": { l: 0.45, c: 0.02, h: 0 },
      "emerald-600": { l: 0.62, c: 0.2, h: 12 },
      "sky-blue": { l: 0.62, c: 0.2, h: 12 },
      // Background - Soft warm
      "bg-dark": { l: 0.97, c: 0.005, h: 20 },
      bg: { l: 1, c: 0, h: 0 },
      "bg-light": { l: 0.98, c: 0.005, h: 20 },
      // Text
      text: { l: 0.22, c: 0.01, h: 0 },
      "text-muted": { l: 0.52, c: 0.01, h: 0 },
      // Borders
      highlight: { l: 0.62, c: 0.2, h: 12 },
      border: { l: 0.9, c: 0.005, h: 20 },
      "border-muted": { l: 0.95, c: 0.005, h: 20 },
      // Actions - Coral primary
      primary: { l: 0.62, c: 0.2, h: 12 },
      "primary-foreground": { l: 1, c: 0, h: 0 },
      secondary: { l: 0.45, c: 0.02, h: 0 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.55, c: 0.24, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.78, c: 0.15, h: 75 },
      "warning-foreground": { l: 0.2, c: 0, h: 0 },
      success: { l: 0.6, c: 0.15, h: 150 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.65, c: 0.12, h: 220 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    darkColors: {
      // Brand foundation - Warm coral
      "navy-900": { l: 0.55, c: 0.02, h: 0 },
      "emerald-600": { l: 0.72, c: 0.2, h: 12 },
      "sky-blue": { l: 0.72, c: 0.2, h: 12 },
      // Background - Dark warm
      "bg-dark": { l: 0.17, c: 0.005, h: 20 },
      bg: { l: 0.22, c: 0.005, h: 20 },
      "bg-light": { l: 0.27, c: 0.005, h: 20 },
      // Text - Warm white
      text: { l: 0.98, c: 0.01, h: 20 },
      "text-muted": { l: 0.68, c: 0.01, h: 20 },
      // Borders
      highlight: { l: 0.72, c: 0.2, h: 12 },
      border: { l: 0.37, c: 0.005, h: 20 },
      "border-muted": { l: 0.27, c: 0.005, h: 20 },
      // Actions - Brighter coral
      primary: { l: 0.72, c: 0.2, h: 12 },
      "primary-foreground": { l: 0.17, c: 0, h: 0 },
      secondary: { l: 0.65, c: 0.02, h: 0 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.67, c: 0.24, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.83, c: 0.15, h: 75 },
      "warning-foreground": { l: 0.17, c: 0, h: 0 },
      success: { l: 0.70, c: 0.15, h: 150 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.73, c: 0.12, h: 220 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    radius: 10,
    spacing: 8,
  },
  {
    id: "marcus-default",
    name: "Marcus Default",
    description: "Professional aviation + tech",
    preview: {
      primary: "#0A1E3D",
      secondary: "#10B981",
      accent: "#60A5FA",
    },
    fonts: {
      family: "system-ui",
      weights: [400, 500, 700],
      url: "",
    },
    lightColors: DEFAULT_TOKENS.colors,
    darkColors: {
      // Brand foundation
      "navy-900": { l: 0.205, c: 0.043, h: 264.052 },
      "emerald-600": { l: 0.617, c: 0.153, h: 166.108 },
      "sky-blue": { l: 0.699, c: 0.126, h: 232.661 },
      // Background - Dark mode (from globals.css)
      "bg-dark": { l: 0.145, c: 0, h: 0 },
      bg: { l: 0.205, c: 0, h: 0 },
      "bg-light": { l: 0.269, c: 0, h: 0 },
      // Text - Dark mode
      text: { l: 0.985, c: 0, h: 0 },
      "text-muted": { l: 0.708, c: 0, h: 0 },
      // Borders - Dark mode
      highlight: { l: 0.617, c: 0.153, h: 166.108 },
      border: { l: 1, c: 0, h: 0 }, // Will use opacity in CSS
      "border-muted": { l: 1, c: 0, h: 0 }, // Will use opacity in CSS
      // Actions - Dark mode
      primary: { l: 0.699, c: 0.126, h: 232.661 },
      "primary-foreground": { l: 0.985, c: 0, h: 0 },
      secondary: { l: 0.617, c: 0.153, h: 166.108 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts - Dark mode
      danger: { l: 0.704, c: 0.191, h: 22.216 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.82, c: 0.155, h: 85 },
      "warning-foreground": { l: 0.145, c: 0, h: 0 },
      success: { l: 0.67, c: 0.153, h: 166.108 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.75, c: 0.126, h: 232.661 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    radius: DEFAULT_TOKENS.radius,
    spacing: DEFAULT_TOKENS.spacing,
  },
  {
    id: "stripe-payment",
    name: "Stripe Payment",
    description: "Professional, trustworthy fintech",
    preview: {
      primary: "#635BFF",
      secondary: "#0A2540",
      accent: "#00D4FF",
    },
    fonts: {
      family: "Inter",
      weights: [400, 500, 600, 700],
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    },
    lightColors: {
      // Brand foundation - Stripe colors
      "navy-900": { l: 0.15, c: 0.05, h: 240 },
      "emerald-600": { l: 0.45, c: 0.18, h: 270 },
      "sky-blue": { l: 0.65, c: 0.15, h: 200 },
      // Background - Clean professional
      "bg-dark": { l: 0.98, c: 0, h: 0 },
      bg: { l: 1, c: 0, h: 0 },
      "bg-light": { l: 0.99, c: 0, h: 0 },
      // Text
      text: { l: 0.15, c: 0, h: 0 },
      "text-muted": { l: 0.48, c: 0, h: 0 },
      // Borders
      highlight: { l: 0.45, c: 0.18, h: 270 },
      border: { l: 0.92, c: 0, h: 0 },
      "border-muted": { l: 0.96, c: 0, h: 0 },
      // Actions - Stripe purple
      primary: { l: 0.45, c: 0.18, h: 270 },
      "primary-foreground": { l: 1, c: 0, h: 0 },
      secondary: { l: 0.15, c: 0.05, h: 240 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.55, c: 0.24, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.78, c: 0.15, h: 80 },
      "warning-foreground": { l: 0.15, c: 0, h: 0 },
      success: { l: 0.62, c: 0.16, h: 145 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.65, c: 0.15, h: 200 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    darkColors: {
      // Brand foundation - Stripe colors
      "navy-900": { l: 0.25, c: 0.05, h: 240 },
      "emerald-600": { l: 0.58, c: 0.18, h: 270 },
      "sky-blue": { l: 0.75, c: 0.15, h: 200 },
      // Background - Dark professional
      "bg-dark": { l: 0.14, c: 0, h: 0 },
      bg: { l: 0.19, c: 0, h: 0 },
      "bg-light": { l: 0.24, c: 0, h: 0 },
      // Text - Clean white
      text: { l: 0.98, c: 0, h: 0 },
      "text-muted": { l: 0.68, c: 0, h: 0 },
      // Borders
      highlight: { l: 0.58, c: 0.18, h: 270 },
      border: { l: 0.34, c: 0, h: 0 },
      "border-muted": { l: 0.24, c: 0, h: 0 },
      // Actions - Brighter Stripe purple
      primary: { l: 0.58, c: 0.18, h: 270 },
      "primary-foreground": { l: 1, c: 0, h: 0 },
      secondary: { l: 0.45, c: 0.05, h: 240 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.66, c: 0.24, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.84, c: 0.15, h: 80 },
      "warning-foreground": { l: 0.14, c: 0, h: 0 },
      success: { l: 0.72, c: 0.16, h: 145 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.75, c: 0.15, h: 200 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    radius: 8,
    spacing: 8,
  },
  {
    id: "notion-productivity",
    name: "Notion Productivity",
    description: "Calm, focused, productive",
    preview: {
      primary: "#37352F",
      secondary: "#E9E5DD",
      accent: "#D4D2C8",
    },
    fonts: {
      family: "Inter",
      weights: [400, 500, 600, 700],
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    },
    lightColors: {
      // Brand foundation - Notion neutrals
      "navy-900": { l: 0.22, c: 0.01, h: 30 },
      "emerald-600": { l: 0.6, c: 0.14, h: 150 },
      "sky-blue": { l: 0.68, c: 0.12, h: 230 },
      // Background - Warm beige
      "bg-dark": { l: 0.94, c: 0.01, h: 40 },
      bg: { l: 1, c: 0, h: 0 },
      "bg-light": { l: 0.96, c: 0.01, h: 40 },
      // Text - Soft black
      text: { l: 0.22, c: 0.01, h: 30 },
      "text-muted": { l: 0.5, c: 0.01, h: 30 },
      // Borders - Subtle
      highlight: { l: 0.22, c: 0.01, h: 30 },
      border: { l: 0.88, c: 0.01, h: 40 },
      "border-muted": { l: 0.92, c: 0.01, h: 40 },
      // Actions - Soft black primary
      primary: { l: 0.22, c: 0.01, h: 30 },
      "primary-foreground": { l: 0.96, c: 0.01, h: 40 },
      secondary: { l: 0.6, c: 0.14, h: 150 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.54, c: 0.22, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.76, c: 0.14, h: 75 },
      "warning-foreground": { l: 0.22, c: 0, h: 0 },
      success: { l: 0.6, c: 0.14, h: 150 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.68, c: 0.12, h: 230 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    darkColors: {
      // Brand foundation - Notion neutrals
      "navy-900": { l: 0.85, c: 0.01, h: 30 },
      "emerald-600": { l: 0.70, c: 0.14, h: 150 },
      "sky-blue": { l: 0.78, c: 0.12, h: 230 },
      // Background - Dark warm
      "bg-dark": { l: 0.16, c: 0.01, h: 30 },
      bg: { l: 0.21, c: 0.01, h: 30 },
      "bg-light": { l: 0.26, c: 0.01, h: 30 },
      // Text - Warm light
      text: { l: 0.96, c: 0.01, h: 40 },
      "text-muted": { l: 0.68, c: 0.01, h: 40 },
      // Borders - Subtle dark
      highlight: { l: 0.85, c: 0.01, h: 30 },
      border: { l: 0.36, c: 0.01, h: 30 },
      "border-muted": { l: 0.26, c: 0.01, h: 30 },
      // Actions - Light primary
      primary: { l: 0.85, c: 0.01, h: 30 },
      "primary-foreground": { l: 0.16, c: 0.01, h: 30 },
      secondary: { l: 0.70, c: 0.14, h: 150 },
      "secondary-foreground": { l: 0.16, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.66, c: 0.22, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.83, c: 0.14, h: 75 },
      "warning-foreground": { l: 0.16, c: 0, h: 0 },
      success: { l: 0.70, c: 0.14, h: 150 },
      "success-foreground": { l: 0.16, c: 0, h: 0 },
      info: { l: 0.78, c: 0.12, h: 230 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    radius: 6,
    spacing: 8,
  },
  {
    id: "linear-saas",
    name: "Linear SaaS",
    description: "Modern, sleek, developer-focused",
    preview: {
      primary: "#5E6AD2",
      secondary: "#8A8F98",
      accent: "#B4B4B8",
    },
    fonts: {
      family: "Inter",
      weights: [400, 500, 600, 700],
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    },
    lightColors: {
      // Brand foundation - Linear purple/gray
      "navy-900": { l: 0.18, c: 0.02, h: 240 },
      "emerald-600": { l: 0.48, c: 0.15, h: 270 },
      "sky-blue": { l: 0.48, c: 0.15, h: 270 },
      // Background - Dark mode optimized
      "bg-dark": { l: 0.96, c: 0, h: 0 },
      bg: { l: 1, c: 0, h: 0 },
      "bg-light": { l: 0.98, c: 0, h: 0 },
      // Text - High tech
      text: { l: 0.12, c: 0, h: 0 },
      "text-muted": { l: 0.48, c: 0.01, h: 240 },
      // Borders - Minimal
      highlight: { l: 0.48, c: 0.15, h: 270 },
      border: { l: 0.9, c: 0, h: 0 },
      "border-muted": { l: 0.94, c: 0, h: 0 },
      // Actions - Linear purple
      primary: { l: 0.48, c: 0.15, h: 270 },
      "primary-foreground": { l: 1, c: 0, h: 0 },
      secondary: { l: 0.52, c: 0.01, h: 240 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.54, c: 0.24, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.78, c: 0.14, h: 80 },
      "warning-foreground": { l: 0.12, c: 0, h: 0 },
      success: { l: 0.6, c: 0.15, h: 145 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.48, c: 0.15, h: 270 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    darkColors: {
      // Brand foundation - Linear purple/gray
      "navy-900": { l: 0.88, c: 0.02, h: 240 },
      "emerald-600": { l: 0.60, c: 0.15, h: 270 },
      "sky-blue": { l: 0.60, c: 0.15, h: 270 },
      // Background - Dark sleek
      "bg-dark": { l: 0.14, c: 0, h: 0 },
      bg: { l: 0.18, c: 0, h: 0 },
      "bg-light": { l: 0.23, c: 0, h: 0 },
      // Text - Clean white
      text: { l: 0.98, c: 0, h: 0 },
      "text-muted": { l: 0.68, c: 0.01, h: 240 },
      // Borders - Minimal visible
      highlight: { l: 0.60, c: 0.15, h: 270 },
      border: { l: 0.33, c: 0, h: 0 },
      "border-muted": { l: 0.23, c: 0, h: 0 },
      // Actions - Bright Linear purple
      primary: { l: 0.60, c: 0.15, h: 270 },
      "primary-foreground": { l: 1, c: 0, h: 0 },
      secondary: { l: 0.72, c: 0.01, h: 240 },
      "secondary-foreground": { l: 0.14, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.66, c: 0.24, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.84, c: 0.14, h: 80 },
      "warning-foreground": { l: 0.14, c: 0, h: 0 },
      success: { l: 0.70, c: 0.15, h: 145 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.60, c: 0.15, h: 270 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    radius: 4,
    spacing: 6,
  },
  {
    id: "figma-creative",
    name: "Figma Creative",
    description: "Creative, vibrant, design-focused",
    preview: {
      primary: "#0C8CE9",
      secondary: "#F24E1E",
      accent: "#A259FF",
    },
    fonts: {
      family: "Inter",
      weights: [400, 500, 600, 700],
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    },
    lightColors: {
      // Brand foundation - Figma multicolor
      "navy-900": { l: 0.2, c: 0.04, h: 240 },
      "emerald-600": { l: 0.52, c: 0.18, h: 210 },
      "sky-blue": { l: 0.52, c: 0.18, h: 210 },
      // Background - Clean canvas
      "bg-dark": { l: 0.97, c: 0, h: 0 },
      bg: { l: 1, c: 0, h: 0 },
      "bg-light": { l: 0.98, c: 0, h: 0 },
      // Text
      text: { l: 0.15, c: 0, h: 0 },
      "text-muted": { l: 0.5, c: 0, h: 0 },
      // Borders
      highlight: { l: 0.52, c: 0.18, h: 210 },
      border: { l: 0.9, c: 0, h: 0 },
      "border-muted": { l: 0.95, c: 0, h: 0 },
      // Actions - Figma blue
      primary: { l: 0.52, c: 0.18, h: 210 },
      "primary-foreground": { l: 1, c: 0, h: 0 },
      secondary: { l: 0.58, c: 0.22, h: 15 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.58, c: 0.22, h: 15 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.78, c: 0.15, h: 75 },
      "warning-foreground": { l: 0.15, c: 0, h: 0 },
      success: { l: 0.6, c: 0.15, h: 145 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.52, c: 0.18, h: 210 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    darkColors: {
      // Brand foundation - Figma multicolor
      "navy-900": { l: 0.88, c: 0.04, h: 240 },
      "emerald-600": { l: 0.64, c: 0.18, h: 210 },
      "sky-blue": { l: 0.64, c: 0.18, h: 210 },
      // Background - Dark canvas
      "bg-dark": { l: 0.15, c: 0, h: 0 },
      bg: { l: 0.20, c: 0, h: 0 },
      "bg-light": { l: 0.25, c: 0, h: 0 },
      // Text - Clean white
      text: { l: 0.98, c: 0, h: 0 },
      "text-muted": { l: 0.70, c: 0, h: 0 },
      // Borders
      highlight: { l: 0.64, c: 0.18, h: 210 },
      border: { l: 0.35, c: 0, h: 0 },
      "border-muted": { l: 0.25, c: 0, h: 0 },
      // Actions - Bright Figma blue
      primary: { l: 0.64, c: 0.18, h: 210 },
      "primary-foreground": { l: 1, c: 0, h: 0 },
      secondary: { l: 0.68, c: 0.22, h: 15 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.68, c: 0.22, h: 15 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.84, c: 0.15, h: 75 },
      "warning-foreground": { l: 0.15, c: 0, h: 0 },
      success: { l: 0.70, c: 0.15, h: 145 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.64, c: 0.18, h: 210 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    radius: 10,
    spacing: 8,
  },
  {
    id: "github-developer",
    name: "GitHub Developer",
    description: "Technical, precise, code-focused",
    preview: {
      primary: "#24292F",
      secondary: "#238636",
      accent: "#58A6FF",
    },
    fonts: {
      family: "system-ui",
      weights: [400, 500, 600, 700],
      url: "",
    },
    lightColors: {
      // Brand foundation - GitHub palette
      "navy-900": { l: 0.16, c: 0.01, h: 240 },
      "emerald-600": { l: 0.52, c: 0.18, h: 145 },
      "sky-blue": { l: 0.62, c: 0.16, h: 230 },
      // Background - Clean white
      "bg-dark": { l: 0.97, c: 0, h: 0 },
      bg: { l: 1, c: 0, h: 0 },
      "bg-light": { l: 0.98, c: 0, h: 0 },
      // Text - Developer-friendly
      text: { l: 0.16, c: 0.01, h: 240 },
      "text-muted": { l: 0.46, c: 0.01, h: 240 },
      // Borders - Sharp
      highlight: { l: 0.52, c: 0.18, h: 145 },
      border: { l: 0.88, c: 0, h: 0 },
      "border-muted": { l: 0.94, c: 0, h: 0 },
      // Actions - GitHub dark
      primary: { l: 0.16, c: 0.01, h: 240 },
      "primary-foreground": { l: 1, c: 0, h: 0 },
      secondary: { l: 0.52, c: 0.18, h: 145 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.55, c: 0.24, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.76, c: 0.15, h: 75 },
      "warning-foreground": { l: 0.16, c: 0, h: 0 },
      success: { l: 0.52, c: 0.18, h: 145 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.62, c: 0.16, h: 230 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    darkColors: {
      // Brand foundation - GitHub dark palette
      "navy-900": { l: 0.86, c: 0.01, h: 240 },
      "emerald-600": { l: 0.62, c: 0.18, h: 145 },
      "sky-blue": { l: 0.72, c: 0.16, h: 230 },
      // Background - GitHub dark
      "bg-dark": { l: 0.13, c: 0, h: 0 },
      bg: { l: 0.16, c: 0, h: 0 },
      "bg-light": { l: 0.19, c: 0, h: 0 },
      // Text - Clean white
      text: { l: 0.98, c: 0, h: 0 },
      "text-muted": { l: 0.66, c: 0.01, h: 240 },
      // Borders - Subtle
      highlight: { l: 0.62, c: 0.18, h: 145 },
      border: { l: 0.29, c: 0, h: 0 },
      "border-muted": { l: 0.19, c: 0, h: 0 },
      // Actions - GitHub green
      primary: { l: 0.86, c: 0.01, h: 240 },
      "primary-foreground": { l: 0.13, c: 0, h: 0 },
      secondary: { l: 0.62, c: 0.18, h: 145 },
      "secondary-foreground": { l: 0.13, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.67, c: 0.24, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.83, c: 0.15, h: 75 },
      "warning-foreground": { l: 0.13, c: 0, h: 0 },
      success: { l: 0.62, c: 0.18, h: 145 },
      "success-foreground": { l: 0.13, c: 0, h: 0 },
      info: { l: 0.72, c: 0.16, h: 230 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    radius: 6,
    spacing: 6,
  },
  {
    id: "vercel-modern",
    name: "Vercel Modern",
    description: "Ultra-modern, minimal, bold",
    preview: {
      primary: "#000000",
      secondary: "#666666",
      accent: "#0070F3",
    },
    fonts: {
      family: "Inter",
      weights: [400, 500, 600, 700],
      url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    },
    lightColors: {
      // Brand foundation - Vercel black/white
      "navy-900": { l: 0, c: 0, h: 0 },
      "emerald-600": { l: 0.5, c: 0.18, h: 220 },
      "sky-blue": { l: 0.5, c: 0.18, h: 220 },
      // Background - Pure white
      "bg-dark": { l: 0.98, c: 0, h: 0 },
      bg: { l: 1, c: 0, h: 0 },
      "bg-light": { l: 0.99, c: 0, h: 0 },
      // Text - Pure black
      text: { l: 0, c: 0, h: 0 },
      "text-muted": { l: 0.4, c: 0, h: 0 },
      // Borders - Minimal
      highlight: { l: 0, c: 0, h: 0 },
      border: { l: 0.9, c: 0, h: 0 },
      "border-muted": { l: 0.95, c: 0, h: 0 },
      // Actions - Pure black
      primary: { l: 0, c: 0, h: 0 },
      "primary-foreground": { l: 1, c: 0, h: 0 },
      secondary: { l: 0.4, c: 0, h: 0 },
      "secondary-foreground": { l: 1, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.55, c: 0.26, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.78, c: 0.16, h: 80 },
      "warning-foreground": { l: 0, c: 0, h: 0 },
      success: { l: 0.6, c: 0.16, h: 145 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.5, c: 0.18, h: 220 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    darkColors: {
      // Brand foundation - Vercel dark
      "navy-900": { l: 1, c: 0, h: 0 },
      "emerald-600": { l: 0.62, c: 0.18, h: 220 },
      "sky-blue": { l: 0.62, c: 0.18, h: 220 },
      // Background - Pure black
      "bg-dark": { l: 0.10, c: 0, h: 0 },
      bg: { l: 0, c: 0, h: 0 },
      "bg-light": { l: 0.15, c: 0, h: 0 },
      // Text - Pure white
      text: { l: 1, c: 0, h: 0 },
      "text-muted": { l: 0.60, c: 0, h: 0 },
      // Borders - Minimal visible
      highlight: { l: 1, c: 0, h: 0 },
      border: { l: 0.25, c: 0, h: 0 },
      "border-muted": { l: 0.15, c: 0, h: 0 },
      // Actions - Pure white
      primary: { l: 1, c: 0, h: 0 },
      "primary-foreground": { l: 0, c: 0, h: 0 },
      secondary: { l: 0.60, c: 0, h: 0 },
      "secondary-foreground": { l: 0, c: 0, h: 0 },
      // Alerts
      danger: { l: 0.68, c: 0.26, h: 27 },
      "danger-foreground": { l: 1, c: 0, h: 0 },
      warning: { l: 0.85, c: 0.16, h: 80 },
      "warning-foreground": { l: 0, c: 0, h: 0 },
      success: { l: 0.72, c: 0.16, h: 145 },
      "success-foreground": { l: 1, c: 0, h: 0 },
      info: { l: 0.62, c: 0.18, h: 220 },
      "info-foreground": { l: 1, c: 0, h: 0 },
    },
    radius: 4,
    spacing: 6,
  },
];

const COLOR_CATEGORIES: ColorCategory[] = [
  {
    name: "Brand Foundation",
    description: "Core brand colors",
    colors: [
      {
        name: "Navy 900",
        variable: "--navy-900",
        usage: "Professional, trustworthy, aviation-inspired",
      },
      {
        name: "Emerald 600",
        variable: "--emerald-600",
        usage: "Growth, momentum, positive outcomes",
      },
      {
        name: "Sky Blue",
        variable: "--sky-blue",
        usage: "Clarity, open communication",
      },
    ],
  },
  {
    name: "Background",
    description: "Background colors for surfaces and layouts",
    colors: [
      {
        name: "Dark Background",
        variable: "--bg-dark",
        usage: "Darkest background for headers, footers, elevated surfaces",
        contrast: "1.0:1",
      },
      {
        name: "Default Background",
        variable: "--bg",
        usage: "Default page background",
        contrast: "21:1",
      },
      {
        name: "Light Background",
        variable: "--bg-light",
        usage: "Cards, panels, elevated surfaces",
        contrast: "1.5:1",
      },
    ],
  },
  {
    name: "Text",
    description: "Text colors for content and labels",
    colors: [
      {
        name: "Primary Text",
        variable: "--text",
        usage: "High contrast text for primary content",
        contrast: "21:1",
      },
      {
        name: "Muted Text",
        variable: "--text-muted",
        usage: "Secondary text, captions, labels",
        contrast: "4.6:1",
      },
    ],
  },
  {
    name: "Border",
    description: "Border colors for separators and outlines",
    colors: [
      {
        name: "Highlight Border",
        variable: "--highlight",
        usage: "Accent borders, focus rings, selected states",
        contrast: "3.5:1",
      },
      {
        name: "Default Border",
        variable: "--border",
        usage: "Default borders, dividers",
        contrast: "1.2:1",
      },
      {
        name: "Muted Border",
        variable: "--border-muted",
        usage: "Subtle separators, light dividers",
        contrast: "1.0:1",
      },
    ],
  },
  {
    name: "Action",
    description: "Interactive element colors",
    colors: [
      {
        name: "Primary Action",
        variable: "--primary",
        usage: "Primary buttons, CTA, main links",
        contrast: "13:1",
      },
      {
        name: "Primary Foreground",
        variable: "--primary-foreground",
        usage: "Text on primary action",
        contrast: "13:1",
      },
      {
        name: "Secondary Action",
        variable: "--secondary",
        usage: "Secondary buttons, alternate actions",
        contrast: "3.5:1",
      },
      {
        name: "Secondary Foreground",
        variable: "--secondary-foreground",
        usage: "Text on secondary action",
        contrast: "8:1",
      },
    ],
  },
  {
    name: "Alert",
    description: "Feedback and notification colors",
    colors: [
      {
        name: "Danger",
        variable: "--danger",
        usage: "Error states, destructive actions",
        contrast: "4.5:1",
      },
      {
        name: "Danger Foreground",
        variable: "--danger-foreground",
        usage: "Text on danger background",
        contrast: "7:1",
      },
      {
        name: "Warning",
        variable: "--warning",
        usage: "Warning states, caution alerts",
        contrast: "5.5:1",
      },
      {
        name: "Warning Foreground",
        variable: "--warning-foreground",
        usage: "Text on warning background",
        contrast: "13:1",
      },
      {
        name: "Success",
        variable: "--success",
        usage: "Success states, confirmations",
        contrast: "3.5:1",
      },
      {
        name: "Success Foreground",
        variable: "--success-foreground",
        usage: "Text on success background",
        contrast: "8:1",
      },
      {
        name: "Info",
        variable: "--info",
        usage: "Info states, tips, notifications",
        contrast: "4:1",
      },
      {
        name: "Info Foreground",
        variable: "--info-foreground",
        usage: "Text on info background",
        contrast: "9:1",
      },
    ],
  },
];

// ============================================================================
// Main Component
// ============================================================================

// ============================================================================
// Helper Functions
// ============================================================================

const loadGoogleFont = (fontFamily: string, weights: number[], url: string) => {
  if (!url) return; // Skip for system fonts

  // Remove existing font link if present
  const existingLink = document.querySelector(`link[href*="${fontFamily}"]`);
  if (existingLink) {
    existingLink.remove();
  }

  // Add new font link
  const link = document.createElement("link");
  link.href = url;
  link.rel = "stylesheet";
  document.head.appendChild(link);

  // Apply to body
  document.body.style.fontFamily =
    fontFamily === "system-ui"
      ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      : `'${fontFamily}', system-ui, -apple-system, sans-serif`;
};

const applyTheme = (theme: BrandTheme) => {
  // Remove existing theme style tag if present
  const existingStyle = document.getElementById("preset-theme-styles");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Build CSS for light mode (:root)
  let lightCss = ":root {\n";
  Object.entries(theme.lightColors).forEach(([key, value]) => {
    const oklchValue = `oklch(${value.l} ${value.c} ${value.h})`;
    lightCss += `  --${key}: ${oklchValue};\n`;
  });
  lightCss += `  --radius: ${theme.radius}px;\n`;
  lightCss += `  --spacing-base: ${theme.spacing}px;\n`;
  lightCss += "}\n\n";

  // Build CSS for dark mode (.dark)
  let darkCss = ".dark {\n";
  Object.entries(theme.darkColors).forEach(([key, value]) => {
    const oklchValue = `oklch(${value.l} ${value.c} ${value.h})`;
    darkCss += `  --${key}: ${oklchValue};\n`;
  });
  darkCss += "}\n";

  // Create and inject style tag
  const styleTag = document.createElement("style");
  styleTag.id = "preset-theme-styles";
  styleTag.textContent = lightCss + darkCss;
  document.head.appendChild(styleTag);

  // Load font
  loadGoogleFont(theme.fonts.family, theme.fonts.weights, theme.fonts.url);

  // Save to localStorage
  localStorage.setItem("selected-theme-id", theme.id);
};

// ============================================================================
// Theme Card Component
// ============================================================================

type ThemeCardProps = {
  theme: BrandTheme;
  isSelected: boolean;
  onSelect: () => void;
};

function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative w-full text-left p-6 rounded-lg border-2 transition-all
        hover:shadow-lg hover:scale-[1.02]
        ${
          isSelected
            ? "border-[var(--primary)] shadow-lg bg-[var(--bg-light)]"
            : "border-[var(--border)] bg-[var(--bg)]"
        }
      `}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3">
          <svg
            className="w-6 h-6 text-[var(--primary)]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Theme name and description */}
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-1">{theme.name}</h3>
        <p className="text-sm text-[var(--text-muted)]">{theme.description}</p>
      </div>

      {/* Color swatches */}
      <div className="flex gap-2 mb-3">
        <div
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: theme.preview.primary }}
          title="Primary color"
        />
        <div
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: theme.preview.secondary }}
          title="Secondary color"
        />
        <div
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: theme.preview.accent }}
          title="Accent color"
        />
      </div>

      {/* Font name */}
      <div className="text-xs text-[var(--text-muted)] font-mono">
        Font: {theme.fonts.family}
      </div>
    </button>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function StyleguidePage() {
  const [mounted, setMounted] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] =
    useState<string>("marcus-default");
  const [themeApplied, setThemeApplied] = useState(false);
  const { theme, setTheme } = useTheme();

  // Load saved theme on mount
  useEffect(() => {
    setMounted(true);
    const savedThemeId = localStorage.getItem("selected-theme-id");
    if (savedThemeId) {
      const savedTheme = PRESET_THEMES.find((t) => t.id === savedThemeId);
      if (savedTheme) {
        setSelectedThemeId(savedThemeId);
        applyTheme(savedTheme);
      }
    }
  }, []);

  // Handle theme selection
  const handleThemeSelect = useCallback((themeId: string) => {
    const selectedTheme = PRESET_THEMES.find((t) => t.id === themeId);
    if (selectedTheme) {
      setSelectedThemeId(themeId);
      applyTheme(selectedTheme);
      setThemeApplied(true);
      setTimeout(() => setThemeApplied(false), 2000);
    }
  }, []);

  const copyToClipboard = async (variable: string) => {
    try {
      await navigator.clipboard.writeText(`var(${variable})`);
      setCopiedColor(variable);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getComputedColor = (variable: string): string => {
    if (typeof window === "undefined") return "";
    const value = getComputedStyle(document.documentElement).getPropertyValue(
      variable,
    );
    return value.trim();
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <Container className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Brand Styleguide</h1>
              <p className="text-sm opacity-90">
                Preset brand themes with instant preview
              </p>
            </div>
            <div className="flex items-center gap-4">
              {themeApplied && (
                <span className="px-4 py-2 bg-[var(--success)] text-[var(--success-foreground)] rounded-md text-sm font-semibold animate-pulse">
                  Theme Applied!
                </span>
              )}
              {mounted && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle dark mode"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {theme === "dark" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    )}
                  </svg>
                </Button>
              )}
              <Link href="/">
                <Button variant="secondary">Back to Home</Button>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="overflow-auto">
        <Container className="py-12">
          {/* Theme Preset Selector */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3">Brand Style Presets</h2>
              <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
                Choose a preset theme to instantly apply complete design systems
                inspired by successful brands. Each theme includes custom
                colors, typography, spacing, and radius.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRESET_THEMES.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isSelected={selectedThemeId === theme.id}
                  onSelect={() => handleThemeSelect(theme.id)}
                />
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t-2 border-[var(--border)] my-16"></div>

          {/* Introduction */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4">Current Theme Preview</h2>
            <p className="text-text-muted mb-4">
              This styleguide documents the comprehensive OKLCH color system for
              the Marcus Gollahon brand. All colors are designed to meet WCAG
              2.1 AA accessibility standards with proper contrast ratios.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
              <div>
                <h3 className="font-semibold mb-2">Brand Foundation</h3>
                <ul className="text-sm text-[var(--text-muted)] space-y-1">
                  <li>Navy: Professional, trustworthy, aviation-inspired</li>
                  <li>Emerald: Growth, momentum, positive outcomes</li>
                  <li>Sky Blue: Clarity, open communication</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Light Mode</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Clean, bright interface with navy as primary action color and
                  white backgrounds.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Dark Mode</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  Sky blue as primary action color on dark backgrounds for
                  reduced eye strain.
                </p>
              </div>
            </div>
          </section>

          {/* Color Categories */}
          {COLOR_CATEGORIES.map((category) => (
            <section key={category.name} className="mb-12">
              <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
              <p className="text-[var(--text-muted)] mb-6">
                {category.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.colors.map((color) => {
                  const computedColor = getComputedColor(color.variable);
                  return (
                    <div
                      key={color.variable}
                      className="group cursor-pointer border border-[var(--border)] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      onClick={() => copyToClipboard(color.variable)}
                    >
                      <div
                        className="h-24 w-full"
                        style={{ backgroundColor: `var(${color.variable})` }}
                      />
                      <div className="p-4 bg-[var(--bg-light)]">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm">
                            {color.name}
                          </h3>
                          {copiedColor === color.variable && (
                            <span className="text-xs bg-[var(--success)] text-[var(--success-foreground)] px-2 py-1 rounded">
                              Copied!
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mb-3">
                          {color.usage}
                        </p>
                        <div className="space-y-1">
                          <code className="block text-xs bg-[var(--bg)] px-2 py-1 rounded font-mono">
                            var({color.variable})
                          </code>
                          <code className="block text-xs bg-[var(--bg)] px-2 py-1 rounded font-mono truncate">
                            {computedColor}
                          </code>
                          {color.contrast && (
                            <p className="text-xs text-[var(--text-muted)] mt-2">
                              Contrast: {color.contrast}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Typography Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Typography</h2>
            <div className="space-y-6">
              <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                <h1 className="text-5xl font-bold mb-2">Heading 1</h1>
                <p className="text-sm text-[var(--text-muted)]">
                  text-5xl font-bold (48px)
                </p>
              </div>
              <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                <h2 className="text-4xl font-bold mb-2">Heading 2</h2>
                <p className="text-sm text-[var(--text-muted)]">
                  text-4xl font-bold (36px)
                </p>
              </div>
              <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                <h3 className="text-3xl font-bold mb-2">Heading 3</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  text-3xl font-bold (30px)
                </p>
              </div>
              <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                <h4 className="text-2xl font-bold mb-2">Heading 4</h4>
                <p className="text-sm text-[var(--text-muted)]">
                  text-2xl font-bold (24px)
                </p>
              </div>
              <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                <h5 className="text-xl font-bold mb-2">Heading 5</h5>
                <p className="text-sm text-[var(--text-muted)]">
                  text-xl font-bold (20px)
                </p>
              </div>
              <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                <h6 className="text-lg font-bold mb-2">Heading 6</h6>
                <p className="text-sm text-[var(--text-muted)]">
                  text-lg font-bold (18px)
                </p>
              </div>
              <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                <p className="text-base mb-2">
                  Body text: The quick brown fox jumps over the lazy dog. This
                  is regular body text used for paragraphs and general content.
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  text-base (16px)
                </p>
              </div>
              <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                <p className="text-sm text-[var(--text-muted)] mb-2">
                  Small text: Additional information, captions, and metadata
                  displayed in smaller size.
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  text-sm (14px)
                </p>
              </div>
            </div>
          </section>

          {/* Interactive Elements */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Interactive Elements</h2>

            {/* Buttons */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Buttons</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                  <h4 className="font-semibold mb-4">Button Variants</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="default">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </div>
                <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                  <h4 className="font-semibold mb-4">Button Sizes</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Form Inputs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                  <h4 className="font-semibold mb-4">Text Input</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Default state"
                      className="flex h-10 w-full rounded-md border border-[var(--input)] bg-[var(--bg)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    />
                    <input
                      type="text"
                      placeholder="Disabled state"
                      disabled
                      className="flex h-10 w-full rounded-md border border-[var(--input)] bg-[var(--bg)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                  <h4 className="font-semibold mb-4">Textarea</h4>
                  <textarea
                    placeholder="Enter your message..."
                    rows={4}
                    className="flex w-full rounded-md border border-[var(--input)] bg-[var(--bg)] px-3 py-2 text-sm placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  />
                </div>
              </div>
            </div>

            {/* Alert Components */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Alerts</h3>
              <div className="space-y-4">
                <div className="p-4 bg-[var(--danger)] text-[var(--danger-foreground)] rounded-lg border border-[var(--danger)]">
                  <div className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold mb-1">Error Alert</h4>
                      <p className="text-sm opacity-90">
                        This is a danger/error alert for critical issues and
                        destructive actions.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[var(--warning)] text-[var(--warning-foreground)] rounded-lg border border-[var(--warning)]">
                  <div className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold mb-1">Warning Alert</h4>
                      <p className="text-sm opacity-90">
                        This is a warning alert for cautionary messages that
                        require attention.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[var(--success)] text-[var(--success-foreground)] rounded-lg border border-[var(--success)]">
                  <div className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold mb-1">Success Alert</h4>
                      <p className="text-sm opacity-90">
                        This is a success alert for confirmations and successful
                        operations.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[var(--info)] text-[var(--info-foreground)] rounded-lg border border-[var(--info)]">
                  <div className="flex items-start gap-3">
                    <svg
                      className="h-5 w-5 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold mb-1">Info Alert</h4>
                      <p className="text-sm opacity-90">
                        This is an info alert for informational messages, tips,
                        and notifications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Borders */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Borders</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-[var(--bg-light)] rounded-lg border-2 border-[var(--highlight)]">
                  <h4 className="font-semibold mb-2">Highlight Border</h4>
                  <p className="text-sm text-[var(--text-muted)]">
                    Used for focus states, selected items, and accent borders.
                  </p>
                </div>
                <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                  <h4 className="font-semibold mb-2">Default Border</h4>
                  <p className="text-sm text-[var(--text-muted)]">
                    Standard border for cards, inputs, and containers.
                  </p>
                </div>
                <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border-muted)]">
                  <h4 className="font-semibold mb-2">Muted Border</h4>
                  <p className="text-sm text-[var(--text-muted)]">
                    Subtle border for dividers and light separations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Usage Guidelines */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Usage Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                <h3 className="text-lg font-semibold mb-3">Color Hierarchy</h3>
                <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                  <li>
                    • Use{" "}
                    <code className="px-1 py-0.5 bg-[var(--bg)] rounded">
                      --primary
                    </code>{" "}
                    for main CTAs and primary actions
                  </li>
                  <li>
                    • Use{" "}
                    <code className="px-1 py-0.5 bg-[var(--bg)] rounded">
                      --secondary
                    </code>{" "}
                    for alternative actions
                  </li>
                  <li>
                    • Use{" "}
                    <code className="px-1 py-0.5 bg-[var(--bg)] rounded">
                      --highlight
                    </code>{" "}
                    for focus states and accents
                  </li>
                  <li>
                    • Reserve alert colors for their specific purposes only
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                <h3 className="text-lg font-semibold mb-3">Accessibility</h3>
                <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                  <li>• All color combinations meet WCAG 2.1 AA standards</li>
                  <li>• Text contrast ratio: minimum 4.5:1</li>
                  <li>• UI element contrast: minimum 3:1</li>
                  <li>
                    • Always use foreground colors with their paired backgrounds
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                <h3 className="text-lg font-semibold mb-3">Implementation</h3>
                <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                  <li>
                    • Use CSS custom properties:{" "}
                    <code className="px-1 py-0.5 bg-[var(--bg)] rounded">
                      var(--primary)
                    </code>
                  </li>
                  <li>
                    • Tailwind classes available:{" "}
                    <code className="px-1 py-0.5 bg-[var(--bg)] rounded">
                      bg-primary
                    </code>
                  </li>
                  <li>
                    • All colors support both light and dark modes automatically
                  </li>
                  <li>• Click any color swatch to copy its CSS variable</li>
                </ul>
              </div>
              <div className="p-6 bg-[var(--bg-light)] rounded-lg border border-[var(--border)]">
                <h3 className="text-lg font-semibold mb-3">Brand Identity</h3>
                <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                  <li>• Navy: Professional, trustworthy, aviation heritage</li>
                  <li>• Emerald: Growth, momentum, positive progress</li>
                  <li>• Sky Blue: Clarity, open communication, innovation</li>
                  <li>
                    • Colors reflect dual-track content (Aviation + Dev/Startup)
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </Container>
      </main>
    </div>
  );
}
