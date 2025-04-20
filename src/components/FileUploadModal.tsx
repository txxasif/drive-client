"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaCloudUploadAlt,
  FaFile,
  FaFileImage,
  FaFilePdf,
  FaFileAudio,
  FaFileVideo,
} from "react-icons/fa";
import { Button } from "./ui/button";

type FileUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<void>;
  currentPath: string;
  allowedFileTypes?: string[];
  maxFileSize?: number; // in bytes
};

export function FileUploadModal({
  isOpen,
  onClose,
  onUpload,
  currentPath,
  allowedFileTypes = [],
  maxFileSize = 100 * 1024 * 1024, // 100MB default
}: FileUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Validate file type and size
  const validateFile = (file: File): string | null => {
    // Size validation
    if (file.size > maxFileSize) {
      return `File too large: ${file.name} exceeds the ${formatFileSize(
        maxFileSize
      )} limit`;
    }

    // Type validation (if allowed types specified)
    if (allowedFileTypes.length > 0) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedFileTypes.includes(fileExtension)) {
        return `Invalid file type: ${fileExtension} is not allowed`;
      }
    }

    return null; // File is valid
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get icon based on file type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)) {
      return <FaFileImage className="text-blue-500" />;
    } else if (["pdf"].includes(extension)) {
      return <FaFilePdf className="text-red-500" />;
    } else if (["mp3", "wav", "ogg"].includes(extension)) {
      return <FaFileAudio className="text-purple-500" />;
    } else if (["mp4", "webm", "mov"].includes(extension)) {
      return <FaFileVideo className="text-green-500" />;
    } else {
      return <FaFile className="text-gray-500" />;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      processFiles(newFiles);
    }
  };

  const processFiles = (newFiles: File[]) => {
    setError("");

    // Validate each file
    for (const file of newFiles) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // All files are valid, add them to state
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles);
      }
    },
    [processFiles]
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      setError("Please select at least one file to upload");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // Simulate upload progress
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 10;
          if (progress > 100) {
            progress = 100;
            clearInterval(interval);
          }
          setUploadProgress(Math.floor(progress));
        }, 200);

        return interval;
      };

      const progressInterval = simulateProgress();

      // In a real app, you'd call an API to upload the files
      await onUpload(files);

      // Clear progress simulation
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Close modal after a brief delay to show 100% completion
      setTimeout(() => {
        onClose();
        setFiles([]);
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);
    } catch {
      setError("Upload failed. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 p-6 w-full max-w-lg max-h-[90vh] overflow-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                id="upload-modal-title"
                className="text-xl font-semibold text-gray-800"
              >
                Upload Files
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <div className="text-sm text-gray-500 mb-4">
              Upload to: {currentPath || "My Files"}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Drag and drop area */}
              <div
                ref={dropZoneRef}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-lg p-8 mb-4 text-center transition-colors
                  ${
                    isDragging
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-300 hover:border-primary-400"
                  }
                `}
                aria-describedby="dropzone-description"
              >
                <FaCloudUploadAlt className="mx-auto h-12 w-12 text-primary-500 mb-4" />
                <p
                  className="text-lg font-medium text-gray-700"
                  id="dropzone-description"
                >
                  Drag and drop files here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    browse files
                  </button>
                </p>
                {allowedFileTypes.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Allowed file types: {allowedFileTypes.join(", ")}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Maximum file size: {formatFileSize(maxFileSize)}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  aria-hidden="true"
                />
              </div>

              {/* Selected files list */}
              {files.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Files ({files.length})
                  </h3>
                  <ul className="max-h-40 overflow-y-auto">
                    {files.map((file, index) => (
                      <motion.li
                        key={`${file.name}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between py-2 px-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center overflow-hidden">
                          <div className="flex-shrink-0 mr-2">
                            {getFileIcon(file.name)}
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                          aria-label={`Remove ${file.name}`}
                          disabled={isUploading}
                        >
                          <FaTimes size={16} />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Upload progress */}
              {isUploading && (
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Uploading...
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="bg-primary-600 h-2.5 rounded-full"
                    ></motion.div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded-md"
                >
                  {error}
                </motion.div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-600 text-white hover:bg-primary-700"
                  disabled={files.length === 0 || isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload Files"}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
