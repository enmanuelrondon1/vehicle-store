// src/components/shared/forms/SelectableChip.tsx
"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils"; // Importamos la utilidad cn de Tailwind

interface SelectableChipProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const SelectableChip: React.FC<SelectableChipProps> = ({
  label,
  isSelected,
  onToggle,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      className={cn(
        // Estilos base
        "flex items-center justify-center px-3 py-2 rounded-full border-2 text-sm font-medium",
        "transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-primary/50",
        
        // Estilos cuando NO está seleccionado
        !isSelected && [
          "bg-background border-border text-foreground",
          "hover:bg-muted hover:border-primary/50 hover:text-primary",
          "dark:bg-background dark:border-border dark:text-foreground",
          "dark:hover:bg-muted/80 dark:hover:border-primary/50 dark:hover:text-primary"
        ],
        
        // Estilos cuando SÍ está seleccionado (MEJORADO)
        isSelected && [
          "bg-primary border-primary text-primary-foreground shadow-sm",
          "dark:bg-primary dark:border-primary dark:text-primary-foreground dark:shadow-lg dark:ring-2 dark:ring-primary/30"
        ],
        
        // Estilos cuando está deshabilitado
        disabled && [
          "opacity-50 cursor-not-allowed",
          "hover:scale-100" // Anula el efecto de escala
        ],
        
        // Efecto de escala cuando no está deshabilitado
        !disabled && "hover:scale-105"
      )}
    >
      {isSelected && <Check className="w-4 h-4 mr-2" />}
      {label}
    </button>
  );
};