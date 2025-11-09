// src/components/features/vehicles/detail/sections/VehicleFeatures.tsx
"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle, Search, Car, Shield, Zap, Settings, Volume2, Navigation, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VehicleFeaturesProps {
  features: string[];
}

// Función de categorización actualizada para usar los colores de globals.css
const categorizeFeature = (feature: string) => {
  const lowerFeature = feature.toLowerCase();
  
  if (lowerFeature.includes("seguridad") || lowerFeature.includes("airbag") || lowerFeature.includes("frenos")) {
    return { category: "Seguridad", icon: Shield, color: "text-destructive", bgColor: "bg-destructive/10" };
  }
  if (lowerFeature.includes("motor") || lowerFeature.includes("potencia") || lowerFeature.includes("rendimiento")) {
    return { category: "Rendimiento", icon: Zap, color: "text-accent", bgColor: "bg-accent/10" };
  }
  if (lowerFeature.includes("tecnología") || lowerFeature.includes("pantalla") || lowerFeature.includes("conectividad")) {
    return { category: "Tecnología", icon: Settings, color: "text-primary", bgColor: "bg-primary/10" };
  }
  if (lowerFeature.includes("sonido") || lowerFeature.includes("altavoz") || lowerFeature.includes("música")) {
    return { category: "Entretenimiento", icon: Volume2, color: "text-chart-4", bgColor: "bg-chart-4/10" };
  }
  if (lowerFeature.includes("gps") || lowerFeature.includes("navegación") || lowerFeature.includes("mapa")) {
    return { category: "Navegación", icon: Navigation, color: "text-chart-2", bgColor: "bg-chart-2/10" };
  }
  
  return { category: "General", icon: Car, color: "text-primary", bgColor: "bg-primary/10" };
};

// Componente para cada característica
const FeatureCard: React.FC<{ feature: any; index: number }> = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = feature.icon;
  
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 cursor-pointer",
        "hover:shadow-md hover:scale-[1.02] hover:border-primary/30",
        isHovered && feature.bgColor
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 50}ms`
      }}
      data-aos="fade-up"
      data-aos-duration="500"
      data-aos-offset="50"
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
        feature.bgColor
      )}>
        <Icon className={cn("w-5 h-5", feature.color)} />
      </div>
      <p className="text-sm font-medium text-foreground">{feature.name}</p>
      {isHovered && (
        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
      )}
    </div>
  );
};

const VehicleFeaturesComponent: React.FC<VehicleFeaturesProps> = ({ features }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const processedFeatures = useMemo(() => {
    if (!features || features.length === 0) return [];
    return features.map(feature => ({ name: feature, ...categorizeFeature(feature) }));
  }, [features]);

  const categories = useMemo(() => {
    return [...new Set(processedFeatures.map(f => f.category))];
  }, [processedFeatures]);

  const filteredFeatures = useMemo(() => {
    return processedFeatures.filter(feature => {
      const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || feature.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [processedFeatures, searchTerm, selectedCategory]);

  // Limitar características mostradas si no se muestra todo
  const displayFeatures = showAll ? filteredFeatures : filteredFeatures.slice(0, 9);
  const hasMoreFeatures = filteredFeatures.length > 9;

  if (!features || features.length === 0) {
    return (
      <Card 
        className="overflow-hidden shadow-lg border-border/50"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">
              Características
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Settings className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Sin características disponibles</h3>
            <p className="text-muted-foreground max-w-md">
              Este vehículo no tiene características disponibles en este momento.
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
      data-aos-delay="400"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-xl">
              Características Destacadas
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
      
      {/* Contenedor con transición suave usando max-height */}
      <div 
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{
          maxHeight: isExpanded ? '5000px' : '0px',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <CardContent className="pt-0">
          <div 
            className="relative mb-6"
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="100"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar características..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          
          <div 
            className="flex flex-wrap gap-2 mb-6"
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="200"
          >
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              Todas ({features.length})
            </Button>
            {categories.map(category => {
              const count = processedFeatures.filter(f => f.category === category).length;
              const feature = processedFeatures.find(f => f.category === category);
              const Icon = feature?.icon;
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="gap-1.5"
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {category} ({count})
                </Button>
              );
            })}
          </div>

          {displayFeatures.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {displayFeatures.map((feature, index) => (
                <FeatureCard key={index} feature={feature} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 mx-auto">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No se encontraron características.</p>
              <Button
                variant="outline"
                onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}

          {/* Botón para mostrar más características */}
          {hasMoreFeatures && (
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={() => setShowAll(!showAll)}
                className="w-full"
              >
                {showAll ? "Mostrar menos" : `Mostrar más (${filteredFeatures.length - 9} restantes)`}
              </Button>
            </div>
          )}

          {/* Resumen de características mejorado */}
          <div 
            className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20"
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="300"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Resumen de características</h4>
                <p className="text-xs text-muted-foreground">
                  Este vehículo tiene {features.length} características distribuidas en {categories.length} categorías.
                  {selectedCategory && ` Actualmente se muestran las características de la categoría "${selectedCategory}".`}
                  {searchTerm && ` Filtradas por el término "${searchTerm}".`}
                </p>
              </div>
              <div className="flex -space-x-2">
                {categories.slice(0, 4).map((category) => {
                  const feature = processedFeatures.find(f => f.category === category);
                  if (!feature) return null;
                  const Icon = feature.icon;
                  return (
                    <div
                      key={category}
                      className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center"
                      title={category}
                    >
                      <Icon className={cn("w-4 h-4", feature.color)} />
                    </div>
                  );
                })}
                {categories.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center" title={`${categories.length - 4} más categorías`}>
                    <span className="text-xs font-medium">+{categories.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export const VehicleFeatures = React.memo(VehicleFeaturesComponent);