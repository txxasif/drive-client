"use client";

import { motion } from "framer-motion";

type StorageUsageBarProps = {
  usedStorage: number; // in bytes
  totalStorage: number; // in bytes
};

export function StorageUsageBar({
  usedStorage,
  totalStorage,
}: StorageUsageBarProps) {
  // Calculate percentage used (0-100)
  const percentageUsed = Math.min(
    100,
    Math.round((usedStorage / totalStorage) * 100)
  );

  // Format storage size
  const formatStorage = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Select color based on usage
  const getBarColor = () => {
    if (percentageUsed < 60) return "bg-primary-500";
    if (percentageUsed < 85) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between mb-1 text-sm">
        <span className="text-primary-700 dark:text-primary-400 font-medium">
          Storage
        </span>
        <span className="text-primary-600 dark:text-primary-300">
          {formatStorage(usedStorage)} of {formatStorage(totalStorage)}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentageUsed}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${getBarColor()}`}
        />
      </div>
      <div className="text-xs text-primary-500 dark:text-primary-400 mt-1 text-right">
        {percentageUsed}% used
      </div>
    </div>
  );
}
