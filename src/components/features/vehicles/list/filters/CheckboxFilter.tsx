// src/components/features/vehicles/list/filters/CheckboxFilter.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { FC } from "react";

interface CheckboxFilterProps {
  options: { value: string; label: string; count?: number }[];
  selected: string[];
  onChange: (value: string) => void;
  // isDarkMode: boolean; // ❌ REMOVED
  maxHeight?: string;
}

const CheckboxFilter: FC<CheckboxFilterProps> = ({ options, selected, onChange, maxHeight = 'max-h-32' }) => (
  <div className={`${maxHeight} overflow-y-auto space-y-1 border rounded p-2 border-border`}>
    {options.map((option) => {
      const hasCount = option.count !== undefined && option.count > 0;
      return (
        <label key={option.value} className="flex items-center justify-between space-x-2 cursor-pointer p-1 rounded hover:bg-accent">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selected.includes(option.value)}
              onCheckedChange={() => onChange(option.value)}
              id={`checkbox-${option.value}`}
            />
            <span className="text-sm text-foreground">
              {option.label}
            </span>
          </div>
          {hasCount && (
            <Badge
              variant="default"
              className="text-xs font-semibold"
            >
              {option.count}
            </Badge>
          )}
        </label>
      );
    })}
  </div>
);

export default CheckboxFilter;