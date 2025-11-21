// src/components/features/vehicles/list/filters/FilterChip.tsx
"use client";

import type { FC } from "react";
import { memo } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type FilterChipVariant = "default" | "secondary" | "range";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  variant?: FilterChipVariant;
}

const chipExitVariants = {
  initial: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const FilterChip: FC<FilterChipProps> = memo(({ label, onRemove, variant = "default" }) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  // Clases base y variantes con soporte para modo oscuro
  const baseClasses = "group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1";
  
  const variantClasses = {
    default: "bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105 dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/30",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 dark:bg-secondary/80 dark:text-secondary-foreground dark:hover:bg-secondary/60",
    // Nueva variante específica para rangos con mejor contraste en modo oscuro
    range: "bg-accent/10 text-accent-foreground hover:bg-accent/20 hover:scale-105 dark:bg-accent/20 dark:text-accent-foreground dark:hover:bg-accent/30 border border-accent/20 dark:border-accent/30"
  };

  // Determinar si es un chip de rango (precio, año, km)
  const isRangeChip = label.includes("Precio:") || label.includes("Año:") || label.includes("Kilómetros:");
  const chipVariant = isRangeChip ? "range" : variant;

  return (
    <motion.div
      layout
      variants={chipExitVariants}
      initial="initial"
      exit="exit"
      className={cn(baseClasses, variantClasses[chipVariant])}
    >
      <span className="truncate max-w-[150px]">{label}</span>
      <button
        onClick={handleRemove}
        className="p-0.5 rounded-full opacity-70 transition-opacity hover:opacity-100 hover:bg-black/10 focus-visible:opacity-100 focus-visible:bg-black/10 dark:hover:bg-white/10 dark:focus-visible:bg-white/10"
        aria-label={`Remover filtro: ${label}`}
        type="button"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
});

FilterChip.displayName = "FilterChip";

export default FilterChip;