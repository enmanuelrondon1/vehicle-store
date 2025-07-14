
// src/components/shared/Navbar/components/ThemeToggle.tsx
"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useDarkMode } from "@/context/DarkModeContext";

interface ThemeToggleProps {
  isMobile?: boolean;
}

const ThemeToggle = ({ isMobile = false }: ThemeToggleProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const buttonClasses = useMemo(() => {
    if (isMobile) {
      return `w-full border transition-colors duration-200 ${
        isDarkMode
          ? "border-gray-600 hover:bg-gray-700 text-white"
          : "border-gray-300 hover:bg-gray-100 text-gray-900"
      }`;
    }
    return `${
      isDarkMode
        ? "text-white hover:bg-white/20"
        : "text-white hover:bg-white/20"
    } p-2 rounded-full transition-colors duration-200`;
  }, [isMobile, isDarkMode]);

  return (
    <Button
      variant={isMobile ? "outline" : "ghost"}
      size="sm"
      className={buttonClasses}
      onClick={toggleDarkMode}
      aria-label={`Cambiar a modo ${isDarkMode ? "claro" : "oscuro"}`}
    >
      <motion.div
        animate={{ rotate: isDarkMode ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.div>
      {isMobile && <span className="ml-2">{isDarkMode ? "Modo Claro" : "Modo Oscuro"}</span>}
    </Button>
  );
};

ThemeToggle.displayName = "ThemeToggle";
export default ThemeToggle;