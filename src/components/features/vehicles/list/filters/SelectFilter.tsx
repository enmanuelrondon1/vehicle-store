// src/components/features/vehicles/list/filters/SelectFilter.tsx
"use client";

import type { FC } from "react";

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  isDarkMode: boolean;
}

const SelectFilter: FC<SelectFilterProps> = ({ value, onChange, options, isDarkMode }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full p-2 rounded border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
);

export default SelectFilter;
