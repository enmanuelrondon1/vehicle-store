// src/components/features/home/hero/BenefitCard.tsx
// ✅ OPTIMIZADO: eliminado framer-motion — reemplazado por CSS hover puro
//    Sin whileHover, sin motion.div — misma apariencia, cero JS extra
"use client";
import React, { memo } from "react";
import { CheckCircle } from "lucide-react";

export const BenefitCard: React.FC<{ benefit: string }> = memo(({ benefit }) => {
  return (
    <div
      className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer overflow-hidden group transition-transform duration-200 hover:scale-105"
      style={{
        backgroundColor: "var(--muted)",
        border: "1px solid var(--border)",
        color: "var(--foreground)",
      }}
    >
      {/* Fondo en hover — CSS puro */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full pointer-events-none"
        style={{ backgroundColor: "var(--primary-10)" }}
        aria-hidden="true"
      />

      {/* Línea inferior decorativa */}
      <div
        className="absolute bottom-0 left-0 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-300 pointer-events-none"
        style={{ backgroundColor: "var(--accent)" }}
        aria-hidden="true"
      />

      <CheckCircle
        className="relative z-10 w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12"
        style={{ color: "var(--accent)" }}
        aria-hidden="true"
      />

      <span className="relative z-10 font-medium group-hover:font-semibold transition-all duration-200">
        {benefit}
      </span>
    </div>
  );
});

BenefitCard.displayName = "BenefitCard";