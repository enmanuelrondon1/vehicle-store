// src/components/features/vehicles/list/VehicleListHeader.tsx
"use client";
import { motion } from "framer-motion";
import { Search, Car, Sparkles, Shield, TrendingUp } from "lucide-react";

interface VehicleListHeaderProps {
  vehicleCount: number;
}

const VehicleListHeader: React.FC<VehicleListHeaderProps> = ({
  vehicleCount,
}) => {
  // Variantes de animación para elementos individuales
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="relative text-center overflow-hidden">
      {/* Fondo con múltiples capas para profundidad */}
      <div className="absolute inset-0 opacity-50 -z-10" style={{ background: "var(--gradient-hero)" }} />
      
      {/* Elementos decorativos flotantes */}
      <motion.div
        className="absolute top-10 right-10 w-20 h-20 rounded-full opacity-20"
        style={{ backgroundColor: "var(--accent)" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div
        className="absolute bottom-10 left-10 w-16 h-16 rounded-full opacity-20"
        style={{ backgroundColor: "var(--primary)" }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Contenedor principal con efecto glassmorphism mejorado */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="card-glass p-8 md:p-12 rounded-2xl relative overflow-hidden shadow-hard"
      >
        {/* Efecto de brillo mejorado */}
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--accent-20)" }}
        />
        
        <div
          className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl"
          style={{ backgroundColor: "var(--primary-20)" }}
        />

        {/* Línea decorativa superior */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: "var(--gradient-accent)", transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
        />

        <div className="relative z-10">
          {/* Título principal con animación mejorada */}
          <motion.h1
            variants={itemVariants}
            className="responsive-heading font-heading font-bold text-center mb-6"
          >
            <span className="block text-gradient-primary mb-2">Encuentra tu</span>
            <span className="block text-gradient">Vehículo Perfecto</span>
          </motion.h1>

          {/* Subtítulo dinámico con animación mejorada */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3 text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            <div className="relative flex items-center gap-2">
              <Search className="w-6 h-6" />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: "var(--accent-10)" }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            <span>Explorando</span>

            {/* Contador con animación mejorada */}
            <motion.span
              key={vehicleCount}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="font-bold text-foreground px-3 py-1 rounded-lg card-glass border border-primary/20"
            >
              {vehicleCount}
            </motion.span>

            <span>vehículos</span>

            {/* Icono decorativo con animación mejorada */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Car className="w-6 h-6" style={{ color: "var(--accent)" }} />
            </motion.div>
          </motion.div>

          {/* Indicadores de progreso animados */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mt-6 gap-2"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Línea decorativa inferior */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ background: "var(--gradient-primary)", transformOrigin: "right" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Badges de confianza mejorados */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-6 flex flex-wrap justify-center gap-3"
      >
        <div className="badge-premium flex items-center gap-2">
          <Shield className="w-4 h-4" />
          <span>Plataforma verificada</span>
        </div>
        
        <div className="badge-accent flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>Mejores precios</span>
        </div>
      </motion.div>

      {/* Elemento decorativo adicional */}
      <motion.div
        className="mt-4 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <span>Actualizado en tiempo real</span>
        </div>
      </motion.div>
    </div>
  );
};

export default VehicleListHeader;