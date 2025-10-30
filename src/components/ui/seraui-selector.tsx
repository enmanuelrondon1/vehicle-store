// src/components/ui/seraui-selector.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react"; // ✅ Usamos iconos consistentes
import { cn } from "@/lib/utils"; // ✅ Usamos la utilidad cn de shadcn

// Definición de tipo para las opciones
interface Option {
  value: string;
  label: string;
}

interface SortSelectorProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string; // ✅ Añadimos className para flexibilidad
}

/**
 * Un componente de selección de primera, 100% integrado con tu sistema de diseño.
 * Ofrece interacciones suaves, retroalimentación visual clara y un aspecto profesional.
 */
export const SortSelector: React.FC<SortSelectorProps> = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  className,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectOption = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedLabel =
    options.find((option) => option.value === value)?.label || placeholder;

  return (
    <div className={cn("relative w-[180px]", className)} ref={wrapperRef}>
      {/* ✅ BOTÓN PRINCIPAL: Estilo limpio y temático */}
      <button
        type="button"
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-card border border-border rounded-md shadow-sm cursor-pointer transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate text-foreground">{selectedLabel}</span>
        <ChevronsUpDown className="h-4 w-4 ml-2 shrink-0 opacity-50" />
      </button>

      {isOpen && (
        /* ✅ LISTA DESPLEGABLE: Fondo de tarjeta, sombra y animación suave */
        <div className="absolute z-20 w-full mt-1 bg-popover border border-border rounded-md shadow-lg overflow-hidden animate-popover-in">
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option.value}
                className={cn(
                  "relative flex items-center w-full px-2 py-1.5 text-sm cursor-pointer rounded-sm transition-colors duration-150",
                  // ✅ ESTILO HOVER: Tu color de acento para una retroalimentación vibrante
                  "hover:bg-accent hover:text-accent-foreground",
                  // ✅ ESTILO SELECCIONADO: Fondo sutil para diferenciarlo del hover
                  value === option.value && "bg-muted text-muted-foreground"
                )}
                onClick={() => handleSelectOption(option.value)}
              >
                <span className="truncate">{option.label}</span>
                {/* ✅ ICONO DE CHECK: Solo se muestra si está seleccionado */}
                {value === option.value && (
                  <Check className="ml-auto h-4 w-4 text-primary" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ ANIMACIÓN: La mantenemos pero la hacemos más suave */}
      <style>{`
        @keyframes popover-in {
          from { opacity: 0; transform: scale(0.97) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-popover-in {
          transform-origin: top;
          animation: popover-in 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
};