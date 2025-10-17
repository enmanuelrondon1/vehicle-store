//src/components/features/vehicles/list/VehicleListHeader.tsx
"use client";

import { Vortex } from "@/components/ui/vortex";
import { motion } from "framer-motion";

const VehicleListHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-900">
        <Vortex
          particleCount={150}
          rangeY={50}
          baseHue={240}
          className="flex items-center flex-col justify-center px-4 py-6 w-full h-full"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent dark:text-white dark:bg-none"
          >
            Encuentra tu Vehículo Perfecto
          </motion.h1>
        </Vortex>
      </div>
      <p className="text-xl text-muted-foreground mb-6">
        Búsqueda avanzada con filtros inteligentes y comparación de vehículos
      </p>
    </div>
  );
};

export default VehicleListHeader;