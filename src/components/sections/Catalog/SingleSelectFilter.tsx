import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface SingleSelectFilterProps {
  label: string;
  options: string[];
  selectedOption: string;
  onChange: (option: string) => void;
}

const SingleSelectFilter: React.FC<SingleSelectFilterProps> = ({
  label,
  options,
  selectedOption,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false); // Cerrar el menú al seleccionar una opción
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between text-left font-normal"
        >
          <span className="truncate">
            {selectedOption === "all" ? `Seleccionar ${label.toLowerCase()}` : selectedOption}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-48 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => handleSelect(option)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-500 text-sm truncate ${
                  selectedOption === option ? "bg-gray-500 font-medium" : ""
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

export default SingleSelectFilter;