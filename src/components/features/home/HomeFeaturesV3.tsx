// src/components/features/home/HomeFeaturesV3.tsx
// ✅ FIX TBT: un solo motion.div contenedor en lugar de motion.div por cada feature
"use client";
import React from "react";
import { motion } from "framer-motion";
import { FeatureCard } from "./hero/FeatureCard";
import { Zap, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Publicación en 5 Minutos",
    description:
      "Sube tu anuncio de forma rápida con nuestro sistema optimizado. Sin complicaciones, sin demoras.",
  },
  {
    icon: Shield,
    title: "100% Seguro y Verificado",
    description:
      "Verificación de usuarios, soporte 24/7 y proceso 100% digital para tu tranquilidad total.",
  },
  {
    icon: Users,
    title: "Sin Comisiones Ocultas",
    description:
      "Transparencia total. Lo que ves es lo que pagas. Miles de compradores activos esperando.",
  },
];

// ✅ staggerChildren en el contenedor — 1 observer en lugar de 4
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const HomeFeaturesV3 = () => {
  return (
    <div className="container-wide relative">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--primary-10) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2
          className="text-4xl sm:text-5xl font-heading font-extrabold mb-6"
          style={{
            background: "var(--gradient-primary)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ¿Por qué elegirnos?
        </h2>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Tres razones que nos hacen{" "}
          <span className="font-semibold" style={{ color: "var(--foreground)" }}>
            la mejor opción
          </span>{" "}
          del mercado
        </p>
      </motion.div>

      {/* ✅ Un solo observer para los 3 cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={itemVariants} className="h-full">
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HomeFeaturesV3;