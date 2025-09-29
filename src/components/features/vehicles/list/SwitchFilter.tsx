// src/components/features/vehicles/list/filters/SwitchFilter.tsx
"use client";

import type { FC } from "react";

interface SwitchFilterProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  isDarkMode: boolean;
}

const SwitchFilter: FC<SwitchFilterProps> = ({ label, checked, onChange, isDarkMode }) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="checkbox" // Usamos checkbox para simplicidad, se puede reemplazar por un componente Switch UI
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded"
    />
    <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{label}</span>
  </label>
);

export default SwitchFilter;