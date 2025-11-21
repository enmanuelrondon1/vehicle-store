// src/components/features/home/HeroSection.tsx (versión mejorada)
"use client";
import React, { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Car, List, Search, Shield, Zap, Sparkles } from "lucide-react";
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

  const testimonialsData = [
    {
      id: "1",
      customerName: "Carlos Ramírez",
      customerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
      vehicleName: "Honda Accord 2022",
      testimonial: "Increíble plataforma. Vendí mi coche en menos de una semana y el proceso fue súper seguro. ¡Totalmente recomendado!",
      rating: 5,
    },
    {
      id: "2",
      customerName: "Ana Sofía Mendoza",
      customerPhoto: "https://images.unsplash.com/photo-1494790108755-2616b332c1f?q=80&w=256&auto=format&fit=crop",
      vehicleName: "Toyota Corolla 2021",
      testimonial: "Estaba un poco escéptica al principio, pero el equipo me guió en cada paso. Conseguí un precio justo y muy rápido.",
      rating: 5,
    },
    {
      id: "3",
      customerName: "Luis Gutiérrez",
      customerPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&auto=format&fit=crop",
      vehicleName: "Ford Mustang 2020",
      testimonial: "La mejor experiencia de venta que he tenido. La visibilidad que le dan a tu anuncio es increíble. Miles de gracias.",
      rating: 4,
    },
    {
      id: "4",
      customerName: "María Fernanda López",
      customerPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop",
      vehicleName: "Mazda CX-5 2023",
      testimonial: "Fácil, rápido y seguro. Me encantó que pudiera gestionar todo desde mi teléfono. ¡Vender mi auto nunca fue tan fácil!",
      rating: 5,
    },
    {
      id: "5",
      customerName: "Roberto Díaz",
      customerPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop",
      vehicleName: "Chevrolet Silverado 2019",
      testimonial: "Como vendedor, esta plataforma me ha conectado con clientes serios. He vendido más vehículos aquí que en cualquier otro lugar.",
      rating: 5,
    },
  ];

  const getSecondaryButtonContent = useCallback(() => {
    if (status === "authenticated") {
      return { text: "Ver Anuncios", icon: <List className="w-5 h-5 mr-2" /> };
    } else {
      return { text: "Explorar Catálogo", icon: <Search className="w-5 h-5 mr-2" /> };
    }
  }, [status]);

  const secondaryButtonContent = getSecondaryButtonContent();

  return (
    <section className="relative w-full min-h-screen overflow-hidden transition-colors duration-500 flex items-center" style={{ background: 'var(--gradient-hero)' }}>
      <AnimatedBackground />
      
      <div className="relative z-10 container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            {/* BADGE PREMIUM CON EFECTOS MEJORADOS */}
            <motion.div
              data-aos="fade-down"
              data-aos-duration="600"
              data-aos-delay="100"
              className="mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold border backdrop-blur-sm card-glass glow-effect group cursor-pointer">
                <motion.div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: 'var(--accent)' }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Shield className="w-4 h-4 mr-2" style={{ color: 'var(--accent)' }} />
                <span className="text-gradient">🏆 Plataforma #1 en ventas de vehículos</span>
                <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>

            {/* TÍTULO CON EFECTOS PREMIUM MEJORADOS */}
            <motion.h1
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="200"
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-extrabold leading-tight mb-8"
            >
              <span className="block" style={{ color: 'var(--foreground)' }}>Vende tu</span>
              
              {/* PALABRA VEHÍCULO CON EFECTO DESTACADO MEJORADO */}
              <motion.span 
                className="block relative"
                style={{ 
                  color: 'var(--accent)',
                  textShadow: '0 0 20px var(--accent-20), 0 0 40px var(--accent-10)',
                  filter: 'brightness(1.2)'
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                Vehículo
                {/* Efecto de brillo mejorado */}
                <motion.span 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
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
                >
                  Vehículo
                </motion.span>
              </motion.span>
              
              <span className="block" style={{ color: 'var(--foreground)' }}>de forma</span>
              <motion.span 
                className="block"
                style={{ 
                  background: 'var(--gradient-accent)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                Rápida y Segura
              </motion.span>
            </motion.h1>

            {/* PÁRRAFO MEJORADO CON EFECTOS DE ENTRADA */}
            <motion.p
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="400"
              className="text-xl mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0"
              style={{ color: 'var(--muted-foreground)' }}
            >
              La plataforma más confiable para vender tu auto o moto. 
              <motion.span 
                className="font-semibold inline-block"
                style={{ color: 'var(--foreground)' }}
                whileHover={{ color: 'var(--accent)' }}
                transition={{ duration: 0.2 }}
              >
                {" "}Conectamos compradores y vendedores
              </motion.span>{" "}
              de manera segura y eficiente.
            </motion.p>

            {/* BOTONES CON EFECTOS PREMIUM MEJORADOS */}
            <motion.div
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="600"
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
            >
              <Button
                onClick={onSellClick}
                size="lg"
                className="btn-accent text-lg py-6 px-8 font-bold glow-effect group relative overflow-hidden"
              >
                {/* Efecto shimmer mejorado */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)'
                  }}
                  animate={{
                    x: ["-100%", "100%"]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut"
                  }}
                />
                
                <span className="relative flex items-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Car className="w-6 h-6 mr-3" />
                  </motion.div>
                  Vender mi Vehículo
                  <Zap className="w-4 h-4 ml-2 animate-pulse" />
                </span>
              </Button>

              {/* BOTÓN SECUNDARIO CON EFECTOS MEJORADOS */}
              <Button
                onClick={onSecondaryButtonClick}
                variant="outline"
                size="lg"
                className="text-lg py-6 px-8 font-bold border-2 transition-all duration-300 group relative overflow-hidden card-hover"
                style={{
                  borderColor: 'var(--accent)',
                  backgroundColor: 'var(--accent-10)',
                  color: 'var(--accent)',
                  boxShadow: '0 4px 12px var(--accent-20)',
                }}
              >
                {/* Efecto shimmer mejorado */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(to right, transparent, var(--accent-20), transparent)'
                  }}
                  animate={{
                    x: ["-100%", "100%"]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    ease: "easeInOut"
                  }}
                />
                
                <span className="relative flex items-center font-medium">
                  {secondaryButtonContent.icon}
                  {secondaryButtonContent.text}
                </span>
              </Button>
            </motion.div>
          </div>
          
          {/* CARRUSEL CON EFECTOS MEJORADOS */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-8">
            <motion.div
              data-aos="fade-left"
              data-aos-duration="800"
              data-aos-delay="800"
              className="text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <h3 
                className="text-2xl font-heading font-bold"
                style={{ 
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Historias de Éxito Sobre Ruedas
              </h3>
              <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
                Vehículos que ya encontraron un nuevo dueño en nuestra plataforma.
              </p>
            </motion.div>
            <ThreeDCarousel testimonials={testimonialsData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);