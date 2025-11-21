// src/components/features/home/TestimonialsSection.tsx - TESTIMONIOS CON CARRUSEL
"use client";
import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import ThreeDCarousel from "./ThreeDCarousel";

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

const TestimonialsSection = () => {
  return (
    <div className="container-wide">
      {/* 📝 TÍTULO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 card-glass">
          <Quote className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            Testimonios
          </span>
        </div>
        
        <h2 
          className="text-4xl sm:text-5xl font-heading font-extrabold mb-4"
          style={{ 
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Historias de Éxito
        </h2>
        
        <p 
          className="text-lg max-w-2xl mx-auto"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Vehículos que ya encontraron un nuevo dueño en nuestra plataforma
        </p>
      </motion.div>

      {/* 🎠 CARRUSEL 3D */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <ThreeDCarousel testimonials={testimonialsData} />
      </motion.div>
    </div>
  );
};

export default TestimonialsSection;