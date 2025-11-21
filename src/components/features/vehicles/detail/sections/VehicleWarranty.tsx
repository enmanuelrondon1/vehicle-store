// src/components/features/vehicles/detail/sections/VehicleWarranty.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle, AlertCircle, Clock, FileText, Info, ChevronDown, ChevronUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WarrantyType } from "@/types/types";
import { cn } from "@/lib/utils";

interface VehicleWarrantyProps {
  warranty?: WarrantyType;
  translatedWarranty?: string;
}

// ✅ FUNCIÓN MEJORADA CON ICONOS DEL TEMA
const getWarrantyInfo = (warranty: WarrantyType) => {
  switch (warranty) {
    case WarrantyType.MANUFACTURER_WARRANTY:
      return {
        title: "Garantía de Fábrica",
        description: "Garantía oficial proporcionada directamente por el fabricante.",
        features: ["Cobertura nacional", "Servicio en concesionarios autorizados", "Repuestos originales"],
        duration: "Típicamente 3-5 años",
        variant: "default",
        icon: <Shield className="w-5 h-5" />,
        iconBg: "bg-primary/10",
        headerBg: "var(--gradient-primary)"
      };
    case WarrantyType.DEALER_WARRANTY:
      return {
        title: "Garantía de Concesionario",
        description: "Garantía proporcionada por el concesionario del vehículo.",
        features: ["Cobertura limitada a sucursales", "Términos y condiciones variables", "Posible costo adicional"],
        duration: "Generalmente 1-2 años",
        variant: "secondary",
        icon: <Shield className="w-5 h-5" />,
        iconBg: "bg-accent/10",
        headerBg: "var(--gradient-accent)"
      };
    case WarrantyType.EXTENDED_WARRANTY:
      return {
        title: "Garantía Extendida",
        description: "Garantía adicional que extiende la cobertura estándar.",
        features: ["Extensión de la garantía original", "Cobertura de componentes adicionales", "Asistencia en carretera"],
        duration: "Hasta 7 años adicionales",
        variant: "outline",
        icon: <Shield className="w-5 h-5" />,
        iconBg: "bg-success/10",
        headerBg: "var(--gradient-success)"
      };
    case WarrantyType.SELLER_WARRANTY:
      return {
        title: "Garantía del Vendedor",
        description: "Garantía proporcionada por el vendedor del vehículo.",
        features: ["Cobertura en talleres afiliados", "Planes personalizados", "Reclamaciones directas"],
        duration: "Variable según el plan",
        variant: "outline",
        icon: <Shield className="w-5 h-5" />,
        iconBg: "bg-accent/10",
        headerBg: "var(--gradient-accent)"
      };
    default:
      return {
        title: "Sin Garantía",
        description: "Este vehículo se vende sin garantía o no se ha especificado una.",
        features: [],
        duration: "N/A",
        variant: "destructive",
        icon: <AlertCircle className="w-5 h-5" />,
        iconBg: "bg-destructive/10",
        headerBg: "linear-gradient(135deg, var(--destructive), var(--destructive)/90%)"
      };
  }
};

// ✅ COMPONENTE PARA CADA BENEFICIO
const BenefitItem: React.FC<{ benefit: string; index: number }> = ({ benefit, index }) => (
  <motion.div
    className="flex items-start gap-3 p-3 rounded-xl card-glass"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.02 }}
  >
    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
    <span className="text-sm text-foreground">{benefit}</span>
  </motion.div>
);

const VehicleWarrantyComponent: React.FC<VehicleWarrantyProps> = ({
  warranty,
  translatedWarranty,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!warranty || warranty === WarrantyType.NO_WARRANTY) {
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
                <AlertCircle className="w-10 h-10 text-destructive" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-primary">
                Sin Garantía Disponible
              </h3>
              <p className="text-muted-foreground max-w-md">
                Este vehículo se vende sin garantía o no se ha especificado una.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const warrantyInfo = getWarrantyInfo(warranty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="card-premium shadow-xl overflow-hidden">
        <CardHeader className={cn("pb-4", warrantyInfo.variant === "default" ? "border-b" : "")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-full flex items-center justify-center glow-effect"
                style={{ background: warrantyInfo.headerBg }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                {warrantyInfo.icon}
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Garantía del Vehículo
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Protección para tu inversión
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
                    Ver detalles
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
                {/* Descripción principal */}
                <motion.div 
                  className="p-4 rounded-xl card-glass"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <p className="text-sm text-foreground">
                    Este vehículo incluye <span className="font-semibold text-gradient-primary">{translatedWarranty?.toLowerCase()}</span>.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {warrantyInfo.description}
                  </p>
                </motion.div>
                
                {/* Beneficios incluidos */}
                {warrantyInfo.features.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-3"
                  >
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      Beneficios Incluidos
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {warrantyInfo.features.map((feature, index) => (
                        <BenefitItem key={index} benefit={feature} index={index} />
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {/* Duración */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center justify-between p-3 rounded-xl card-glass"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Duración Típica</span>
                  </div>
                  <Badge className="badge-accent">
                    {warrantyInfo.duration}
                  </Badge>
                </motion.div>
                
                {/* Aviso importante */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: 'var(--primary-10)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <Info className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">
                        Información Importante
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        La información de la garantía es proporcionada por el vendedor. Te recomendamos verificar todos los detalles y condiciones directamente con el vendedor antes de realizar la compra.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Botón expandir/contraer */}
        <div className="px-6 pb-4 pt-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full btn-accent"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Ocultar detalles
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Ver detalles de la garantía
              </>
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export const VehicleWarranty = React.memo(VehicleWarrantyComponent);