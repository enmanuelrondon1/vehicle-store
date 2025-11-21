// src/components/features/home/HomeStatsV2.tsx - STATS CON COUNTUP MEJORADO
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

const HomeStatsV2 = () => {
  return (
    <div className="container-wide relative">
      {/* Fondo decorativo mejorado */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(circle at 30% 70%, var(--primary-5) 0%, transparent 50%), radial-gradient(circle at 70% 30%, var(--accent-5) 0%, transparent 50%)'
        }}
      />
      
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        
        {/* 📝 COLUMNA IZQUIERDA - TEXTO */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold relative">
            <span 
              style={{ 
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 30px var(--accent-10)'
              }}
            >
              Resultados que hablan
              <br />
              por sí mismos
            </span>
          </h2>
          
          <p 
            className="text-lg leading-relaxed font-medium"
            style={{ color: 'var(--foreground)' }}
          >
            Nuestra plataforma ha ayudado a{" "}
            <span className="font-bold text-gradient">miles de personas</span>
            {" "}a vender sus vehículos de forma rápida, segura y rentable.
          </p>
          
          {/* 🎯 BENEFICIOS */}
          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <BenefitCard benefit={benefit} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 📊 COLUMNA DERECHA - ESTADÍSTICAS */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <StatCard
                number={stat.number}
                label={stat.label}
              />
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </div>
  );
};

export default HomeStatsV2;