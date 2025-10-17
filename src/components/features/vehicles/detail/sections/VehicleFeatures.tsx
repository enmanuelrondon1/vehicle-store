//src/components/features/vehicles/detail/sections/VehicleFeatures.tsx
"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

interface VehicleFeaturesProps {
  features: string[];
}

const VehicleFeaturesComponent: React.FC<VehicleFeaturesProps> = ({ features }) => {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className="p-6 rounded-xl border bg-card/50 border-border backdrop-blur-sm">
      <h3 className="text-2xl font-bold mb-6 text-foreground">
        Características
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-muted-foreground">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const VehicleFeatures = React.memo(VehicleFeaturesComponent);