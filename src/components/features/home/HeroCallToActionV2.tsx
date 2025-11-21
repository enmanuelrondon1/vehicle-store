// src/components/features/home/HeroCallToActionV2.tsx - CTA FINAL OPTIMIZADO
"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Star, Shield } from "lucide-react";
import { SparklesText } from "@/components/ui/SparklesText";

interface HeroCallToActionV2Props {
  onSellClick: () => void;
}

export const HeroCallToActionV2: React.FC<HeroCallToActionV2Props> = ({
  onSellClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: "-100%", y: "-100%" });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x: `${x}px`, y: `${y}px` });
    }
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 50%, var(--primary-5) 0%, transparent 70%)'
      }}
    >
      {/* EFECTO GRADIENTE INTERACTIVO */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 hover:opacity-100"
        style={{
          background: `radial-gradient(400px at ${mousePosition.x} ${mousePosition.y}, var(--accent-10) 0%, transparent 80%)`,
        }}
      />

      <div className="container-wide relative z-10 mx-auto text-center py-20">
        
        {/* 🏆 BADGE PREMIUM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full card-glass border">
            <Shield className="w-4 h-4" style={{ color: 'var(--success)' }} />
            <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
              Plataforma verificada y segura
            </span>
          </div>
        </motion.div>

        {/* 📝 TÍTULO CON SPARKLES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SparklesText
            className="text-5xl sm:text-6xl font-heading font-bold tracking-tight mb-6"
            colors={{ 
              first: 'var(--accent)', 
              second: 'var(--primary)' 
            }}
            sparkleCount={20}
          >
            ¿Listo para empezar?
          </SparklesText>
        </motion.div>

        {/* 💬 DESCRIPCIÓN */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed font-medium mb-10"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Únete a{" "}
          <span className="font-bold" style={{ color: 'var(--foreground)' }}>
            25,000+ vendedores
          </span>
          {" "}que confían en nuestra plataforma.
          <br />
          Publica tu anuncio en minutos y llega a compradores serios.
        </motion.p>

        {/* 🎯 BOTÓN CTA PRINCIPAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
          className="mb-10"
        >
          <Button
            onClick={onSellClick}
            size="lg"
            className="btn-accent relative inline-flex h-16 items-center justify-center overflow-hidden rounded-2xl px-12 text-xl font-bold transition-all duration-300 group shadow-hard"
          >
            {/* Efecto shimmer */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shimmer 2s infinite'
              }}
            />
            
            <span className="relative flex items-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Zap className="w-6 h-6 mr-3" />
              </motion.div>
              Publicar Anuncio Ahora
              <ArrowRight className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        </motion.div>

        {/* ✅ TRUST INDICATORS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8"
        >
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className="w-5 h-5" 
                  style={{ color: 'var(--accent)' }}
                  fill="currentColor"
                />
              ))}
            </div>
            <span 
              className="text-sm font-semibold"
              style={{ color: 'var(--muted-foreground)' }}
            >
              4.8/5 Valoración
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--success)' }}
            >
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span 
              className="text-sm font-semibold"
              style={{ color: 'var(--muted-foreground)' }}
            >
              100% Seguro
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span 
              className="text-sm font-semibold"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Publicación en 5 min
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroCallToActionV2;