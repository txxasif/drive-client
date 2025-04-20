import { useCallback } from "react";
import { mockFiles, mockFolders } from "../data/mockData";
import { FileService, MockFileService } from "../services/fileService";
import { useFileStore } from "../stores/fileStore";

/**
 * This hook connects the file service with the zustand store
 * It follows the Dependency Inversion Principle by accepting any implementation of FileService
 * This allows for easy testing and switching between real and mock implementations
 */
export const useFileService = (
  fileService: FileService = new MockFileService(mockFiles, mockFolders)
) => {
  const currentPath = useFileStore((state) => state.currentPath);
  const setFiles = useFileStore((state) => state.setFiles);
  const setFolders = useFileStore((state) => state.setFolders);
  const addFiles = useFileStore((state) => state.addFiles);
  const addFolder = useFileStore((state) => state.addFolder);
  const removeFile = useFileStore((state) => state.removeFile);
  const removeFolder = useFileStore((state) => state.removeFolder);
  const setFileToShare = useFileStore((state) => state.setFileToShare);

  // Load files and folders for the current path
  const loadCurrentPathItems = useCallback(async () => {
    try {
      const [files, folders] = await Promise.all([
        fileService.getFiles(currentPath),
        fileService.getFolders(currentPath),
      ]);

      setFiles(files);
      setFolders(folders);
      return { files, folders };
    } catch (error) {
      console.error("Error loading files and folders:", error);
      return { files: [], folders: [] };
    }
  }, [currentPath, fileService, setFiles, setFolders]);

  // Upload files
  const uploadFiles = useCallback(
    async (files: File[]) => {
      try {
        const uploadedFiles = await fileService.uploadFiles(files, currentPath);
        addFiles(uploadedFiles);
        return uploadedFiles;
      } catch (error) {
        console.error("Error uploading files:", error);
        return [];
      }
    },
    [currentPath, fileService, addFiles]
  );

  // Create folder
  const createFolder = useCallback(
    async (name: string) => {
      try {
        const newFolder = await fileService.createFolder(name, currentPath);
        addFolder(newFolder);
        return newFolder;
      } catch (error) {
        console.error("Error creating folder:", error);
        return null;
      }
    },
    [currentPath, fileService, addFolder]
  );

  // Delete item
  const deleteItem = useCallback(
    async (id: string, type: "file" | "folder") => {
      try {
        let success: boolean;

        if (type === "file") {
          success = await fileService.deleteFile(id);
          if (success) removeFile(id);
        } else {
          success = await fileService.deleteFolder(id);
          if (success) removeFolder(id);
        }

        return success;
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        return false;
      }
    },
    [fileService, removeFile, removeFolder]
  );

  // Share file
  const shareFile = useCallback(
    async (
      id: string,
      email: string,
      permission: "view" | "edit" | "admin"
    ) => {
      try {
        await fileService.shareFile(id, email, permission);
        return true;
      } catch (error) {
        console.error("Error sharing file:", error);
        return false;
      }
    },
    [fileService]
  );

  // Get file for sharing UI
  const prepareFileForSharing = useCallback(
    async (id: string) => {
      try {
        const file = await fileService.getFileById(id);
        setFileToShare(file);
        return file;
      } catch (error) {
        console.error("Error preparing file for sharing:", error);
        return null;
      }
    },
    [fileService, setFileToShare]
  );

  return {
    loadCurrentPathItems,
    uploadFiles,
    createFolder,
    deleteItem,
    shareFile,
    prepareFileForSharing,
  };
};
