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
    <motion.section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.5 }}
      className="relative w-full overflow-hidden bg-secondary/30 py-20 md:py-28"
    >
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(350px at ${mousePosition.x} ${mousePosition.y}, hsl(var(--primary) / 0.15), transparent 80%)`,
        }}
      />

      <div className="container relative z-10 mx-auto text-center">
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
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
            sparkleCount={10}
          >
            Vende tu Vehículo Hoy
          </SparklesText>
        </motion.div>

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
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-primary px-8 font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary to-[hsl(var(--primary)/0.8)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative">Publicar Anuncio</span>
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
};