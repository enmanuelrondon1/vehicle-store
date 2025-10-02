"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronsUpDown } from "lucide-react";

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
}

// Icono de Check (puedes reemplazarlo con el de lucide-react si lo prefieres)
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/**
 * Un componente de selección simple inspirado en seraui/shadcn.
 * Optimizado para una única selección, con una interfaz limpia y accesible.
 */
export const SortSelector: React.FC<SortSelectorProps> = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer clic fuera
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
    <div className="relative w-[180px]" ref={wrapperRef}>
      <button
        type="button"
        className="flex items-center justify-between w-full p-2 min-h-[40px] text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm cursor-pointer transition-colors focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-900 dark:text-gray-100">
          {selectedLabel}
        </span>
        <ChevronsUpDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md shadow-lg max-h-60 overflow-y-auto animate-popover-in">
          <ul className="p-1">
            {options.map((option) => (
              <li
                key={option.value}
                className="flex items-center justify-between p-2 cursor-pointer rounded-md transition-colors duration-150 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                onClick={() => handleSelectOption(option.value)}
              >
                {option.label}
                {value === option.value && <CheckIcon />}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Estilos para la animación del popover */}
      <style>{`
        @keyframes popover-in {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-popover-in {
          transform-origin: top;
          animation: popover-in 0.1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};