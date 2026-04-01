// src/components/features/home/hero/StatCard.tsx
// ✅ OPTIMIZADO: eliminado animate repeat:Infinity que bloqueaba el hilo principal
//    AnimatedCounter solo corre una vez al montar — no es loop infinito
//    Hover effects con CSS en lugar de framer-motion
"use client";
import React, { memo, useState, useEffect, useRef } from "react";

interface StatCardProps {
  number: string;
  label: string;
}

const AnimatedCounter = ({ value }: { value: string }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");
    const decimals = (value.split(".")[1] || "").length;

    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    const duration = 1200;
    const startTime = Date.now();

    const frame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = eased * numericValue;

      const formattedValue =
        decimals > 0
          ? currentValue.toFixed(decimals)
          : Math.floor(currentValue).toString();

      setDisplayValue(formattedValue + suffix);

      if (progress < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }, [value]);

  return (
    <span
      className="font-bold text-4xl sm:text-5xl"
      style={{
        color: "var(--accent)",
        textShadow: "0 0 20px var(--accent-20)",
      }}
    >
      {displayValue}
    </span>
  );
};

export const StatCard: React.FC<StatCardProps> = memo(({ number, label }) => {
  return (
    <div className="relative card-premium group h-full p-6 text-center transition-transform duration-200 hover:scale-105 hover:-translate-y-1 cursor-default">
      {/* Brillo en hover — CSS puro */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, var(--accent-10) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Línea superior decorativa en hover */}
      <div
        className="absolute top-0 left-0 w-0 group-hover:w-full h-0.5 rounded-t-xl transition-all duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(to right, var(--accent), var(--primary), transparent)",
        }}
        aria-hidden="true"
      />

      <p className="mb-2">
        <AnimatedCounter value={number} />
      </p>

      <p
        className="text-sm font-semibold leading-relaxed"
        style={{ color: "var(--foreground)" }}
      >
        {label}
      </p>

      {/* ✅ ELIMINADO: motion.div animate scale repeat:Infinity — bloqueaba hilo principal */}
      {/* Reemplazado por punto estático con pulse CSS */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: "var(--accent)" }}
        aria-hidden="true"
      />
    </div>
  );
});

StatCard.displayName = "StatCard";