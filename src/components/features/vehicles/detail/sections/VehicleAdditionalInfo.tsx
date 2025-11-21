// src/components/features/vehicles/detail/sections/VehicleAdditionalInfo.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Calendar, MapPin, Eye, Package, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InfoItem {
  label: string;
  value?: string | number;
}

interface VehicleAdditionalInfoProps {
  items: InfoItem[];
}

// ✅ FUNCIÓN DE ICONOS CON TEMA ADAPTATIVO
const getIconForLabel = (label: string) => {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes("publicado") || lowerLabel.includes("fecha")) {
    return <Calendar className="w-4 h-4 text-primary" />;
  }
  if (lowerLabel.includes("categoría") || lowerLabel.includes("subcategoría")) {
    return <Package className="w-4 h-4 text-accent" />;
  }
  if (lowerLabel.includes("visitas") || lowerLabel.includes("vistas")) {
    return <Eye className="w-4 h-4 text-success" />;
  }
  if (lowerLabel.includes("capacidad") || lowerLabel.includes("carga")) {
    return <TrendingUp className="w-4 h-4 text-orange-500" />;
  }
  if (lowerLabel.includes("ubicación") || lowerLabel.includes("localización")) {
    return <MapPin className="w-4 h-4 text-red-500" />;
  }
  
  return <Info className="w-4 h-4 text-muted-foreground" />;
};

// ✅ FUNCIÓN DE FORMATEO MEJORADA
const formatValue = (label: string, value: string | number) => {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes("publicado") || lowerLabel.includes("fecha")) {
    if (typeof value === "string") {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    }
  }
  
  if (typeof value === "number" && value > 999) {
    return new Intl.NumberFormat("es-ES").format(value);
  }
  
  return value;
};

// ✅ COMPONENTE DE FILA MEJORADO CON ANIMACIONES
const InfoRow: React.FC<{ label: string; value: string | number; index: number; }> = ({
  label,
  value,
  index,
}) => {
  const icon = getIconForLabel(label);
  const formattedValue = formatValue(label, value);
  
  return (
    <motion.div
      className={cn(
        "flex items-center justify-between p-4 rounded-xl transition-all duration-300 card-hover",
        index % 2 === 0 ? "bg-muted" : "bg-card"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3">
        <motion.div 
          className="w-10 h-10 rounded-full card-glass flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {icon}
        </motion.div>
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{String(formattedValue)}</span>
    </motion.div>
  );
};

const VehicleAdditionalInfoComponent: React.FC<VehicleAdditionalInfoProps> = ({
  items,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filtra items para quitar "Estado" y los que no tienen valor
  const validItems = items.filter(
    (item): item is { label: string; value: string | number } => 
      item.label.toLowerCase() !== 'estado' &&
      item.value !== undefined && item.value !== null && item.value !== ""
  );
  
  if (validItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="card-premium shadow-xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <motion.div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-float"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <Info className="w-10 h-10 text-muted-foreground" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-primary">
                Sin información adicional
              </h3>
              <p className="text-muted-foreground max-w-md">
                No hay datos adicionales disponibles para este vehículo.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="card-premium shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-full flex items-center justify-center glow-effect"
                style={{ background: 'var(--gradient-primary)' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Info className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Información Adicional
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {validItems.length} puntos de datos adicionales
                </p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="gap-1"
              >
                {isExpanded ? (
                  <>
                    Ocultar
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Mostrar
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0">
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {validItems.map((item, index) => (
                    <InfoRow
                      key={item.label}
                      label={item.label}
                      value={item.value}
                      index={index}
                    />
                  ))}
                </motion.div>
                
                {/* ✅ SECCIÓN DE RESUMEN MEJORADA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-6 p-6 rounded-xl card-glass"
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'var(--primary-10)' }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Info className="w-5 h-5 text-primary" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">
                        Resumen de información
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Este vehículo tiene {validItems.length} puntos de datos adicionales disponibles.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {validItems.slice(0, 4).map((item) => {
                          const icon = getIconForLabel(item.label);
                          return (
                            <div
                              key={item.label}
                              className="w-8 h-8 rounded-full card-glass border border-glass-border flex items-center justify-center"
                              title={item.label}
                            >
                              {icon}
                            </div>
                          );
                        })}
                        {validItems.length > 4 && (
                          <div className="w-8 h-8 rounded-full card-glass border border-glass-border flex items-center justify-center" title={`${validItems.length - 4} más`}>
                            <span className="text-xs font-medium">+{validItems.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export const VehicleAdditionalInfo = React.memo(VehicleAdditionalInfoComponent);