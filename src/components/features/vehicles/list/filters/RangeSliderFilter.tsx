// src/components/features/vehicles/list/filters/RangeSliderFilter.tsx
"use client";

import { type FC, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RangeSliderFilterProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
}

const RangeSliderFilter: FC<RangeSliderFilterProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  formatValue = (val) => val.toString(),
}) => {
  const [localValues, setLocalValues] = useState(value);

  const handleValueChange = (newValue: number[]) => {
    setLocalValues(newValue as [number, number]);
    onChange(newValue as [number, number]);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="py-3 px-1">
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5 group"
          value={value}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          minStepsBetweenThumbs={1}
        >
          {/* Track mejorado para modo oscuro */}
          <Slider.Track 
            className="relative grow rounded-full h-[6px]"
            style={{ 
              backgroundColor: "var(--muted)",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.2)"
            }}
          >
            {/* Range mejorado con gradiente y sombra para modo oscuro */}
            <Slider.Range 
              className="absolute rounded-full h-full transition-all group-hover:opacity-90"
              style={{ 
                background: "var(--gradient-accent)",
                boxShadow: "0 0 10px rgba(var(--accent-rgb), 0.3)"
              }}
            />
          </Slider.Track>
          
          {/* Thumb para el valor mínimo mejorado */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Slider.Thumb
                className={cn(
                  "block h-5 w-5 rounded-full cursor-grab focus:outline-none transition-all",
                  "hover:scale-110 focus-visible:scale-110"
                )}
                style={{
                  backgroundColor: "var(--accent)",
                  boxShadow: "0 2px 10px rgba(var(--accent-rgb), 0.5), 0 0 0 2px var(--background)",
                  border: "2px solid var(--accent)"
                }}
                aria-label={`Valor mínimo: ${formatValue(localValues[0])}`}
              />
            </TooltipTrigger>
            <TooltipContent 
              className="border-border bg-card text-card-foreground shadow-hard"
              sideOffset={5}
            >
              <p className="font-semibold">{formatValue(localValues[0])}</p>
            </TooltipContent>
          </Tooltip>

          {/* Thumb para el valor máximo mejorado */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Slider.Thumb
                className={cn(
                  "block h-5 w-5 rounded-full cursor-grab focus:outline-none transition-all",
                  "hover:scale-110 focus-visible:scale-110"
                )}
                style={{
                  backgroundColor: "var(--accent)",
                  boxShadow: "0 2px 10px rgba(var(--accent-rgb), 0.5), 0 0 0 2px var(--background)",
                  border: "2px solid var(--accent)"
                }}
                aria-label={`Valor máximo: ${formatValue(localValues[1])}`}
              />
            </TooltipTrigger>
            <TooltipContent 
              className="border-border bg-card text-card-foreground shadow-hard"
              sideOffset={5}
            >
              <p className="font-semibold">{formatValue(localValues[1])}</p>
            </TooltipContent>
          </Tooltip>
        </Slider.Root>
        
        {/* Valores seleccionados completamente rediseñados para modo oscuro */}
        <div className="flex justify-between mt-2 text-xs font-mono">
          {/* Valor mínimo con diseño mejorado para modo oscuro */}
          <div className="px-2 py-1 rounded-md font-bold">
            <span className="dark:text-white text-foreground">
              {formatValue(localValues[0])}
            </span>
          </div>
          
          {/* Valor máximo con diseño mejorado para modo oscuro */}
          <div className="px-2 py-1 rounded-md font-bold">
            <span className="dark:text-white text-foreground">
              {formatValue(localValues[1])}
            </span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RangeSliderFilter;