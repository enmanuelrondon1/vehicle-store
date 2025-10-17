// src/components/features/vehicles/list/filters/FilterChip.tsx
"use client";

import type { FC } from "react";
import { X } from "lucide-react";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
  // isDarkMode: boolean; // ❌ REMOVED
}

const FilterChip: FC<FilterChipProps> = ({ label, onRemove }) => (
  <div
    className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-sm font-medium transition-colors animate-in fade-in-0 zoom-in-95 bg-primary/10 text-primary"
  >
    <span>{label}</span>
    <button
      onClick={onRemove}
      className="p-0.5 rounded-full hover:bg-primary/20"
      aria-label={`Remover filtro: ${label}`}
    >
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
);

export default FilterChip;