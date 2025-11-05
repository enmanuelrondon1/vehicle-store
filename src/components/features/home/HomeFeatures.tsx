// src/components/features/home/HomeFeatures.tsx
"use client";
import React from "react";
import { FeatureCard } from "./hero/FeatureCard";
import { features } from "./hero/data";

const HomeFeatures = () => {
  return (
    // Usamos nuestra clase de utilidad para consistencia
    <section id="features" className="section-padding bg-muted/30">
      <div className="container-max">
        {/* --- TÍTULO Y DESCRIPCIÓN CON ANIMACIÓN AOS "fade-up" --- */}
        <div
          data-aos="fade-up"
          data-aos-duration="800"
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-foreground">
            ¿Por qué elegirnos?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Te ofrecemos las mejores herramientas y la mayor visibilidad para que vendas tu vehículo al mejor precio y en tiempo récord.
          </p>
        </div>

        {/* --- GRID DE TARJETAS CON ANIMACIÓN AOS "fade-up" --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            // --- CADA TARJETA TIENE SU PROPIO RETRASO ---
            <div
              key={index}
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay={index * 100} // Retraso escalonado: 0ms, 100ms, 200ms...
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