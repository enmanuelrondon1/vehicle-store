// src/components/features/home/HomeFeatures.tsx (versión corregida)
"use client";
import React from "react";
import { FeatureCard } from "./hero/FeatureCard";
import { features } from "./hero/data";

const HomeFeatures = () => {
  return (
    <section id="features" className="section-spacing relative overflow-hidden">
      {/* Fondo sutil con efectos */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, var(--primary-5) 0%, transparent 70%)'
        }}
      />
      
      {/* ✅ GRID COPIADO EXACTAMENTE DE HEROSECTION */}
      <div 
        className="absolute inset-0 -z-10 opacity-3"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Elementos decorativos flotantes */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full opacity-20 animate-float" style={{ backgroundColor: 'var(--accent-10)' }}></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full opacity-20 animate-float" style={{ backgroundColor: 'var(--primary-10)', animationDelay: '1s' }}></div>
      
      <div className="container-wide">
        {/* TÍTULO Y DESCRIPCIÓN CON EFECTOS PREMIUM MEJORADOS */}
        <div
          data-aos="fade-up"
          data-aos-duration="800"
          className="text-center mb-16"
        >
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold mb-6"
            style={{ 
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            ¿Por qué elegirnos?
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Te ofrecemos las mejores herramientas y la mayor visibilidad para que 
            <span className="font-semibold" style={{ color: 'var(--foreground)' }}> vendas tu vehículo</span> al mejor precio y en tiempo récord.
          </p>
        </div>

        {/* GRID DE TARJETAS CON EFECTOS PREMIUM MEJORADOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay={index * 100}
              className="h-full"
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFeatures;