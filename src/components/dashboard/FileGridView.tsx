"use client";

import React from "react";
import { FaFileUpload, FaFolder, FaShare, FaTrash } from "react-icons/fa";
import { Item, FileItem, FileType } from "../../types/files";

interface FileGridViewProps {
  items: Item[];
  selectedItems: string[];
  handleItemClick: (e: React.MouseEvent, id: string) => void;
  handleItemContextMenu: (
    e: React.MouseEvent,
    type: "file" | "folder",
    id: string
  ) => void;
  handleFolderClick: (id: string) => void;
  handleShareFile: (id: string) => void;
  handleDeleteItem: (id: string, type: "file" | "folder") => void;
  getFileTypeIcon: (fileType: FileType) => React.ReactNode;
}

export default function FileGridView({
  items,
  selectedItems,
  handleItemClick,
  handleItemContextMenu,
  handleFolderClick,
  handleShareFile,
  handleDeleteItem,
  getFileTypeIcon,
}: FileGridViewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item) =>
        item.type === "folder" ? (
          <div
            key={item.id}
            className={`bg-white dark:bg-dark-surface-light rounded-lg shadow overflow-hidden hover:shadow-md transition-all cursor-pointer group ${
              selectedItems.includes(item.id)
                ? "bg-blue-50 dark:bg-blue-900/20"
                : ""
            }`}
            onClick={(e) => handleItemClick(e, item.id)}
            onContextMenu={(e) => {
              handleItemContextMenu(e, "folder", item.id);
              if (!selectedItems.includes(item.id)) {
                // Add to selection if not already selected
                handleItemClick(e, item.id);
              }
            }}
          >
            <div
              className="p-4 flex flex-col items-center relative"
              onClick={(e) => {
                e.stopPropagation();
                handleFolderClick(item.id);
              }}
            >
              <FaFolder className="text-4xl text-yellow-500 mb-2" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-full">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Folder
              </p>

              {/* Action buttons - visible on hover */}
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFolderClick(item.id);
                  }}
                  className="p-1 text-gray-500 hover:text-primary-600 rounded bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
                  title="Open"
                >
                  <FaFolder size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Sharing folder ${item.id}`);
                  }}
                  className="p-1 text-gray-500 hover:text-primary-600 rounded bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
                  title="Share"
                >
                  <FaShare size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id, "folder");
                  }}
                  className="p-1 text-red-500 hover:text-red-600 rounded bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm"
                  title="Delete"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            key={item.id}
            className={`bg-white dark:bg-dark-surface-light rounded-lg shadow overflow-hidden hover:shadow-md transition-all cursor-pointer group ${
              selectedItems.includes(item.id)
                ? "bg-blue-50 dark:bg-blue-900/20"
                : ""
            }`}
            onClick={(e) => handleItemClick(e, item.id)}
            onContextMenu={(e) => {
              handleItemContextMenu(e, "file", item.id);
              if (!selectedItems.includes(item.id)) {
                // Add to selection if not already selected
                handleItemClick(e, item.id);
              }
            }}
          >
            <div className="p-4 flex flex-col items-center relative">
              <div className="text-4xl mb-2">{getFileTypeIcon(item.type)}</div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-full">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {(item as FileItem).size}
              </p>

              {/* Action buttons - visible on hover */}
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Opening file ${item.id}`);
                  }}
                  className="p-1 text-gray-500 hover:text-primary-600 rounded bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
                  title="Open"
                >
                  <FaFileUpload size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareFile(item.id);
                  }}
                  className="p-1 text-gray-500 hover:text-primary-600 rounded bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
                  title="Share"
                >
                  <FaShare size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id, "file");
                  }}
                  className="p-1 text-red-500 hover:text-red-600 rounded bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm"
                  title="Delete"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
