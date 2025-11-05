// src/components/features/home/hero/HeroCallToAction.tsx
"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
    // --- SECCIÓN PRINCIPAL CON ANIMACIÓN AOS "fade-up" ---
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      data-aos="fade-up"
      data-aos-duration="1000"
      className="relative w-full overflow-hidden bg-muted/50 section-padding"
    >
      {/* --- EFECTO GRADIENTE QUE SIGUE AL RATÓN (Sin cambios, es perfecto) --- */}
      <div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(350px at ${mousePosition.x} ${mousePosition.y}, hsl(var(--accent) / 0.15), transparent 80%)`,
        }}
      />

      <div className="container relative z-10 mx-auto text-center">
        {/* --- TÍTULO CON ANIMACIÓN INTERNA (Framer Motion) --- */}
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
          <SparklesText
            className="text-4xl font-heading font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            ¿Listo para empezar?
          </SparklesText>
        </motion.div>

        {/* --- PÁRRAFO CON ANIMACIÓN INTERNA (Framer Motion) --- */}
        <motion.p
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 0.2, ease: "easeOut" },
            },
          }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Únete a miles de vendedores que confían en nuestra plataforma. Publica
          tu anuncio en minutos y llega a compradores serios.
        </motion.p>

        {/* --- BOTÓN CON ANIMACIÓN INTERNA (Framer Motion) --- */}
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
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-accent px-8 font-semibold text-accent-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span className="relative">Publicar Anuncio Ahora</span>
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};