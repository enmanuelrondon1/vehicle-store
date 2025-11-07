// src/components/features/vehicles/detail/sections/VehicleDescription.tsx
"use client";

import React, { useState, useMemo } from "react";
import { FileText, ChevronDown, ChevronUp, MessageSquare, Clock, Hash, Type } from "lucide-react";
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
  
  if (!description) {
    return (
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
            <h3 className="text-xl font-semibold mb-2">Sin descripción disponible</h3>
            <p className="text-muted-foreground max-w-md">
              Este vehículo no tiene una descripción detallada disponible en este momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const shouldTruncate = description.length > 300;
  const displayText = shouldTruncate && !isExpanded 
    ? description.substring(0, 300) + "..." 
    : description;

  const extractKeywords = useMemo(() => {
    const keywords = [];
    const commonWords = ["el", "la", "los", "las", "de", "del", "y", "o", "pero", "más", "menos", "con", "sin", "para", "por", "como", "cuando", "donde", "que", "qué"];
    
    const words = description.toLowerCase().split(/\s+/);
    const wordCount: Record<string, number> = {};
    
    words.forEach(word => {
      const cleanWord = word.replace(/[.,;:!?()]/g, "");
      if (cleanWord.length > 4 && !commonWords.includes(cleanWord)) {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    });
    
    const sortedWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
    
    return sortedWords;
  }, [description]);

  const stats = useMemo(() => {
    const wordCount = description.split(/\s+/).length;
    const sentenceCount = description.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    return {
      wordCount,
      sentenceCount,
      readingTime,
      charCount: description.length
    };
  }, [description]);

  return (
    <Card 
      className="overflow-hidden shadow-lg border-border/50"
      data-aos="fade-up"
      data-aos-duration="700"
      data-aos-delay="500"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-xl">
              Descripción
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {stats.charCount} caracteres
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div 
            className="relative"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="100"
          >
            {/* Texto principal con break-words para palabras largas */}
            <p className="text-sm leading-relaxed text-foreground break-words overflow-wrap-anywhere">
              {displayText}
            </p>
            
            {shouldTruncate && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="gap-1"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Mostrar menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Mostrar más
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div 
            className="space-y-2"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="200"
          >
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Hash className="w-4 h-4 text-muted-foreground" />
              Palabras clave
            </h4>
            {/* Contenedor de badges con max-w-full y los badges con break-words */}
            <div className="flex flex-wrap gap-2 max-w-full">
              {extractKeywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs break-words max-w-full inline-block"
                  style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
          
          <div 
            className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20"
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay="300"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center gap-1">
                <Type className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">{stats.wordCount} palabras</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">{stats.sentenceCount} frases</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">{stats.readingTime} min</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Hash className="w-5 h-5 text-primary" />
                <span className="text-xs font-medium">{extractKeywords.length} claves</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const VehicleDescription = React.memo(VehicleDescriptionComponent);