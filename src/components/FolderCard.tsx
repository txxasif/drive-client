"use client";

import { motion } from "framer-motion";
import { FaFolder } from "react-icons/fa";

type FolderCardProps = {
  name: string;
  count: number;
  onClick?: () => void;
};

export function FolderCard({ name, count, onClick }: FolderCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.04,
        boxShadow: "0 4px 24px 0 rgba(2,132,199,0.10)",
      }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer bg-white rounded-lg shadow p-4 flex flex-col items-center border border-primary-100 transition"
      onClick={onClick}
    >
      <div className="bg-primary-100 text-primary-600 rounded-full p-3 mb-2">
        <FaFolder className="w-7 h-7" />
      </div>
      <div className="font-semibold text-primary-700">{name}</div>
      <div className="text-xs text-primary-500">{count} items</div>
    </motion.div>
  );
}
