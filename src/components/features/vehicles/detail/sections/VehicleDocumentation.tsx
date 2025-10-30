// src/components/features/vehicles/detail/sections/VehicleDocumentation.tsx
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Shield, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VehicleDocumentationProps {
  documentation: string[];
}

// Mapeo de documentos a iconos específicos para mejor UX
const getDocumentIcon = (doc: string) => {
  const lowerDoc = doc.toLowerCase();
  if (lowerDoc.includes("seguro") || lowerDoc.includes("garantía")) {
    return <Shield className="w-4 h-4" />;
  }
  if (lowerDoc.includes("matrícula") || lowerDoc.includes("registro")) {
    return <Car className="w-4 h-4" />;
  }
  return <FileText className="w-4 h-4" />;
};

// Mapeo de documentos a colores según su importancia
const getDocumentVariant = (doc: string) => {
  const lowerDoc = doc.toLowerCase();
  if (lowerDoc.includes("seguro") || lowerDoc.includes("garantía")) {
    return "default";
  }
  if (lowerDoc.includes("matrícula") || lowerDoc.includes("registro")) {
    return "secondary";
  }
  return "outline";
};

const VehicleDocumentationComponent: React.FC<VehicleDocumentationProps> = ({ documentation }) => {
  if (!documentation || documentation.length === 0) {
    return (
      <Card className="overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sin documentación disponible</h3>
            <p className="text-muted-foreground">
              Este vehículo no tiene información de documentación disponible en este momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-heading flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Documentación Incluida
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <TooltipProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documentation.map((doc, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div>
                    <Badge 
                      variant={getDocumentVariant(doc)} 
                      className="justify-start gap-2 py-2 px-3 text-sm font-normal cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      {getDocumentIcon(doc)}
                      <span className="truncate">{doc}</span>
                      <CheckCircle className="w-3 h-3 ml-auto text-green-500" />
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Documentación verificada</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
        
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Verificación de documentos</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Todos los documentos han sido verificados por nuestro equipo para garantizar su autenticidad.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const VehicleDocumentation = React.memo(VehicleDocumentationComponent);