// src/components/shared/forms/SelectableChip.tsx
"use client";

import React from "react";
import { Check } from "lucide-react";

// 1. AÑADE LA PROP 'disabled' A LA INTERFAZ
interface SelectableChipProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

// 2. AÑADE 'disabled' A LOS PARÁMETROS Y DÁLE UN VALOR POR DEFECTO
export const SelectableChip: React.FC<SelectableChipProps> = ({
  label,
  isSelected,
  onToggle,
  disabled = false, // <-- Valor por defecto para que no rompa tu código actual
}) => {
  return (
    <button
      type="button"
      // 3. DESHABILITA EL CLIC SI ESTÁ INACTIVO
      onClick={disabled ? undefined : onToggle}
      // 4. AÑADE EL ATRIBUTO 'disabled' PARA ACCESIBILIDAD
      disabled={disabled}
      className={`
        flex items-center justify-center px-3 py-2 rounded-full border-2 text-sm font-medium
        transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-primary/50
        ${
          isSelected
            ? "bg-primary border-primary/90 text-primary-foreground shadow-lg "
            : "bg-transparent border-border text-foreground hover:bg-muted"
        }
        // 5. AÑADE ESTILOS VISUALES CUANDO ESTÁ DESHABILITADO
        ${
          disabled
            ? "opacity-50 cursor-not-allowed hover:scale-100" // Opacidad, cursor de no permitido y anula el hover:scale-105
            : "hover:scale-105" // Mantiene tu efecto de escala solo si no está deshabilitado
        }
      `}
    >
      {isSelected && <Check className="w-4 h-4 mr-2" />}
      {label}
    </button>
  );
};