// src/components/features/vehicles/list/filters/CheckboxFilter.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import type { FC } from "react";

interface CheckboxFilterProps {
  // Permitir que las opciones tengan un contador opcional
  options: { value: string; label: string; count?: number }[];
  selected: string[];
  onChange: (value: string) => void;
  isDarkMode: boolean;
  maxHeight?: string;
}

const CheckboxFilter: FC<CheckboxFilterProps> = ({ options, selected, onChange, isDarkMode, maxHeight = 'max-h-32' }) => (
  <div className={`${maxHeight} overflow-y-auto space-y-1 border rounded p-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
    {options.map((option) => {
      const hasCount = option.count !== undefined && option.count > 0;
      return (
        <label key={option.value} className="flex items-center justify-between space-x-2 cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => onChange(option.value)}
              className="rounded"
            />
            <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {option.label}
            </span>
          </div>
          {hasCount && <Badge variant="secondary">{option.count}</Badge>}
        </label>
      );
    })}
  </div>
);

export default CheckboxFilter;