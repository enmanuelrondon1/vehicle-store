import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Translation } from "@/context/LanguajeContext";

interface SearchBarProps {
  translations: Translation;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ translations, searchQuery, onSearchChange }) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <Input
            placeholder={translations.exploreVehicles || "Explorar vehículos..."}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchBar;