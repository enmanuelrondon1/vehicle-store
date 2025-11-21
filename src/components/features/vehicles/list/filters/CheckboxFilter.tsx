// src/components/features/vehicles/list/filters/CheckboxFilter.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { FC } from "react";
import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CheckboxFilterProps {
  options: { value: string; label: string; count?: number }[];
  selected: string[];
  onChange: (value: string) => void;
  maxHeight?: string;
}

const CheckboxFilter: FC<CheckboxFilterProps> = memo(({ options, selected, onChange, maxHeight = 'max-h-60' }) => {
  if (!options || options.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "var(--muted)" }}>
          <span className="text-2xl">📋</span>
        </div>
        <p className="text-sm text-muted-foreground">
          No hay opciones disponibles
        </p>
      </div>
    );
  }

  return (
    <div className={cn(maxHeight, "overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent")}>
      {options.map((option, index) => {
        const isSelected = selected.includes(option.value);
        const hasCount = option.count !== undefined && option.count > 0;

        return (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <label
              htmlFor={`checkbox-${option.value}`}
              className={cn(
                "flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-200",
                "hover:bg-accent/10 focus-within:bg-accent/10",
                isSelected && "bg-accent/20 border border-accent/30"
              )}
            >
              <div className="flex items-center space-x-3 flex-grow min-w-0">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Checkbox
                    id={`checkbox-${option.value}`}
                    checked={isSelected}
                    onCheckedChange={() => onChange(option.value)}
                    className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                </motion.div>
                <span 
                  className="text-sm font-medium text-foreground truncate" 
                  title={option.label}
                >
                  {option.label}
                </span>
              </div>
              {hasCount && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="text-xs font-semibold"
                    style={{
                      backgroundColor: isSelected ? "var(--accent-20)" : "var(--muted)",
                      color: isSelected ? "var(--accent-foreground)" : "var(--muted-foreground)"
                    }}
                  >
                    {option.count}
                  </Badge>
                </motion.div>
              )}
            </label>
          </motion.div>
        );
      })}
    </div>
  );
});

CheckboxFilter.displayName = "CheckboxFilter";

export default CheckboxFilter;