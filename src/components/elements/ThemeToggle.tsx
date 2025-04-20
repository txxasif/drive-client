"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Icon } from "./Icon";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
        theme === "dark"
          ? "bg-gray-800 text-yellow-400"
          : "bg-blue-100 text-gray-800"
      } ${className}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <Icon name={theme === "light" ? "moon" : "sun"} />
    </button>
  );
}
