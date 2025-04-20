"use client";

import React from "react";
import {
  FiSun,
  FiMoon,
  FiSettings,
  FiBell,
  FiFolder,
  FiShare2,
  FiShield,
  FiArrowRight,
  FiChevronDown,
} from "react-icons/fi";
import { cva, VariantProps } from "class-variance-authority";

// Define icon size variants
const iconVariants = cva("", {
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Icon type definitions
export type IconName =
  | "sun"
  | "moon"
  | "logo"
  | "bell"
  | "settings"
  | "folder"
  | "share"
  | "shield"
  | "arrow-right"
  | "chevron-down";

export interface IconProps extends VariantProps<typeof iconVariants> {
  name: IconName;
  className?: string;
}

// Icon component with various icon options
export function Icon({ name, size, className = "" }: IconProps) {
  const iconClasses = iconVariants({ size, className: className });

  // Match icons to their components
  const renderIcon = () => {
    switch (name) {
      case "sun":
        return <FiSun className={iconClasses} />;
      case "moon":
        return <FiMoon className={iconClasses} />;
      case "bell":
        return <FiBell className={iconClasses} />;
      case "settings":
        return <FiSettings className={iconClasses} />;
      case "folder":
        return <FiFolder className={iconClasses} />;
      case "share":
        return <FiShare2 className={iconClasses} />;
      case "shield":
        return <FiShield className={iconClasses} />;
      case "arrow-right":
        return <FiArrowRight className={iconClasses} />;
      case "chevron-down":
        return <FiChevronDown className={iconClasses} />;
      case "logo":
        // Custom SVG for logo
        return (
          <svg
            className={iconClasses}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return renderIcon();
}
