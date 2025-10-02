//src/components/features/vehicles/list/SearchBar.tsx
"use client";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { SortSelector } from "@/components/ui/seraui-selector";
import { SORT_OPTIONS } from "@/types/types";

type SearchBarProps = {
  onSearch: (term: string) => void;
  onToggleFilters: () => void;
  isFiltersOpen: boolean;
  sortBy: string;
  onSortChange: (sortValue: string) => void;
};

const SearchBar = ({
  onSearch,
  onToggleFilters,
  isFiltersOpen,
  sortBy,
  onSortChange,
}: SearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleSortChange = (sortValue: string) => {
    onSortChange(sortValue);
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    currentParams.set("sort", sortValue);
    router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg shadow-md mb-6 sticky top-20 z-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-grow w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por marca, modelo, año..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isFiltersOpen
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <SlidersHorizontal size={20} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Ordenar por:
            </span>
            {/* Reemplazamos el antiguo Select por nuestro nuevo SortSelector */}
            <SortSelector
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={handleSortChange}
              placeholder="Seleccionar orden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;