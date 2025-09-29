// src/components/features/vehicles/list/filters/CheckboxFilter.tsx
"use client";

import type { FC } from "react";
import type { FilterOption } from "@/types/types";

interface CheckboxFilterProps {
  options: (string | FilterOption)[];
  selected: string[];
  onChange: (value: string) => void;
  isDarkMode: boolean;
  maxHeight?: string;
}

const CheckboxFilter: FC<CheckboxFilterProps> = ({ options, selected, onChange, isDarkMode, maxHeight = 'max-h-48' }) => (
  <div className={`${maxHeight} overflow-y-auto space-y-1 border rounded p-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
    {options.map((option) => {
      const value = typeof option === 'string' ? option : option.value;
      const label = typeof option === 'string' ? option : option.label;
      return (<label key={value} className="flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
        <input
          type="checkbox"
          checked={selected.includes(value)}
          onChange={() => onChange(value)}
          className="rounded"
        />
        <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          {label}
        </span>
      </label>);
    })}
  </div>
);

export default CheckboxFilter;