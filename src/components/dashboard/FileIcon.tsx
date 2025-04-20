"use client";

import React from "react";
import { FaFileUpload } from "react-icons/fa";
import { getFileTypeColor } from "../../utils/fileUtils";
import { FileType } from "../../types/files";

interface FileIconProps {
  fileType: FileType;
  size?: "sm" | "md" | "lg";
}

export default function FileIcon({ fileType, size = "md" }: FileIconProps) {
  const colorClass = getFileTypeColor(fileType);

  const sizeClass = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  }[size];

  return <FaFileUpload className={`${colorClass} ${sizeClass}`} />;
}
