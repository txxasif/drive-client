"use client";

import { useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Dropzone from "../elements/Dropzone";

// Define ProgressBar props type to fix import error
type ProgressBarProps = {
  value: number;
  status: "uploading" | "success" | "error";
};

// Create a temporary ProgressBar component while the import issue is resolved
const ProgressBar = ({ value, status }: ProgressBarProps) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
    <div
      className={`h-2.5 rounded-full ${
        status === "success"
          ? "bg-green-600 dark:bg-green-500"
          : status === "error"
          ? "bg-red-600 dark:bg-red-500"
          : "bg-blue-600 dark:bg-blue-500"
      }`}
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

type FileUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
};

type UploadingFile = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
};

export default function FileUploadModal({
  isOpen,
  onClose,
  onUploadComplete,
}: FileUploadModalProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  if (!isOpen) return null;

  const handleFileDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadingFiles((prev) => [...prev, ...newFiles]);
    setIsUploading(true);

    // Simulate upload progress for each file
    newFiles.forEach((fileInfo) => {
      simulateFileUpload(fileInfo);
    });
  };

  const simulateFileUpload = (fileInfo: UploadingFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setUploadingFiles((files) =>
          files.map((f) =>
            f.id === fileInfo.id
              ? { ...f, progress: 100, status: "success" }
              : f
          )
        );

        // Check if all files are done uploading
        const allDone = uploadingFiles.every((f) =>
          f.id === fileInfo.id
            ? true
            : f.status === "success" || f.status === "error"
        );

        if (allDone) {
          setIsUploading(false);
        }
      } else {
        setUploadingFiles((files) =>
          files.map((f) =>
            f.id === fileInfo.id ? { ...f, progress: Math.round(progress) } : f
          )
        );
      }
    }, 200);
  };

  const handleClose = () => {
    if (!isUploading) {
      onClose();
      // Reset state after modal is closed
      setTimeout(() => {
        setUploadingFiles([]);
      }, 300);
    }
  };

  const handleUploadComplete = () => {
    onUploadComplete();
    onClose();
    // Reset state after modal is closed
    setTimeout(() => {
      setUploadingFiles([]);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle dark:bg-gray-800">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-gray-800">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Upload Files
                  </h3>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none dark:bg-gray-800 dark:text-gray-500 dark:hover:text-gray-400"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4">
                  {uploadingFiles.length === 0 ? (
                    <Dropzone onFilesDropped={handleFileDrop} />
                  ) : (
                    <div className="space-y-4">
                      {uploadingFiles.map((file) => (
                        <div
                          key={file.id}
                          className="rounded-md border border-gray-200 p-3 dark:border-gray-700"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center max-w-[80%]">
                              <span className="block truncate text-sm font-medium text-gray-900 dark:text-white">
                                {file.name}
                              </span>
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                            {file.status === "success" && (
                              <CheckCircleIcon
                                className="h-5 w-5 text-green-500"
                                aria-hidden="true"
                              />
                            )}
                          </div>
                          <ProgressBar
                            value={file.progress}
                            status={file.status}
                          />
                          {file.error && (
                            <p className="mt-1 text-xs text-red-500">
                              {file.error}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-gray-700">
            {uploadingFiles.length > 0 &&
            uploadingFiles.every((file) => file.status === "success") ? (
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleUploadComplete}
              >
                Done
              </button>
            ) : (
              <button
                type="button"
                disabled={isUploading}
                className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={
                  uploadingFiles.length === 0 ? undefined : handleUploadComplete
                }
              >
                {isUploading ? "Uploading..." : "Upload More Files"}
              </button>
            )}
            <button
              type="button"
              className={`mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleClose}
              ref={cancelRef}
              disabled={isUploading}
            >
              {isUploading ? "Please wait..." : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
