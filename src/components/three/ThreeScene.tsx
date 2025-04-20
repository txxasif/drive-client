"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Box, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

// Single Responsibility: Floating object component
function FloatingObject({
  position,
  size,
  color,
  shape,
  rotationSpeed,
  floatSpeed,
  floatRange,
}: {
  position: [number, number, number];
  size: number;
  color: string;
  shape: "sphere" | "box" | "pill";
  rotationSpeed: number;
  floatSpeed: number;
  floatRange: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  // Animation loop using useFrame
  useFrame((_state, delta) => {
    if (!ref.current) return;

    // Rotate the object
    ref.current.rotation.x += delta * rotationSpeed * 0.5;
    ref.current.rotation.y += delta * rotationSpeed;

    // Apply floating motion using sin wave
    ref.current.position.y =
      initialY + Math.sin(_state.clock.elapsedTime * floatSpeed) * floatRange;
  });

  // Render different shapes based on the shape prop
  if (shape === "sphere") {
    return (
      <Sphere ref={ref} args={[size, 16, 16]} position={position}>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </Sphere>
    );
  } else if (shape === "box") {
    return (
      <Box ref={ref} args={[size, size, size]} position={position}>
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </Box>
    );
  } else if (shape === "pill") {
    // Create a pill shape using a stretched sphere
    return (
      <Sphere
        ref={ref}
        args={[size, 16, 16]}
        position={position}
        scale={[0.5, 1, 0.5]}
      >
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
      </Sphere>
    );
  }

  return null;
}

// Scene composition component (Open/Closed Principle - can add more objects without modifying core logic)
function SceneObjects() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Memoize the object configurations to prevent unnecessary re-renders
  const objects = useMemo(() => {
    // Define colors based on theme
    const primaryColor = isDark ? "#6366f1" : "#4f46e5"; // Indigo for primary
    const secondaryColor = isDark ? "#ec4899" : "#db2777"; // Pink for secondary
    const tertiaryColor = isDark ? "#06b6d4" : "#0891b2"; // Cyan for tertiary
    const quaternaryColor = isDark ? "#8b5cf6" : "#7c3aed"; // Purple for quaternary

    return [
      {
        position: [-2, 0, -2] as [number, number, number],
        size: 1.2,
        color: primaryColor,
        shape: "sphere" as const,
        rotationSpeed: 0.3,
        floatSpeed: 0.6,
        floatRange: 0.3,
      },
      {
        position: [2.5, 1, -3] as [number, number, number],
        size: 0.8,
        color: secondaryColor,
        shape: "box" as const,
        rotationSpeed: 0.5,
        floatSpeed: 0.7,
        floatRange: 0.2,
      },
      {
        position: [0, -1.5, -1] as [number, number, number],
        size: 0.6,
        color: tertiaryColor,
        shape: "pill" as const,
        rotationSpeed: 0.4,
        floatSpeed: 0.5,
        floatRange: 0.4,
      },
      {
        position: [-1.5, 2, -4] as [number, number, number],
        size: 0.9,
        color: quaternaryColor,
        shape: "sphere" as const,
        rotationSpeed: 0.3,
        floatSpeed: 0.8,
        floatRange: 0.25,
      },
      {
        position: [3, -0.5, -2] as [number, number, number],
        size: 0.7,
        color: primaryColor,
        shape: "pill" as const,
        rotationSpeed: 0.6,
        floatSpeed: 0.4,
        floatRange: 0.35,
      },
    ];
  }, [isDark]);

  return (
    <>
      {objects.map((obj, idx) => (
        <FloatingObject key={idx} {...obj} />
      ))}
      {/* Add ambient and point lights for better visuals */}
      <ambientLight intensity={isDark ? 0.3 : 0.5} />
      <pointLight position={[10, 10, 10]} intensity={isDark ? 0.8 : 1.2} />
      <pointLight
        position={[-10, -10, -5]}
        intensity={isDark ? 0.5 : 0.8}
        color={isDark ? "#2463eb" : "#3b82f6"}
      />
      <Environment preset={isDark ? "night" : "sunset"} />
    </>
  );
}

// Main Three.js scene container (Interface Segregation Principle - focused API)
export default function ThreeScene() {
  // Create a ref for the canvas container
  const containerRef = useRef<HTMLDivElement>(null);
  // Track component mount state
  const [isMounted, setIsMounted] = useState(false);

  // Make sure the scene stays mounted and doesn't disappear on reload
  useEffect(() => {
    // This ensures the component is properly initialized
    const container = containerRef.current;

    // Force the container to remain visible
    if (container) {
      container.style.visibility = "visible";
      container.style.opacity = "1";
    }

    // Set mounted state
    setIsMounted(true);

    // Prevent cleanup to ensure component stays mounted
    // Use a non-empty return function so React doesn't optimize it away
    return () => {
      // Intentionally left minimal to prevent unmounting side effects
      console.log("ThreeScene still mounted");
    };
  }, []);

  // Don't render until component is mounted
  if (!isMounted) {
    return (
      <div
        className="w-full h-[500px] md:h-[600px] relative bg-gray-100 dark:bg-dark-surface rounded-lg"
        style={{ minHeight: "400px" }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] md:h-[600px] relative"
      // Ensure the container is visible and properly sized
      style={{
        minHeight: "400px",
        zIndex: 10,
        position: "relative",
        visibility: "visible", // Ensure visibility in initial render
        opacity: 1, // Ensure opacity in initial render
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]} // Responsive performance scaling
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        // Add key to force recreation of the canvas and prevent disposal
        key="three-scene-canvas"
      >
        <SceneObjects />
      </Canvas>
    </div>
  );
}
