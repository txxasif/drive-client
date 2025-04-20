"use client";

import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaFileImage,
  FaFilePdf,
  FaFileAudio,
  FaFileVideo,
  FaShareAlt,
  FaTrash,
} from "react-icons/fa";
import { useState } from "react";

const iconMap = {
  image: FaFileImage,
  video: FaFileVideo,
  pdf: FaFilePdf,
  document: FaFileAlt,
  audio: FaFileAudio,
  other: FaFileAlt,
};

type FileType = "image" | "video" | "pdf" | "document" | "audio" | "other";

type FileCardProps = {
  id: string;
  name: string;
  type: FileType;
  size: string;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function FileCard({
  id,
  name,
  type,
  size,
  onShare,
  onDelete,
}: FileCardProps) {
  const [showActions, setShowActions] = useState(false);
  const Icon = iconMap[type] || FaFileAlt;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow p-4 flex flex-col relative border border-primary-50 hover:border-primary-200 transition-all"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="bg-primary-100 text-primary-600 rounded-full p-3 mb-2 mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <div className="font-medium text-primary-800 text-center truncate max-w-full px-2">
        {name}
      </div>
      <div className="text-xs text-primary-500 text-center mt-1">{size}</div>

      {/* Action buttons */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 right-2 flex space-x-1"
        >
          {onShare && (
            <button
              onClick={() => onShare(id)}
              className="bg-primary-50 hover:bg-primary-100 p-1.5 rounded-full text-primary-600"
            >
              <FaShareAlt className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="bg-red-50 hover:bg-red-100 p-1.5 rounded-full text-red-500"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
