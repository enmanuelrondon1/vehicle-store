// src/components/features/vehicles/reels/HeartAnimation.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface HeartAnimationProps {
  isFavorited: boolean;
  onToggle: () => void;
}

export const HeartAnimation: React.FC<HeartAnimationProps> = ({
  isFavorited,
  onToggle,
}) => {
  const [hearts, setHearts] = useState<Array<{ id: number }>>([]);

  const createHeartParticles = () => {
    // Crear múltiples corazones flotantes
    const newHearts = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
    }));

    setHearts((prev) => [...prev, ...newHearts]);

    // Limpiar después de la animación
    setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.find((nh) => nh.id === h.id))
      );
    }, 1000);
  };

  const handleHeartClick = () => {
    if (!isFavorited) {
      createHeartParticles();
    }
    onToggle();
  };

  return (
    <div className="relative">
      {/* Botón Principal */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        onClick={handleHeartClick}
        className="relative w-14 h-14 rounded-full shadow-lg bg-black/50 hover:bg-black/70 backdrop-blur-md flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black/50"
      >
        {/* Corazón animado */}
        <motion.div
          initial={false}
          animate={{
            scale: isFavorited ? [1, 1.3, 1.1] : 1,
          }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
        >
          <Heart
            className={`w-6 h-6 transition-all duration-300 ${
              isFavorited
                ? "fill-red-500 text-red-500"
                : "text-white hover:text-red-200"
            }`}
          />
        </motion.div>

        {/* Pulse Ring (solo cuando favorited) */}
        {isFavorited && (
          <>
            <motion.div
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-red-500"
            />
            <motion.div
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="absolute inset-0 rounded-full border-2 border-red-500/50"
            />
          </>
        )}
      </motion.button>

      {/* Partículas de Corazones Flotantes */}
      <AnimatePresence>
        {hearts.map((heart) => {
          const angle = (Math.random() * Math.PI * 2); // Ángulo aleatorio
          const distance = 100 + Math.random() * 50; // Distancia aleatoria
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance - 100; // Arriba predominantemente

          return (
            <motion.div
              key={heart.id}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x,
                y,
                opacity: 0,
                scale: 0.3,
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
              className="absolute pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "linear" }}
              >
                <Heart className="w-5 h-5 fill-red-500 text-red-500 drop-shadow-lg" />
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default HeartAnimation;