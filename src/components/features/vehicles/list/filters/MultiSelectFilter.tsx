// src/components/features/vehicles/list/filters/MultiSelectFilter.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface MultiSelectFilterProps {
  options: { value: string; label: string; count?: number }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  isDarkMode: boolean;
  showPublishedToggle?: boolean;
  isPublishedOnly?: boolean;
  onPublishedOnlyChange?: (value: boolean) => void;
  publishedOnlyLabel?: string;
}

export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Seleccionar...",
  isDarkMode,
  showPublishedToggle = false,
  isPublishedOnly = false,
  onPublishedOnlyChange,
  publishedOnlyLabel = "Mostrar solo publicados",
}) => {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between h-auto min-h-10 ${selected.length > 0 ? "h-full" : ""}`}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length > 0 ? (
              selected.map((value) => {
                const optionLabel =
                  options.find((opt) => opt.value === value)?.label ||
                  value;
                return (
                  <Badge
                    variant="secondary"
                    key={value}
                    className="mr-1 mb-1 flex items-center"
                  >
                    <span className="mr-1">{optionLabel}</span>
                    <div
                      role="button"
                      aria-label={`Quitar ${optionLabel}`}
                      tabIndex={0}
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleUnselect(value)}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnselect(value);
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </div>
                  </Badge>
                );
              })
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0 z-50",
          "border rounded-md shadow-lg",
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-200 text-black"
        )}
      >
        <Command>
          {showPublishedToggle && onPublishedOnlyChange && (
            <div className="px-2 py-1.5">
              <div
                className="flex items-center space-x-2 cursor-pointer px-2 py-1.5 rounded-md hover:bg-accent"
                onClick={() => onPublishedOnlyChange(!isPublishedOnly)}
              >
                <Checkbox
                  id="published-only"
                  checked={isPublishedOnly}
                  onCheckedChange={(checked) => {
                    if (onPublishedOnlyChange) {
                      onPublishedOnlyChange(checked === true);
                    }
                  }}
                />
                <label
                  htmlFor="published-only"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {publishedOnlyLabel}
                </label>
              </div>
            </div>
          )}
          <CommandInput placeholder="Buscar..." />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((item) => item !== option.value)
                        : [...selected, option.value]
                    );
                    setOpen(true);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <span className="flex-1">{option.label}</span>
                  {option.count !== undefined && option.count > 0 && (
                    <span
                      className={cn(
                        "ml-2 text-xs px-1.5 py-0.5 rounded-full",
                        isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
                      )}
                    >
                      {option.count}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};