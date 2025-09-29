// src/components/features/vehicles/list/filters/FilterGroup.tsx
"use client";

import type { FC, ReactNode } from "react";

interface FilterGroupProps {
  label: string;
  isDarkMode: boolean;
  children: ReactNode;
}

const FilterGroup: FC<FilterGroupProps> = ({ label, isDarkMode, children }) => (
  <div>
    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
      {label}
    </label>
    {children}
  </div>
);

export default FilterGroup;
