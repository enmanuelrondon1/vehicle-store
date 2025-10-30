// src/components/shared/forms/InputField.tsx
"use client";

import React, { useState } from "react";
import { Check, AlertCircle, Info, TrendingUp } from "lucide-react";
// ¡Eliminada la dependencia de useDarkMode!

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
  const [showTips, setShowTips] = useState(false);

  return (
    // Usamos 'text-foreground' y 'space-y-2' para consistencia
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="flex items-center text-sm font-medium text-foreground">
          {icon && <span className="mr-2 text-muted-foreground">{icon}</span>}
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
          {tooltip && (
            <span className="ml-2 cursor-help" title={tooltip}>
              <Info className="w-3 h-3 text-muted-foreground" />
            </span>
          )}
        </label>
        {tips && (
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            // Usamos colores de tema para el botón de tips
            className="ml-auto text-xs px-2 py-1 rounded-full transition-colors bg-muted text-muted-foreground hover:bg-muted/80"
          >
            <TrendingUp className="w-3 h-3 inline mr-1" />
            Tips
          </button>
        )}
      </div>
      <div className="relative">
        {children}
        {success && !error && <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />}
        {error && <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-destructive" />}
      </div>
      {counter && (
        <div className={`text-xs ${counter.current > counter.max * 0.9 ? "text-destructive" : "text-muted-foreground"}`}>
          {counter.current}/{counter.max} caracteres
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
      {showTips && tips && (
        // El contenedor de tips ahora usa colores de tema
        <div className="mt-2 p-3 rounded-lg space-y-1 bg-muted/50 border border-border">
          {tips.map((tip, index) => (
            <p key={index} className="text-xs text-muted-foreground">
              {tip}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};