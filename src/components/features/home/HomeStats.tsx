// src/components/features/home/HomeStats.tsx
"use client";
import React from "react";
import { StatCard } from "./hero/StatCard";
import { BenefitCard } from "./hero/BenefitCard";
import { stats, benefits } from "./hero/data";

const HomeStats = () => {
  return (
    // Usamos nuestra clase de utilidad para consistencia
    <section className="section-padding bg-background">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* --- COLUMNA IZQUIERDA (TEXTO) CON ANIMACIÓN AOS "fade-right" --- */}
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-foreground">
              Resultados que hablan por sí mismos
            </h2>
            <p className="text-lg text-muted-foreground">
              Nuestra plataforma ha ayudado a miles de personas a vender sus vehículos de forma rápida, segura y rentable. Los números no mienten.
            </p>
            {/* --- BENEFICIOS CON ANIMACIÓN ESCALONADA --- */}
            <div className="flex flex-wrap gap-3">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay={index * 100} // Retraso escalonado
                >
                  <BenefitCard benefit={benefit} />
                </div>
              ))}
            </div>
          </div>

          {/* --- COLUMNA DERECHA (ESTADÍSTICAS) CON ANIMACIÓN AOS "fade-left" --- */}
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