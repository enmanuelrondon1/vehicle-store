// src/components/shared/Navbar/ThemeToggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.button
      className="relative p-2.5 rounded-full card-glass glow-effect group"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      whileHover={{ scale: 1.1, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Cambiar tema"
    >
      {/* Sol (visible en light mode) */}
      <motion.div
        className="relative"
        animate={{ rotate: theme === "light" ? 0 : 180, opacity: theme === "light" ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Sun className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        {/* Rayos del sol animados */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: 'var(--accent-10)' }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Luna (visible en dark mode) */}
      <motion.div
        className="absolute inset-2 flex items-center justify-center"
        animate={{ rotate: theme === "dark" ? 0 : -180, opacity: theme === "dark" ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Moon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
        {/* Efecto de brillo en la luna */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: 'var(--accent-20)' }}
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>

      {/* Efecto de pulse mejorado */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: 'var(--accent-10)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0, 0.3, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      {/* Indicador de tema actual */}
      <motion.div
        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
        style={{ backgroundColor: 'var(--accent)' }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  );
}