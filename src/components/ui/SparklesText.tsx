// src/components/ui/SparklesText.tsx
"use client";
import * as React from "react";

interface SparklesTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: { first: string; second: string };
  sparkleCount?: number;
}

export const SparklesText: React.FC<SparklesTextProps> = ({
  children,
  className,
}) => {
  // Sin sparkles — solo renderiza el texto con el estilo cta-title
  // Evita completamente el hydration mismatch por Math.random
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <span className="relative z-20">{children}</span>
    </span>
  );
};