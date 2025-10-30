// src/components/features/vehicles/list/VehicleListHeader.tsx
"use client";
import { motion } from "framer-motion";

const VehicleListHeader: React.FC = () => {
  return (
    <div className="text-center">
      {/* ESTILO ACTUALIZADO: Contenedor con sombra sutil y borde de tema para integrarse mejor. */}
      <div className="rounded-xl overflow-hidden mb-4 shadow-lg border bg-muted flex items-center flex-col justify-center px-4 py-6 w-full h-full">
        {/* ESTILO ACTUALIZADO: Título con fuente de encabezado y animación consistente. */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          Encuentra tu Vehículo Perfecto
        </motion.h1>
      </div>
      {/* ESTILO ACTUALIZADO: Subtítulo con ancho máximo para legibilidad. */}
      <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
        Búsqueda avanzada con filtros inteligentes y comparación de vehículos
      </p>
    </div>
  );
};

export default VehicleListHeader;