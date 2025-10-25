"use client";

import React from "react";
import { AlertCircle, Info } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";

interface TextareaFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  tooltip?: string;
  counter?: { current: number; max: number };
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  required,
  error,
  icon,
  children,
  tooltip,
  counter,
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`space-y-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
      <div className="flex items-center justify-between gap-2">
        <label className={`flex items-center text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {tooltip && (
            <span className="ml-2 cursor-help" title={tooltip}>
              <Info className="w-3 h-3 text-gray-400" />
            </span>
          )}
        </label>
      </div>
      <div className="relative">
        {children}
        {error && <AlertCircle className="absolute right-3 top-4 transform -translate-y-1/2 w-5 h-5 text-red-500" />}
      </div>
      {counter && (
        <div className={`text-xs text-right ${counter.current > counter.max * 0.9 ? "text-orange-500" : isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {counter.current}/{counter.max}
        </div>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};