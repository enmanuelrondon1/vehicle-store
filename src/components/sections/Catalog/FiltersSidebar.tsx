import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ChevronDownIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Translation } from "@/context/LanguajeContext";
import { FilterState } from "./CatalogPages"; // Importamos FilterState

// Componentes de filtro
const PriceRangeFilter: React.FC<{
  range: [number, number];
  onChange: (range: [number, number]) => void;
  min?: number;
  max?: number;
}> = ({ range, onChange, min = 50000, max = 6000000 }) => {
  const [localRange, setLocalRange] = React.useState(range);

  React.useEffect(() => {
    setLocalRange(range);
  }, [range]);

  const handleSliderChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    setLocalRange(newRange);
  };

  const handleSliderCommit = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]];
    onChange(newRange);
  };

  const presets = [
    { label: "Hasta $200K", value: [min, 200000] as [number, number] },
    { label: "$200K - $500K", value: [200000, 500000] as [number, number] },
    { label: "$500K - $1M", value: [500000, 1000000] as [number, number] },
    { label: "Más de $1M", value: [1000000, max] as [number, number] },
  ];

  return (
    <div>
      <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Rango de Precio</label>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {presets.map((preset, index) => (
          <Button
            key={index}
            variant={localRange[0] === preset.value[0] && localRange[1] === preset.value[1] ? "default" : "outline"}
            size="sm"
            className="text-xs h-8"
            onClick={() => {
              setLocalRange(preset.value);
              onChange(preset.value);
            }}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <div className="px-2 pb-4">
        <Slider
          min={min}
          max={max}
          step={1000}
          value={localRange}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>${localRange[0].toLocaleString()}</span>
          <span>${localRange[1].toLocaleString()}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Input
            type="number"
            placeholder="Mínimo"
            value={localRange[0]}
            onChange={(e) => {
              const value = Number(e.target.value) || min;
              if (value <= localRange[1] && value >= min) {
                const newRange: [number, number] = [value, localRange[1]];
                setLocalRange(newRange);
                onChange(newRange);
              }
            }}
            className="text-sm"
          />
        </div>
        <div>
          <Input
            type="number"
            placeholder="Máximo"
            value={localRange[1]}
            onChange={(e) => {
              const value = Number(e.target.value) || max;
              if (value >= localRange[0] && value <= max) {
                const newRange: [number, number] = [localRange[0], value];
                setLocalRange(newRange);
                onChange(newRange);
              }
            }}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};

const MultiSelectFilter: React.FC<{
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (options: string[]) => void;
  maxItems?: number;
}> = ({ label, options, selectedOptions, onChange, maxItems = 10 }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOption = React.useCallback(
    (option: string) => {
      onChange(
        selectedOptions.includes(option)
          ? selectedOptions.filter((item) => item !== option)
          : [...selectedOptions, option]
      );
    },
    [selectedOptions, onChange]
  );

  const displayOptions = options.slice(0, maxItems);

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{label}</label>
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between text-left font-normal text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        >
          <span className="truncate">
            {selectedOptions.length === 0
              ? `Seleccionar ${label.toLowerCase()}`
              : `${selectedOptions.length} seleccionado${selectedOptions.length > 1 ? "s" : ""}`}
          </span>
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""} text-gray-600 dark:text-gray-400`} />
        </Button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {displayOptions.map((option) => (
              <label
                key={option}
                className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => toggleOption(option)}
                  className="mr-2 rounded text-blue-600 dark:text-blue-400"
                />
                <span className="text-sm truncate">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedOptions.slice(0, 3).map((option) => (
            <Badge
              key={option}
              variant="secondary"
              className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {option}
              <X
                className="ml-1 h-3 w-3 cursor-pointer text-gray-600 dark:text-gray-400"
                onClick={() => toggleOption(option)}
              />
            </Badge>
          ))}
          {selectedOptions.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              +{selectedOptions.length - 3} más
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

const SingleSelectFilter: React.FC<{
  label: string;
  options: string[];
  selectedOption: string;
  onChange: (option: string) => void;
}> = ({ label, options, selectedOption, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{label}</label>
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between text-left font-normal text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        >
          <span className="truncate">
            {selectedOption === "all" || selectedOption === ""
              ? `Seleccionar ${label.toLowerCase()}`
              : selectedOption}
          </span>
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""} text-gray-600 dark:text-gray-400`} />
        </Button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm truncate text-gray-900 dark:text-gray-100 ${
                  selectedOption === option ? "bg-gray-100 dark:bg-gray-700 font-medium" : ""
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface FiltersSidebarProps {
  translations: Translation;
  filterOptions: {
    categories: string[];
    brands: string[];
    conditions: string[];
    fuelTypes: string[];
    transmissions: string[];
  };
  filters: FilterState;
  showFilters: boolean;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearAllFilters: () => void;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  translations,
  filterOptions,
  filters,
  showFilters,
  updateFilter,
  clearAllFilters,
}) => {
  return (
    <div className={`w-full lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
      <Card className="sticky top-4">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {translations.filters || "Filtros"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-gray-600 dark:text-gray-400"
            >
              {translations.clear || "Limpiar"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <SingleSelectFilter
            label={translations.vehiclesByCategory || "Categoría"}
            options={filterOptions.categories}
            selectedOption={filters.category}
            onChange={(value) => updateFilter("category", value)}
          />
          <MultiSelectFilter
            label={translations.vehiclesByBrand || "Marcas"}
            options={filterOptions.brands}
            selectedOptions={filters.brands}
            onChange={(brands) => updateFilter("brands", brands)}
            maxItems={8}
          />
          <PriceRangeFilter
            range={filters.priceRange}
            onChange={(range) => updateFilter("priceRange", range)}
            min={50000}
            max={6000000}
          />
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              {translations.vehiclesByYear || "Año"}
            </label>
            <div className="px-2 pb-4">
              <Slider
                min={2010}
                max={2025}
                step={1}
                value={filters.yearRange}
                onValueChange={(values) => updateFilter("yearRange", values as [number, number])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{filters.yearRange[0]}</span>
                <span>{filters.yearRange[1]}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SingleSelectFilter
              label={translations.condition || "Condición"}
              options={filterOptions.conditions}
              selectedOption={filters.condition}
              onChange={(value) => updateFilter("condition", value)}
            />
            <SingleSelectFilter
              label={translations.fuelType || "Combustible"}
              options={filterOptions.fuelTypes}
              selectedOption={filters.fuelType}
              onChange={(value) => updateFilter("fuelType", value)}
            />
          </div>
          <SingleSelectFilter
            label={translations.transmission || "Transmisión"}
            options={filterOptions.transmissions}
            selectedOption={filters.transmission}
            onChange={(value) => updateFilter("transmission", value)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FiltersSidebar;