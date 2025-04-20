"use client";

import { useState, useCallback } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

type DropzoneProps = {
  onFilesDropped: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxSizeMB?: number;
};

export default function Dropzone({
  onFilesDropped,
  acceptedFileTypes = ["image/*", "application/pdf", ".docx", ".xlsx", ".zip"],
  maxSizeMB = 10,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragError(null);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) {
        setIsDragging(true);
      }
    },
    [isDragging]
  );

  const validateFiles = useCallback(
    (files: FileList | File[]): File[] => {
      const validFiles: File[] = [];
      const fileList = Array.from(files);

      for (const file of fileList) {
        // Check file size
        if (file.size > maxSizeBytes) {
          setDragError(
            `File ${file.name} exceeds the maximum size of ${maxSizeMB}MB`
          );
          continue;
        }

        // Check file type if acceptedFileTypes is provided
        if (acceptedFileTypes.length > 0) {
          const fileType = file.type;
          const fileExtension = `.${file.name.split(".").pop()}`;

          const isAccepted = acceptedFileTypes.some((type) => {
            if (type.startsWith(".")) {
              // Check extension
              return fileExtension.toLowerCase() === type.toLowerCase();
            } else if (type.includes("*")) {
              // Check mime type pattern (e.g., image/*)
              const [category] = type.split("/");
              return fileType.startsWith(`${category}/`);
            } else {
              // Check exact mime type
              return fileType === type;
            }
          });

          if (!isAccepted) {
            setDragError(`File ${file.name} has an unsupported file type`);
            continue;
          }
        }

        validFiles.push(file);
      }

      return validFiles;
    },
    [acceptedFileTypes, maxSizeBytes, maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const { files } = e.dataTransfer;
      if (!files || files.length === 0) return;

      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        onFilesDropped(validFiles);
        setDragError(null);
      }
    },
    [onFilesDropped, validateFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;
      if (!files || files.length === 0) return;

      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        onFilesDropped(validFiles);
        setDragError(null);
      }

      // Reset the input value so the same file can be uploaded again if needed
      e.target.value = "";
    },
    [onFilesDropped, validateFiles]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
        isDragging
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : dragError
          ? "border-red-400 bg-red-50 dark:bg-red-900/20"
          : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label className="w-full h-full flex flex-col items-center cursor-pointer">
        <CloudArrowUpIcon
          className={`h-12 w-12 mb-3 ${
            isDragging
              ? "text-blue-500"
              : dragError
              ? "text-red-500"
              : "text-gray-400"
          }`}
          aria-hidden="true"
        />

        <div className="text-center">
          {dragError ? (
            <p className="text-sm text-red-500 font-medium mb-1">{dragError}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {isDragging ? "Drop files here" : "Drag and drop files here"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                or{" "}
                <span className="text-blue-600 dark:text-blue-400">browse</span>{" "}
                from your computer
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Supported file types: {acceptedFileTypes.join(", ")}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Maximum file size: {maxSizeMB}MB
              </p>
            </>
          )}
        </div>

        <input
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          multiple
          accept={acceptedFileTypes.join(",")}
        />
      </label>
    </div>
  );
}
