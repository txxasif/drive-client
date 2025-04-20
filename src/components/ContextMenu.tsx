"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export type MenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  divider?: boolean;
};

type ContextMenuProps = {
  items: MenuItem[];
  position: { x: number; y: number } | null;
  onClose: () => void;
};

export default function ContextMenu({
  items,
  position,
  onClose,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(
    position || { x: 0, y: 0 }
  );

  // Adjust position to keep menu in viewport
  useEffect(() => {
    if (!position) return;

    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = position.x;
      let y = position.y;

      // Adjust horizontal position if menu would go off screen
      if (x + menuRect.width > viewportWidth) {
        x = viewportWidth - menuRect.width - 10;
      }

      // Adjust vertical position if menu would go off screen
      if (y + menuRect.height > viewportHeight) {
        y = viewportHeight - menuRect.height - 10;
      }

      setAdjustedPosition({ x, y });
    } else {
      setAdjustedPosition(position);
    }
  }, [position]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  // Don't render if no position
  if (!position) return null;

  // Use portal to render at root level
  return createPortal(
    <AnimatePresence>
      {position && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          style={{
            position: "fixed",
            top: adjustedPosition.y,
            left: adjustedPosition.x,
            zIndex: 50,
          }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[180px] overflow-hidden"
        >
          <ul>
            {items.map((item, index) => (
              <li key={item.id}>
                <button
                  className={`w-full text-left px-4 py-2 text-sm flex items-center ${
                    item.danger
                      ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => {
                    item.onClick();
                    onClose();
                  }}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </button>
                {item.divider && index < items.length - 1 && (
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
