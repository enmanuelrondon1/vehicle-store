// src/components/features/vehicles/detail/sections/TechnicalSpecifications.tsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Search,
  Settings,
  Car,
  Gauge,
  Fuel,
  Cog,
  Palette,
  Shield,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  DoorOpen,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Spec {
  label: string;
  value: string | number;
}

interface TechnicalSpecificationsProps {
  specs: Spec[];
}

// ✅ FUNCIÓN MEJORADA: Iconos personalizados para cada campo
const getIconForSpec = (label: string) => {
  const lowerLabel = label.toLowerCase();

  if (lowerLabel.includes("marca") || lowerLabel.includes("modelo")) {
    return <Car className="w-4 h-4 text-blue-500" />;
  }
  if (
    lowerLabel.includes("kilometraje") ||
    lowerLabel.includes("rendimiento")
  ) {
    return <Gauge className="w-4 h-4 text-green-500" />;
  }
  if (lowerLabel.includes("combustible")) {
    return <Fuel className="w-4 h-4 text-orange-500" />;
  }
  if (
    lowerLabel.includes("motor") ||
    lowerLabel.includes("transmisión") ||
    lowerLabel.includes("cilindraje")
  ) {
    return <Cog className="w-4 h-4 text-purple-500" />;
  }
  if (lowerLabel.includes("color")) {
    return <Palette className="w-4 h-4 text-pink-500" />;
  }
  
  // ✅ NUEVOS ICONOS PERSONALIZADOS
  if (lowerLabel.includes("puertas")) {
    return <DoorOpen className="w-4 h-4 text-cyan-500" />;
  }
  if (lowerLabel.includes("asientos")) {
    return <Users className="w-4 h-4 text-indigo-500" />;
  }
  
  if (lowerLabel.includes("garantía") || lowerLabel.includes("seguro")) {
    return <Shield className="w-4 h-4 text-red-500" />;
  }
  if (lowerLabel.includes("tracción") || lowerLabel.includes("potencia")) {
    return <Zap className="w-4 h-4 text-yellow-500" />;
  }

  return <Settings className="w-4 h-4 text-gray-500" />;
};

// ✅ FUNCIÓN MEJORADA: Categorización más específica
const categorizeSpec = (label: string) => {
  const lowerLabel = label.toLowerCase();

  if (
    lowerLabel.includes("marca") ||
    lowerLabel.includes("modelo") ||
    lowerLabel.includes("año")
  ) {
    return "Información General";
  }
  
  if (
    lowerLabel.includes("kilometraje") ||
    lowerLabel.includes("rendimiento") ||
    lowerLabel.includes("motor") ||
    lowerLabel.includes("cilindraje") ||
    lowerLabel.includes("potencia")
  ) {
    return "Rendimiento";
  }
  
  if (
    lowerLabel.includes("combustible") ||
    lowerLabel.includes("transmisión") ||
    lowerLabel.includes("tracción")
  ) {
    return "Sistema de Propulsión";
  }
  
  // ✅ NUEVA CATEGORÍA: Para características físicas del vehículo
  if (
    lowerLabel.includes("color") ||
    lowerLabel.includes("puertas") ||
    lowerLabel.includes("asientos") ||
    lowerLabel.includes("condición")
  ) {
    return "Características del Vehículo";
  }
  
  if (
    lowerLabel.includes("garantía") ||
    lowerLabel.includes("seguro")
  ) {
    return "Garantía y Seguridad";
  }

  return "Otros";
};

// Componente para cada fila de especificación
const SpecRow: React.FC<{
  label: string;
  value: string | number;
  isHighlighted?: boolean;
  index?: number;
}> = ({ label, value, isHighlighted = false, index = 0 }) => {
  const icon = getIconForSpec(label);

  return (
    <div
      className={cn(
        "flex justify-between items-center py-3 px-4 rounded-lg transition-all duration-200",
        "hover:bg-muted/50 hover:shadow-sm",
        isHighlighted && "bg-primary/10 border border-primary/20",
        index % 2 === 0 && !isHighlighted && "bg-muted/20"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-full bg-muted">{icon}</div>
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-foreground font-semibold">{value}</span>
        {value === "N/A" && (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            No disponible
          </Badge>
        )}
      </div>
    </div>
  );
};

const TechnicalSpecificationsComponent: React.FC<
  TechnicalSpecificationsProps
> = ({ specs }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<"label" | "category" | "default">(
    "default"
  );

  // Agrupar especificaciones por categoría
  const categorizedSpecs = useMemo(() => {
    const groups: Record<string, Spec[]> = {};
    specs.forEach((spec) => {
      const category = categorizeSpec(spec.label);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(spec);
    });
    return groups;
  }, [specs]);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    return Object.keys(categorizedSpecs);
  }, [categorizedSpecs]);

  // Filtrar especificaciones según búsqueda y categoría
  const filteredSpecs = useMemo(() => {
    let filtered = specs;

    if (selectedCategory) {
      filtered = filtered.filter(
        (spec) => categorizeSpec(spec.label) === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (spec) =>
          spec.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          spec.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar especificaciones
    if (sortBy === "label") {
      filtered = [...filtered].sort((a, b) => a.label.localeCompare(b.label));
    } else if (sortBy === "category") {
      filtered = [...filtered].sort((a, b) => {
        const categoryA = categorizeSpec(a.label);
        const categoryB = categorizeSpec(b.label);
        if (categoryA !== categoryB) {
          return categoryA.localeCompare(categoryB);
        }
        return a.label.localeCompare(b.label);
      });
    }

    return filtered;
  }, [specs, searchTerm, selectedCategory, sortBy]);

  // Especificaciones a mostrar (limitadas si no se muestra todo)
  const displaySpecs = showAll ? filteredSpecs : filteredSpecs.slice(0, 8);

  const midPoint = Math.ceil(displaySpecs.length / 2);
  const firstHalf = displaySpecs.slice(0, midPoint);
  const secondHalf = displaySpecs.slice(midPoint);

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSortBy("default");
  }, []);

  if (!specs || specs.length === 0) {
    return (
      <Card 
        className="shadow-lg border-border/50 overflow-hidden"
        data-aos="fade-up"
        data-aos-duration="700"
      >
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Settings className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Sin especificaciones disponibles
            </h3>
            <p className="text-muted-foreground max-w-md">
              Este vehículo no tiene especificaciones técnicas disponibles.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="shadow-lg border-border/50 overflow-hidden"
      data-aos="fade-up"
      data-aos-duration="700"
      data-aos-delay="200"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              Especificaciones Técnicas
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
          {/* Filtros de categoría */}
          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-border">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="text-xs"
            >
              Todas ({specs.length})
            </Button>
            {categories.map((category) => {
              const count = categorizedSpecs[category].length;
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category} ({count})
                </Button>
              );
            })}
          </div>

          {/* Lista de especificaciones */}
          {displaySpecs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-6 gap-y-2">
              <div className="space-y-2">
                {firstHalf.map((spec, index) => (
                  <SpecRow
                    key={spec.label}
                    label={spec.label}
                    value={spec.value}
                    isHighlighted={
                      !!searchTerm &&
                      (spec.label
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                        spec.value
                          .toString()
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()))
                    }
                    index={index}
                  />
                ))}
              </div>
              <div className="space-y-2">
                {secondHalf.map((spec, index) => (
                  <SpecRow
                    key={spec.label}
                    label={spec.label}
                    value={spec.value}
                    isHighlighted={
                      !!searchTerm &&
                      (spec.label
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                        spec.value
                          .toString()
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()))
                    }
                    index={index + midPoint}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 mx-auto">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">
                No se encontraron especificaciones que coincidan con tu búsqueda.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                Limpiar filtros
              </Button>
            </div>
          )}

          {/* Botón para mostrar más/menos */}
          {filteredSpecs.length > 8 && (
            <div className="mt-6 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="w-full"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Mostrar menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Mostrar más ({filteredSpecs.length - 8} restantes)
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Resumen de especificaciones */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">
                  Resumen de especificaciones
                </h4>
                <p className="text-xs text-muted-foreground">
                  Este vehículo tiene {specs.length} especificaciones técnicas
                  distribuidas en {categories.length} categorías.
                  {selectedCategory &&
                    ` Actualmente se muestran las especificaciones de la categoría "${selectedCategory}".`}
                  {searchTerm && ` Filtradas por el término "${searchTerm}".`}
                </p>
              </div>
              <div className="flex -space-x-2">
                {categories.slice(0, 4).map((category, index) => (
                  <div
                    key={category}
                    className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center"
                  >
                    {getIconForSpec(category)}
                  </div>
                ))}
                {categories.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs font-medium">
                      +{categories.length - 4}
                    </span>
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

export const TechnicalSpecifications = React.memo(
  TechnicalSpecificationsComponent
);