// src/components/features/vehicles/list/filters/RangeSliderFilter.tsx
"use client";

import type { FC } from "react";

interface RangeSliderFilterProps {
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const RangeSliderFilter: FC<RangeSliderFilterProps> = ({ min, max, step, value, onChange }) => (
  <div className="space-y-2">
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onChange([Number(e.target.value), value[1]])}
      className="w-full"
    />
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[1]}
      onChange={(e) => onChange([value[0], Number(e.target.value)])}
      className="w-full"
    />
  </div>
);

export default RangeSliderFilter;