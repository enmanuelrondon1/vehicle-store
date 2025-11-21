// src/components/features/home/hero/AnimatedBackground.tsx (versión mejorada)
"use client";
import React from "react";
import { motion } from "framer-motion";

export const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Gradiente base premium más sutil */}
    <div 
      className="absolute inset-0 opacity-30" 
      style={{ background: 'var(--gradient-hero)' }} 
    />
    
    {/* Capa de overlay sutil mejorada */}
    <div 
      className="absolute inset-0 opacity-40"
      style={{
        background: 'radial-gradient(circle at 50% 50%, transparent 0%, var(--background) 100%)'
      }}
    />
    
    {/* Forma flotante principal - Accent más sutil */}
    <motion.div
      animate={{
        y: [0, -20, 0],
        x: [0, 15, 0],
        rotate: [0, 5, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
      style={{
        background: 'radial-gradient(circle, var(--accent-10) 0%, transparent 70%)'
      }}
    />
    
    {/* Forma flotante secundaria - Success más sutil */}
    <motion.div
      animate={{
        y: [0, 15, 0],
        x: [0, -15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      }}
      className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
      style={{
        background: 'radial-gradient(circle, var(--success-10) 0%, transparent 70%)'
      }}
    />

    {/* Elemento flotante terciario - Primary más sutil */}
    <motion.div
      animate={{
        y: [0, -25, 0],
        x: [0, 20, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{
        duration: 14,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1,
      }}
      className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full blur-2xl"
      style={{
        background: 'radial-gradient(circle, var(--primary-10) 0%, transparent 70%)'
      }}
    />

    {/* Partículas flotantes más sutiles y menos numerosas */}
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          backgroundColor: 'var(--accent)',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: 0.4,
        }}
        animate={{
          y: [0, -80 - Math.random() * 40, 0],
          opacity: [0, 0.6, 0],
          scale: [0, 1, 0],
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut",
        }}
      />
    ))}

    {/* Grid sutil de fondo más sutil */}
    <div 
      className="absolute inset-0 opacity-3"
      style={{
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  </div>
);