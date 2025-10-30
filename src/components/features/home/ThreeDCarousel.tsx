// src/components/features/home/ThreeFeatures.tsx
"use client";
import Image from "next/image";
import React, { useMemo, useRef, useEffect, useCallback } from "react";
import { Card as UICard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* 1️⃣  Assets ————————————————————————— */
const FALLBACK =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ' +
  'width="160" height="220"><rect width="100%" height="100%" ' +
  'fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle"' +
  ' text-anchor="middle" fill="%234a5568" font-size="18">Image</text></svg>';

// Por favor, reemplaza estas imágenes con las que me proporcionarás.
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517672651691-24622a91b2dc?q=80&w=1974&auto=format&fit=crop",
];

/* 2️⃣  Config ————————————————————————— */
const CARD_W = 180;
const CARD_H = 240;
const RADIUS = 240;
const TILT_SENSITIVITY = 10;
const DRAG_SENSITIVITY = 0.5;
const INERTIA_FRICTION = 0.95;
const AUTOSPIN_SPEED = 0.08;
const IDLE_TIMEOUT = 2000;

/* 3️⃣  Card Component (Memoized for Performance) ——— */
interface CardProps {
  src: string;
  transform: string;
  cardW: number;
  cardH: number;
  index: number;
  title: string;
  price: string;
}

const Card = React.memo(
  ({ src, transform, cardW, cardH, index, title, price }: CardProps) => (
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
          "w-full h-full rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105",
          "bg-card border-border"
        )}
        style={{ backfaceVisibility: "hidden" }}
      >
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt="Carousel item"
            width={cardW}
            height={cardH}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable="false"
            onError={(e) => {
              e.currentTarget.src = FALLBACK;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-lg font-heading mb-1">
              {title}
            </h3>
            <p className="text-white text-sm">{price}</p>
          </div>
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className="bg-primary/20 text-primary-foreground border-primary/30"
            >
              Destacado
            </Badge>
          </div>
        </div>
      </UICard>
    </div>
  )
);

Card.displayName = "Card";

/* 4️⃣  Main component —————————————————— */
interface ThreeDCarouselProps {
  images?: string[];
  radius?: number;
  cardW?: number;
  cardH?: number;
  titles?: string[];
  prices?: string[];
}

const ThreeDCarousel = React.memo(
  ({
    images = DEFAULT_IMAGES,
    radius = RADIUS,
    cardW = CARD_W,
    cardH = CARD_H,
    titles = Array(images.length).fill("Vehículo Premium"),
    prices = Array(images.length).fill("$25,000"),
  }: ThreeDCarouselProps) => {
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

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);

    useEffect(() => {
      const animate = () => {
        if (!isDraggingRef.current) {
          // Apply inertia
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
      const newRotation =
        initialRotationRef.current + deltaX * DRAG_SENSITIVITY;

      velocityRef.current = newRotation - rotationRef.current;
      rotationRef.current = newRotation;
    }, []);

    // Handle drag end
    const handleDragEnd = useCallback(() => {
      isDraggingRef.current = false;
      lastInteractionRef.current = Date.now();
    }, []);

    // Event listeners for mouse and touch
    const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
    const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
    const onTouchStart = (e: React.TouchEvent) =>
      handleDragStart(e.touches[0].clientX);
    const onTouchMove = (e: React.TouchEvent) =>
      handleDragMove(e.touches[0].clientX);

    /* Pre-compute card transforms (only re-computes if images/radius change) */
    const cards = useMemo(
      () =>
        images.map((src, idx) => {
          const angle = (idx * 360) / images.length;
          return {
            key: idx,
            src,
            transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
          };
        }),
      [images, radius]
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
            onTouchEnd={handleDragEnd}
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
                {cards.map((card, idx) => (
                  <Card
                    key={card.key}
                    src={card.src}
                    transform={card.transform}
                    cardW={cardW}
                    cardH={cardH}
                    index={idx}
                    title={titles[idx]}
                    price={prices[idx]}
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