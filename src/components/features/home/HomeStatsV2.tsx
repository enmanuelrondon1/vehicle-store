// src/components/features/home/HomeStatsV2.tsx
// ✅ OPTIMIZADO: sin framer-motion en bundle inicial, CSS animations en lugar de JS
"use client";
import React from "react";
import { StatCard } from "./hero/StatCard";
import { BenefitCard } from "./hero/BenefitCard";

const stats = [
  { number: "50K+", label: "Vehículos Vendidos" },
  { number: "25K+", label: "Usuarios Activos" },
  { number: "4.8", label: "Calificación Obtenida" },
  { number: "48h", label: "Tiempo Promedio" },
];

const benefits = [
  "Sin comisiones ocultas",
  "Soporte 24/7",
  "Proceso 100% digital",
  "Verificación de usuarios",
];

const HomeStatsV2 = () => {
  return (
    <div className="container-wide relative">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 30% 70%, var(--primary-10) 0%, transparent 50%), radial-gradient(circle at 70% 30%, var(--accent-10) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* Columna izquierda */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold">
            <span className="text-gradient">
              Resultados que hablan
              <br />
              por sí mismos
            </span>
          </h2>

          <p className="text-lg leading-relaxed font-medium" style={{ color: "var(--foreground)" }}>
            Nuestra plataforma ha ayudado a{" "}
            <span className="font-bold text-gradient">miles de personas</span>
            {" "}a vender sus vehículos de forma rápida, segura y rentable.
          </p>

          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="animate-in fade-in duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <BenefitCard benefit={benefit} />
              </div>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <StatCard number={stat.number} label={stat.label} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default HomeStatsV2;