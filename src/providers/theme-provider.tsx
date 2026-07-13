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

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  reducedMotion: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Initialise from storage and detect reduced-motion preference
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored) setThemeState(stored);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

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

  const setTheme = useCallback((t: ThemeMode) => setThemeState(t), []);

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
