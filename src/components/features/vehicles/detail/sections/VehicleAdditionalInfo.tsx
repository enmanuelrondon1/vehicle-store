// src/components/features/vehicles/detail/sections/VehicleAdditionalInfo.tsx
"use client";

import React, { useState } from "react";
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

// ✅ FUNCIÓN DE ICONOS MEJORADA CON COLORES DEL TEMA
const getIconForLabel = (label: string) => {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes("publicado") || lowerLabel.includes("fecha")) {
    return { icon: <Calendar className="w-4 h-4" />, color: "text-blue-500" };
  }
  if (lowerLabel.includes("categoría") || lowerLabel.includes("subcategoría")) {
    return { icon: <Package className="w-4 h-4" />, color: "text-purple-500" };
  }
  if (lowerLabel.includes("visitas") || lowerLabel.includes("vistas")) {
    return { icon: <Eye className="w-4 h-4" />, color: "text-green-500" };
  }
  if (lowerLabel.includes("capacidad") || lowerLabel.includes("carga")) {
    return { icon: <TrendingUp className="w-4 h-4" />, color: "text-orange-500" };
  }
  if (lowerLabel.includes("ubicación") || lowerLabel.includes("localización")) {
    return { icon: <MapPin className="w-4 h-4" />, color: "text-red-500" };
  }
  
  return { icon: <Info className="w-4 h-4" />, color: "text-muted-foreground" };
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

// ✅ COMPONENTE DE FILA REDISEÑADO COMO TARJETA INDIVIDUAL
const InfoRow: React.FC<{ label: string; value: string | number; index: number; }> = ({
  label,
  value,
  index,
}) => {
  const { icon, color } = getIconForLabel(label);
  const formattedValue = formatValue(label, value);
  
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border transition-all duration-300 hover:shadow-sm hover:scale-[1.01]",
        index % 2 === 0 ? "bg-muted/20" : "bg-background"
      )}
      data-aos="fade-up"
      data-aos-duration="500"
      data-aos-delay={index * 50}
    >
      <div className="flex items-center gap-3">
        <div className={cn("w-8 h-8 rounded-full bg-muted flex items-center justify-center", color)}>
          {icon}
        </div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{String(formattedValue)}</span>
    </div>
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
      <Card 
        className="overflow-hidden shadow-lg border-border/50"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Info className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sin información adicional</h3>
            <p className="text-muted-foreground max-w-md">
              No hay datos adicionales disponibles para este vehículo.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="overflow-hidden shadow-lg border-border/50"
      data-aos="fade-up"
      data-aos-duration="700"
      data-aos-delay="700"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-xl">
              Información Adicional
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-1 text-sm"
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
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {validItems.map((item, index) => (
              <InfoRow
                key={item.label}
                label={item.label}
                value={item.value}
                index={index}
              />
            ))}
          </div>
          
          {/* ✅ SECCIÓN DE RESUMEN MEJORADA */}
          <div 
            className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20"
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay={validItems.length * 50 + 100}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Resumen de información</h4>
                <p className="text-xs text-muted-foreground">
                  Este vehículo tiene {validItems.length} puntos de datos adicionales disponibles.
                </p>
              </div>
              <div className="flex -space-x-2">
                {validItems.slice(0, 4).map((item) => {
                  const { icon, color } = getIconForLabel(item.label);
                  return (
                    <div
                      key={item.label}
                      className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center"
                      title={item.label}
                    >
                      <div className={color}>{icon}</div>
                    </div>
                  );
                })}
                {validItems.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center" title={`${validItems.length - 4} más`}>
                    <span className="text-xs font-medium">+{validItems.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export const VehicleAdditionalInfo = React.memo(VehicleAdditionalInfoComponent);