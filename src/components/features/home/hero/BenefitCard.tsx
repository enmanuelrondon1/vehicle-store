// src/components/features/home/hero/BenefitCard.tsx
"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export const BenefitCard: React.FC<{ benefit: string }> = memo(({ benefit }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, transition: { duration: 200 } }}
      className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer overflow-hidden group"
      style={{
        backgroundColor: 'var(--muted)',
        border: '1px solid var(--border)',
        color: 'var(--foreground)'
      }}
    >
      {/* Efecto de fondo en hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
        style={{
          backgroundColor: 'var(--primary-10)',
          borderColor: 'var(--primary-20)'
        }}
      />
      
      {/* Icono con efectos */}
      <motion.div
        className="relative z-10"
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
      >
        <CheckCircle 
          className="w-4 h-4 flex-shrink-0" 
          style={{ color: 'var(--accent)' }} 
        />
      </motion.div>
      
      {/* Texto con mejor contraste */}
      <span className="relative z-10 font-medium group-hover:font-semibold transition-all duration-300">
        {benefit}
      </span>
      
      {/* Efecto shimmer */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          animation: 'shimmer 2s infinite'
        }}
      />
      
      {/* Línea decorativa */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 rounded-full w-0 group-hover:w-full transition-all duration-300"
        style={{ backgroundColor: 'var(--accent)' }}
      />
    </motion.div>
  );
}
)
BenefitCard.displayName = "BenefitCard";