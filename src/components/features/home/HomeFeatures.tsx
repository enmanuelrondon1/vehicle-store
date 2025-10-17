"use client";
import React from "react";
import { motion } from "framer-motion";
import { FeatureCard } from "./hero/FeatureCard";
import { features } from "./hero/data";

const HomeFeatures = () => {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground">
            ¿Por qué elegirnos?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Te ofrecemos las mejores herramientas y la mayor visibilidad para que vendas tu vehículo al mejor precio y en tiempo récord.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={0.1 + index * 0.1}
              textColor={feature.textColor}
              borderColor={feature.borderColor}
              bgColor={feature.bgColor}
              iconBg={feature.iconBg}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HomeFeatures;