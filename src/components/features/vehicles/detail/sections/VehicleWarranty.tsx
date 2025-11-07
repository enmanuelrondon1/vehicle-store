// src/components/features/vehicles/detail/sections/VehicleWarranty.tsx
"use client";

import React, { useState } from "react";
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

// ✅ FUNCIÓN MEJORADA CON MÁS DETALLES VISUALES
const getWarrantyInfo = (warranty: WarrantyType) => {
  switch (warranty) {
    case WarrantyType.MANUFACTURER_WARRANTY:
      return {
        title: "Garantía de Fábrica",
        description: "Garantía oficial proporcionada directamente por el fabricante.",
        features: ["Cobertura nacional", "Servicio en concesionarios autorizados", "Repuestos originales"],
        duration: "Típicamente 3-5 años",
        variant: "default" as const,
        iconColor: "text-chart-2",
        iconBgColor: "bg-chart-2/10",
        headerBg: "bg-gradient-to-r from-chart-2/5 to-chart-2/10"
      };
    case WarrantyType.DEALER_WARRANTY:
      return {
        title: "Garantía de Concesionario",
        description: "Garantía proporcionada por el concesionario vendedor.",
        features: ["Cobertura limitada a sucursales", "Términos y condiciones variables", "Posible costo adicional"],
        duration: "Generalmente 1-2 años",
        variant: "secondary" as const,
        iconColor: "text-primary",
        iconBgColor: "bg-primary/10",
        headerBg: "bg-gradient-to-r from-primary/5 to-primary/10"
      };
    case WarrantyType.EXTENDED_WARRANTY:
      return {
        title: "Garantía Extendida",
        description: "Garantía adicional que extiende la cobertura estándar.",
        features: ["Extensión de la garantía original", "Cobertura de componentes adicionales", "Asistencia en carretera"],
        duration: "Hasta 7 años adicionales",
        variant: "outline" as const,
        iconColor: "text-chart-4",
        iconBgColor: "bg-chart-4/10",
        headerBg: "bg-gradient-to-r from-chart-4/5 to-chart-4/10"
      };
    case WarrantyType.SELLER_WARRANTY:
      return {
        title: "Garantía del Vendedor",
        description: "Garantía proporcionada por el vendedor del vehículo.",
        features: ["Cobertura en talleres afiliados", "Planes personalizados", "Reclamaciones directas"],
        duration: "Variable según el plan",
        variant: "outline" as const,
        iconColor: "text-accent",
        iconBgColor: "bg-accent/10",
        headerBg: "bg-gradient-to-r from-accent/5 to-accent/10"
      };
    default:
      return {
        title: "Sin Garantía",
        description: "Este vehículo se vende en su estado actual, sin garantía incluida.",
        features: [],
        duration: "N/A",
        variant: "destructive" as const,
        iconColor: "text-muted-foreground",
        iconBgColor: "bg-muted",
        headerBg: "bg-gradient-to-r from-muted/50 to-muted/20"
      };
  }
};

// ✅ COMPONENTE PARA CADA BENEFICIO
const BenefitItem: React.FC<{ benefit: string; index: number }> = ({ benefit, index }) => (
  <div
    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-all duration-300"
    data-aos="fade-up"
    data-aos-duration="500"
    data-aos-delay={index * 100}
  >
    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
    <span className="text-sm text-foreground">{benefit}</span>
  </div>
);

const VehicleWarrantyComponent: React.FC<VehicleWarrantyProps> = ({
  warranty,
  translatedWarranty,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!warranty || warranty === WarrantyType.NO_WARRANTY) {
    return (
      <Card 
        className="overflow-hidden shadow-lg border-border/50"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sin Garantía Especificada</h3>
            <p className="text-muted-foreground max-w-md">
              Este vehículo se vende sin garantía o no se ha especificado una. Consulta con el vendedor para más detalles.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const warrantyInfo = getWarrantyInfo(warranty);

  return (
    <Card 
      className="overflow-hidden shadow-lg border-border/50"
      data-aos="fade-up"
      data-aos-duration="700"
      data-aos-delay="800"
    >
      <CardHeader className={cn("pb-4", warrantyInfo.headerBg)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", warrantyInfo.iconBgColor)}>
              <Shield className={cn("w-5 h-5", warrantyInfo.iconColor)} />
            </div>
            <div>
              <CardTitle className="text-xl">
                Garantía del Vehículo
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Protección para tu inversión
              </p>
            </div>
          </div>
          <Badge variant={warrantyInfo.variant} className="text-xs">
            {warrantyInfo.title}
          </Badge>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-6">
            {/* Descripción principal */}
            <div 
              className="p-4 bg-muted/30 rounded-lg border"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="100"
            >
              <p className="text-sm text-foreground">
                Este vehículo incluye <span className="font-semibold">{translatedWarranty?.toLowerCase()}</span>.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {warrantyInfo.description}
              </p>
            </div>
            
            {/* Beneficios incluidos */}
            {warrantyInfo.features.length > 0 && (
              <div 
                className="space-y-3"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="200"
              >
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  Beneficios Incluidos
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {warrantyInfo.features.map((feature, index) => (
                    <BenefitItem key={index} benefit={feature} index={index} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Duración */}
            <div 
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="300"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Duración Típica</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {warrantyInfo.duration}
              </Badge>
            </div>
            
            {/* Aviso importante */}
            <div 
              className="p-4 bg-gradient-to-r from-amber-100/50 to-amber-50/30 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-300/50 dark:border-amber-800/50 rounded-lg"
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-delay="400"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-amber-800 dark:text-amber-300 mb-1">
                    Aviso importante
                  </h5>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    La información de la garantía es proporcionada por el vendedor. Te recomendamos verificar todos los detalles y condiciones directamente con el vendedor antes de realizar la compra.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
      
      {/* Botón expandir/contraer */}
      <div className="px-6 pb-4 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full gap-1"
        >
          {isExpanded ? (
            <>
              Ocultar detalles
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Ver detalles de la garantía
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export const VehicleWarranty = React.memo(VehicleWarrantyComponent);