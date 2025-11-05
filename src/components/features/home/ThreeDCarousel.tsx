// src/components/features/home/ThreeDCarousel.tsx
"use client";
import Image from "next/image";
import React, { useMemo, useRef, useEffect, useCallback } from "react";
import { Card as UICard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star } from "lucide-react"; // Iconos para testimonios
import { cn } from "@/lib/utils";

/* 1️⃣  Assets ————————————————————————— */
const FALLBACK_AVATAR =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ' +
  'width="160" height="220"><rect width="100%" height="100%" ' +
  'fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle"' +
  ' text-anchor="middle" fill="%234a5568" font-size="18">Photo</text></svg>';

// 2️⃣  Config ————————————————————————— */
const CARD_W = 320; // Un poco más ancho para texto
const CARD_H = 400; // Más alto para la foto y el texto
const RADIUS = 240;
const TILT_SENSITIVITY = 10;
const DRAG_SENSITIVITY = 0.5;
const INERTIA_FRICTION = 0.95;
const AUTOSPIN_SPEED = 0.08;
const IDLE_TIMEOUT = 2000;

// 3️⃣  Nuevo Tipo de Dato para Testimonios ———————— */
interface Testimonial {
  id: string;
  customerName: string;
  customerPhoto: string;
  vehicleName: string;
  testimonial: string;
  rating: number;
}

// 4️⃣  Componente de Tarjeta de Testimonio (Memoizado) ——— */
interface TestimonialCardProps {
  testimonial: Testimonial;
  transform: string;
  cardW: number;
  cardH: number;
  index: number;
}

const TestimonialCard = React.memo(
  ({ testimonial, transform, cardW, cardH }: TestimonialCardProps) => (
    <div
      className="absolute"
      style={{
        width: cardW,
        height: cardH,
        transform,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <UICard
        className={cn(
          "w-full h-full rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105",
          "bg-card text-card-foreground border-border flex flex-col"
        )}
        style={{ backfaceVisibility: "hidden" }}
      >
        {/* Header con foto y nombre */}
        <div className="flex items-center p-4 pb-2">
          <Image
            src={testimonial.customerPhoto}
            alt={`Foto de ${testimonial.customerName}`}
            width={50}
            height={50}
            className="w-12 h-12 rounded-full object-cover mr-3"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_AVATAR;
            }}
          />
          <div>
            <h4 className="font-heading font-bold text-foreground">{testimonial.customerName}</h4>
            <p className="text-sm text-muted-foreground">Compró un {testimonial.vehicleName}</p>
          </div>
        </div>

        {/* Cuerpo con el testimonio */}
        <div className="flex-1 px-4 pb-4 text-center flex flex-col justify-between">
          <Quote className="w-8 h-8 text-primary/30 mx-auto mb-3 flex-shrink-0" />
          <p className="text-sm text-muted-foreground italic line-clamp-4">
            "{testimonial.testimonial}"
          </p>
        </div>

        {/* Footer con rating y badge */}
        <div className="flex items-center justify-between p-4 pt-2 border-t">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-4 h-4",
                  i < testimonial.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            ))}
          </div>
          <Badge variant="secondary" className="text-xs">
            Verificado
          </Badge>
        </div>
      </UICard>
    </div>
  )
);

TestimonialCard.displayName = "TestimonialCard";

/* 5️⃣  Componente Principal (con nuevas props) —————————— */
interface ThreeDCarouselProps {
  testimonials: Testimonial[];
  radius?: number;
  cardW?: number;
  cardH?: number;
}

const ThreeDCarousel = React.memo(
  ({
    testimonials,
    radius = RADIUS,
    cardW = CARD_W,
    cardH = CARD_H,
  }: ThreeDCarouselProps) => {
    // (Toda la lógica de interacción, drag, etc. permanece exactamente igual)
    const parentRef = useRef<HTMLDivElement>(null);
    const wheelRef = useRef<HTMLDivElement>(null);
    const rotationRef = useRef(0);
    const tiltRef = useRef(0);
    const targetTiltRef = useRef(0);
    const velocityRef = useRef(0);
    const isDraggingRef = useRef(false);
    const dragStartRef = useRef(0);
    const initialRotationRef = useRef(0);
    const lastInteractionRef = useRef(Date.now());
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!parentRef.current || isDraggingRef.current) return;
        lastInteractionRef.current = Date.now();
        const parentRect = parentRef.current.getBoundingClientRect();
        const mouseY = e.clientY - parentRect.top;
        const normalizedY = (mouseY / parentRect.height - 0.5) * 2;
        targetTiltRef.current = -normalizedY * TILT_SENSITIVITY;
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
      const animate = () => {
        if (!isDraggingRef.current) {
          if (Math.abs(velocityRef.current) > 0.01) {
            rotationRef.current += velocityRef.current;
            velocityRef.current *= INERTIA_FRICTION;
          } else if (Date.now() - lastInteractionRef.current > IDLE_TIMEOUT) {
            rotationRef.current += AUTOSPIN_SPEED;
          }
        }
        tiltRef.current += (targetTiltRef.current - tiltRef.current) * 0.1;
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotateX(${tiltRef.current}deg) rotateY(${rotationRef.current}deg)`;
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animationFrameRef.current = requestAnimationFrame(animate);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, []);

    const handleDragStart = useCallback((clientX: number) => {
      lastInteractionRef.current = Date.now();
      isDraggingRef.current = true;
      velocityRef.current = 0;
      dragStartRef.current = clientX;
      initialRotationRef.current = rotationRef.current;
    }, []);

    const handleDragMove = useCallback((clientX: number) => {
      if (!isDraggingRef.current) return;
      lastInteractionRef.current = Date.now();
      const deltaX = clientX - dragStartRef.current;
      const newRotation = initialRotationRef.current + deltaX * DRAG_SENSITIVITY;
      velocityRef.current = newRotation - rotationRef.current;
      rotationRef.current = newRotation;
    }, []);

    const handleDragEnd = useCallback(() => {
      isDraggingRef.current = false;
      lastInteractionRef.current = Date.now();
    }, []);

      const onTouchEnd = useCallback(() => {
      handleDragEnd();
    }, []);

    const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
    const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
    const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);

    const cards = useMemo(
      () =>
        testimonials.map((testimonial, idx) => ({
          key: testimonial.id,
          testimonial,
          transform: `rotateY(${(idx * 360) / testimonials.length}deg) translateZ(${radius}px)`,
        })),
      [testimonials, radius]
    );

    return (
      <div className="w-full py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div
            ref={parentRef}
            className="w-full h-96 flex items-center justify-center overflow-hidden font-sans cursor-grab active:cursor-grabbing bg-background/50 rounded-xl"
            style={{ userSelect: "none" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="relative"
              style={{
                perspective: 1500,
                perspectiveOrigin: "center",
                width: Math.max(cardW * 1.5, radius * 2.2),
                height: Math.max(cardH * 1.8, radius * 1.5),
              }}
            >
              <div
                ref={wheelRef}
                className="relative"
                style={{
                  width: cardW,
                  height: cardH,
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  marginLeft: -cardW / 2,
                  marginTop: -cardH / 2,
                }}
              >
                {cards.map((card) => (
                  <TestimonialCard
                    key={card.key}
                    testimonial={card.testimonial}
                    transform={card.transform}
                    cardW={cardW}
                    cardH={cardH}
                    index={0} // El index ya no se usa en la tarjeta
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ThreeDCarousel.displayName = 'ThreeDCarousel';

export default ThreeDCarousel;