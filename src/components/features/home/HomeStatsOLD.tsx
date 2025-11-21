// src/components/features/home/HomeStats.tsx
"use client";
import React from "react";
import { StatCard } from "./hero/StatCard";
import { BenefitCard } from "./hero/BenefitCard";
import { stats, benefits } from "./hero/data";

const HomeStats = () => {
  return (
    <section className="section-spacing relative overflow-hidden">
      {/* Fondo mejorado para modo oscuro */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(circle at 30% 70%, var(--primary-10) 0%, transparent 50%), radial-gradient(circle at 70% 30%, var(--accent-10) 0%, transparent 50%)'
        }}
      />
      
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* COLUMNA IZQUIERDA (TEXTO) CON EFECTOS MEJORADOS */}
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            className="space-y-8"
          >
            {/* TÍTULO CON MEJOR VISIBILIDAD EN MODO OSCURO */}
        {/* TÍTULO CON GRADIENTE MEJORADO PARA MODO OSCURO */}
<h2 
  className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold mb-4 relative"
>
  <span 
    style={{ 
      background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 50%, var(--accent) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 0 30px var(--accent-20), 0 0 60px var(--accent-10)',
      filter: 'brightness(1.3)'
    }}
  >
    Resultados que hablan por sí mismos
  </span>
  
  {/* Efecto shimmer adicional */}
  <span 
    className="absolute inset-0"
    style={{
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animation: 'shimmer 3s infinite'
    }}
  >
    Resultados que hablan por sí mismos
  </span>
</h2>
            
            <p 
              className="text-lg leading-relaxed font-medium"
              style={{ color: 'var(--foreground)' }}
            >
              Nuestra plataforma ha ayudado a miles de personas a vender sus vehículos de forma rápida, segura y rentable. Los números no mienten.
            </p>
            
            {/* BENEFICIOS CON EFECTOS MEJORADOS */}
            <div className="flex flex-wrap gap-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay={index * 100}
                >
                  <BenefitCard benefit={benefit} />
                </div>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA (ESTADÍSTICAS) CON EFECTOS MEJORADOS */}
          <div
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="200"
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                number={stat.number}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeStats;