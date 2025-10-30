// src/components/features/home/HeroSection.tsx
"use client";
import React, { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Car, List, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "./hero/AnimatedBackground";
import ThreeDCarousel from "./ThreeDCarousel";

interface HeroSectionProps {
  onSellClick: () => void;
  onSecondaryButtonClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSellClick, onSecondaryButtonClick }) => {
  const { status } = useSession();

  const getSecondaryButtonContent = useCallback(() => {
    if (status === "authenticated") {
      return {
        text: "Ver Anuncios",
        icon: <List className="w-5 h-5 mr-2" />,
      };
    } else {
      return {
        text: "Explorar Catálogo",
        icon: <Search className="w-5 h-5 mr-2" />,
      };
    }
  }, [status]);

  const secondaryButtonContent = getSecondaryButtonContent();

  return (
    <section className="relative w-full h-screen overflow-hidden bg-background transition-colors duration-500 flex items-center">
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                🏆 Plataforma #1 en ventas de vehículos
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-extrabold leading-tight mb-8"
            >
              <span className="block text-foreground">Vende tu</span>
              <span className="block text-primary">Vehículo</span>
              <span className="block text-foreground">de forma</span>
              <span className="block text-accent">Rápida y Segura</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 text-muted-foreground"
            >
              La plataforma más confiable para vender tu auto o moto. Conectamos compradores y vendedores de manera segura y eficiente.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
            >
              {/* Botón Principal con color de acento */}
              <Button
                onClick={onSellClick}
                size="lg"
                className="relative overflow-hidden text-lg py-6 px-8 font-bold text-accent-foreground bg-accent hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center">
                  <Car className="w-6 h-6 mr-3" />
                  Vender mi Vehículo
                </span>
              </Button>

              {/* Botón Secundario con estilo limpio */}
              <Button
                onClick={onSecondaryButtonClick}
                variant="outline"
                size="lg"
                className="text-lg py-6 px-8 font-bold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {secondaryButtonContent.icon}
                {secondaryButtonContent.text}
              </Button>
            </motion.div>
          </div>
          
          <div className="hidden lg:flex flex-col items-center justify-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-center"
            >
              <h3 className="text-2xl font-heading font-bold text-foreground">
                Historias de Éxito Sobre Ruedas
              </h3>
              <p className="text-muted-foreground mt-2">
                Vehículos que ya encontraron un nuevo dueño en nuestra plataforma.
              </p>
            </motion.div>
            <ThreeDCarousel />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);