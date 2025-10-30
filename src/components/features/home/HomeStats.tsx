// src/components/features/home/HomeStats.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { StatCard } from "./hero/StatCard";
import { BenefitCard } from "./hero/BenefitCard"; // Usaremos el nuevo componente
import { stats, benefits } from "./hero/data";

const HomeStats = () => {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-foreground mb-6">
              Resultados que hablan por sí mismos
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nuestra plataforma ha ayudado a miles de personas a vender sus vehículos de forma rápida, segura y rentable. Los números no mienten.
            </p>
            <div className="flex flex-wrap gap-3 justify-start">
              {benefits.map((benefit, index) => (
                <BenefitCard key={index} benefit={benefit} />
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                number={stat.number}
                label={stat.label}
                index={index}
                // ¡Se eliminaron todas las props de color!
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeStats;