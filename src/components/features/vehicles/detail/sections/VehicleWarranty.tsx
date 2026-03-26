// src/components/features/vehicles/detail/sections/VehicleWarranty.tsx
"use client";

import React, { useState } from "react";
import { Shield, CheckCircle, AlertCircle, Clock, Info, ChevronDown, ChevronUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WarrantyType } from "@/types/types";

interface VehicleWarrantyProps {
  warranty?: WarrantyType;
  translatedWarranty?: string;
}

const getWarrantyInfo = (warranty: WarrantyType) => {
  switch (warranty) {
    case WarrantyType.SELLER_WARRANTY:
      return {
        title: "Garantía del Vendedor",
        description: "Garantía proporcionada por el vendedor del vehículo.",
        features: ["Cobertura en talleres afiliados", "Planes personalizados", "Reclamaciones directas"],
        duration: "Variable según el plan",
        icon: <Shield className="w-5 h-5" />,
        headerBg: "var(--gradient-accent)",
      };
    default:
      return {
        title: "Sin Garantía",
        description: "Este vehículo se vende sin garantía o no se ha especificado una.",
        features: [],
        duration: "N/A",
        icon: <AlertCircle className="w-5 h-5" />,
        headerBg: "var(--destructive)",
      };
  }
};

const BenefitItem: React.FC<{ benefit: string }> = ({ benefit }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl card-glass animate-in fade-in slide-in-from-bottom-2 duration-300">
    <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
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
      <Card className="card-premium shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "var(--muted)" }}>
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gradient-primary">
              Sin Garantía Disponible
            </h3>
            <p className="text-muted-foreground max-w-md">
              Este vehículo se vende sin garantía o no se ha especificado una.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const warrantyInfo = getWarrantyInfo(warranty);

  return (
    <Card className="card-premium shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center glow-effect hover:scale-110 hover:rotate-3 transition-transform duration-200"
              style={{ background: warrantyInfo.headerBg }}
            >
              {warrantyInfo.icon}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Garantía del Vehículo</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Protección para tu inversión</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="gap-1">
            {isExpanded ? (<>Ocultar <ChevronUp className="w-4 h-4" /></>) : (<>Ver detalles <ChevronDown className="w-4 h-4" /></>)}
          </Button>
        </div>
      </CardHeader>

      {/* Expansible sin framer-motion */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
        <CardContent className="pt-4 space-y-4">
          {/* Descripción */}
          <div className="p-4 rounded-xl card-glass">
            <p className="text-sm text-foreground">
              Este vehículo incluye{" "}
              <span className="font-semibold text-gradient-primary">{translatedWarranty?.toLowerCase()}</span>.
            </p>
            <p className="text-xs text-muted-foreground mt-2">{warrantyInfo.description}</p>
          </div>

          {/* Beneficios */}
          {warrantyInfo.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Beneficios Incluidos
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {warrantyInfo.features.map((feature, index) => (
                  <BenefitItem key={index} benefit={feature} />
                ))}
              </div>
            </div>
          )}

          {/* Duración */}
          <div className="flex items-center justify-between p-3 rounded-xl card-glass">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Duración Típica</span>
            </div>
            <Badge className="badge-accent">{warrantyInfo.duration}</Badge>
          </div>

          {/* Aviso */}
          <div className="p-4 rounded-xl" style={{ backgroundColor: "var(--primary-10)" }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Información Importante</h4>
                <p className="text-xs text-muted-foreground">
                  La información de la garantía es proporcionada por el vendedor. Te recomendamos
                  verificar todos los detalles y condiciones directamente con el vendedor antes de
                  realizar la compra.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Botón inferior */}
      <div className="px-6 pb-4 pt-2">
        <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)} className="w-full btn-accent">
          {isExpanded ? (
            <><ChevronUp className="w-4 h-4 mr-2" />Ocultar detalles</>
          ) : (
            <><ChevronDown className="w-4 h-4 mr-2" />Ver detalles de la garantía</>
          )}
        </Button>
      </div>
    </Card>
  );
};

export const VehicleWarranty = React.memo(VehicleWarrantyComponent);