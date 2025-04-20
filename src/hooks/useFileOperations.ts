import { useCallback, useState } from "react";
import { FileItem, FolderItem } from "../types/files";
import { getFileTypeFromExtension } from "../utils/fileUtils";

export function useFileOperations(
  initialFiles: FileItem[],
  initialFolders: FolderItem[]
) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders);
  const [fileToShare, setFileToShare] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Handle file upload
  const handleFileUpload = useCallback(async (uploadedFiles: File[]) => {
    // In a real app, this would be an API call to upload the files
    // Simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create new file entries
    const newFiles: FileItem[] = uploadedFiles.map((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      const fileType = getFileTypeFromExtension(extension);

      return {
        id: `file${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: "file",
        fileType,
        size: file.size,
        path: "/", // Add current path
        lastModified: new Date().toISOString(), // Replace modifiedDate with lastModified
      };
    });

    // Update files state
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  // Handle file share
  const handleShareFile = useCallback(
    (fileId: string) => {
      const file = files.find((f) => f.id === fileId);
      if (file) {
        setFileToShare({ id: file.id, name: file.name });
        setIsShareModalOpen(true);
      }
    },
    [files]
  );

  // Handle delete item (file or folder)
  const handleDeleteItem = useCallback(
    (id: string, itemType: "file" | "folder") => {
      if (itemType === "file") {
        setFiles((prev) => prev.filter((file) => file.id !== id));
      } else {
        setFolders((prev) => prev.filter((folder) => folder.id !== id));
      }
      console.log(`${itemType} deleted: ${id}`);
    },
    []
  );

  // Handle create folder
  const handleCreateFolder = useCallback((folderName: string) => {
    // In a real app, this would be an API call
    const newFolder: FolderItem = {
      id: `f${Date.now()}`, // Generate a unique ID
      name: folderName,
      type: "folder",
      path: "/", // Add path property
      lastModified: new Date().toISOString(), // Use lastModified instead
    };

    // Update the folders state
    setFolders((prev) => [...prev, newFolder]);
    console.log(`Folder "${folderName}" created successfully`);
    return newFolder;
  }, []);

  // Modal controls
  const openNewFolderModal = useCallback(
    () => setIsNewFolderModalOpen(true),
    []
  );
  const closeNewFolderModal = useCallback(
    () => setIsNewFolderModalOpen(false),
    []
  );
  const openUploadModal = useCallback(() => setIsUploadModalOpen(true), []);
  const closeUploadModal = useCallback(() => setIsUploadModalOpen(false), []);
  const closeShareModal = useCallback(() => {
    setIsShareModalOpen(false);
    setFileToShare(null);
  }, []);

  // Get folder names for validation
  const getCurrentFolderNames = useCallback(() => {
    return folders.map((folder) => folder.name);
  }, [folders]);

  return {
    files,
    folders,
    fileToShare,
    isShareModalOpen,
    isNewFolderModalOpen,
    isUploadModalOpen,
    handleFileUpload,
    handleShareFile,
    handleDeleteItem,
    handleCreateFolder,
    openNewFolderModal,
    closeNewFolderModal,
    openUploadModal,
    closeUploadModal,
    closeShareModal,
    getCurrentFolderNames,
  };
}
