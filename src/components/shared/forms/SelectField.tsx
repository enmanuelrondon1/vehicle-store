"use client";

import React from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  isLoading?: boolean;
  className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onChange,
  onBlur,
  disabled,
  placeholder,
  options,
  isLoading,
  className = "",
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled || isLoading}
        className={className}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? "text-gray-500" : "text-gray-500"} pointer-events-none`} />
      {isLoading && <Loader2 className="absolute right-12 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />}
    </div>
  );
};

