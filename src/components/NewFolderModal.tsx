"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFolder, FaTimes } from "react-icons/fa";
import { Button } from "./ui/button";

type NewFolderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folderName: string) => void;
  existingFolderNames?: string[];
  currentPath: string;
};

export function NewFolderModal({
  isOpen,
  onClose,
  onCreateFolder,
  existingFolderNames = [],
  currentPath,
}: NewFolderModalProps) {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setFolderName("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate folder name
    if (!folderName.trim()) {
      setError("Folder name cannot be empty");
      return;
    }

    // Check for special characters (except spaces, hyphens, and underscores)
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(folderName)) {
      setError("Folder name contains invalid characters");
      return;
    }

    // Check if folder name already exists
    if (existingFolderNames.includes(folderName)) {
      setError(
        `A folder named "${folderName}" already exists in this location`
      );
      return;
    }

    // All validations passed
    onCreateFolder(folderName);
    onClose();
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Create New Folder
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FaTimes />
              </button>
            </div>

            <div className="text-sm text-gray-500 mb-4">
              Location: {currentPath || "My Files"}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-4 bg-gray-100 p-3 rounded-lg">
                <FaFolder className="text-primary-500 mr-3" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  value={folderName}
                  onChange={(e) => {
                    setFolderName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter folder name"
                  className="bg-transparent border-none w-full focus:outline-none focus:ring-0 text-gray-700"
                  maxLength={255}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mb-4"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-600 text-white hover:bg-primary-700"
                >
                  Create Folder
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
