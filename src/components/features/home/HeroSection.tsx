// src/components/features/home/HeroSection.tsx
"use client";
import React, { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Car, DollarSign, List } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "./hero/AnimatedBackground";
import SparklesText from "@/components/ui/SparklesText";
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
        variant: "default" as const,
        className:
          "bg-gradient-to-r from-[var(--chart-3)] to-[oklch(0.7_0.18_140)] hover:from-[var(--chart-3)]/90 hover:to-[oklch(0.7_0.18_140)]/90 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg py-6",
      };
    } else {
      return {
        text: "Conoce más",
        icon: <DollarSign className="w-5 h-5 mr-2" />,
        variant: "outline" as const,
        className:
          "transition-all duration-300 border-border hover:bg-accent text-muted-foreground hover:text-foreground text-lg py-6",
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
                <span className="w-2 h-2 bg-[var(--chart-3)] rounded-full mr-2 animate-pulse"></span>
                🏆 Plataforma #1 en ventas de vehículos
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-8"
            >
              <span className="block text-foreground mb-2">Vende tu</span>
              <SparklesText
                as="span"
                className="block font-black mb-2"
                colors={{ first: 'oklch(0.6 0.18 250)', second: 'oklch(0.696 0.17 162.48)' }}
                sparkleCount={25}
                sparkleSize={14}
              >
                <span className="bg-gradient-to-r from-primary to-[oklch(0.55_0.15_270)] bg-clip-text text-transparent">
                  Vehículo
                </span>
              </SparklesText>
              <span className="block text-foreground mb-2">de forma</span>
              <SparklesText
                as="span"
                className="block font-black"
                colors={{ first: 'oklch(0.645 0.246 16.439)', second: 'oklch(0.7 0.25 25)' }}
                sparkleCount={25}
                sparkleSize={14}
              >
                <span className="bg-gradient-to-r from-[var(--chart-5)] to-[var(--destructive)] bg-clip-text text-transparent">
                  Rápida y Segura
                </span>
              </SparklesText>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 text-muted-foreground"
            >
              {"La plataforma más confiable para vender tu auto o moto. Conectamos compradores y vendedores de manera segura y eficiente. Miles de usuarios ya confían en nosotros."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
            >
              <Button
                onClick={onSellClick}
                size="lg"
                className="relative overflow-hidden text-lg py-6 px-8 font-bold text-primary-foreground bg-gradient-to-r from-primary to-[oklch(0.55_0.15_270)] hover:from-primary/90 hover:to-[oklch(0.55_0.15_270)]/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center">
                  <Car className="w-6 h-6 mr-3" />
                  {"Vender mi Vehículo"}
                </span>
              </Button>

              <Button
                onClick={onSecondaryButtonClick}
                variant={secondaryButtonContent.variant}
                size="lg"
                className={`${secondaryButtonContent.className} backdrop-blur-sm`}
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
              <h3 className="text-2xl font-bold text-foreground">
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