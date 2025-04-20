"use client";

import { useTheme } from "../../context/ThemeContext";
import { Icon } from "../elements/Icon";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface-light text-gray-700 dark:text-gray-300 transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Icon name="sun" size="sm" />
      ) : (
        <Icon name="moon" size="sm" />
      )}
    </button>
  );
}
