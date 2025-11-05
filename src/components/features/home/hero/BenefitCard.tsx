// src/components/features/home/hero/BenefitCard.tsx
"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export const BenefitCard: React.FC<{ benefit: string }> = memo(({ benefit }) => {
  return (
    // --- MANTENEMOS FRAMER-MOTION SOLO PARA EL HOVER ---
    <motion.div
      // Eliminamos 'initial' y 'animate' para que AOS controle la entrada
      whileHover={{ scale: 1.05, transition: { duration: 200 } }}
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
      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
      <span>{benefit}</span>
    </motion.div>
  );
}
)
BenefitCard.displayName = "BenefitCard";