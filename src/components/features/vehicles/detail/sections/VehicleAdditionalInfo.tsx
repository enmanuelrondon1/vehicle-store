"use client";

import React from "react";

interface InfoItem {
  label: string;
  value?: string | number;
}

interface VehicleAdditionalInfoProps {
  items: InfoItem[];
}

const InfoRow: React.FC<{ label: string; value: string | number; }> = ({
  label,
  value,
}) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
};

const VehicleAdditionalInfoComponent: React.FC<VehicleAdditionalInfoProps> = ({
  items,
}) => {
  return (
    <div className="p-6 rounded-xl border bg-card/50 border-border backdrop-blur-sm">
      <h3 className="text-xl font-bold mb-4 text-foreground">
        Información Adicional
      </h3>
      <div className="space-y-3">
        {items.map((item) =>
          item.value ? (
            <InfoRow key={item.label} label={item.label} value={item.value} />
          ) : null
        )}
      </div>
    </div>
  );
};

export const VehicleAdditionalInfo = React.memo(
  VehicleAdditionalInfoComponent
);