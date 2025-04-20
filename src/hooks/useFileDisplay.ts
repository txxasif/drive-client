import { useCallback, useMemo, useState } from "react";
import { ContextMenuState, FileItem, FolderItem, Item } from "../types/files";

export function useFileDisplay(
  initialFiles: FileItem[],
  initialFolders: FolderItem[]
) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size" | "type">(
    "name"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Combined, filtered and sorted items
  const items = useMemo(() => {
    let combined: Item[] = [...initialFolders, ...initialFiles];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      combined = combined.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      if (filterType === "folder") {
        combined = combined.filter((item) => item.type === "folder");
      } else if (filterType === "file") {
        combined = combined.filter((item) => item.type === "file");
      } else {
        // Filter by file type
        combined = combined.filter(
          (item) =>
            item.type === "file" && (item as FileItem).fileType === filterType
        );
      }
    }

    // Apply sorting
    return combined.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "date" && a.lastModified && b.lastModified) {
        comparison =
          new Date(a.lastModified).getTime() -
          new Date(b.lastModified).getTime();
      } else if (sortBy === "type") {
        comparison = a.type.localeCompare(b.type);
      } else if (sortBy === "size" && a.type === "file" && b.type === "file") {
        // Direct comparison of numeric sizes
        const sizeA = (a as FileItem).size;
        const sizeB = (b as FileItem).size;
        comparison = sizeA - sizeB;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [
    initialFolders,
    initialFiles,
    sortBy,
    sortOrder,
    filterType,
    searchQuery,
  ]);

  // Handle item selection
  const handleItemClick = useCallback((e: React.MouseEvent, id: string) => {
    if (e.ctrlKey || e.metaKey) {
      // Multi-select (add or remove from selection)
      setSelectedItems((prev) =>
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id)
          : [...prev, id]
      );
    } else {
      // Single select (replace current selection)
      setSelectedItems((prev) =>
        prev.includes(id) && prev.length === 1 ? [] : [id]
      );
    }
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Toggle sort order
  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  // Handle item context menu
  const handleItemContextMenu = useCallback(
    (e: React.MouseEvent, itemType: "file" | "folder", id: string) => {
      e.preventDefault(); // Prevent default context menu
      setContextMenu({
        position: { x: e.clientX, y: e.clientY },
        type: itemType,
        id: id,
      });
    },
    []
  );

  // Close context menu
  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return {
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    filterType,
    setFilterType,
    searchQuery,
    selectedItems,
    setSelectedItems,
    contextMenu,
    items,
    handleItemClick,
    handleSearch,
    handleItemContextMenu,
    handleCloseContextMenu,
  };
}
