// src/components/features/home/hero/AnimatedBackground.tsx
"use client";
import React from "react";

export const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Gradiente base */}
    <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-hero)" }} />

    {/* Overlay radial */}
    <div
      className="absolute inset-0 opacity-40"
      style={{
        background: "radial-gradient(circle at 50% 50%, transparent 0%, var(--background) 100%)",
      }}
    />

    {/* Forma flotante principal — CSS keyframe */}
    <div
      className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float-slow"
      style={{
        background: "radial-gradient(circle, var(--accent-10) 0%, transparent 70%)",
      }}
    />

    {/* Forma flotante secundaria */}
    <div
      className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-float-medium"
      style={{
        background: "radial-gradient(circle, var(--success-10) 0%, transparent 70%)",
        animationDelay: "2s",
      }}
    />

    {/* Forma flotante terciaria */}
    <div
      className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full blur-2xl animate-float-slow"
      style={{
        background: "radial-gradient(circle, var(--primary-10) 0%, transparent 70%)",
        animationDelay: "1s",
      }}
    />

    {/* Partículas estáticas con pulse — evitamos JS/Math.random en render */}
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="absolute w-2 h-2 rounded-full animate-pulse-glow"
        style={{
          backgroundColor: "var(--accent)",
          left: `${20 + i * 15}%`,
          top: `${10 + i * 17}%`,
          opacity: 0.4,
          animationDelay: `${i * 0.4}s`,
          animationDuration: `${4 + i * 0.5}s`,
        }}
      />
    ))}

    {/* Grid sutil de fondo */}
    <div
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage: `
          linear-gradient(var(--border) 1px, transparent 1px),
          linear-gradient(90deg, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  </div>
);