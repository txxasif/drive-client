import { create } from "zustand";
import { persist } from "./helpers";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist<ThemeState>("theme-store", { version: 1 })((set) => {
    // Get initial theme from system preference if available
    const getInitialTheme = (): Theme => {
      // Check if we're in the browser environment
      if (typeof window !== "undefined") {
        // First try localStorage
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light" || savedTheme === "dark") {
          return savedTheme;
        }

        // Then check system preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
        }
      }

      return "light";
    };

    return {
      theme: getInitialTheme(),

      setTheme: (theme) => {
        set({ theme });

        // Apply theme to document
        if (typeof document !== "undefined") {
          const root = document.documentElement;

          if (theme === "dark") {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }
      },

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";

          // Apply theme to document
          if (typeof document !== "undefined") {
            const root = document.documentElement;

            if (newTheme === "dark") {
              root.classList.add("dark");
            } else {
              root.classList.remove("dark");
            }
          }

          return { theme: newTheme };
        });
      },
    };
  })
);
