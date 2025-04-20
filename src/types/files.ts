export type FileType =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "doc"
  | "docx"
  | "txt"
  | "folder"
  | "png"
  | "jpg"
  | string;

export interface BaseItem {
  id: string;
  name: string;
  path: string;
  lastModified: string;
  type: FileType;
}

export interface FileItem extends BaseItem {
  size: number;
  type: Exclude<FileType, "folder">;
  fileType: string;
}

export interface FolderItem extends BaseItem {
  type: "folder";
  count?: number;
}

export type Item = FileItem | FolderItem;

export interface FileShare {
  id: string;
  fileId: string;
  email: string;
  permission: "view" | "edit" | "admin";
  dateShared: string;
}

export interface UserDetails {
  name: string;
  usedStorage: number;
  totalStorage: number;
}

export interface ContextMenuState {
  position: { x: number; y: number };
  type: "file" | "folder";
  id: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}
