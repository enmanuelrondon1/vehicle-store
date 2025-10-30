// src/components/features/vehicles/detail/sections/VehicleAdditionalInfo.tsx
"use client";

import React from "react";
import { Info, Calendar, MapPin, Eye, Package, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface InfoItem {
  label: string;
  value?: string | number;
}

interface VehicleAdditionalInfoProps {
  items: InfoItem[];
}

const getIconForLabel = (label: string) => {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes("publicado") || lowerLabel.includes("fecha")) {
    return <Calendar className="w-4 h-4 text-primary" />;
  }
  if (lowerLabel.includes("categoría") || lowerLabel.includes("subcategoría")) {
    return <Package className="w-4 h-4 text-primary" />;
  }
  if (lowerLabel.includes("visitas") || lowerLabel.includes("vistas")) {
    return <Eye className="w-4 h-4 text-chart-2" />;
  }
  if (lowerLabel.includes("capacidad") || lowerLabel.includes("carga")) {
    return <TrendingUp className="w-4 h-4 text-accent" />;
  }
  if (lowerLabel.includes("ubicación") || lowerLabel.includes("localización")) {
    return <MapPin className="w-4 h-4 text-destructive" />;
  }
  
  return <Info className="w-4 h-4 text-muted-foreground" />;
};

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

const InfoRow: React.FC<{ label: string; value: string | number; index: number; }> = ({
  label,
  value,
  index,
}) => {
  const icon = getIconForLabel(label);
  const formattedValue = formatValue(label, value);
  
  return (
    <div className={cn(
      "flex items-center justify-between py-3.5",
      index > 0 && "border-t border-border/50"
    )}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{String(formattedValue)}</span>
    </div>
  );
};

const VehicleAdditionalInfoComponent: React.FC<VehicleAdditionalInfoProps> = ({
  items,
}) => {
  // Filtra items para quitar "Estado" y los que no tienen valor
  const validItems = items.filter(
    (item): item is { label: string; value: string | number } => 
      item.label.toLowerCase() !== 'estado' &&
      item.value !== undefined && item.value !== null && item.value !== ""
  );
  
  if (validItems.length === 0) {
    return (
      <Card className="overflow-hidden shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-heading flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Información Adicional
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Info className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sin información adicional</h3>
            <p className="text-sm text-muted-foreground">
              No hay datos adicionales disponibles para este vehículo.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-sm">
      <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="p-6 hover:no-underline">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-heading">Información Adicional</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div>
              {validItems.map((item, index) => (
                <InfoRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  index={index}
                />
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Resumen</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {validItems.length} puntos de datos adicionales.
                  </p>
                </div>
                <div className="flex -space-x-2">
                  {validItems.slice(0, 5).map((item) => (
                    <div
                      key={item.label}
                      className="w-8 h-8 rounded-full bg-background border-2 flex items-center justify-center"
                      title={item.label}
                    >
                      {getIconForLabel(item.label)}
                    </div>
                  ))}
                  {validItems.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-muted border-2 flex items-center justify-center" title={`${validItems.length - 5} más`}>
                      <span className="text-xs font-medium">+{validItems.length - 5}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export const VehicleAdditionalInfo = React.memo(VehicleAdditionalInfoComponent);