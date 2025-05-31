import React from "react";
import SingleSelectFilter from "./SingleSelectFilter";
import { Translation } from "@/context/LanguajeContext";
import { SortOption } from "./CatalogPages"; // Importamos SortOption

interface SortAndStatsBarProps {
  translations: Translation;
  stats: { total: number; avgPrice: number; priceRange: { min: number; max: number } };
  totalPages: number;
  currentPage: number;
  sortOption: SortOption;
  sortOptions: { value: string; label: string }[];
  setSortOption: (option: SortOption) => void;
}

const SortAndStatsBar: React.FC<SortAndStatsBarProps> = ({
  translations,
  stats,
  totalPages,
  currentPage,
  sortOption,
  sortOptions,
  setSortOption,
}) => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-semibold">{stats.total}</span> {translations.vehicles || "vehículos"} encontrados
        {stats.total > 0 && stats.priceRange.min !== stats.priceRange.max && (
          <span className="ml-2">
            • ${stats.priceRange.min.toLocaleString()} - ${stats.priceRange.max.toLocaleString()}
          </span>
        )}
        {totalPages > 1 && (
          <span className="ml-2">• Página {currentPage} de {totalPages}</span>
        )}
        {stats.total > 0 && (
          <span className="ml-2">• Precio promedio: ${stats.avgPrice.toLocaleString()}</span>
        )}
      </div>
      <div className="w-full sm:w-48">
        <SingleSelectFilter
          label={translations.sortBy || "Ordenar por"}
          options={sortOptions.map((opt) => opt.label)}
          selectedOption={
            sortOptions.find((opt) => opt.value === sortOption)?.label ||
            (translations.sortBy || "Ordenar por")
          }
          onChange={(label) => {
            const selectedOption = sortOptions.find((opt) => opt.label === label)?.value || "";
            setSortOption(selectedOption as SortOption); // Aseguramos que sea un SortOption
          }}
        />
      </div>
    </div>
  );
};

export default SortAndStatsBar;