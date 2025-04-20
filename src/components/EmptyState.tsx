"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  icon?: React.ReactNode;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  icon,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 rounded-lg bg-white dark:bg-dark-surface-light shadow-sm border border-gray-100 dark:border-dark-border text-center"
    >
      {icon && <div className="mb-4 text-primary-400 opacity-80">{icon}</div>}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-primary-600 hover:bg-primary-700"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
