import { create } from "zustand";
import { mockFiles, mockFolders } from "../data/mockData";
import { FileItem, FileType, FolderItem } from "../types/files";

interface FileState {
  // Navigation state
  currentPath: string;
  breadcrumbs: { id: string; name: string; path: string }[];

  // File operation state
  files: FileItem[];
  folders: FolderItem[];
  fileToShare: FileItem | null;
  isShareModalOpen: boolean;
  isNewFolderModalOpen: boolean;
  isUploadModalOpen: boolean;

  // Direct state setters
  setFiles: (files: FileItem[]) => void;
  setFolders: (folders: FolderItem[]) => void;
  addFiles: (files: FileItem[]) => void;
  addFolder: (folder: FolderItem) => void;
  removeFile: (id: string) => void;
  removeFolder: (id: string) => void;
  setFileToShare: (file: FileItem | null) => void;

  // Actions
  setCurrentPath: (path: string) => void;
  setBreadcrumbs: (
    breadcrumbs: { id: string; name: string; path: string }[]
  ) => void;
  handleNavigate: (path: string) => void;
  handleFolderClick: (folderId: string, folderList: FolderItem[]) => void;
  handleFileUpload: (files: File[]) => void;
  handleShareFile: (fileId: string) => void;
  handleDeleteItem: (id: string, type: "file" | "folder") => void;
  handleCreateFolder: (name: string) => void;
  openNewFolderModal: () => void;
  closeNewFolderModal: () => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  closeShareModal: () => void;
  getCurrentFolderNames: () => string[];
}

export const useFileStore = create<FileState>((set, get) => ({
  // Initial state
  currentPath: "/",
  breadcrumbs: [{ id: "root", name: "My Drive", path: "/" }],
  files: mockFiles as FileItem[],
  folders: mockFolders as FolderItem[],
  fileToShare: null,
  isShareModalOpen: false,
  isNewFolderModalOpen: false,
  isUploadModalOpen: false,

  // Direct state setters
  setFiles: (files) => set({ files }),
  setFolders: (folders) => set({ folders }),

  addFiles: (newFiles) =>
    set((state) => ({
      files: [...state.files, ...newFiles],
    })),

  addFolder: (folder) =>
    set((state) => ({
      folders: [...state.folders, folder],
    })),

  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),

  removeFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
    })),

  setFileToShare: (file) => set({ fileToShare: file }),

  // Actions
  setCurrentPath: (path) => set({ currentPath: path }),

  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

  handleNavigate: (path) => {
    const { breadcrumbs } = get();
    const newBreadcrumbs = breadcrumbs.slice(
      0,
      breadcrumbs.findIndex((crumb) => crumb.path === path) + 1
    );

    set({
      currentPath: path,
      breadcrumbs: newBreadcrumbs,
    });
  },

  handleFolderClick: (folderId, folderList) => {
    const { currentPath, breadcrumbs } = get();
    const clickedFolder = folderList.find((folder) => folder.id === folderId);

    if (!clickedFolder) return;

    const newPath = `${currentPath === "/" ? "" : currentPath}/${
      clickedFolder.name
    }`;
    const newBreadcrumbs = [
      ...breadcrumbs,
      {
        id: clickedFolder.id,
        name: clickedFolder.name,
        path: newPath,
      },
    ];

    set({
      currentPath: newPath,
      breadcrumbs: newBreadcrumbs,
    });
  },

  handleFileUpload: (files) => {
    const { currentPath } = get();
    const newFiles = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type.split("/")[0] as FileType,
      size: file.size,
      lastModified: new Date().toISOString(),
      path: currentPath,
    }));

    set((state) => ({
      files: [...state.files, ...newFiles] as FileItem[],
      isUploadModalOpen: false,
    }));
  },

  handleShareFile: (fileId) => {
    const { files } = get();
    const fileToShare = files.find((file) => file.id === fileId) || null;

    set({
      fileToShare,
      isShareModalOpen: !!fileToShare,
    });
  },

  handleDeleteItem: (id, type) => {
    if (type === "file") {
      set((state) => ({
        files: state.files.filter((file) => file.id !== id),
      }));
    } else {
      set((state) => ({
        folders: state.folders.filter((folder) => folder.id !== id),
      }));
    }
  },

  handleCreateFolder: (name) => {
    const { currentPath, folders } = get();

    const newFolder: FolderItem = {
      id: crypto.randomUUID(),
      name,
      type: "folder",
      path: currentPath,
      lastModified: new Date().toISOString(),
    };

    set({
      folders: [...folders, newFolder],
      isNewFolderModalOpen: false,
    });
  },

  openNewFolderModal: () => set({ isNewFolderModalOpen: true }),

  closeNewFolderModal: () => set({ isNewFolderModalOpen: false }),

  openUploadModal: () => set({ isUploadModalOpen: true }),

  closeUploadModal: () => set({ isUploadModalOpen: false }),

  closeShareModal: () =>
    set({
      isShareModalOpen: false,
      fileToShare: null,
    }),

  getCurrentFolderNames: () => {
    const { currentPath, folders } = get();
    return folders
      .filter((folder) => folder.path === currentPath)
      .map((folder) => folder.name);
  },
}));
