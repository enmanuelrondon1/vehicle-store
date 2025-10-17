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
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
        border border-gray-200 dark:border-gray-700
        text-gray-700 dark:text-gray-200
        hover:bg-white dark:hover:bg-gray-800
        hover:border-blue-300 dark:hover:border-blue-600
        hover:text-blue-600 dark:hover:text-blue-400
        transition-all duration-300 cursor-pointer
        shadow-sm hover:shadow-md
      `}
    >
      <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" />
      <span>{benefit}</span>
    </motion.div>
  );
});

BenefitCard.displayName = "BenefitCard";