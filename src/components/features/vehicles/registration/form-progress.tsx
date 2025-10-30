// src/components/features/vehicles/registration/form-progress.tsx
"use client";

import React from 'react';
import { Car, DollarSign, FileText, MapPin, Camera, CheckCircle } from "lucide-react";

const formSteps = [
  { label: "Información Básica", description: "Marca, modelo y año", iconName: "Car" },
  { label: "Precio y Condición", description: "Valor y estado del vehículo", iconName: "DollarSign" },
  { label: "Especificaciones", description: "Detalles técnicos y motor", iconName: "FileText" },
  { label: "Contacto", description: "Tus datos de vendedor", iconName: "MapPin" },
  { label: "Multimedia y Extras", description: "Fotos y características", iconName: "Camera" },
];

const iconMap = {
  Car,
  DollarSign,
  FileText,
  MapPin,
  Camera,
  CheckCircle,
};

interface FormProgressProps {
  currentStep: number;
  highestCompletedStep: number;
  onStepClick: (step: number) => void;
}

export const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  highestCompletedStep,
  onStepClick,
}) => {
  const handleStepClick = (stepIndex: number) => {
    if (stepIndex + 1 <= highestCompletedStep) {
      onStepClick(stepIndex + 1);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:flex-nowrap items-stretch justify-center gap-2">
        {formSteps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isReachable = stepNumber <= highestCompletedStep;

          const Icon = iconMap[step.iconName as keyof typeof iconMap] || Car;

          // ESTILO ACTUALIZADO: Estados con colores de tema.
          const stepClasses = `
            flex items-center p-3 rounded-xl transition-all duration-300 w-full lg:flex-1
            ${isReachable ? "cursor-pointer hover:bg-muted/80" : "cursor-not-allowed"} 
            ${
              isActive
                ? "bg-primary/10 border-2 border-primary shadow-lg"
                : isCompleted
                  ? "bg-muted/50"
                  : "bg-muted/50 opacity-50"
            }
          `;

          // ESTILO ACTUALIZADO: Iconos con colores de tema.
          const iconClasses = `
            w-10 h-10 p-2 rounded-full transition-all duration-300
            ${
              isActive
                ? "bg-primary text-primary-foreground"
                : isCompleted
                ? "bg-green-600 text-white"
                : "bg-muted text-muted-foreground"
            }
          `;

          // ESTILO ACTUALIZADO: Textos con colores de tema.
          const textClasses = `
            transition-colors duration-300
            ${
              isActive
                ? "text-primary"
                : isCompleted
                ? "text-foreground"
                : "text-muted-foreground"
            }
          `;

          return (
            <React.Fragment key={index}>
              <div
                className={stepClasses}
                onClick={() => handleStepClick(index)}
                aria-disabled={!isReachable}
              >
                <div className={iconClasses}>
                  <Icon className="w-full h-full" />
                </div>
                <div className="ml-3">
                  {/* ESTILO ACTUALIZADO: Título con fuente de encabezado. */}
                  <p className={`font-heading text-sm font-bold ${textClasses}`}>
                    {step.label}
                  </p>
                  <p className={`text-xs hidden md:block ${textClasses}`}>{step.description}</p>
                </div>
              </div>
              {index < formSteps.length - 1 && (
                // ESTILO ACTUALIZADO: Conector con colores de tema.
                <div
                  className={`
                    h-px w-full md:h-auto md:w-px flex-shrink-0 my-2 md:my-0 md:mx-2
                    ${isCompleted ? 'bg-primary' : 'bg-border'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};