/**
 * Shiki Configuration and Highlighter Initialization
 *
 * Provides a singleton highlighter instance with GitHub Dark/Light themes
 * and support for 8 programming languages (JS, TS, Python, Bash, YAML, JSON, Go, Rust).
 *
 * Pattern: Singleton to avoid re-initialization during build
 * Performance: Cached instance reduces build time overhead
 */

import { getHighlighter, type Highlighter } from 'shiki';

// Singleton cache for highlighter instance
let highlighterInstance: Highlighter | null = null;

/**
 * Supported languages for syntax highlighting
 * Based on FR-002: Core languages + aviation use cases (Python for data analysis)
 */
export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'bash',
  'yaml',
  'json',
  'go',
  'rust',
  'jsx',
  'tsx',
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/**
 * Theme configuration for dual light/dark mode
 * Uses GitHub themes for familiarity and quality
 */
export const THEMES = {
  light: 'github-light',
  dark: 'github-dark',
} as const;

/**
 * Get or create highlighter instance (singleton pattern)
 *
 * Initializes Shiki with dual themes (github-dark, github-light) and loads
 * all supported languages. Returns cached instance on subsequent calls.
 *
 * @returns Promise<Highlighter> - Configured Shiki highlighter
 * @throws Error if highlighter initialization fails
 */
export async function getShikiHighlighter(): Promise<Highlighter> {
  // Return cached instance if available
  if (highlighterInstance) {
    return highlighterInstance;
  }

  try {
    // Initialize highlighter with dual themes and all supported languages
    highlighterInstance = await getHighlighter({
      themes: [THEMES.light, THEMES.dark],
      langs: [...SUPPORTED_LANGUAGES],
    });

    return highlighterInstance;
  } catch (error) {
    // Log initialization error for debugging
    console.error('Failed to initialize Shiki highlighter:', error);
    throw new Error('Shiki highlighter initialization failed');
  }
}

/**
 * Check if a language is supported by Shiki
 *
 * @param lang - Language identifier from fenced code block
 * @returns boolean - True if language is in SUPPORTED_LANGUAGES
 */
export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

/**
 * Get fallback language for unsupported languages
 * Returns 'plaintext' for graceful degradation
 *
 * @param lang - Original language identifier
 * @returns 'plaintext' - Safe fallback
 */
export function getFallbackLanguage(lang: string): 'plaintext' {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`Unsupported language "${lang}", falling back to plaintext`);
  }
  return 'plaintext';
}
