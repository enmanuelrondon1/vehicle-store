// src/components/features/vehicles/list/filters/RangeSliderFilter.tsx
"use client";

import { type FC } from "react";
import * as Slider from "@radix-ui/react-slider";

interface RangeSliderFilterProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  isDarkMode: boolean;
}

const RangeSliderFilter: FC<RangeSliderFilterProps> = ({
  min,
  max,
  step,
  value,
  onChange,
  isDarkMode,
}) => (
  <div className="py-3">
    <Slider.Root
      className="relative flex items-center select-none touch-none w-full h-5"
      value={value}
      onValueChange={(newValue) => onChange(newValue as [number, number])} // ✅ CORRECCIÓN: Convertir el readonly array a mutable
      min={min}
      max={max}
      step={step}
      minStepsBetweenThumbs={1}
    >
      <Slider.Track className={`relative grow rounded-full h-1.5 ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}>
        <Slider.Range className={`absolute rounded-full h-full ${isDarkMode ? "bg-blue-400" : "bg-blue-600"}`} />
      </Slider.Track>
      <Slider.Thumb className={`block h-5 w-5 rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${isDarkMode ? "bg-blue-400 focus:ring-blue-300 focus:ring-offset-gray-800" : "bg-blue-600 focus:ring-blue-500 focus:ring-offset-white"}`} aria-label="Valor mínimo" />
      <Slider.Thumb className={`block h-5 w-5 rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${isDarkMode ? "bg-blue-400 focus:ring-blue-300 focus:ring-offset-gray-800" : "bg-blue-600 focus:ring-blue-500 focus:ring-offset-white"}`} aria-label="Valor máximo" />
    </Slider.Root>
  </div>
);

export default RangeSliderFilter;