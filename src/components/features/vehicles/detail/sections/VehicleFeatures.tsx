// src/components/features/vehicles/detail/sections/VehicleFeatures.tsx
"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle, Search, Car, Shield, Zap, Settings, Volume2, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface VehicleFeaturesProps {
  features: string[];
}

// Función de categorización actualizada para usar los colores de globals.css
const categorizeFeature = (feature: string) => {
  const lowerFeature = feature.toLowerCase();
  
  if (lowerFeature.includes("seguridad") || lowerFeature.includes("airbag") || lowerFeature.includes("frenos")) {
    return { category: "Seguridad", icon: Shield, color: "text-destructive" };
  }
  if (lowerFeature.includes("motor") || lowerFeature.includes("potencia") || lowerFeature.includes("rendimiento")) {
    return { category: "Rendimiento", icon: Zap, color: "text-accent" };
  }
  if (lowerFeature.includes("tecnología") || lowerFeature.includes("pantalla") || lowerFeature.includes("conectividad")) {
    return { category: "Tecnología", icon: Settings, color: "text-primary" };
  }
  if (lowerFeature.includes("sonido") || lowerFeature.includes("altavoz") || lowerFeature.includes("música")) {
    return { category: "Entretenimiento", icon: Volume2, color: "text-chart-4" };
  }
  if (lowerFeature.includes("gps") || lowerFeature.includes("navegación") || lowerFeature.includes("mapa")) {
    return { category: "Navegación", icon: Navigation, color: "text-chart-2" };
  }
  
  // Cambiado a text-primary para que los carritos sean azules
  return { category: "General", icon: Car, color: "text-primary" };
};

const VehicleFeaturesComponent: React.FC<VehicleFeaturesProps> = ({ features }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  if (!features || features.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            Características
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay características disponibles para este vehículo.</p>
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
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-heading">Características Destacadas</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar en características..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedCategory === null ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Todas ({features.length})
              </Button>
              {categories.map(category => {
                const count = processedFeatures.filter(f => f.category === category).length;
                const Icon = processedFeatures.find(f => f.category === category)?.icon;
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="flex items-center gap-1.5"
                  >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {category} ({count})
                  </Button>
                );
              })}
            </div>

            {filteredFeatures.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                {filteredFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <Icon className={cn("w-4 h-4 flex-shrink-0", feature.color)} />
                      <p className="text-sm text-muted-foreground">{feature.name}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <Search className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No se encontraron características.</p>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
                  className="mt-2"
                >
                  Limpiar filtros
                </Button>
              </div>
            )}

            <div className="mt-8 p-3 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                  {features.length} características en {categories.length} categorías.
                </p>
                <div className="flex -space-x-2">
                  {categories.slice(0, 5).map((category) => {
                    const feature = processedFeatures.find(f => f.category === category);
                    if (!feature) return null;
                    const Icon = feature.icon;
                    return (
                      <div
                        key={category}
                        className="w-7 h-7 rounded-full bg-card border-2 flex items-center justify-center"
                        title={category}
                      >
                        <Icon className={cn("w-4 h-4", feature.color)} />
                      </div>
                    );
                  })}
                  {categories.length > 5 && (
                    <div className="w-7 h-7 rounded-full bg-muted border-2 flex items-center justify-center" title={`${categories.length - 5} más categorías`}>
                      <span className="text-xs font-medium">+{categories.length - 5}</span>
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

export const VehicleFeatures = React.memo(VehicleFeaturesComponent);