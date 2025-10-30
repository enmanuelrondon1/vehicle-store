// src/components/features/home/hero/BenefitCard.tsx
"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export const BenefitCard: React.FC<{ benefit: string }> = memo(({ benefit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
        bg-muted/80 backdrop-blur-sm
        border border-border
        text-muted-foreground
        hover:bg-card hover:border-accent hover:text-accent
        transition-all duration-300 cursor-pointer
        shadow-sm hover:shadow-md
      `}
    >
      {/* El icono ahora usa el color de acento para consistencia */}
      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
      <span>{benefit}</span>
    </motion.div>
  );
});

BenefitCard.displayName = "BenefitCard";