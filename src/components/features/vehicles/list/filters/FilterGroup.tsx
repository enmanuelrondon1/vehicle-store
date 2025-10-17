// src/components/features/vehicles/list/filters/FilterGroup.tsx
"use client";

import type { FC, ReactNode } from "react";

interface FilterGroupProps {
  label: string;
  // isDarkMode: boolean; // ❌ REMOVED
  children: ReactNode;
}

const FilterGroup: FC<FilterGroupProps> = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-muted-foreground">
      {label}
    </label>
    {children}
  </div>
);

export default FilterGroup;