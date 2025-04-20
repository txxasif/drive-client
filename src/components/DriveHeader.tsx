"use client";

import { useState } from "react";
import { FaSearch, FaPlus, FaUpload } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

type DriveHeaderProps = {
  onNewFolder: () => void;
  onUploadFile: () => void;
  onSearch: (query: string) => void;
};

export function DriveHeader({
  onNewFolder,
  onUploadFile,
  onSearch,
}: DriveHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showActions, setShowActions] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border py-4">
      <div className="container px-4 mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search files and folders..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-surface-light dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </form>

        {/* Action buttons (desktop) */}
        <div className="hidden md:flex items-center space-x-2">
          <Button
            onClick={onNewFolder}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700"
          >
            <FaPlus size={14} />
            <span>New Folder</span>
          </Button>

          <Button
            onClick={onUploadFile}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700"
          >
            <FaUpload size={14} />
            <span>Upload</span>
          </Button>
        </div>

        {/* Action button (mobile) */}
        <div className="md:hidden">
          <Button
            onClick={() => setShowActions(!showActions)}
            className="w-full bg-primary-600 hover:bg-primary-700"
          >
            Actions
          </Button>

          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-4 mt-2 bg-white dark:bg-dark-surface-light rounded-lg shadow-xl border border-gray-200 dark:border-dark-border z-10 w-48"
              >
                <button
                  onClick={() => {
                    onNewFolder();
                    setShowActions(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-left hover:bg-primary-50 dark:hover:bg-dark-surface-elevated text-primary-700 dark:text-primary-400"
                >
                  <FaPlus size={14} />
                  <span>New Folder</span>
                </button>

                <button
                  onClick={() => {
                    onUploadFile();
                    setShowActions(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-left hover:bg-primary-50 dark:hover:bg-dark-surface-elevated text-primary-700 dark:text-primary-400 border-t border-gray-100 dark:border-dark-border"
                >
                  <FaUpload size={14} />
                  <span>Upload</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
