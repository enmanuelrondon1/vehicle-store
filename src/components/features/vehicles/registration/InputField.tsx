"use client";

import React, { useState } from "react";
import { Check, AlertCircle, Info, TrendingUp } from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";

interface InputFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  tooltip?: string;
  counter?: { current: number; max: number };
  tips?: string[];
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  required,
  error,
  success,
  icon,
  children,
  tooltip,
  counter,
  tips,
}) => {
  const { isDarkMode } = useDarkMode();
  const [showTips, setShowTips] = useState(false);

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
        {tips && (
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className={`ml-auto text-xs px-2 py-1 rounded-full transition-colors ${
              isDarkMode 
                ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/70' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            <TrendingUp className="w-3 h-3 inline mr-1" />
            Tips
          </button>
        )}
      </div>
      <div className="relative">
        {children}
        {success && !error && <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />}
        {error && <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />}
      </div>
      {counter && (
        <div className={`text-xs ${counter.current > counter.max * 0.9 ? "text-orange-500" : isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {counter.current}/{counter.max} caracteres
        </div>
      )}
      {error && (
        <p className="text-sm text-red-500 mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
      {showTips && tips && (
        <div className={`mt-2 p-3 rounded-lg space-y-1 ${isDarkMode ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'}`}>
          {tips.map((tip, index) => (
            <p key={index} className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              {tip}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};