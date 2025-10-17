//src/components/shared/Navbar/ThemeToggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="relative p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-5 w-5 scale-100 dark:scale-0 transition-transform" />
      <Moon className="h-5 w-5 absolute top-2 right-2 scale-0 dark:scale-100 transition-transform" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}