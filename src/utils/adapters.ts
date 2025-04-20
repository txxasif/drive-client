import React from "react";

/**
 * Adapters for component props
 * These functions help bridge the gap between different component interfaces
 * and follow the Adapter pattern
 */

// Type definitions
type SortByDisplay = "name" | "size" | "type" | "date";
type SortByStore = "name" | "size" | "type" | "modified";
type FilterType = "all" | "folders" | "images" | "documents" | "media";

/**
 * Converts store sort option to display sort option
 */
export const adaptSortByForDisplay = (sortBy: SortByStore): SortByDisplay => {
  return sortBy === "modified" ? "date" : sortBy;
};

/**
 * Converts display sort option to store sort option
 */
export const createSortByHandler = (setSortBy: (sort: SortByStore) => void) => {
  return (sort: SortByDisplay) => {
    setSortBy(sort === "date" ? "modified" : (sort as SortByStore));
  };
};

/**
 * Creates a type-safe filter handler
 */
export const createFilterTypeHandler = (
  setFilterType: (type: FilterType) => void
) => {
  return (type: string) => {
    if (["all", "folders", "images", "documents", "media"].includes(type)) {
      setFilterType(type as FilterType);
    }
  };
};

/**
 * Adapts store item click handler to component interface
 */
export const createItemClickHandler = (
  handleItemClick: (id: string, isMultiSelect: boolean) => void
) => {
  return (e: React.MouseEvent, id: string) => {
    handleItemClick(id, e.ctrlKey || e.metaKey);
  };
};

/**
 * Adapts store context menu handler to component interface
 */
export const createContextMenuHandler = (
  handleContextMenu: (
    e: React.MouseEvent,
    id: string,
    type: "file" | "folder"
  ) => void
) => {
  return (e: React.MouseEvent, type: "file" | "folder", id: string) => {
    handleContextMenu(e, id, type);
  };
};

/**
 * Creates an async version of file upload handler
 */
export const createAsyncFileUploadHandler = (
  handleFileUpload: (files: File[]) => void
) => {
  return async (files: File[]): Promise<void> => {
    handleFileUpload(files);
    return Promise.resolve();
  };
};
