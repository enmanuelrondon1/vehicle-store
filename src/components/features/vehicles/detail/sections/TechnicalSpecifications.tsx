"use client";

import React from "react";

interface Spec {
  label: string;
  value: string | number;
}

interface TechnicalSpecificationsProps {
  specs: Spec[];
}

const SpecRow: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
};

const TechnicalSpecificationsComponent: React.FC<
  TechnicalSpecificationsProps
> = ({ specs }) => {
  const midPoint = Math.ceil(specs.length / 2);
  const firstHalf = specs.slice(0, midPoint);
  const secondHalf = specs.slice(midPoint);

  return (
    <div className="p-6 rounded-xl border bg-card/50 border-border backdrop-blur-sm">
      <h3 className="text-2xl font-bold mb-6 text-foreground">
        Especificaciones Técnicas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <div className="space-y-4">
          {firstHalf.map((spec) => (
            <SpecRow key={spec.label} label={spec.label} value={spec.value} />
          ))}
        </div>
        <div className="space-y-4">
          {secondHalf.map((spec) => (
            <SpecRow key={spec.label} label={spec.label} value={spec.value} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const TechnicalSpecifications = React.memo(TechnicalSpecificationsComponent);