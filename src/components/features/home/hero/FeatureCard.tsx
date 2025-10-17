// src/components/features/home/hero/FeatureCard.tsx
"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
  textColor: string;
  borderColor: string;
  bgColor?: string;
  iconBg?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = memo(({
  icon,
  title,
  description,
  delay,
  textColor,
  borderColor,
  bgColor = "bg-white/60 dark:bg-gray-800/60",
  iconBg = "bg-gray-100 dark:bg-gray-700",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        scale: 1.03, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={`
        relative group cursor-pointer rounded-xl p-6 border-2 ${borderColor}
        ${bgColor} backdrop-blur-sm
        hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/30
        transition-all duration-300 transform-gpu
        overflow-hidden
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <div className="relative z-10">
        <div className={`
          mb-4 p-3 rounded-xl ${iconBg} 
          group-hover:scale-110 transition-transform duration-300
          border border-transparent group-hover:border-current/20
        `}>
          {React.cloneElement(icon, { 
            className: `w-8 h-8 ${textColor} transition-colors duration-300` 
          })}
        </div>
        
        <h3 className={`
          text-lg font-bold mb-3 ${textColor} 
          group-hover:scale-105 transition-transform duration-300
          dark:text-white
        `}>
          {title}
        </h3>
        
        <p className={`
          text-sm leading-relaxed 
          text-gray-600 dark:text-gray-300
          group-hover:text-gray-700 dark:group-hover:text-gray-200
          transition-colors duration-300
        `}>
          {description}
        </p>
      </div>

      <div className={`
        absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${textColor.replace('text', 'from')} to-transparent
        transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left
      `} />
    </motion.div>
  );
});

FeatureCard.displayName = "FeatureCard";