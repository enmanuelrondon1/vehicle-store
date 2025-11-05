// src/components/features/home/hero/FeatureCard.tsx
"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  // La prop 'delay' ya no es necesaria aquí, pero no pasa nada si la dejas.
}

export const FeatureCard: React.FC<FeatureCardProps> = memo(({
  icon: Icon,
  title,
  description,
}) => {
  return (
    // --- MANTENEMOS FRAMER-MOTION PARA LA MICRO-INTERACCIÓN ---
    <motion.div
      // Eliminamos la animación de entrada 'whileInView', ya que AOS la controla ahora.
      whileHover={{ y: -5, transition: { duration: 200 } }}
      className="group relative bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* El icono usa tu color primario, ¡perfecto! */}
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4 transition-transform duration-300 group-hover:scale-110">
        <Icon className="w-6 h-6" />
      </div> 
      
      <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
)

FeatureCard.displayName = "FeatureCard";