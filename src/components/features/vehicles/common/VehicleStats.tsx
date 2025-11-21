// src/components/features/vehicles/common/VehicleStats.tsx
"use client";

import React from "react";
import { useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { BarChart, DollarSign, Calendar, Sparkles, Activity, TrendingUp, Clock } from "lucide-react";
import { Vehicle } from "@/types/types";

// Componente reutilizable para cada estadística
interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  textClass: "text-gradient-primary" | "text-gradient" | "text-success";
  bgGradient: string; // Cambiamos a string para mayor flexibilidad
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
  delay = 0
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
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
        ease: [0.04, 0.62, 0.23, 0.98]
      }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tarjeta con efecto glassmorphism mejorado */}
      <div className="card-glass p-6 rounded-xl h-full overflow-hidden card-hover relative">
        {/* Efecto de fondo animado */}
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{
            background: 'radial-gradient(circle at center, var(--accent-10) 0%, transparent 70%)'
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Efecto de línea decorativa */}
        <motion.div
          className="absolute top-0 left-0 h-1 w-full"
          style={{ background: bgGradient, transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        
        <div className="relative z-10">
          {/* Icono con fondo mejorado */}
          <motion.div 
            className="inline-flex p-3 rounded-xl relative overflow-hidden"
            style={{ 
              background: bgGradient,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Efecto de brillo */}
            <motion.div
              className="absolute inset-0 bg-white opacity-0"
              animate={{ opacity: isHovered ? 0.2 : 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="text-white relative z-10">
              {icon}
            </div>
          </motion.div>
          
          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {label}
            </p>
            
            {/* Valor con animación mejorada */}
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
            
            {/* Indicador de cambio */}
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

const VehicleStats: React.FC<{
  filteredVehicles: Vehicle[];
}> = ({ filteredVehicles }) => {
  const [lastUpdated, setLastUpdated] = React.useState(new Date());
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  // Actualizar la hora cada minuto
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const averagePrice = useMemo(() => {
    if (filteredVehicles.length === 0) return 0;
    const total = filteredVehicles.reduce((sum, v) => sum + (v.price ?? 0), 0);
    return Math.round(total / filteredVehicles.length);
  }, [filteredVehicles]);

  const averageYear = useMemo(() => {
    if (filteredVehicles.length === 0) return 0;
    const total = filteredVehicles.reduce((sum, v) => sum + (v.year ?? 0), 0);
    return Math.round(total / filteredVehicles.length);
  }, [filteredVehicles]);

  // Formatear la hora de última actualización
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="relative py-8"
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: "var(--accent)" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        <motion.div
          className="absolute bottom-10 left-10 w-24 h-24 rounded-full opacity-10"
          style={{ backgroundColor: "var(--primary)" }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
      
      {/* Badge principal mejorado */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center mb-8"
      >
        <div className="badge-premium flex items-center gap-2 glow-effect">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
          <span>Estadísticas en tiempo real</span>
        </div>
      </motion.div>
      
      {/* Grid de estadísticas con diseño mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatItem
          icon={<BarChart className="w-6 h-6" />}
          label="Vehículos Encontrados"
          value={filteredVehicles.length.toLocaleString()}
          textClass="text-gradient-primary"
          bgGradient="var(--gradient-primary)"
          index={0}
        />
        <StatItem
          icon={<DollarSign className="w-6 h-6" />}
          label="Precio Promedio"
          value={`$ ${averagePrice.toLocaleString()} USD`}
          textClass="text-gradient"
          bgGradient="var(--gradient-accent)"
          index={1}
        />
        <StatItem
          icon={<Calendar className="w-6 h-6" />}
          label="Año Promedio"
          value={averageYear}
          textClass="text-success"
          bgGradient="var(--gradient-success)"
          index={2}
        />
      </div>
      
      {/* Footer mejorado con indicador de actividad y hora */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="w-4 h-4 text-success" />
          </motion.div>
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