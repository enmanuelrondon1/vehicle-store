// src/components/features/home/TestimonialsSection.tsx
// ✅ FIXES:
// 1. URL de Unsplash corregida (faltaba un carácter)
// 2. onError sin bucle infinito — usa iniciales CSS en lugar de img externa
// 3. setState durante render eliminado
"use client";
import React, { useState, memo } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

const testimonialsData = [
  {
    id: "1",
    customerName: "Carlos Ramírez",
    // ✅ URL corregida
    customerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=96&auto=format&fit=crop",
    vehicleName: "Honda Accord 2022",
    testimonial: "Increíble plataforma. Vendí mi coche en menos de una semana y el proceso fue súper seguro. ¡Totalmente recomendado!",
    rating: 5,
  },
  {
    id: "2",
    customerName: "Ana Sofía Mendoza",
    // ✅ URL corregida (faltaba "c" al final del ID)
    customerPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=96&auto=format&fit=crop",
    vehicleName: "Toyota Corolla 2021",
    testimonial: "Estaba un poco escéptica al principio, pero el equipo me guió en cada paso. Conseguí un precio justo y muy rápido.",
    rating: 5,
  },
  {
    id: "3",
    customerName: "Luis Gutiérrez",
    customerPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=96&auto=format&fit=crop",
    vehicleName: "Ford Mustang 2020",
    testimonial: "La mejor experiencia de venta que he tenido. La visibilidad que le dan a tu anuncio es increíble. Miles de gracias.",
    rating: 4,
  },
  {
    id: "4",
    customerName: "María Fernanda López",
    customerPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=96&auto=format&fit=crop",
    vehicleName: "Mazda CX-5 2023",
    testimonial: "Fácil, rápido y seguro. Me encantó que pudiera gestionar todo desde mi teléfono. ¡Vender mi auto nunca fue tan fácil!",
    rating: 5,
  },
  {
    id: "5",
    customerName: "Roberto Díaz",
    customerPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=96&auto=format&fit=crop",
    vehicleName: "Chevrolet Silverado 2019",
    testimonial: "Como vendedor, esta plataforma me ha conectado con clientes serios. He vendido más vehículos aquí que en cualquier otro lugar.",
    rating: 5,
  },
  {
    id: "6",
    customerName: "Valentina Torres",
    customerPhoto: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=96&auto=format&fit=crop",
    vehicleName: "Nissan Sentra 2022",
    testimonial: "El proceso de verificación me dio mucha confianza. Supe que estaba tratando con compradores serios desde el primer mensaje.",
    rating: 5,
  },
];

/* ============================================
   Avatar con fallback CSS — sin requests externos
   ✅ Evita el bucle infinito de onError
   ============================================ */
const AvatarWithFallback = memo(({
  src,
  name,
}: {
  src: string;
  name: string;
}) => {
  const [hasError, setHasError] = useState(false);

  // Iniciales para el fallback CSS
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (hasError) {
    // ✅ Fallback CSS puro — sin imagen externa, sin bucle
    return (
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
        style={{
          background: "var(--gradient-accent)",
          color: "var(--accent-foreground)",
          border: "2px solid var(--border)",
        }}
        aria-label={`Avatar de ${name}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`Foto de ${name}`}
      width={48}
      height={48}
      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      style={{ border: "2px solid var(--border)" }}
      // ✅ onError solo cambia hasError a true — no carga otra imagen externa
      onError={() => setHasError(true)}
    />
  );
});
AvatarWithFallback.displayName = "AvatarWithFallback";

/* ============================================
   Tarjeta individual
   ============================================ */
const TestimonialCard = memo(({
  testimonial,
}: {
  testimonial: (typeof testimonialsData)[0];
}) => (
  <div
    className="relative flex-shrink-0 w-80 rounded-2xl p-6 mx-3 testimonial-card"
    style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      boxShadow: "0 4px 24px var(--primary-10)",
    }}
  >
    {/* Comilla decorativa */}
    <div
      className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "var(--accent-10)" }}
      aria-hidden="true"
    >
      <Quote className="w-4 h-4" style={{ color: "var(--accent)" }} />
    </div>

    {/* Header */}
    <div className="flex items-center gap-3 mb-4">
      <div className="relative flex-shrink-0">
        <AvatarWithFallback src={testimonial.customerPhoto} name={testimonial.customerName} />
        {/* Badge verificado */}
        <div
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--success)" }}
          aria-hidden="true"
        >
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="min-w-0">
        <p className="font-bold text-sm truncate" style={{ color: "var(--foreground)" }}>
          {testimonial.customerName}
        </p>
        <p className="text-xs truncate" style={{ color: "var(--accent)" }}>
          Vendió: {testimonial.vehicleName}
        </p>
      </div>
    </div>

    {/* Estrellas */}
    <div className="flex gap-0.5 mb-3" aria-label={`${testimonial.rating} de 5 estrellas`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className="w-3.5 h-3.5"
          style={{
            color: i < testimonial.rating ? "var(--accent)" : "var(--border)",
            fill: i < testimonial.rating ? "var(--accent)" : "transparent",
          }}
          aria-hidden="true"
        />
      ))}
    </div>

    {/* Testimonio */}
    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "var(--muted-foreground)" }}>
      "{testimonial.testimonial}"
    </p>
  </div>
));
TestimonialCard.displayName = "TestimonialCard";

/* ============================================
   Fila de marquee
   ============================================ */
const MarqueeRow = ({
  items,
  direction = "left",
  speed = 35,
}: {
  items: (typeof testimonialsData);
  direction?: "left" | "right";
  speed?: number;
}) => {
  const doubled = [...items, ...items];

  return (
    <div
      className="flex overflow-hidden"
      style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
    >
      <motion.div
        className="flex"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
        ))}
      </motion.div>
    </div>
  );
};

/* ============================================
   Sección principal
   ============================================ */
const TestimonialsSection = () => {
  const firstRow = testimonialsData.slice(0, 3);
  const secondRow = testimonialsData.slice(3, 6);

  return (
    <section className="w-full overflow-hidden" aria-label="Testimonios de clientes">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ background: "var(--accent-10)", border: "1px solid var(--accent-20)" }}
          >
            <Star className="w-4 h-4" style={{ color: "var(--accent)" }} fill="currentColor" aria-hidden="true" />
            <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>Testimonios</span>
          </div>

          <h2
            className="text-4xl sm:text-5xl font-heading font-extrabold mb-4"
            style={{
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Historias de Éxito
          </h2>

          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--muted-foreground)" }}>
            Vehículos que ya encontraron un nuevo dueño en nuestra plataforma
          </p>
        </motion.div>
      </div>

      <div className="space-y-4">
        <MarqueeRow items={firstRow} direction="left" speed={40} />
        <MarqueeRow items={secondRow} direction="right" speed={35} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="container-wide mt-10 flex flex-wrap justify-center gap-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex" aria-label="4.8 de 5 estrellas">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5" style={{ color: "var(--accent)" }} fill="currentColor" aria-hidden="true" />
            ))}
          </div>
          <div>
            <span className="font-bold text-lg" style={{ color: "var(--foreground)" }}>4.8</span>
            <span className="text-sm ml-1" style={{ color: "var(--muted-foreground)" }}>/ 5.0</span>
          </div>
          <div className="w-px h-6" style={{ backgroundColor: "var(--border)" }} aria-hidden="true" />
          <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Basado en{" "}
            <span className="font-semibold" style={{ color: "var(--foreground)" }}>+2,500</span>
            {" "}reseñas verificadas
          </span>
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;