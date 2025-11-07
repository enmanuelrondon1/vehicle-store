// src/components/features/vehicles/list/filters/CheckboxFilter.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { FC } from "react";
import { memo } from "react"; // MEJORA: Memoizamos para rendimiento
import { cn } from "@/lib/utils"; // MEJORA: Para unir clases de forma limpia

interface CheckboxFilterProps {
  options: { value: string; label: string; count?: number }[];
  selected: string[];
  onChange: (value: string) => void;
  maxHeight?: string;
}

// MEJORA: Memoizamos el componente para evitar re-renders si las props no cambian
const CheckboxFilter: FC<CheckboxFilterProps> = memo(({ options, selected, onChange, maxHeight = 'max-h-60' }) => {
  // MEJORA: Manejamos el caso de que no haya opciones
  if (!options || options.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center p-4">
        No hay opciones disponibles.
      </p>
    );
  }

  return (
    // MEJORA: Contenedor más limpio, sin borde duplicado y con scroll suave
    <div className={cn(maxHeight, "overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent")}>
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        const hasCount = option.count !== undefined && option.count > 0;

        return (
          // MEJORA: Usamos una etiqueta semántica y mejoramos el feedback visual
          <label
            key={option.value}
            htmlFor={`checkbox-${option.value}`}
            className={cn(
              "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors duration-200",
              "hover:bg-accent/80 focus-within:bg-accent/80",
              isSelected && "bg-accent/50"
            )}
          >
            <div className="flex items-center space-x-3 flex-grow min-w-0">
              <Checkbox
                id={`checkbox-${option.value}`} // MEJORA: ID para la etiqueta
                checked={isSelected}
                onCheckedChange={() => onChange(option.value)}
              />
              {/* MEJORA: 'truncate' para evitar que textos largos desformen el diseño */}
              <span className="text-sm font-medium text-foreground truncate" title={option.label}>
                {option.label}
              </span>
            </div>
            {hasCount && (
              // MEJORA: La Badge ahora usa una variante secundaria para no competir con el checkbox
              <Badge variant="secondary" className="text-xs font-semibold">
                {option.count}
              </Badge>
            )}
          </label>
        );
      })}
    </div>
  );
});

// MEJORA: Añadimos un displayName para las herramientas de desarrollo
CheckboxFilter.displayName = "CheckboxFilter";

export default CheckboxFilter;