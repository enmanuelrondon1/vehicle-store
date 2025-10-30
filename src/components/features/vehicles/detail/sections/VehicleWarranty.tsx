// src/components/features/vehicles/detail/sections/VehicleWarranty.tsx
"use client";

import React from "react";
import { Shield, CheckCircle, AlertCircle, Clock, FileText, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WarrantyType } from "@/types/types";
import { cn } from "@/lib/utils";

interface VehicleWarrantyProps {
  warranty?: WarrantyType;
  translatedWarranty?: string;
}

const getWarrantyInfo = (warranty: WarrantyType) => {
  switch (warranty) {
    case WarrantyType.MANUFACTURER_WARRANTY:
      return {
        title: "Garantía de Fábrica",
        description: "Garantía oficial proporcionada directamente por el fabricante.",
        features: ["Cobertura nacional", "Servicio en concesionarios autorizados", "Repuestos originales"],
        duration: "Típicamente 3-5 años",
        variant: "default" as const,
        color: "text-chart-2"
      };
    case WarrantyType.DEALER_WARRANTY:
      return {
        title: "Garantía de Concesionario",
        description: "Garantía proporcionada por el concesionario vendedor.",
        features: ["Cobertura limitada a sucursales", "Términos y condiciones variables", "Posible costo adicional"],
        duration: "Generalmente 1-2 años",
        variant: "secondary" as const,
        color: "text-primary"
      };
    case WarrantyType.EXTENDED_WARRANTY:
      return {
        title: "Garantía Extendida",
        description: "Garantía adicional que extiende la cobertura estándar.",
        features: ["Extensión de la garantía original", "Cobertura de componentes adicionales", "Asistencia en carretera"],
        duration: "Hasta 7 años adicionales",
        variant: "outline" as const,
        color: "text-chart-4"
      };
    case WarrantyType.SELLER_WARRANTY: // Asumiendo que 'SELLER_WARRANTY' es para terceros o vendedores privados
      return {
        title: "Garantía del Vendedor",
        description: "Garantía proporcionada por una compañía externa o el vendedor.",
        features: ["Cobertura en talleres afiliados", "Planes personalizados", "Reclamaciones directas"],
        duration: "Variable según el plan",
        variant: "outline" as const,
        color: "text-accent"
      };
    default:
      return {
        title: "Sin Garantía",
        description: "Este vehículo se vende en su estado actual, sin garantía incluida.",
        features: [],
        duration: "N/A",
        variant: "destructive" as const,
        color: "text-muted-foreground"
      };
  }
};

const VehicleWarrantyComponent: React.FC<VehicleWarrantyProps> = ({
  warranty,
  translatedWarranty,
}) => {
  if (!warranty || warranty === WarrantyType.NO_WARRANTY) {
    return (
      <Card className="overflow-hidden shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-heading flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            Garantía del Vehículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sin Garantía Especificada</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Este vehículo se vende sin garantía o no se ha especificado una. Consulta con el vendedor para más detalles.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const warrantyInfo = getWarrantyInfo(warranty);

  return (
    <Card className="overflow-hidden shadow-sm">
      <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="p-6 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Shield className={cn("w-5 h-5", warrantyInfo.color)} />
                <h3 className="text-xl font-heading">Garantía del Vehículo</h3>
              </div>
              <Badge variant={warrantyInfo.variant} className="text-xs mr-4">
                {warrantyInfo.title}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-5">
              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="text-sm text-foreground">
                  Este vehículo incluye <span className="font-semibold">{translatedWarranty?.toLowerCase()}</span>.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {warrantyInfo.description}
                </p>
              </div>
              
              {warrantyInfo.features.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-chart-2" />
                    Beneficios Incluidos
                  </h4>
                  <ul className="space-y-2 pl-6">
                    {warrantyInfo.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-chart-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Duración Típica</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {warrantyInfo.duration}
                </Badge>
              </div>
              <div className="!mt-6 p-3 bg-amber-100/50 dark:bg-amber-900/20 border border-amber-300/50 dark:border-amber-800/50 rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">Aviso importante:</span> La información de la garantía es proporcionada por el vendedor. Te recomendamos verificar todos los detalles y condiciones directamente con el vendedor antes de realizar la compra.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export const VehicleWarranty = React.memo(VehicleWarrantyComponent);