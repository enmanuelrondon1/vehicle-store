// src/components/features/vehicles/list/filters/CheckboxFilter.tsx
"use client";

import type { FC } from "react";

interface CheckboxFilterProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (value: string) => void;
  isDarkMode: boolean;
  maxHeight?: string;
}

const CheckboxFilter: FC<CheckboxFilterProps> = ({ options, selected, onChange, isDarkMode, maxHeight = 'max-h-32' }) => (
  <div className={`${maxHeight} overflow-y-auto space-y-1 border rounded p-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
    {options.map((option) => (
      <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes(option.value)}
          onChange={() => onChange(option.value)}
          className="rounded"
        />
        <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          {option.label}
        </span>
      </label>
    ))}
  </div>
);

export default CheckboxFilter;
