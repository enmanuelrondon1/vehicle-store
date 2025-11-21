// src/components/features/home/hero/FeatureCard.tsx (versión mejorada)
"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = memo(({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 300 } }}
      className="card-premium card-hover group relative h-full p-6 glow-effect"
    >
      {/* Efecto de brillo en hover mejorado */}
      <motion.div 
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, var(--accent-10) 0%, transparent 70%)'
        }}
        animate={{
          opacity: [0, 0.1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />
      
      {/* Contenedor del icono con efectos premium mejorados */}
      <motion.div
        className="flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden"
        style={{
          background: 'var(--gradient-primary)',
          boxShadow: '0 10px 25px -5px var(--primary-20), 0 10px 10px -5px var(--primary-10)'
        }}
        whileHover={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {/* Efecto shimmer en el icono mejorado */}
        <motion.div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
          }}
          animate={{
            x: ["-100%", "100%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "easeInOut"
          }}
        />
        
        <Icon 
          className="w-8 h-8 relative z-10" 
          style={{ color: 'var(--primary-foreground)' }} 
          strokeWidth={2} 
        />
      </motion.div> 
      
      <h3 
        className="font-heading font-semibold text-xl mb-3 transition-colors duration-300"
        style={{ color: 'var(--card-foreground)' }}
      >
        <motion.span 
          className="group-hover:inline-block transition-transform duration-300"
          whileHover={{ x: 2 }}
        >
          {title}
        </motion.span>
      </h3>
      
      <p 
        className="text-sm leading-relaxed"
        style={{ color: 'var(--muted-foreground)' }}
      >
        {description}
      </p>

      {/* Efecto decorativo premium mejorado */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div 
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, var(--accent-5) 0%, transparent 50%)'
          }}
        />
        <motion.div 
          className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
          style={{
            background: 'linear-gradient(to right, var(--accent), var(--primary), transparent)'
          }}
          animate={{
            x: ["-100%", "100%"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Indicador interactivo mejorado */}
      <motion.div
        className="absolute bottom-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100"
        style={{ backgroundColor: 'var(--accent)' }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Línea decorativa animada mejorada */}
      <motion.div
        className="absolute bottom-0 left-4 h-0.5 rounded-full w-0 group-hover:w-8 transition-all duration-500"
        style={{ backgroundColor: 'var(--accent)' }}
      />
    </motion.div>
  );
}
)

FeatureCard.displayName = "FeatureCard";