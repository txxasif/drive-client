import { create } from "zustand";

interface Position {
  x: number;
  y: number;
}

interface ContextMenuInfo {
  position: Position;
  id: string;
  type: "file" | "folder";
}

type SortByOption = "name" | "size" | "modified" | "type";
type FilterTypeOption = "all" | "folders" | "images" | "documents" | "media";
type ViewModeOption = "grid" | "list";

interface DisplayState {
  // View preferences
  viewMode: ViewModeOption;
  sortBy: SortByOption;
  sortOrder: "asc" | "desc";
  filterType: FilterTypeOption;
  searchQuery: string;

  // Selection and context menu state
  selectedItems: string[];
  contextMenu: ContextMenuInfo | null;

  // Actions
  setViewMode: (mode: ViewModeOption) => void;
  setSortBy: (sortBy: SortByOption) => void;
  toggleSortOrder: () => void;
  setFilterType: (filterType: FilterTypeOption) => void;
  handleSearch: (query: string) => void;
  handleItemClick: (id: string, isMultiSelect: boolean) => void;
  handleItemContextMenu: (
    e: React.MouseEvent,
    id: string,
    type: "file" | "folder"
  ) => void;
  handleCloseContextMenu: () => void;
  clearSelectedItems: () => void;
}

export const useDisplayStore = create<DisplayState>((set, get) => ({
  // Initial state
  viewMode: "grid",
  sortBy: "name",
  sortOrder: "asc",
  filterType: "all",
  searchQuery: "",
  selectedItems: [],
  contextMenu: null,

  // Actions
  setViewMode: (mode) => set({ viewMode: mode }),

  setSortBy: (sortBy) => set({ sortBy }),

  toggleSortOrder: () =>
    set((state) => ({
      sortOrder: state.sortOrder === "asc" ? "desc" : "asc",
    })),

  setFilterType: (filterType) => set({ filterType }),

  handleSearch: (query) => set({ searchQuery: query }),

  handleItemClick: (id, isMultiSelect) => {
    const { selectedItems } = get();

    if (isMultiSelect) {
      // If already selected, deselect. Otherwise, add to selection
      const newSelectedItems = selectedItems.includes(id)
        ? selectedItems.filter((item) => item !== id)
        : [...selectedItems, id];

      set({ selectedItems: newSelectedItems });
    } else {
      // Single selection replaces the current selection
      set({ selectedItems: [id] });
    }
  },

  handleItemContextMenu: (e, id, type) => {
    e.preventDefault();

    set({
      contextMenu: {
        position: { x: e.clientX, y: e.clientY },
        id,
        type,
      },
    });
  },

  handleCloseContextMenu: () => set({ contextMenu: null }),

  clearSelectedItems: () => set({ selectedItems: [] }),
}));
