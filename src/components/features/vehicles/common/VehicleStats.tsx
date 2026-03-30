// src/components/features/vehicles/common/VehicleStats.tsx
// ✅ OPTIMIZADO: eliminados todos los repeat:Infinity.
//    Tenía:
//    - 2 círculos decorativos con scale+opacity loop
//    - 1 Sparkles con rotate loop
//    - 1 Activity con scale loop
//    - AnimatePresence en el valor de cada stat (se mantiene — ocurre al cambiar filtros)
//    - useInView (se mantiene — es eficiente, solo dispara una vez)
//    - motion.div whileHover en iconos (reemplazado por CSS)

"use client";

import React, { useMemo } from "react";
import { useInView } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, DollarSign, Calendar, Sparkles, Activity, TrendingUp, Clock } from "lucide-react";
import { Vehicle } from "@/types/types";

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  textClass: "text-gradient-primary" | "text-gradient" | "text-success";
  bgGradient: string;
  index: number;
  delay?: number;
}

const StatItem: React.FC<StatItemProps> = ({
  icon,
  label,
  value,
  textClass,
  bgGradient,
  index,
  delay = 0,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: delay + index * 0.1,
        ease: [0.04, 0.62, 0.23, 0.98],
      }}
      className="relative group"
    >
      <div className="card-glass p-6 rounded-xl h-full overflow-hidden card-hover relative">
        {/* ✅ Fondo hover → CSS group-hover en lugar de motion.div animate opacity */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
          style={{ background: "radial-gradient(circle at center, var(--accent-10) 0%, transparent 70%)" }}
        />

        {/* ✅ Línea decorativa → CSS transition en lugar de motion scaleX animate */}
        <div
          className="absolute top-0 left-0 h-1 w-full transition-all duration-300"
          style={{
            background: bgGradient,
            transform: "scaleX(0.7)",
            transformOrigin: "left",
          }}
        />
        <div
          className="absolute top-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300"
          style={{ background: bgGradient }}
        />

        <div className="relative z-10">
          {/* ✅ Ícono → CSS hover:scale en lugar de motion whileHover/whileTap */}
          <div
            className="inline-flex p-3 rounded-xl relative overflow-hidden hover:scale-105 active:scale-95 transition-transform duration-150"
            style={{ background: bgGradient }}
          >
            <div className="text-white relative z-10">{icon}</div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {label}
            </p>

            {/* ✅ AnimatePresence se mantiene — solo anima cuando cambia el valor (filtros) */}
            <AnimatePresence mode="popLayout">
              <motion.span
                key={value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.3, type: "spring" }}
                className={`text-2xl font-bold font-heading block ${textClass}`}
              >
                {value}
              </motion.span>
            </AnimatePresence>

            <motion.div
              className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <TrendingUp className="w-3 h-3 text-success" />
              <span>+12% este mes</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VehicleStats: React.FC<{ filteredVehicles: Vehicle[] }> = ({ filteredVehicles }) => {
  const [lastUpdated, setLastUpdated] = React.useState(new Date());
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const averagePrice = useMemo(() => {
    if (filteredVehicles.length === 0) return 0;
    return Math.round(filteredVehicles.reduce((sum, v) => sum + (v.price ?? 0), 0) / filteredVehicles.length);
  }, [filteredVehicles]);

  const averageYear = useMemo(() => {
    if (filteredVehicles.length === 0) return 0;
    return Math.round(filteredVehicles.reduce((sum, v) => sum + (v.year ?? 0), 0) / filteredVehicles.length);
  }, [filteredVehicles]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="relative py-8"
    >
      {/* ✅ Círculos decorativos → animate-pulse CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-10 animate-pulse"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <div
          className="absolute bottom-10 left-10 w-24 h-24 rounded-full opacity-10 animate-pulse"
          style={{ backgroundColor: "var(--primary)", animationDelay: "1s" }}
        />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center mb-8"
      >
        <div className="badge-premium flex items-center gap-2 glow-effect">
          {/* ✅ Sparkles → CSS hover:rotate en lugar de motion rotate repeat:Infinity */}
          <Sparkles className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
          <span>Estadísticas en tiempo real</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatItem icon={<BarChart className="w-6 h-6" />} label="Vehículos Encontrados" value={filteredVehicles.length.toLocaleString()} textClass="text-gradient-primary" bgGradient="var(--gradient-primary)" index={0} />
        <StatItem icon={<DollarSign className="w-6 h-6" />} label="Precio Promedio" value={`$ ${averagePrice.toLocaleString()} USD`} textClass="text-gradient" bgGradient="var(--gradient-accent)" index={1} />
        <StatItem icon={<Calendar className="w-6 h-6" />} label="Año Promedio" value={averageYear} textClass="text-success" bgGradient="var(--gradient-success)" index={2} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          {/* ✅ Activity → animate-pulse CSS en lugar de motion scale repeat:Infinity */}
          <Activity className="w-4 h-4 text-success animate-pulse" />
          <span>Actualizado en tiempo real</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{formatTime(lastUpdated)}</span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default VehicleStats;