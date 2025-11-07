// src/components/features/vehicles/list/filters/FilterGroup.tsx
"use client";

import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils"; // MEJORA: Para unir clases de forma condicional

interface FilterGroupProps {
  label: string;
  children: ReactNode;
  className?: string; // MEJORA: Permitir clases adicionales para flexibilidad
}

const FilterGroup: FC<FilterGroupProps> = ({ label, children, className }) => {
  return (
    // MEJORA: Usamos <fieldset> para una mejor semántica y accesibilidad
    // Es la etiqueta HTML correcta para agrupar controles de formulario relacionados.
    <fieldset
      className={cn(
        // MEJORA: Añadimos estilos para que cada grupo sea visualmente distinto
        "p-4 border border-border/50 rounded-lg bg-muted/30 space-y-3",
        className // Permite sobreescribir estilos si es necesario
      )}
    >
      {/* MEJORA: Usamos <legend> para el título del grupo.
          Es semánticamente correcto dentro de un <fieldset> y los lectores de pantalla lo anunciarán. */}
      <legend className="text-sm font-semibold text-foreground leading-none">
        {label}
      </legend>
      
      {/* MEJORA: Un contenedor para los hijos con espaciado consistente */}
      <div className="space-y-2">
        {children}
      </div>
    </fieldset>
  );
};

export default FilterGroup;