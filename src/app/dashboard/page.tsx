"use client";

import React from "react";
import { FaFileUpload } from "react-icons/fa";

import { Sidebar } from "../../components/Sidebar";
import { DriveHeader } from "../../components/DriveHeader";
import { Breadcrumb } from "../../components/Breadcrumb";
import { EmptyState } from "../../components/EmptyState";
import { FileShareModal } from "../../components/FileShareModal";
import { NewFolderModal } from "../../components/NewFolderModal";
import { FileUploadModal } from "../../components/FileUploadModal";
import ContextMenu from "../../components/ContextMenu";
import FileListView from "../../components/dashboard/FileListView";
import FileGridView from "../../components/dashboard/FileGridView";
import FileIcon from "../../components/dashboard/FileIcon";
import FileControls from "../../components/dashboard/FileControls";

// Import zustand stores instead of hooks
import { useFileStore } from "../../stores/fileStore";
import { useDisplayStore } from "../../stores/displayStore";

import { FileType, FileItem } from "../../types/files";

export default function Dashboard() {
  // User information
  const userDetails = {
    name: "John Doe",
    usedStorage: 1.2 * 1024 * 1024 * 1024, // 1.2 GB in bytes
    totalStorage: 5 * 1024 * 1024 * 1024, // 5 GB in bytes
  };

  // Get state and actions from file store
  const currentPath = useFileStore((state) => state.currentPath);
  const breadcrumbs = useFileStore((state) => state.breadcrumbs);
  const files = useFileStore((state) => state.files);
  const folders = useFileStore((state) => state.folders);
  const fileToShare = useFileStore((state) => state.fileToShare);
  const isShareModalOpen = useFileStore((state) => state.isShareModalOpen);
  const isNewFolderModalOpen = useFileStore(
    (state) => state.isNewFolderModalOpen
  );
  const isUploadModalOpen = useFileStore((state) => state.isUploadModalOpen);

  // Get actions from file store
  const handleNavigate = useFileStore((state) => state.handleNavigate);
  const handleFolderClick = useFileStore((state) => state.handleFolderClick);
  const handleFileUpload = useFileStore((state) => state.handleFileUpload);
  const handleShareFile = useFileStore((state) => state.handleShareFile);
  const handleDeleteItem = useFileStore((state) => state.handleDeleteItem);
  const handleCreateFolder = useFileStore((state) => state.handleCreateFolder);
  const openNewFolderModal = useFileStore((state) => state.openNewFolderModal);
  const closeNewFolderModal = useFileStore(
    (state) => state.closeNewFolderModal
  );
  const openUploadModal = useFileStore((state) => state.openUploadModal);
  const closeUploadModal = useFileStore((state) => state.closeUploadModal);
  const closeShareModal = useFileStore((state) => state.closeShareModal);
  const getCurrentFolderNames = useFileStore(
    (state) => state.getCurrentFolderNames
  );

  // Get state and actions from display store
  const viewMode = useDisplayStore((state) => state.viewMode);
  const setViewMode = useDisplayStore((state) => state.setViewMode);
  const sortBy = useDisplayStore((state) => state.sortBy);
  const setSortBy = useDisplayStore((state) => state.setSortBy);
  const sortOrder = useDisplayStore((state) => state.sortOrder);
  const toggleSortOrder = useDisplayStore((state) => state.toggleSortOrder);
  const filterType = useDisplayStore((state) => state.filterType);
  const setFilterType = useDisplayStore((state) => state.setFilterType);
  const searchQuery = useDisplayStore((state) => state.searchQuery);
  const selectedItems = useDisplayStore((state) => state.selectedItems);
  const contextMenu = useDisplayStore((state) => state.contextMenu);
  const _handleItemClick = useDisplayStore((state) => state.handleItemClick);
  const handleSearch = useDisplayStore((state) => state.handleSearch);
  const _handleItemContextMenu = useDisplayStore(
    (state) => state.handleItemContextMenu
  );
  const handleCloseContextMenu = useDisplayStore(
    (state) => state.handleCloseContextMenu
  );

  // Adapters for component prop types

  // Convert Zustand's sortBy "modified" to FileControls' "date"
  const adaptedSortBy = React.useMemo(() => {
    return sortBy === "modified" ? "date" : sortBy;
  }, [sortBy]);

  // Wrapper for setSortBy to convert FileControls' "date" to Zustand's "modified"
  const adaptedSetSortBy = React.useCallback(
    (sort: "name" | "size" | "type" | "date") => {
      const convertedSort = sort === "date" ? "modified" : sort;
      // Only pass valid sort options
      if (
        convertedSort === "name" ||
        convertedSort === "size" ||
        convertedSort === "type" ||
        convertedSort === "modified"
      ) {
        setSortBy(convertedSort);
      }
    },
    [setSortBy]
  );

  // Adapter for filterType
  const adaptedSetFilterType = React.useCallback(
    (type: string) => {
      // Only set if it's a valid filter type
      if (["all", "folders", "images", "documents", "media"].includes(type)) {
        setFilterType(
          type as "all" | "folders" | "images" | "documents" | "media"
        );
      }
    },
    [setFilterType]
  );

  // Wrapper for handleItemClick to match component's expected parameter order
  const handleItemClick = React.useCallback(
    (e: React.MouseEvent, id: string) => {
      _handleItemClick(id, e.ctrlKey || e.metaKey);
    },
    [_handleItemClick]
  );

  // Wrapper for handleItemContextMenu to match component's expected parameter order
  const handleItemContextMenu = React.useCallback(
    (e: React.MouseEvent, type: "file" | "folder", id: string) => {
      _handleItemContextMenu(e, id, type);
    },
    [_handleItemContextMenu]
  );

  // Wrapper for getFileTypeIcon to match expected parameter type
  const adaptedGetFileTypeIcon = React.useCallback(
    (fileType: string): React.ReactNode => {
      return <FileIcon fileType={fileType as FileType} />;
    },
    []
  );

  // Async wrapper for handleFileUpload
  const asyncHandleFileUpload = React.useCallback(
    async (files: File[]) => {
      handleFileUpload(files);
      return Promise.resolve();
    },
    [handleFileUpload]
  );

  // Process items based on current filters, sorting, and search
  const items = React.useMemo(() => {
    // Start with all items
    let filteredItems = [
      ...folders.filter((folder) => folder.path === currentPath),
      ...files.filter((file) => file.path === currentPath),
    ];

    // Apply search filter if query exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredItems = filteredItems.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      if (filterType === "folders") {
        filteredItems = filteredItems.filter((item) => item.type === "folder");
      } else if (filterType === "images") {
        filteredItems = filteredItems.filter(
          (item) =>
            item.type === "image" || item.type === "png" || item.type === "jpg"
        );
      } else if (filterType === "documents") {
        filteredItems = filteredItems.filter(
          (item) =>
            item.type === "pdf" ||
            item.type === "doc" ||
            item.type === "docx" ||
            item.type === "txt"
        );
      } else if (filterType === "media") {
        filteredItems = filteredItems.filter(
          (item) => item.type === "video" || item.type === "audio"
        );
      }
    }

    // Apply sorting
    filteredItems.sort((a, b) => {
      // Always sort folders before files
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;

      // Apply specified sort
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      if (sortBy === "size") {
        const aSize = a.type === "folder" ? 0 : (a as FileItem).size;
        const bSize = b.type === "folder" ? 0 : (b as FileItem).size;
        return sortOrder === "asc" ? aSize - bSize : bSize - aSize;
      }

      if (sortBy === "modified") {
        const aDate = new Date(a.lastModified).getTime();
        const bDate = new Date(b.lastModified).getTime();
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }

      if (sortBy === "type") {
        return sortOrder === "asc"
          ? String(a.type).localeCompare(String(b.type))
          : String(b.type).localeCompare(String(a.type));
      }

      return 0;
    });

    return filteredItems;
  }, [files, folders, currentPath, searchQuery, filterType, sortBy, sortOrder]);

  // Empty state render
  const renderEmptyState = () => (
    <EmptyState
      title="No items found"
      description={
        searchQuery
          ? "Try a different search term"
          : "Upload files or create a folder to get started"
      }
      icon={<FaFileUpload size={48} />}
      actionLabel={searchQuery ? "Clear Search" : "Upload Files"}
      onAction={searchQuery ? () => handleSearch("") : openUploadModal}
    />
  );

  // Folder click handler with correct context
  const handleFolderClickWithContext = (id: string) => {
    handleFolderClick(id, folders);
  };

  // Get context menu items based on type
  function getContextMenuItems(type: "file" | "folder", id: string) {
    if (type === "file") {
      return [
        {
          id: "open",
          label: "Open",
          icon: <FaFileUpload />,
          onClick: () => console.log(`Opening file ${id}`),
        },
        {
          id: "download",
          label: "Download",
          icon: <FaFileUpload />,
          onClick: () => console.log(`Downloading file ${id}`),
        },
        {
          id: "share",
          label: "Share",
          icon: <FaFileUpload />,
          onClick: () => handleShareFile(id),
          divider: true,
        },
        {
          id: "rename",
          label: "Rename",
          icon: <FaFileUpload />,
          onClick: () => console.log(`Renaming file ${id}`),
        },
        {
          id: "delete",
          label: "Delete",
          icon: <FaFileUpload />,
          onClick: () => handleDeleteItem(id, "file"),
          danger: true,
        },
      ];
    } else {
      return [
        {
          id: "open",
          label: "Open",
          icon: <FaFileUpload />,
          onClick: () => handleFolderClickWithContext(id),
        },
        {
          id: "share",
          label: "Share",
          icon: <FaFileUpload />,
          onClick: () => console.log(`Sharing folder ${id}`),
          divider: true,
        },
        {
          id: "rename",
          label: "Rename",
          icon: <FaFileUpload />,
          onClick: () => console.log(`Renaming folder ${id}`),
        },
        {
          id: "delete",
          label: "Delete",
          icon: <FaFileUpload />,
          onClick: () => handleDeleteItem(id, "folder"),
          danger: true,
        },
      ];
    }
  }

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-dark-surface flex">
      {/* Sidebar */}
      <Sidebar
        userName={userDetails.name}
        usedStorage={userDetails.usedStorage}
        totalStorage={userDetails.totalStorage}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <DriveHeader
          onNewFolder={openNewFolderModal}
          onUploadFile={openUploadModal}
          onSearch={handleSearch}
        />

        <main className="flex-1 p-6">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbs} onNavigate={handleNavigate} />
          </div>

          {/* File Controls */}
          <FileControls
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={adaptedSortBy}
            setSortBy={adaptedSetSortBy}
            sortOrder={sortOrder}
            toggleSortOrder={toggleSortOrder}
            filterType={filterType}
            setFilterType={adaptedSetFilterType}
            breadcrumbs={breadcrumbs}
          />

          {/* File Display */}
          {items.length > 0 ? (
            viewMode === "list" ? (
              <FileListView
                items={items}
                selectedItems={selectedItems}
                handleItemClick={handleItemClick}
                handleItemContextMenu={handleItemContextMenu}
                handleFolderClick={handleFolderClickWithContext}
                handleShareFile={handleShareFile}
                handleDeleteItem={handleDeleteItem}
                getFileTypeIcon={adaptedGetFileTypeIcon}
              />
            ) : (
              <FileGridView
                items={items}
                selectedItems={selectedItems}
                handleItemClick={handleItemClick}
                handleItemContextMenu={handleItemContextMenu}
                handleFolderClick={handleFolderClickWithContext}
                handleShareFile={handleShareFile}
                handleDeleteItem={handleDeleteItem}
                getFileTypeIcon={adaptedGetFileTypeIcon}
              />
            )
          ) : (
            renderEmptyState()
          )}
        </main>
      </div>

      {/* Modals */}
      {fileToShare && (
        <FileShareModal
          isOpen={isShareModalOpen}
          onClose={closeShareModal}
          fileName={fileToShare.name}
          onShare={(email, permission) => {
            console.log(
              `Sharing ${fileToShare.name} with ${email}, permission: ${permission}`
            );
            closeShareModal();
          }}
        />
      )}

      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onClose={closeNewFolderModal}
        onCreateFolder={handleCreateFolder}
        existingFolderNames={getCurrentFolderNames()}
        currentPath={currentPath}
      />

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        onUpload={asyncHandleFileUpload}
        currentPath={currentPath}
        allowedFileTypes={[
          "jpg",
          "jpeg",
          "png",
          "pdf",
          "doc",
          "docx",
          "mp3",
          "mp4",
        ]}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          position={contextMenu.position}
          items={getContextMenuItems(contextMenu.type, contextMenu.id)}
          onClose={handleCloseContextMenu}
        />
      )}
    </div>
  );
}
