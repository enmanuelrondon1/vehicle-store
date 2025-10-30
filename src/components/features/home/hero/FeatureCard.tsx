// src/components/features/home/hero/FeatureCard.tsx
"use client";
import React, { memo } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = memo(({
  icon: Icon,
  title,
  description,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="group relative bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* El icono ahora usa el color primario para ser un ancla visual consistente */}
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
});

FeatureCard.displayName = "FeatureCard";