// src/components/features/vehicles/detail/sections/VehicleDescription.tsx
"use client";

import React, { useState } from "react";
import { FileText, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface VehicleDescriptionProps {
  description: string;
}

const VehicleDescriptionComponent: React.FC<VehicleDescriptionProps> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Si no hay descripción, mostramos un estado vacío
  if (!description) {
    return (
      <Card className="overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sin descripción disponible</h3>
            <p className="text-muted-foreground">
              Este vehículo no tiene una descripción detallada disponible en este momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determinar si la descripción es lo suficientemente larga para truncar
  const shouldTruncate = description.length > 300;
  const displayText = shouldTruncate && !isExpanded 
    ? description.substring(0, 300) + "..." 
    : description;

  // Extraer palabras clave de la descripción para resaltar
  const extractKeywords = (text: string) => {
    const keywords = [];
    const commonWords = ["el", "la", "los", "las", "de", "del", "y", "o", "pero", "más", "menos", "con", "sin", "para", "por", "como", "cuando", "donde", "que", "qué"];
    
    const words = text.toLowerCase().split(/\s+/);
    const wordCount: Record<string, number> = {};
    
    words.forEach(word => {
      // Limpiar la palabra de signos de puntuación
      const cleanWord = word.replace(/[.,;:!?()]/g, "");
      if (cleanWord.length > 4 && !commonWords.includes(cleanWord)) {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    });
    
    // Obtener las 5 palabras más frecuentes
    const sortedWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
    
    return sortedWords;
  };

  const keywords = extractKeywords(description);

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-heading flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Descripción
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {description.length} caracteres
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Texto de la descripción con formato mejorado */}
          <div className="relative">
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {displayText}
            </p>
            
            {/* Botón para expandir/contraer si el texto es largo */}
            {shouldTruncate && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Mostrar menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Mostrar más
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Palabras clave de la descripción */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              Palabras clave
            </h4>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Información adicional sobre la descripción */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {description.split(/\s+/).length} palabras • {description.split(/[.!?]+/).length - 1} frases
              </span>
              <span>
                Tiempo de lectura aprox: {Math.ceil(description.split(/\s+/).length / 200)} min
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const VehicleDescription = React.memo(VehicleDescriptionComponent);