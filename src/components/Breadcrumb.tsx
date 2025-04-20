"use client";

import { Fragment } from "react";
import { FaChevronRight, FaHome } from "react-icons/fa";
import { motion } from "framer-motion";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
};

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <button
            onClick={() => onNavigate("/")}
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
          >
            <FaHome className="mr-2" />
            Home
          </button>
        </li>

        {items.map((item, index) => (
          <Fragment key={item.path}>
            <li className="flex items-center">
              <FaChevronRight className="text-gray-400 mx-1" size={10} />
            </li>
            <li>
              <motion.button
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onNavigate(item.path)}
                className={`text-sm font-medium transition-colors ${
                  index === items.length - 1
                    ? "text-gray-500 cursor-default"
                    : "text-primary-600 hover:text-primary-800"
                }`}
                disabled={index === items.length - 1}
              >
                {item.name}
              </motion.button>
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
