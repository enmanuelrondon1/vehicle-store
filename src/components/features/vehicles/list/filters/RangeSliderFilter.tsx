// src/components/features/vehicles/list/filters/RangeSliderFilter.tsx
"use client";

import { type FC, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { cn } from "@/lib/utils"; // MEJORA: Para unir clases
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // MEJORA: Para mostrar los valores

interface RangeSliderFilterProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string; // MEJORA: Para formatear (ej: a moneda)
}

const RangeSliderFilter: FC<RangeSliderFilterProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  formatValue = (val) => val.toString(), // Por defecto, solo muestra el número
}) => {
  // MEJORA: Estado local para mostrar el valor mientras se arrastra
  const [localValues, setLocalValues] = useState(value);

  const handleValueChange = (newValue: number[]) => {
    setLocalValues(newValue as [number, number]);
    onChange(newValue as [number, number]);
  };

  return (
    // MEJORA: TooltipProvider es necesario para que los tooltips funcionen
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
          <Slider.Track className="relative grow rounded-full h-[6px] bg-muted">
            <Slider.Range className="absolute rounded-full h-full bg-primary group-hover:opacity-80 transition-opacity" />
          </Slider.Track>
          
          {/* MEJORA: Thumb para el valor mínimo con Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Slider.Thumb
                className={cn(
                  "block h-5 w-5 rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all",
                  "bg-primary hover:scale-110 hover:ring-offset-background"
                )}
                aria-label={`Valor mínimo: ${formatValue(localValues[0])}`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">{formatValue(localValues[0])}</p>
            </TooltipContent>
          </Tooltip>

          {/* MEJORA: Thumb para el valor máximo con Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Slider.Thumb
                className={cn(
                  "block h-5 w-5 rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all",
                  "bg-primary hover:scale-110 hover:ring-offset-background"
                )}
                aria-label={`Valor máximo: ${formatValue(localValues[1])}`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">{formatValue(localValues[1])}</p>
            </TooltipContent>
          </Tooltip>
        </Slider.Root>
        
        {/* MEJORA: Mostrar los valores seleccionados debajo del slider */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono">
          <span>{formatValue(localValues[0])}</span>
          <span>{formatValue(localValues[1])}</span>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RangeSliderFilter;