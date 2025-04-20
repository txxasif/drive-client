"use client";

import React from "react";
import { FaSortAmountDown, FaFilter } from "react-icons/fa";

interface FileControlsProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: "name" | "date" | "size" | "type";
  setSortBy: (sort: "name" | "date" | "size" | "type") => void;
  sortOrder: "asc" | "desc";
  toggleSortOrder: () => void;
  filterType: string;
  setFilterType: (type: string) => void;
  breadcrumbs: Array<{ name: string; path: string }>;
}

export default function FileControls({
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  sortOrder,
  toggleSortOrder,
  filterType,
  setFilterType,
  breadcrumbs,
}: FileControlsProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-primary-700">
        {breadcrumbs.length > 0
          ? breadcrumbs[breadcrumbs.length - 1].name
          : "My Files"}
      </h2>

      {/* View controls */}
      <div className="flex space-x-4">
        {/* View mode toggle */}
        <div className="flex items-center space-x-2 bg-white dark:bg-dark-surface-light rounded-lg shadow px-3 py-2">
          <button
            className={`p-1.5 rounded ${
              viewMode === "list"
                ? "bg-primary-100 text-primary-600"
                : "text-gray-500"
            }`}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            className={`p-1.5 rounded ${
              viewMode === "grid"
                ? "bg-primary-100 text-primary-600"
                : "text-gray-500"
            }`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
        </div>

        {/* Sort options */}
        <div className="relative bg-white dark:bg-dark-surface-light rounded-lg shadow px-3 py-2">
          <div className="flex items-center space-x-2">
            <FaSortAmountDown className="text-gray-500" />
            <select
              className="bg-transparent dark:bg-dark-surface-light dark:text-gray-300 text-sm focus:outline-none"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "name" | "date" | "size" | "type")
              }
            >
              <option value="name">Name</option>
              <option value="date">Date Modified</option>
              <option value="size">Size</option>
              <option value="type">Type</option>
            </select>
            <button onClick={toggleSortOrder} className="text-gray-500">
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {/* Filter options */}
        <div className="relative bg-white dark:bg-dark-surface-light rounded-lg shadow px-3 py-2">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <select
              className="bg-transparent dark:bg-dark-surface-light dark:text-gray-300 text-sm focus:outline-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="folder">Folders</option>
              <option value="file">Files</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="pdf">PDFs</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
