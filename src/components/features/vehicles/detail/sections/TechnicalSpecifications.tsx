// src/components/features/vehicles/detail/sections/TechnicalSpecifications.tsx
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Grid3X3,
  List,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Spec {
  label: string;
  value: string | number;
  icon?: string; // Icono opcional desde el componente padre
}

interface TechnicalSpecificationsProps {
  specs: Spec[];
}

// ✅ FUNCIÓN MEJORADA: Iconos personalizados para cada campo
const getIconForSpec = (label: string, providedIcon?: string) => {
  // Si se proporciona un icono desde el componente padre, usarlo
  if (providedIcon) {
    return <span className="text-lg">{providedIcon}</span>;
  }

  const lowerLabel = label.toLowerCase();

  if (lowerLabel.includes("marca") || lowerLabel.includes("modelo")) {
    return <Car className="w-4 h-4 text-primary" />;
  }
  if (
    lowerLabel.includes("kilometraje") ||
    lowerLabel.includes("rendimiento")
  ) {
    return <Gauge className="w-4 h-4 text-accent" />;
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
    return <Shield className="w-4 h-4 text-success" />;
  }
  if (lowerLabel.includes("tracción") || lowerLabel.includes("potencia")) {
    return <Zap className="w-4 h-4 text-yellow-500" />;
  }

  return <Settings className="w-4 h-4 text-muted-foreground" />;
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
  icon?: string;
}> = ({ label, value, isHighlighted = false, index = 0, icon }) => {
  const specIcon = getIconForSpec(label, icon);

  return (
    <motion.div
      className={cn(
        "flex justify-between items-center py-3 px-4 rounded-xl transition-all duration-300",
        "hover:bg-glass-bg hover:shadow-md hover:-translate-y-0.5",
        isHighlighted ? "border border-primary glow-effect" : "",
        index % 2 === 0 && !isHighlighted && "bg-muted"
      )}
      style={{
        backgroundColor: isHighlighted ? 'var(--primary-10)' : 
                         index % 2 === 0 ? 'var(--muted)' : 'transparent'
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full card-glass">
          {specIcon}
        </div>
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
    </motion.div>
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  // Función para limpiar filtros
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSortBy("default");
  }, []);

  // Variants para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (!specs || specs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="card-premium shadow-xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <motion.div 
                className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 animate-float"
              >
                <Settings className="w-10 h-10 text-muted-foreground" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-primary">
                Sin especificaciones disponibles
              </h3>
              <p className="text-muted-foreground max-w-md">
                Este vehículo no tiene especificaciones técnicas disponibles.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="card-premium shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-full flex items-center justify-center glow-effect"
                style={{ background: 'var(--gradient-primary)' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Especificaciones Técnicas
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {specs.length} especificaciones técnicas disponibles
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                  className="gap-1"
                >
                  {viewMode === "grid" ? (
                    <List className="w-4 h-4" />
                  ) : (
                    <Grid3X3 className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="gap-1"
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
              </motion.div>
            </div>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0">
                {/* Barra de búsqueda y filtros */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar especificaciones..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 input-premium"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortBy(sortBy === "label" ? "default" : "label")}
                      className="gap-1"
                    >
                      Ordenar
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="gap-1"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Limpiar
                    </Button>
                  </div>
                </div>

                {/* Tabs de categorías - MEJORADO */}
                <div className="mb-6">
                  <div className="relative">
                    {/* Contenedor con scroll horizontal */}
                    <div className="overflow-x-auto pb-2 -mb-2">
                      <Tabs
                        value={selectedCategory || "all"}
                        onValueChange={(value) =>
                          setSelectedCategory(value === "all" ? null : value)
                        }
                        className="w-full min-w-max"
                      >
                        <TabsList 
                          className="inline-flex h-auto w-auto min-w-max gap-2 p-2 card-glass rounded-xl whitespace-nowrap"
                        >
                          <TabsTrigger
                            value="all"
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200"
                          >
                            Todas ({specs.length})
                          </TabsTrigger>
                          {categories.map((category) => {
                            const count = categorizedSpecs[category].length;
                            return (
                              <TabsTrigger
                                key={category}
                                value={category}
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200"
                              >
                                {category} ({count})
                              </TabsTrigger>
                            );
                          })}
                        </TabsList>
                      </Tabs>
                    </div>
                    {/* Indicador de scroll */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Lista de especificaciones */}
                {displaySpecs.length > 0 ? (
                  viewMode === "grid" ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {displaySpecs.map((spec, index) => (
                        <SpecRow
                          key={spec.label}
                          label={spec.label}
                          value={spec.value}
                          icon={spec.icon}
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
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3"
                    >
                      {displaySpecs.map((spec, index) => (
                        <SpecRow
                          key={spec.label}
                          label={spec.label}
                          value={spec.value}
                          icon={spec.icon}
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
                    </motion.div>
                  )
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 mx-auto animate-float">
                      <Search className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      No se encontraron especificaciones
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      No se encontraron especificaciones que coincidan con tu búsqueda.
                    </p>
                    <Button variant="outline" onClick={clearFilters} className="btn-accent">
                      Limpiar filtros
                    </Button>
                  </motion.div>
                )}

                {/* Botón para mostrar más/menos */}
                {filteredSpecs.length > 8 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 pt-6 border-t border-border"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setShowAll(!showAll)}
                      className="w-full btn-accent"
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
                  </motion.div>
                )}

                {/* Resumen de especificaciones */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 p-6 rounded-xl card-glass"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                         style={{ backgroundColor: 'var(--primary-10)' }}>
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">
                        Resumen de especificaciones
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Este vehículo tiene {specs.length} especificaciones técnicas
                        distribuidas en {categories.length} categorías.
                        {selectedCategory &&
                          ` Actualmente se muestran las especificaciones de la categoría "${selectedCategory}".`}
                        {searchTerm && ` Filtradas por el término "${searchTerm}".`}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className="gap-1 card-glass"
                          >
                            {getIconForSpec(category)}
                            {category} ({categorizedSpecs[category].length})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export const TechnicalSpecifications = React.memo(
  TechnicalSpecificationsComponent
);