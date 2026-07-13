/**
 * Centralized constants for the application
 * Extracted to remove magic numbers and improve maintainability
 */

// AI Chat Constants
export const AI_CHAT = {
  MAX_MESSAGE_LENGTH: 4000,
  MAX_VISIBLE_CHARS: 20_000,
  UI_FLUSH_INTERVAL_MS: 60,
} as const;

// Rate Limiting Constants
export const RATE_LIMIT = {
  DEFAULT_LIMIT: 30,
  DEFAULT_WINDOW_MS: 60_000,
  AI_CHAT_LIMIT: 30,
  AI_CHAT_WINDOW_MS: 60_000,
} as const;

// API Constants
export const API = {
  MAX_REQUEST_BYTES: 64_000,
} as const;

// Stadium Constants
export const STADIUM = {
  TOTAL_ZONES: 7,
  TOTAL_GATES: 6,
} as const;

// Animation Constants
export const ANIMATION = {
  STAGGER_DELAY_MS: 50,
  INITIAL_DELAY_MS: 100,
  DURATION_MS: 400,
} as const;

// UI Constants
export const UI = {
  CHAT_PANEL_HEIGHT: 600,
  CHART_CARD_HEIGHT: 280,
  SIDEBAR_WIDTH: 256,
} as const;
