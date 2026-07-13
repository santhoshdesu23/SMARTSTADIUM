"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ThemeMode } from "@/types";

const STORAGE_KEY = "stadiumos-theme";
const DEFAULT_THEME: ThemeMode = "dark";
const VALID_THEMES: ThemeMode[] = ["dark", "light", "high-contrast", "colorblind"];

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  reducedMotion: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  return VALID_THEMES.includes(stored as ThemeMode) ? (stored as ThemeMode) : DEFAULT_THEME;
}

function getInitialReducedMotionPreference(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(getStoredTheme);
  const [reducedMotion, setReducedMotion] = useState(getInitialReducedMotionPreference);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Apply theme via data attribute — cleaner than class manipulation
  // and avoids conflicts with Tailwind's dark mode class strategy.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    // Keep Tailwind dark-mode class in sync for components that rely on it
    document.documentElement.classList.toggle("dark", theme !== "light");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY && VALID_THEMES.includes(event.newValue as ThemeMode)) {
        setThemeState(event.newValue as ThemeMode);
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setTheme = useCallback((nextTheme: ThemeMode) => setThemeState(nextTheme), []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, reducedMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
