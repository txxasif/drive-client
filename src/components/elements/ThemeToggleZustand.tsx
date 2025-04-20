"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useThemeStore } from "../../stores/themeStore";

type ThemeToggleProps = {
  className?: string;
  iconClassName?: string;
  variant?: "default" | "minimal";
};

export function ThemeToggleZustand({
  className = "",
  iconClassName = "h-5 w-5",
  variant = "default",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center rounded-full focus:outline-none ${
        variant === "default"
          ? `p-2 ${
              theme === "light"
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700 dark:bg-blue-50 dark:text-blue-600 dark:hover:bg-blue-100"
            }`
          : ""
      } ${className}`}
      aria-label={theme === "light" ? "Enable dark mode" : "Enable light mode"}
    >
      {theme === "light" ? (
        <SunIcon className={iconClassName} />
      ) : (
        <MoonIcon className={iconClassName} />
      )}
    </button>
  );
}
