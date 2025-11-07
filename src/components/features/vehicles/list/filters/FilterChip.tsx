// src/components/features/vehicles/list/filters/FilterChip.tsx
"use client";

import type { FC } from "react";
import { memo } from "react"; // MEJORA: Memoizamos para evitar re-renders
import { X } from "lucide-react";
import { motion } from "framer-motion"; // MEJORA: Para animar la salida
import { cn } from "@/lib/utils"; // MEJORA: Para unir clases de forma condicional

// MEJORA: Añadimos una prop 'variant' para mayor flexibilidad futura
type FilterChipVariant = "default" | "secondary";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  variant?: FilterChipVariant;
}

// MEJORA: Variantes de animación para la salida del chip
const chipExitVariants = {
  initial: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

// MEJORA: Memoizamos el componente para rendimiento en listas grandes
const FilterChip: FC<FilterChipProps> = memo(({ label, onRemove, variant = "default" }) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el clic se propague al padre
    onRemove();
  };

  // MEJORA: Clases base y variantes para un estilo más controlado
  const baseClasses = "group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1";
  const variantClasses = {
    default: "bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105",
  };

  return (
    // MEJORA: Usamos motion.div para animar la salida del chip
    <motion.div
      layout
      variants={chipExitVariants}
      initial="initial"
      exit="exit"
      className={cn(baseClasses, variantClasses[variant])}
    >
      <span className="truncate max-w-[150px]">{label}</span>
      {/* MEJORA: El botón de remover tiene más feedback visual */}
      <button
        onClick={handleRemove}
        className="p-0.5 rounded-full opacity-70 transition-opacity hover:opacity-100 hover:bg-black/10 focus-visible:opacity-100 focus-visible:bg-black/10"
        aria-label={`Remover filtro: ${label}`}
        type="button"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
});

FilterChip.displayName = "FilterChip"; // Buenas prácticas para componentes memoizados

export default FilterChip;