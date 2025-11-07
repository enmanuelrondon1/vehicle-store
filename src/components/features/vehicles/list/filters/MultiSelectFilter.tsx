// src/components/features/vehicles/list/filters/MultiSelectFilter.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // MEJORA: Para animar la salida de las badges

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
  showPublishedToggle?: boolean;
  isPublishedOnly?: boolean;
  onPublishedOnlyChange?: (value: boolean) => void;
  publishedOnlyLabel?: string;
  singleSelect?: boolean;
  className?: string;
}

export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Seleccionar...",
  showPublishedToggle = false,
  isPublishedOnly = false,
  onPublishedOnlyChange,
  publishedOnlyLabel = "Mostrar solo publicados",
  singleSelect = false,
  className,
}) => {
  const [open, setOpen] = React.useState(false);

  // MEJORA: Manejador de deselección más limpio
  const handleUnselect = (item: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onChange(selected.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-auto min-h-10",
            selected.length > 0 && "h-full",
            className
          )}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {selected.map((value) => {
                  const optionLabel = options.find((opt) => opt.value === value)?.label || value;
                  return (
                    // MEJORA: Animamos la salida de cada badge
                    <motion.div
                      key={value}
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge variant="secondary" key={value} className="mr-1 mb-1 flex items-center gap-1">
                        <span className="truncate max-w-[100px]">{optionLabel}</span>
                        <button
                          type="button"
                          role="button"
                          aria-label={`Quitar ${optionLabel}`}
                          tabIndex={0}
                          className="rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 cursor-pointer hover:bg-destructive/20 transition-colors p-0.5"
                          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleUnselect(value, e as any)}
                          onClick={(e) => handleUnselect(value, e)}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </Badge>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-50" align="start">
        <Command>
          {showPublishedToggle && onPublishedOnlyChange && (
            // MEJORA: El toggle ahora es un CommandItem para mejor integración
            <CommandItem onSelect={() => onPublishedOnlyChange(!isPublishedOnly)}>
              <div className="flex items-center space-x-2 w-full">
                <Checkbox id="published-only" checked={isPublishedOnly} />
                <label htmlFor="published-only" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1">
                  {publishedOnlyLabel}
                </label>
              </div>
            </CommandItem>
          )}
          <CommandInput placeholder="Buscar opción..." />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>No se encontraron opciones.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (singleSelect) {
                        onChange(isSelected ? [] : [option.value]);
                        setOpen(false);
                      } else {
                        onChange(isSelected ? selected.filter((item) => item !== option.value) : [...selected, option.value]);
                      }
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                    <span className="flex-1 truncate">{option.label}</span>
                    {option.count !== undefined && option.count > 0 && (
                      // MEJORA: Usamos una Badge secundaria para no competir visualmente
                      <Badge variant="secondary" className="text-xs font-semibold">
                        {option.count}
                      </Badge>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};