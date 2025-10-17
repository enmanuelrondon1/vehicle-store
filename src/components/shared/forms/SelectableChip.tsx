//src/components/shared/forms/SelectableChip.tsx
"use client";

import React from "react";
import { Check } from "lucide-react";

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
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        flex items-center justify-center px-3 py-2 rounded-full border-2 text-sm font-medium
        transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50
        ${
          isSelected
            ? "bg-primary border-primary/90 text-primary-foreground shadow-lg "
            : "bg-transparent border-border text-foreground hover:bg-muted"
        }`}
    >
      {isSelected && <Check className="w-4 h-4 mr-2" />}
      {label}
    </button>
  );
};