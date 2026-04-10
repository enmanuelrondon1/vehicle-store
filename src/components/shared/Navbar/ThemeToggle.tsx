// src/components/shared/Navbar/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ✅ Solo renderizar en el cliente — evita hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Placeholder con las mismas dimensiones para evitar layout shift
    return (
      <div className="relative p-2.5 rounded-full card-glass w-10 h-10" aria-hidden="true" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      className="relative p-2.5 rounded-full card-glass glow-effect hover:scale-110 hover:rotate-12 active:scale-90 transition-all duration-200"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {/* Sol */}
      <div
        className={`transition-all duration-300 ${
          isDark ? "opacity-0 rotate-180 absolute inset-2" : "opacity-100 rotate-0"
        }`}
      >
        <Sun className="w-5 h-5" style={{ color: "var(--accent)" }} />
      </div>

      {/* Luna */}
      <div
        className={`transition-all duration-300 ${
          isDark ? "opacity-100 rotate-0" : "opacity-0 -rotate-180 absolute inset-2"
        }`}
      >
        <Moon className="w-5 h-5" style={{ color: "var(--accent)" }} />
      </div>

      {/* Indicador inferior */}
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full animate-pulse"
        style={{ backgroundColor: "var(--accent)" }}
      />
    </button>
  );
}