
// src/components/features/vehicles/reels/ReelsFilters.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReelsFiltersState {
  category: string;
  condition: string;
  priceRange: [number, number];
  yearRange: [number, number];
  featured: boolean;
  random: boolean;
}

interface ReelsFiltersProps {
  filters: ReelsFiltersState;
  onFiltersChange: (filters: ReelsFiltersState) => void;
  onClose: () => void;
}

export const ReelsFilters: React.FC<ReelsFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState<ReelsFiltersState>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: ReelsFiltersState = {
      category: "all",
      condition: "all",
      priceRange: [0, 1000000],
      yearRange: [1900, 2025],
      featured: false,
      random: true,
    };
    setLocalFilters(defaultFilters);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[75vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Drag Handle */}
          <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Filtros Rápidos</h3>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Category */}
            <FilterSection 
              title="Categoría" 
              options={[
                { value: "all", label: "Todos", icon: "🚗" },
                { value: "Automóvil", label: "Automóvil", icon: "🚙" },
                { value: "SUV", label: "SUV", icon: "🚐" },
                { value: "Motocicleta", label: "Motocicleta", icon: "🏍️" },
                { value: "Camión", label: "Camión", icon: "🚚" },
              ]}
              value={localFilters.category}
              onChange={(value) => setLocalFilters({ ...localFilters, category: value })}
            />
            
            {/* Condition */}
            <FilterSection 
              title="Condición" 
              options={[
                { value: "all", label: "Todas", icon: "✨" },
                { value: "Nuevo", label: "Nuevo", icon: "🆕" },
                { value: "Excelente", label: "Excelente", icon: "⭐" },
                { value: "Bueno", label: "Bueno", icon: "👍" },
              ]}
              value={localFilters.condition}
              onChange={(value) => setLocalFilters({ ...localFilters, condition: value })}
            />
            
            {/* Price Range */}
            <FilterSection 
              title="Precio" 
              options={[
                { value: "all", label: "Todos", icon: "💰" },
                { value: "0-20000", label: "Hasta $20k", icon: "💵" },
                { value: "20000-40000", label: "$20k - $40k", icon: "💸" },
                { value: "40000-1000000", label: "$40k+", icon: "💎" },
              ]}
              value={
                localFilters.priceRange[0] === 0 && localFilters.priceRange[1] === 1000000
                  ? "all"
                  : localFilters.priceRange[1] <= 20000
                  ? "0-20000"
                  : localFilters.priceRange[1] <= 40000
                  ? "20000-40000"
                  : "40000-1000000"
              }
              onChange={(value) => {
                if (value === "all") {
                  setLocalFilters({ ...localFilters, priceRange: [0, 1000000] });
                } else if (value === "0-20000") {
                  setLocalFilters({ ...localFilters, priceRange: [0, 20000] });
                } else if (value === "20000-40000") {
                  setLocalFilters({ ...localFilters, priceRange: [20000, 40000] });
                } else {
                  setLocalFilters({ ...localFilters, priceRange: [40000, 1000000] });
                }
              }}
            />

            {/* Featured Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-all cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={localFilters.featured}
                  onChange={(e) => setLocalFilters({ ...localFilters, featured: e.target.checked })}
                  className="w-5 h-5 rounded accent-primary"
                />
                <span className="flex-1 font-semibold">Solo Destacados</span>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleReset}
              className="flex-1 py-3.5 border-2 border-border rounded-full font-bold hover:bg-muted transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3.5 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              Aplicar
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// Filter Section Component
interface FilterOption {
  value: string;
  label: string;
  icon: string;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  value,
  onChange,
}) => {
  return (
    <div>
      <h4 className="font-semibold mb-3 text-muted-foreground">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option.value;
          
          return (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all border-2",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                  : "bg-background border-border hover:border-primary/50"
              )}
            >
              <span className="text-lg">{option.icon}</span>
              <span>{option.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ReelsFilters;