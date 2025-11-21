// src/components/features/home/HomeFeaturesV3.tsx - FEATURES OPTIMIZADOS (SOLO 3)
"use client";
import React from "react";
import { motion } from "framer-motion";
import { FeatureCard } from "./hero/FeatureCard";
import { Zap, Shield, Users } from "lucide-react";

// ✅ SOLO LOS 3 DIFERENCIADORES PRINCIPALES
const features = [
  {
    icon: Zap, 
    title: "Publicación en 5 Minutos",
    description: "Sube tu anuncio de forma rápida con nuestro sistema optimizado. Sin complicaciones, sin demoras.",
  },
  {
    icon: Shield,
    title: "100% Seguro y Verificado",
    description: "Verificación de usuarios, soporte 24/7 y proceso 100% digital para tu tranquilidad total.",
  },
  {
    icon: Users,
    title: "Sin Comisiones Ocultas",
    description: "Transparencia total. Lo que ves es lo que pagas. Miles de compradores activos esperando.",
  },
];

const HomeFeaturesV3 = () => {
  return (
    <div className="container-wide relative">
      {/* Fondo sutil */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, var(--primary-5) 0%, transparent 70%)'
        }}
      />
      
      {/* 📝 TÍTULO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 
          className="text-4xl sm:text-5xl font-heading font-extrabold mb-6"
          style={{ 
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          ¿Por qué elegirnos?
        </h2>
        
        <p 
          className="text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Tres razones que nos hacen{" "}
          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
            la mejor opción
          </span>
          {" "}del mercado
        </p>
      </motion.div>

      {/* 🎯 GRID DE 3 FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="h-full"
          >
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomeFeaturesV3;