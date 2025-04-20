"use client";

import React from "react";
import {
  FaFileUpload,
  FaFolder,
  FaShare,
  FaEdit,
  FaTrash,
  FaDownload,
} from "react-icons/fa";
import { Item, FileItem } from "../../types/files";
import { formatFileSize } from "../../utils/formatters";

interface FileListViewProps {
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
  getFileTypeIcon: (fileType: string) => React.ReactNode;
}

export default function FileListView({
  items,
  selectedItems,
  handleItemClick,
  handleItemContextMenu,
  handleFolderClick,
  handleShareFile,
  handleDeleteItem,
  getFileTypeIcon,
}: FileListViewProps) {
  return (
    <div className="bg-white dark:bg-dark-surface-light rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-dark-surface-elevated">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Size
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Modified
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr
              key={item.id}
              className={`group hover:bg-gray-50 dark:hover:bg-dark-surface-elevated transition-colors cursor-pointer ${
                selectedItems.includes(item.id)
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : ""
              }`}
              onClick={(e) => handleItemClick(e, item.id)}
              onContextMenu={(e) => {
                handleItemContextMenu(
                  e,
                  item.type === "folder" ? "folder" : "file",
                  item.id
                );
                if (!selectedItems.includes(item.id)) {
                  // Add to selection if not already selected
                  handleItemClick(e, item.id);
                }
              }}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  {item.type === "folder" ? (
                    <FaFolder className="mr-3 text-yellow-500" />
                  ) : (
                    <div className="mr-3">{getFileTypeIcon(item.type)}</div>
                  )}
                  <span
                    className={`truncate ${
                      item.type === "folder"
                        ? "cursor-pointer hover:text-primary-600"
                        : ""
                    }`}
                    onClick={(e) => {
                      if (item.type === "folder") {
                        e.stopPropagation();
                        handleFolderClick(item.id);
                      }
                    }}
                  >
                    {item.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {item.type === "folder" ? "Folder" : item.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {item.type === "folder"
                  ? "-"
                  : formatFileSize((item as FileItem).size)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {item.lastModified || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
                  {item.type === "folder" ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFolderClick(item.id);
                        }}
                        className="p-1 text-gray-500 hover:text-primary-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Open"
                      >
                        <FaFolder size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`Sharing folder ${item.id}`);
                        }}
                        className="p-1 text-gray-500 hover:text-primary-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Share"
                      >
                        <FaShare size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`Renaming folder ${item.id}`);
                        }}
                        className="p-1 text-gray-500 hover:text-primary-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Rename"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id, "folder");
                        }}
                        className="p-1 text-red-500 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`Opening file ${item.id}`);
                        }}
                        className="p-1 text-gray-500 hover:text-primary-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Open"
                      >
                        <FaFileUpload size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(`Downloading file ${item.id}`);
                        }}
                        className="p-1 text-gray-500 hover:text-primary-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Download"
                      >
                        <FaDownload size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareFile(item.id);
                        }}
                        className="p-1 text-gray-500 hover:text-primary-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Share"
                      >
                        <FaShare size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id, "file");
                        }}
                        className="p-1 text-red-500 hover:text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
