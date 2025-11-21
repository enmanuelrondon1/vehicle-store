// src/components/features/home/hero/HeroCallToAction.tsx
"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Star } from "lucide-react";
import { SparklesText } from "@/components/ui/SparklesText";

interface HeroCallToActionProps {
  onSellClick: () => void;
}

export const HeroCallToAction: React.FC<HeroCallToActionProps> = ({
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
      data-aos="fade-up"
      data-aos-duration="1000"
      className="relative w-full overflow-hidden section-spacing"
      style={{
        background: 'radial-gradient(circle at 50% 50%, var(--primary-5) 0%, transparent 70%)'
      }}
    >
      {/* EFECTO GRADIENTE QUE SIGUE AL RATÓN */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(350px at ${mousePosition.x} ${mousePosition.y}, var(--accent-10) 0%, transparent 80%)`,
        }}
      />

      {/* FONDO ADICIONAL CON EFECTOS */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 70%, var(--primary-10) 0%, transparent 50%), radial-gradient(circle at 70% 30%, var(--accent-10) 0%, transparent 50%)'
        }}
      />

      <div className="container-wide relative z-10 mx-auto text-center">
        {/* TÍTULO CON EFECTOS PREMIUM */}
        <motion.div
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
        >
          <div className="relative inline-block">
            <SparklesText
              className="text-4xl font-heading font-bold tracking-tight sm:text-5xl md:text-6xl"
              colors={{ 
                first: 'var(--accent)', 
                second: 'var(--primary)' 
              }}
              sparkleCount={20}
            >
              ¿Listo para empezar?
            </SparklesText>
            
            {/* Efecto de brillo adicional */}
            <div 
              className="absolute inset-0 opacity-50"
              style={{
                background: 'radial-gradient(circle at center, var(--accent-10) 0%, transparent 70%)',
                filter: 'blur(20px)'
              }}
            />
          </div>
        </motion.div>

        {/* PÁRRAFO CON EFECTOS PREMIUM */}
        <motion.p
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 0.2, ease: "easeOut" },
            },
          }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed font-medium"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Únete a miles de vendedores que confían en nuestra plataforma. Publica
          tu anuncio en minutos y llega a compradores serios.
        </motion.p>

        {/* BOTÓN CON EFECTOS PREMIUM */}
        <motion.div
          variants={{
            initial: { opacity: 0, scale: 0.9 },
            animate: {
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.6,
                delay: 0.4,
                type: "spring",
                stiffness: 200,
              },
            },
          }}
          className="mt-10"
        >
          <Button
            onClick={onSellClick}
            size="lg"
            className="btn-accent relative inline-flex h-14 items-center justify-center overflow-hidden rounded-xl px-8 font-bold text-accent-foreground transition-all duration-300 group"
          >
            {/* Efecto shimmer */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shimmer 2s infinite'
              }}
            />
            
            {/* Efecto de brillo en hover */}
            <div 
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle at center, var(--accent-20) 0%, transparent 70%)'
              }}
            />
            
            <span className="relative flex items-center text-lg">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Zap className="w-5 h-5 mr-3" />
              </motion.div>
              Publicar Anuncio Ahora
              <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        </motion.div>

        {/* INDICADORES ADICIONALES */}
        <motion.div
          variants={{
            initial: { opacity: 0, y: 10 },
            animate: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 0.6, ease: "easeOut" },
            },
          }}
          className="mt-8 flex justify-center gap-6"
        >
          <div className="flex items-center gap-2">
            <Star 
              className="w-5 h-5" 
              style={{ color: 'var(--accent)' }}
              fill="currentColor"
            />
            <span 
              className="text-sm font-medium"
              style={{ color: 'var(--muted-foreground)' }}
            >
              4.9/5 Valoración
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
              className="text-sm font-medium"
              style={{ color: 'var(--muted-foreground)' }}
            >
              100% Seguro
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};