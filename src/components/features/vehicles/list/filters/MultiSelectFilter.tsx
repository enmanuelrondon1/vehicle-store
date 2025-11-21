// src/components/features/vehicles/list/filters/MultiSelectFilter.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleUnselect = (item: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onChange(selected.filter((i) => i !== item));
  };

  // Filtrar opciones basadas en la búsqueda
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    
    return options.filter((option) => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-auto min-h-10 border-border/50 bg-card/50 backdrop-blur-sm",
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
                      <motion.div
                        key={value}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge 
                          variant="secondary" 
                          key={value} 
                          className="mr-1 mb-1 flex items-center gap-1 px-2 py-1"
                          style={{
                            // CORREGIDO: Mejor contraste en modo oscuro
                            backgroundColor: "var(--accent)",
                            color: "var(--accent-foreground)",
                            border: "1px solid var(--accent-border)"
                          }}
                        >
                          <span className="truncate max-w-[100px] font-medium">{optionLabel}</span>
                          <motion.button
                            type="button"
                            role="button"
                            aria-label={`Quitar ${optionLabel}`}
                            tabIndex={0}
                            className="rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 cursor-pointer hover:bg-white/20 transition-colors p-0.5"
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleUnselect(value, e as any)}
                            onClick={(e) => handleUnselect(value, e)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="h-3 w-3" />
                          </motion.button>
                        </Badge>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </motion.div>
          </Button>
        </motion.div>
      </PopoverTrigger>
      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <PopoverContent 
              className="w-[var(--radix-popover-trigger-width)] p-0 z-50" 
              align="start"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-hard)"
              }}
            >
              <Command>
                {showPublishedToggle && onPublishedOnlyChange && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <CommandItem 
                      onSelect={() => onPublishedOnlyChange(!isPublishedOnly)}
                      className="flex items-center space-x-2 w-full p-3"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Checkbox 
                          id="published-only" 
                          checked={isPublishedOnly} 
                          className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        />
                      </motion.div>
                      <label 
                        htmlFor="published-only" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        {publishedOnlyLabel}
                      </label>
                    </CommandItem>
                  </motion.div>
                )}
                
                <div className="relative">
                  <CommandInput 
                    placeholder="Buscar opción..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    className="pl-10"
                  />
                  <motion.div
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </div>
                
                <CommandList className="max-h-[300px] overflow-y-auto">
                  <CommandEmpty>
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "var(--muted)" }}>
                        <span className="text-2xl">🔍</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        No se encontraron opciones para "{searchQuery}"
                      </p>
                    </div>
                  </CommandEmpty>
                  
                  <CommandGroup>
                    <AnimatePresence mode="popLayout">
                      {filteredOptions.map((option, index) => {
                        const isSelected = selected.includes(option.value);
                        return (
                          <motion.div
                            key={option.value}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                          >
                            <CommandItem
                              value={option.value}
                              onSelect={() => {
                                if (singleSelect) {
                                  onChange(isSelected ? [] : [option.value]);
                                  setOpen(false);
                                } else {
                                  onChange(isSelected ? selected.filter((item) => item !== option.value) : [...selected, option.value]);
                                }
                              }}
                              className="flex items-center justify-between p-3 cursor-pointer"
                            >
                              <div className="flex items-center space-x-2 flex-1">
                                <motion.div
                                  animate={{ scale: isSelected ? [1, 1.2, 1] : 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Check 
                                    className={cn("h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} 
                                    style={{ color: "var(--accent)" }}
                                  />
                                </motion.div>
                                <span className="flex-1 truncate">{option.label}</span>
                              </div>
                              {option.count !== undefined && option.count > 0 && (
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Badge 
                                    variant="secondary" 
                                    className="text-xs font-semibold"
                                    style={{
                                      backgroundColor: "var(--accent)",
                                      color: "var(--accent-foreground)",
                                      border: "1px solid var(--accent)"
                                    }}
                                  >
                                    {option.count}
                                  </Badge>
                                </motion.div>
                              )}
                            </CommandItem>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Popover>
  );
};