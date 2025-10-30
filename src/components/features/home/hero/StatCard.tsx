// src/components/features/home/hero/StatCard.tsx
"use client";
import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  number: string;
  label: string;
  index: number;
}

// ¡Mantengo tu AnimatedCounter! Es un detalle genial.
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

  return <span className="font-black">{displayValue}</span>;
};

export const StatCard: React.FC<StatCardProps> = memo(({ number, label, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="relative bg-card border-2 border-primary rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <p className="text-3xl sm:text-4xl font-heading font-black text-primary">
        <AnimatedCounter value={number} />
      </p>
      <p className="text-sm text-muted-foreground mt-2">{label}</p>
    </motion.div>
  );
});

StatCard.displayName = "StatCard";