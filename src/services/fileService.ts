import { FileItem, FolderItem } from "../types/files";

/**
 * Interface for file operations
 * Following the Dependency Inversion Principle, high-level modules
 * should depend on abstractions rather than concrete implementations
 */
export interface FileService {
  getFiles(path: string): Promise<FileItem[]>;
  getFolders(path: string): Promise<FolderItem[]>;
  uploadFile(file: File, path: string): Promise<FileItem>;
  uploadFiles(files: File[], path: string): Promise<FileItem[]>;
  deleteFile(id: string): Promise<boolean>;
  deleteFolder(id: string): Promise<boolean>;
  createFolder(name: string, path: string): Promise<FolderItem>;
  getFileById(id: string): Promise<FileItem | null>;
  renameItem(
    id: string,
    newName: string,
    type: "file" | "folder"
  ): Promise<void>;
  moveItem(id: string, newPath: string, type: "file" | "folder"): Promise<void>;
  shareFile(
    id: string,
    email: string,
    permission: "view" | "edit" | "admin"
  ): Promise<void>;
}

/**
 * Mock implementation of the FileService
 * This can be replaced with a real API implementation without changing consuming code
 */
export class MockFileService implements FileService {
  private files: FileItem[];
  private folders: FolderItem[];

  constructor(
    initialFiles: FileItem[] = [],
    initialFolders: FolderItem[] = []
  ) {
    this.files = [...initialFiles];
    this.folders = [...initialFolders];
  }

  async getFiles(path: string): Promise<FileItem[]> {
    return this.files.filter((file) => file.path === path);
  }

  async getFolders(path: string): Promise<FolderItem[]> {
    return this.folders.filter((folder) => folder.path === path);
  }

  async uploadFile(file: File, path: string): Promise<FileItem> {
    const fileType = this.getFileTypeFromMime(file.type);
    const newFile: FileItem = {
      id: crypto.randomUUID(),
      name: file.name,
      type: fileType,
      fileType: fileType,
      size: file.size,
      path,
      lastModified: new Date().toISOString(),
    };

    this.files.push(newFile);
    return newFile;
  }

  async uploadFiles(files: File[], path: string): Promise<FileItem[]> {
    const uploadedFiles: FileItem[] = [];

    for (const file of files) {
      const uploadedFile = await this.uploadFile(file, path);
      uploadedFiles.push(uploadedFile);
    }

    return uploadedFiles;
  }

  async deleteFile(id: string): Promise<boolean> {
    const initialLength = this.files.length;
    this.files = this.files.filter((file) => file.id !== id);
    return initialLength > this.files.length;
  }

  async deleteFolder(id: string): Promise<boolean> {
    const initialLength = this.folders.length;
    this.folders = this.folders.filter((folder) => folder.id !== id);
    return initialLength > this.folders.length;
  }

  async createFolder(name: string, path: string): Promise<FolderItem> {
    const newFolder: FolderItem = {
      id: crypto.randomUUID(),
      name,
      type: "folder",
      path,
      lastModified: new Date().toISOString(),
    };

    this.folders.push(newFolder);
    return newFolder;
  }

  async getFileById(id: string): Promise<FileItem | null> {
    return this.files.find((file) => file.id === id) || null;
  }

  async renameItem(
    id: string,
    newName: string,
    type: "file" | "folder"
  ): Promise<void> {
    if (type === "file") {
      const fileIndex = this.files.findIndex((file) => file.id === id);
      if (fileIndex >= 0) {
        this.files[fileIndex] = { ...this.files[fileIndex], name: newName };
      }
    } else {
      const folderIndex = this.folders.findIndex((folder) => folder.id === id);
      if (folderIndex >= 0) {
        this.folders[folderIndex] = {
          ...this.folders[folderIndex],
          name: newName,
        };
      }
    }
  }

  async moveItem(
    id: string,
    newPath: string,
    type: "file" | "folder"
  ): Promise<void> {
    if (type === "file") {
      const fileIndex = this.files.findIndex((file) => file.id === id);
      if (fileIndex >= 0) {
        this.files[fileIndex] = { ...this.files[fileIndex], path: newPath };
      }
    } else {
      const folderIndex = this.folders.findIndex((folder) => folder.id === id);
      if (folderIndex >= 0) {
        this.folders[folderIndex] = {
          ...this.folders[folderIndex],
          path: newPath,
        };
      }
    }
  }

  async shareFile(
    id: string,
    email: string,
    permission: "view" | "edit" | "admin"
  ): Promise<void> {
    // In a real implementation, this would create a share record
    console.log(
      `Shared file ${id} with ${email} with ${permission} permissions`
    );
  }

  // Helper methods
  private getFileTypeFromMime(mimeType: string): string {
    const mainType = mimeType.split("/")[0];
    const subType = mimeType.split("/")[1];

    if (mainType === "image") return subType || "image";
    if (mainType === "video") return "video";
    if (mainType === "audio") return "audio";
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.includes("word") || mimeType.includes("document"))
      return "doc";
    if (mimeType.includes("text")) return "txt";

    return mainType;
  }
}
