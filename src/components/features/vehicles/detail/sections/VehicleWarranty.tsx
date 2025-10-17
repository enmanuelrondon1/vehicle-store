"use client";

import React from "react";
import { Shield } from "lucide-react";
import { WarrantyType } from "@/types/types";

interface VehicleWarrantyProps {
  warranty: WarrantyType;
  translatedWarranty: string;
}

const VehicleWarrantyComponent: React.FC<VehicleWarrantyProps> = ({
  warranty,
  translatedWarranty,
}) => {
  if (warranty === WarrantyType.NO_WARRANTY) {
    return null;
  }

  return (
    <div className="p-6 rounded-xl border bg-card/50 border-border backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-6 h-6 text-green-500" />
        <h3 className="text-xl font-bold text-foreground">
          Garantía Incluida
        </h3>
      </div>
      <p className="text-muted-foreground">
        Este vehículo incluye {translatedWarranty.toLowerCase()}.
      </p>
    </div>
  );
};

export const VehicleWarranty = React.memo(VehicleWarrantyComponent);