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
  RotateCcw,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Spec {
  label: string;
  value: string | number;
}

interface TechnicalSpecificationsProps {
  specs: Spec[];
}

// Función para obtener el icono apropiado según la etiqueta
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
  if (lowerLabel.includes("garantía") || lowerLabel.includes("seguro")) {
    return <Shield className="w-4 h-4 text-red-500" />;
  }
  if (lowerLabel.includes("tracción") || lowerLabel.includes("potencia")) {
    return <Zap className="w-4 h-4 text-yellow-500" />;
  }

  return <Settings className="w-4 h-4 text-gray-500" />;
};

// Función para categorizar las especificaciones
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
    lowerLabel.includes("cilindraje")
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
  if (lowerLabel.includes("color") || lowerLabel.includes("garantía")) {
    return "Características";
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

  // Función para exportar especificaciones en diferentes formatos
  const exportSpecs = useCallback(
    (format: "txt" | "csv" | "json") => {
      let dataStr: string;
      let mimeType: string;
      let fileName: string;

      switch (format) {
        case "csv":
          const header = "Característica,Valor";
          const rows = filteredSpecs.map(
            (spec) =>
              `"${spec.label.replace(/"/g, '""')}","${String(
                spec.value
              ).replace(/"/g, '""')}"`
          );
          dataStr = [header, ...rows].join("\n");
          mimeType = "text/csv;charset=utf-8,";
          fileName = "especificaciones_tecnicas.csv";
          break;

        case "json":
          dataStr = JSON.stringify(filteredSpecs, null, 2);
          mimeType = "application/json;charset=utf-8,";
          fileName = "especificaciones_tecnicas.json";
          break;

        case "txt":
        default:
          dataStr = filteredSpecs
            .map((spec) => `${spec.label}: ${spec.value}`)
            .join("\n");
          mimeType = "text/plain;charset=utf-8,";
          fileName = "especificaciones_tecnicas.txt";
          break;
      }

      const dataUri = "data:" + mimeType + encodeURIComponent(dataStr);
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", fileName);
      document.body.appendChild(linkElement); // Requerido para Firefox
      linkElement.click();
      document.body.removeChild(linkElement);
    },
    [filteredSpecs]
  );

  if (!specs || specs.length === 0) {
    return (
      <div className="p-6 rounded-xl border bg-card/50 border-border backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Settings className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Sin especificaciones disponibles
          </h3>
          <p className="text-muted-foreground">
            Este vehículo no tiene especificaciones técnicas disponibles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border bg-card/50 border-border backdrop-blur-sm">
      {/* Cabecera con título y búsqueda */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold text-foreground">
            Especificaciones Técnicas
          </h3>
        </div>
      </div>

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
          <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            No se encontraron especificaciones que coincidan con tu búsqueda.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="mt-4"
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
          <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
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
    </div>
  );
};

export const TechnicalSpecifications = React.memo(
  TechnicalSpecificationsComponent
);
