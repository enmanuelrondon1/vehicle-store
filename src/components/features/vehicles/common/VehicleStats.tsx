// src/components/features/vehicles/common/VehicleStats.tsx
"use client";

import type React from "react";
import { useMemo } from "react";
// MEJORA: Importamos Framer Motion para animar los números
import { motion, AnimatePresence } from "framer-motion";
// MEJORA: Importamos más iconos para dar identidad a cada estadística
import { BarChart, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { Vehicle } from "@/types/types";
// MEJORA: Usamos el componente Card para consistencia
import { Card, CardContent } from "@/components/ui/card";

// MEJORA: Componente reutilizable para cada estadística
interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colorClass: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, colorClass }) => (
  <div className="flex items-center gap-3">
    <div className={`p-2 rounded-lg bg-muted ${colorClass}/10`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      {/* MEJORA: Animamos el valor cuando cambia */}
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value} // La clave es crucial para animar el cambio de número
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.3, type: "spring" }}
          className={`text-lg font-bold font-heading ${colorClass}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  </div>
);

const VehicleStats: React.FC<{
  filteredVehicles: Vehicle[];
}> = ({ filteredVehicles }) => {
  const averagePrice = useMemo(() => {
    if (filteredVehicles.length === 0) return 0;
    // ✅ SOLUCIÓN: Usamos el operador ?? para tratar null/undefined como 0
    const total = filteredVehicles.reduce((sum, v) => sum + (v.price ?? 0), 0);
    return Math.round(total / filteredVehicles.length);
  }, [filteredVehicles]);

  const averageYear = useMemo(() => {
    if (filteredVehicles.length === 0) return 0;
    // ✅ SOLUCIÓN: Hacemos lo mismo para el año
    const total = filteredVehicles.reduce((sum, v) => sum + (v.year ?? 0), 0);
    return Math.round(total / filteredVehicles.length);
  }, [filteredVehicles]);

  return (
    // MEJORA: Usamos el componente Card para un look consistente y pulido
    <Card className="shadow-lg border-border card-hover overflow-hidden">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatItem
            icon={<BarChart className="w-5 h-5 text-primary" />}
            label="Vehículos Encontrados"
            value={filteredVehicles.length.toLocaleString()}
            colorClass="text-primary"
          />
          <StatItem
            icon={<DollarSign className="w-5 h-5 text-accent" />}
            label="Precio Promedio"
            value={`$ ${averagePrice.toLocaleString()} USD`}
            colorClass="text-accent"
          />
          <StatItem
            icon={<Calendar className="w-5 h-5 text-foreground" />}
            label="Año Promedio"
            value={averageYear}
            colorClass="text-foreground"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleStats;