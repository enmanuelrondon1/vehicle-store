// src/components/shared/forms/InputField.tsx (Versión Corregida)
"use client";

import React, { useState, cloneElement, ReactElement, isValidElement, Children } from "react";
import { Check, AlertCircle, Info, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

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
  layout?: "default" | "switch";
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
  layout = "default",
}) => {
  const [showTips, setShowTips] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const showSuccessIcon = success && !error && !isFocused;

  const labelContent = (
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
  );

  if (layout === "switch") {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between h-10">
          {labelContent}
          {children}
        </div>
        {error && (
          <p className="text-sm text-destructive mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
      </div>
    );
  }

  // CAMBIO: Función segura para clonar children con manejo de focus
  const renderChildrenWithFocus = () => {
    // Si es un solo elemento React válido
    if (isValidElement(children)) {
      return cloneElement(children as ReactElement, {
        onFocus: (e: any) => {
          setIsFocused(true);
          const originalOnFocus = (children as ReactElement).props?.onFocus;
          if (originalOnFocus) originalOnFocus(e);
        },
        onBlur: (e: any) => {
          setIsFocused(false);
          const originalOnBlur = (children as ReactElement).props?.onBlur;
          if (originalOnBlur) originalOnBlur(e);
        },
      });
    }
    
    // Si son múltiples elementos, envolvemos en un div con los handlers
    return (
      <div
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {children}
      </div>
    );
  };

  return (
    <div className={cn("space-y-2 focus-within:bg-primary/5 rounded-lg p-1 -m-1 transition-colors duration-200")}>
      <div className="flex items-center justify-between gap-2">
        {labelContent}
        {tips && (
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="ml-auto text-xs px-2 py-1 rounded-full transition-colors bg-muted text-muted-foreground hover:bg-muted/80"
          >
            <TrendingUp className="w-3 h-3 inline mr-1" />
            Tips
          </button>
        )}
      </div>
      <div className="relative">
        {renderChildrenWithFocus()}
        {showSuccessIcon && (
          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600 dark:text-green-400 pointer-events-none" />
        )}
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-destructive pointer-events-none" />
        )}
      </div>
      {counter && counter.current < counter.max && (
        <div className={`text-xs transition-colors ${counter.current > counter.max * 0.9 ? "text-destructive" : "text-muted-foreground"}`}>
          {counter.current}/{counter.max} caracteres
        </div>
      )}
      {error && (
        <p className="text-sm text-destructive mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
      <div
        className={cn(
          "mt-2 p-3 rounded-lg space-y-1 bg-muted/50 border border-border overflow-hidden",
          "transition-all duration-300 ease-out",
          showTips ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {tips && tips.map((tip, index) => (
          <p key={index} className="text-xs text-muted-foreground">
            {tip}
          </p>
        ))}
      </div>
    </div>
  );
};