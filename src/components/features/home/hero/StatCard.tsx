// src/components/features/home/hero/StatCard.tsx
"use client";
import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  number: string;
  label: string;
  index: number;
  textColor: string;
  bgColor: string;
  borderColor?: string;
}

const AnimatedCounter = ({ value }: { value: string }) => {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    const suffix = value.replace(/[0-9.]/g, "");
    const decimals = (value.split(".")[1] || "").length;

    if (isNaN(numericValue)) return;

    const duration = 1500; // Duración de la animación en ms
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

  return <span className="font-black">{displayValue}</span>;
};

export const StatCard: React.FC<StatCardProps> = memo(
  ({
  number, 
  label, 
  index,
  textColor,
  bgColor,
  borderColor = "border-transparent",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.05, y: -2 }}
      className={`
        relative text-center p-4 rounded-xl border-2 ${borderColor} ${bgColor}
        backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 
        dark:hover:shadow-primary/20 transition-all duration-300
        group cursor-pointer
      `}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent dark:from-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className={`text-2xl font-bold mb-1 ${textColor} relative z-10`}>
        <AnimatedCounter value={number} />
      </div>
      
      <div className={`
        text-xs font-semibold uppercase tracking-wide
        text-gray-600 dark:text-gray-300
        group-hover:text-gray-700 dark:group-hover:text-gray-200
        transition-colors duration-300 relative z-10
      `}>
        {label}
      </div>

      <div className={`
        absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${textColor.replace('text', 'from')}
        transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center
      `} />
    </motion.div>
  );
});

StatCard.displayName = "StatCard";