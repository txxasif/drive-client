import { FileType } from "../types/files";

/**
 * Parse size strings like "1.2 MB" to bytes for comparison
 */
export const parseSizeString = (sizeStr: string): number => {
  const [value, unit] = sizeStr.split(" ");
  const numValue = parseFloat(value);

  switch (unit) {
    case "KB":
      return numValue * 1024;
    case "MB":
      return numValue * 1024 * 1024;
    case "GB":
      return numValue * 1024 * 1024 * 1024;
    case "TB":
      return numValue * 1024 * 1024 * 1024 * 1024;
    default:
      return numValue;
  }
};

/**
 * Format file size from bytes to human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Determine file type from extension
 */
export const getFileTypeFromExtension = (extension: string): FileType => {
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
    return "image";
  } else if (["pdf"].includes(extension)) {
    return "pdf";
  } else if (["mp3", "wav", "ogg"].includes(extension)) {
    return "audio";
  } else if (["mp4", "webm", "mov"].includes(extension)) {
    return "video";
  } else if (
    ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt"].includes(extension)
  ) {
    return "document";
  }
  return "other";
};

/**
 * Get file type icon color
 */
export const getFileTypeColor = (fileType: FileType): string => {
  switch (fileType) {
    case "image":
      return "text-blue-500";
    case "video":
      return "text-green-500";
    case "audio":
      return "text-purple-500";
    case "pdf":
      return "text-red-500";
    case "document":
      return "text-orange-500";
    default:
      return "text-gray-500";
  }
};
