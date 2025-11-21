// src/components/features/home/hero/StatCard.tsx
"use client";
import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  number: string;
  label: string;
}

const AnimatedCounter = ({ value }: { value: string }) => {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");
    const decimals = (value.split(".")[1] || "").length;

    if (isNaN(numericValue)) return;

    const duration = 1500;
    const startTime = Date.now();

    const frame = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = progress * numericValue;

      const formattedValue =
        decimals > 0
          ? currentValue.toFixed(decimals)
          : Math.floor(currentValue).toString();

      setDisplayValue(formattedValue + suffix);

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }, [value]);

  return (
    <span 
      className="font-bold relative text-4xl sm:text-5xl"
      style={{ 
        color: 'var(--accent)',
        textShadow: '0 0 20px var(--accent-20), 0 0 40px var(--accent-10)',
        filter: 'brightness(1.3)'
      }}
    >
      {displayValue}
      {/* Efecto shimmer para mayor visibilidad */}
      <span 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'shimmer 3s infinite'
        }}
      >
        {displayValue}
      </span>
    </span>
  );
};

export const StatCard: React.FC<StatCardProps> = memo(({ number, label }) => {
  return (
    <motion.div
      data-aos="zoom-in"
      data-aos-duration="600"
      whileHover={{ scale: 1.05, y: -2, transition: { duration: 200 } }}
      className="relative card-premium card-hover group h-full p-6 text-center"
    >
      {/* Efecto de brillo en hover */}
      <div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, var(--accent-10) 0%, transparent 70%)'
        }}
      />
      
      {/* Número con efectos mejorados */}
      <p className="mb-2">
        <AnimatedCounter value={number} />
      </p>
      
      {/* Etiqueta con mejor contraste */}
      <p 
        className="text-sm font-semibold leading-relaxed"
        style={{ 
          color: 'var(--foreground)',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        {label}
      </p>

      {/* Efecto decorativo */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div 
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, var(--accent-5) 0%, transparent 50%)'
          }}
        />
        <div 
          className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
          style={{
            background: 'linear-gradient(to right, var(--accent), var(--primary), transparent)'
          }}
        />
      </div>

      {/* Indicador animado */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
        style={{ backgroundColor: 'var(--accent)' }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
)

StatCard.displayName = "StatCard";