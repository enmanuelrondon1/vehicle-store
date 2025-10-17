//src/components/features/vehicles/detail/sections/VehicleDescription.tsx
"use client";

import React from "react";

interface VehicleDescriptionProps {
  description: string;
}

const VehicleDescriptionComponent: React.FC<VehicleDescriptionProps> = ({ description }) => {
  if (!description) {
    return null;
  }

  return (
    <div className="p-6 rounded-xl border bg-card/50 border-border backdrop-blur-sm">
      <h3 className="text-2xl font-bold mb-4 text-foreground">
        Descripción
      </h3>
      <p className="text-lg leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export const VehicleDescription = React.memo(VehicleDescriptionComponent);