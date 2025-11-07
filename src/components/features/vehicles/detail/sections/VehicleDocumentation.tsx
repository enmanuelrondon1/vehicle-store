// src/components/features/vehicles/detail/sections/VehicleDocumentation.tsx
"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  FileText,
  Shield,
  Car,
  Eye,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

// Componente para cada documento
const DocumentItem: React.FC<{ doc: string; index: number }> = ({ doc, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer",
              "hover:shadow-md hover:scale-[1.02]",
              isHovered && "bg-accent/30"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              animationDelay: `${index * 100}ms`
            }}
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-offset="50"
          >
            <div className="flex items-center gap-3 p-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
                getDocumentVariant(doc) === "default" ? "bg-primary/10 text-primary" :
                getDocumentVariant(doc) === "secondary" ? "bg-secondary/10 text-secondary" :
                "bg-muted text-muted-foreground"
              )}>
                {getDocumentIcon(doc)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{doc}</p>
                <p className="text-xs text-muted-foreground">Verificado</p>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {isHovered && (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
            <div className={cn(
              "absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300",
              isHovered ? "w-full" : "w-0"
            )} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Documentación verificada</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const VehicleDocumentationComponent: React.FC<VehicleDocumentationProps> = ({
  documentation,
}) => {
  const [showAllDocs, setShowAllDocs] = useState(false);
  const [isMobileVisible, setIsMobileVisible] = useState(false);

  const hasDocs = documentation && documentation.length > 0;

  const initialDocs = hasDocs ? documentation.slice(0, 4) : [];
  const remainingDocs = hasDocs ? documentation.slice(4) : [];
  const hasMoreDocs = hasDocs && documentation.length > 4;

  return (
    <div className="w-full">
      {/* Botón Acordeón para Móvil */}
      <div className="sm:hidden border-b mb-4">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between py-6 text-left h-auto"
          onClick={() => setIsMobileVisible(!isMobileVisible)}
        >
          <span className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg">Documentación</span>
          </span>
          {isMobileVisible ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Contenido Principal (Card) */}
      <div className={cn("sm:block", isMobileVisible ? "block" : "hidden")}>
        {!hasDocs ? (
          <Card
            className="overflow-hidden shadow-lg border-border/50"
            data-aos="fade-up"
            data-aos-duration="700"
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Sin documentación disponible
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Este vehículo no tiene información de documentación disponible
                  en este momento.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card
            className="overflow-hidden shadow-lg border-border/50"
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-delay="300"
          >
            <CardHeader className="pb-4 hidden sm:flex">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  Documentación Incluida
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="pt-4 sm:pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {initialDocs.map((doc, index) => (
                  <DocumentItem key={index} doc={doc} index={index} />
                ))}
              </div>

              {showAllDocs && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {remainingDocs.map((doc, index) => (
                    <DocumentItem
                      key={index + 4}
                      doc={doc}
                      index={index + 4}
                    />
                  ))}
                </div>
              )}

              {hasMoreDocs && (
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllDocs(!showAllDocs)}
                    className="w-full"
                  >
                    {showAllDocs
                      ? "Ver menos"
                      : `Ver todos los documentos (${documentation.length} totales)`}
                  </Button>
                </div>
              )}

              <div
                className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20"
                data-aos="fade-up"
                data-aos-duration="500"
                data-aos-delay="400"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      Verificación de documentos
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5"
                      >
                        Seguro
                      </Badge>
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Todos los documentos han sido verificados por nuestro
                      equipo para garantizar su autenticidad.
                    </p>
                  </div>
                  <AlertCircle className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export const VehicleDocumentation = React.memo(VehicleDocumentationComponent);