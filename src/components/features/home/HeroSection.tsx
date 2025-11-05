// src/components/features/home/HeroSection.tsx
"use client";
import React, { memo, useCallback } from "react";
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

    const testimonialsData = [
    {
      id: "1",
      customerName: "Carlos Ramírez",
      customerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop", // Foto de una persona
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
    // Añadimos un contenedor relativo para el posicionamiento absoluto del fondo
    <section className="relative w-full h-screen overflow-hidden bg-background transition-colors duration-500 flex items-center">
      <AnimatedBackground />
      
      <div className="relative z-10 container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            {/* --- BADGE CON ANIMACIÓN AOS "fade-down" --- */}
            <div
              data-aos="fade-down"
              data-aos-duration="600"
              data-aos-delay="100"
              className="mb-6"
            >
              <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                🏆 Plataforma #1 en ventas de vehículos
              </span>
            </div>

            {/* --- TÍTULO CON ANIMACIÓN AOS "fade-up" --- */}
            <h1
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="200"
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-extrabold leading-tight mb-8"
            >
              <span className="block text-foreground">Vende tu</span>
              <span className="block text-primary">Vehículo</span>
              <span className="block text-foreground">de forma</span>
              <span className="block text-accent">Rápida y Segura</span>
            </h1>

            {/* --- PÁRRAFO CON ANIMACIÓN AOS "fade-up" y más retraso --- */}
            <p
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="400"
              className="text-xl mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 text-muted-foreground"
            >
              La plataforma más confiable para vender tu auto o moto. Conectamos compradores y vendedores de manera segura y eficiente.
            </p>

            {/* --- BOTONES CON ANIMACIÓN AOS "fade-up" y el mayor retraso --- */}
            <div
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="600"
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
            >
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

              <Button
                onClick={onSecondaryButtonClick}
                variant="outline"
                size="lg"
                className="text-lg py-6 px-8 font-bold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {secondaryButtonContent.icon}
                {secondaryButtonContent.text}
              </Button>
            </div>
          </div>
          
          {/* --- CARRUSEL CON ANIMACIÓN AOS "fade-left" --- */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-8">
            <div
              data-aos="fade-left"
              data-aos-duration="800"
              data-aos-delay="800"
              className="text-center"
            >
              <h3 className="text-2xl font-heading font-bold text-foreground">
                Historias de Éxito Sobre Ruedas
              </h3>
              <p className="text-muted-foreground mt-2">
                Vehículos que ya encontraron un nuevo dueño en nuestra plataforma.
              </p>
            </div>
            <ThreeDCarousel testimonials={testimonialsData} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);