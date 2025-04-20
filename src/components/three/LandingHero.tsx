"use client";

import React from "react";
import { motion } from "framer-motion";
import ThreeScene from "./ThreeScene";
import { Icon, IconName } from "../elements/Icon";
import { useTheme } from "../../context/ThemeContext";

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

// Feature card component following SRP
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: IconName;
  title: string;
  description: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`p-6 rounded-xl ${
        isDark
          ? "bg-dark-surface-elevated border border-dark-border hover:border-dark-border-light"
          : "bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow"
      } transition-all duration-300`}
      variants={itemVariants}
      whileHover={{ y: -5 }}
    >
      <div className="mb-4 text-primary-500">
        <Icon name={icon} size="lg" />
      </div>
      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
}

// Fully responsive hero section with animated content (LSP - inherits base React component behavior)
export default function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white dark:from-dark-surface/50 dark:to-dark-surface z-0"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text content */}
          <motion.div
            className="mt-10 lg:mt-0 lg:pr-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 mb-4">
                Next Generation File Storage
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
              variants={itemVariants}
            >
              Store, Share, <br />
              <span className="text-primary-600 dark:text-primary-400">
                Collaborate
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl"
              variants={itemVariants}
            >
              The secure cloud storage platform designed for professionals with
              powerful file management and seamless collaboration tools.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <a
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                Get Started
                <Icon name="arrow-right" size="sm" className="ml-2" />
              </a>

              <a
                href="#features"
                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                Learn More
                <Icon name="chevron-down" size="sm" className="ml-2" />
              </a>
            </motion.div>
          </motion.div>

          {/* 3D Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.5,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="relative mt-12 lg:mt-0 z-10"
          >
            <ThreeScene />
          </motion.div>
        </div>

        {/* Feature cards */}
        <motion.div
          id="features"
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <FeatureCard
            icon="folder"
            title="Intelligent Organization"
            description="AI-powered file organization that learns from your behavior to create a personalized experience."
          />

          <FeatureCard
            icon="shield"
            title="Enterprise Security"
            description="Bank-level encryption and multi-factor authentication to keep your files secure and private."
          />

          <FeatureCard
            icon="share"
            title="Seamless Collaboration"
            description="Real-time collaboration with team members, clients, and partners with granular permissions."
          />
        </motion.div>
      </div>
    </section>
  );
}
