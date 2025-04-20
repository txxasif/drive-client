"use client";

import React from "react";
import { Item, FileItem } from "../../types/files";
import { formatFileSize, truncateString } from "../../utils/formatters";
import FileIcon from "./FileIcon";

interface FileGridItemProps {
  item: Item;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onFolderClick?: (id: string) => void;
  onDelete?: (id: string, type: "file" | "folder") => void;
  onShare?: (id: string) => void;
}

/**
 * A reusable file grid item component that handles both files and folders
 * Following the Single Responsibility Principle by focusing only on rendering a single item
 */
export default function FileGridItem({
  item,
  isSelected,
  onSelect,
  onContextMenu,
  onFolderClick,
  onDelete,
  onShare,
}: FileGridItemProps) {
  const isFolder = item.type === "folder";

  const handleClick = (e: React.MouseEvent) => {
    if (isFolder && onFolderClick && !e.ctrlKey && !e.metaKey) {
      onFolderClick(item.id);
    } else {
      onSelect(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isFolder && onFolderClick) {
      onFolderClick(item.id);
    } else if (e.key === "Delete" && onDelete) {
      onDelete(item.id, isFolder ? "folder" : "file");
    }
  };

  return (
    <div
      className={`group relative p-3 rounded-md cursor-pointer transition-colors ${
        isSelected
          ? "bg-primary-100 dark:bg-dark-surface-elevated"
          : "hover:bg-gray-100 dark:hover:bg-dark-surface-light"
      }`}
      onClick={handleClick}
      onContextMenu={onContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-selected={isSelected}
      role="gridcell"
      data-testid={`file-grid-item-${item.id}`}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="w-16 h-16 flex items-center justify-center">
          <FileIcon fileType={item.type} />
        </div>

        <div className="text-center w-full">
          <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
            {truncateString(item.name, 20)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isFolder ? "Folder" : formatFileSize((item as FileItem).size || 0)}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute top-2 right-2 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isFolder && onShare && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(item.id);
            }}
            className="p-1 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={`Share ${item.name}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500 dark:text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
        )}

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id, isFolder ? "folder" : "file");
            }}
            className="p-1 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={`Delete ${item.name}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500 dark:text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
