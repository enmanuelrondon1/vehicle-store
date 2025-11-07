// src/components/features/vehicles/common/CompareBar.tsx
"use client";

import type React from "react";
import { X, GitCompare } from "lucide-react"; // MEJORA: Usamos un icono de Lucide para consistencia
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // MEJORA: Para consistencia visual
import { Badge } from "@/components/ui/badge"; // MEJORA: Para el contador

interface CompareBarProps {
  compareList: string[];
  setCompareList: (list: string[]) => void;
}

const CompareBar: React.FC<CompareBarProps> = ({ compareList, setCompareList }) => {
  const router = useRouter();
  const canCompare = compareList.length >= 2; // MEJORA: Lógica para habilitar/deshabilitar el botón

  const handleCompare = () => {
    if (!canCompare) return; // Previene la acción si no hay suficientes vehículos
    const params = new URLSearchParams();
    compareList.forEach((id) => params.append("vehicles", id));
    router.push(`/compare?${params.toString()}`);
  };

  const handleClear = () => {
    setCompareList([]);
  };

  return (
    // MEJORA: Usamos Card para consistencia y lo hacemos 'sticky' para que siempre sea visible
    <Card className="sticky bottom-4 z-40 shadow-lg border-border">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <GitCompare className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {compareList.length} vehículo{compareList.length !== 1 ? "s" : ""} seleccionado{compareList.length !== 1 ? "s" : ""}
          </span>
          {/* MEJORA: Badge para un feedback visual rápido */}
          <Badge variant="secondary">{compareList.length}/3</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleCompare}
            disabled={!canCompare} // MEJORA: Deshabilitado si no se puede comparar
            className="gap-2"
          >
            <GitCompare className="w-4 h-4" />
            Comparar
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleClear}
            title="Limpiar selección"
            aria-label="Limpiar selección"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompareBar;