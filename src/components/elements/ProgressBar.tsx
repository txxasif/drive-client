"use client";

import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva(
  "w-full rounded-full h-2.5 dark:bg-gray-700 bg-gray-200",
  {
    variants: {
      status: {
        progress: "",
        success: "",
        error: "",
      },
    },
  }
);

const barVariants = cva("h-2.5 rounded-full transition-all duration-300", {
  variants: {
    status: {
      progress: "bg-blue-600 dark:bg-blue-500",
      success: "bg-green-600 dark:bg-green-500",
      error: "bg-red-600 dark:bg-red-500",
    },
  },
  defaultVariants: {
    status: "progress",
  },
});

export interface ProgressBarProps
  extends VariantProps<typeof progressVariants> {
  percent: number;
  status?: "progress" | "success" | "error";
  className?: string;
  showPercentage?: boolean;
  label?: string;
}

export default function ProgressBar({
  percent,
  status = "progress",
  className = "",
  showPercentage = false,
  label,
}: ProgressBarProps) {
  // Clamp percent value between 0 and 100
  const clampedPercent = Math.max(0, Math.min(100, percent));

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {clampedPercent.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className={progressVariants({ status, className })}>
        <div
          className={barVariants({ status })}
          style={{ width: `${clampedPercent}%` }}
          role="progressbar"
          aria-valuenow={clampedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
