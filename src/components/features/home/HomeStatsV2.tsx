// src/components/features/home/HomeStatsV2.tsx
// ✅ FIX TBT: staggerChildren en contenedor — de 6 observers a 2
"use client";
import React from "react";
import { motion } from "framer-motion";
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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const benefitVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

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
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
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

          {/* ✅ Un observer para los 4 benefits */}
          <motion.div
            className="flex flex-wrap gap-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={benefitVariants}>
                <BenefitCard benefit={benefit} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ✅ Un observer para las 4 stat cards */}
        <motion.div
          className="grid grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <StatCard number={stat.number} label={stat.label} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default HomeStatsV2;