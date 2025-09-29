//src/components/shared/forms/SelectableChip.tsx
"use client";

import React from "react";
import { Check } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";

interface SelectableChipProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
}

export const SelectableChip: React.FC<SelectableChipProps> = ({
  label,
  isSelected,
  onToggle,
}) => {
  const { isDarkMode } = useDarkMode();
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        flex items-center justify-center px-3 py-2 rounded-full border-2 text-sm font-medium
        transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500/50
        ${isSelected
          ? "bg-teal-600 border-teal-700 text-white shadow-lg"
          : isDarkMode
          ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
        }`}
    >
      {isSelected && <Check className="w-4 h-4 mr-2" />}
      {label}
    </button>
  );
};