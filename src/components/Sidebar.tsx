"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaFolder,
  FaFolderOpen,
  FaShareAlt,
  FaTrash,
  FaStar,
  FaClock,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import { StorageUsageBar } from "./StorageUsageBar";
import { useState } from "react";

type SidebarProps = {
  userName: string;
  usedStorage: number;
  totalStorage: number;
};

export function Sidebar({ userName, usedStorage, totalStorage }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      name: "My Files",
      icon: FaFolder,
      activeIcon: FaFolderOpen,
      path: "/dashboard",
    },
    {
      name: "Shared",
      icon: FaShareAlt,
      activeIcon: FaShareAlt,
      path: "/dashboard/shared",
    },
    {
      name: "Starred",
      icon: FaStar,
      activeIcon: FaStar,
      path: "/dashboard/starred",
    },
    {
      name: "Recent",
      icon: FaClock,
      activeIcon: FaClock,
      path: "/dashboard/recent",
    },
    {
      name: "Trash",
      icon: FaTrash,
      activeIcon: FaTrash,
      path: "/dashboard/trash",
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-20 rounded-full bg-primary-500 text-white p-3 shadow-lg md:hidden"
      >
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed md:sticky top-0 h-screen bg-white dark:bg-dark-surface shadow-lg z-10 overflow-y-auto
          ${isMobileOpen ? "left-0" : "-left-72"} 
          md:left-0 transition-all duration-300 w-64 p-6
        `}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo and User */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-6">
              FileDrive
            </h2>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-gray-800 dark:text-white">
                  {userName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Free Account
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                const Icon = active ? item.activeIcon : item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={`
                        flex items-center space-x-3 px-3 py-2.5 rounded-lg
                        ${
                          active
                            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface-light"
                        }
                        transition-colors
                      `}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Icon
                        className={`${
                          active
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                      <span>{item.name}</span>
                      {active && (
                        <motion.div
                          layoutId="activeNavIndicator"
                          className="absolute right-0 w-1 h-6 bg-primary-600 dark:bg-primary-400 rounded-l-md"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Storage Usage */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-dark-border">
            <StorageUsageBar
              usedStorage={usedStorage}
              totalStorage={totalStorage}
            />
          </div>
        </div>
      </motion.aside>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-0 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
