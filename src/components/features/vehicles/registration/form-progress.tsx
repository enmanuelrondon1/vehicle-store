"use client";

import React from 'react';
import { 
  Car, 
  DollarSign, 
  FileText, 
  MapPin, 
  Camera, 
  CheckCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

const formSteps = [
  { label: "Información Básica", description: "Marca, modelo y año", iconName: "Car" },
  { label: "Precio y Condición", description: "Valor y estado del vehículo", iconName: "DollarSign" },
  { label: "Especificaciones", description: "Detalles técnicos y motor", iconName: "FileText" },
  { label: "Contacto", description: "Tus datos de vendedor", iconName: "MapPin" },
  { label: "Multimedia y Extras", description: "Fotos y características", iconName: "Camera" },
] as const;

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
    <div className="mb-10">
      {/* Desktop: Línea horizontal con pasos */}
      <div className="hidden lg:flex items-center justify-center gap-3">
        {formSteps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isReachable = stepNumber <= highestCompletedStep;

          const Icon = iconMap[step.iconName];

          return (
            <React.Fragment key={index}>
              {/* Paso */}
              <button
                onClick={() => handleStepClick(index)}
                disabled={!isReachable}
                className={cn(
                  "group relative flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 w-full max-w-xs",
                  "hover:shadow-md hover:-translate-y-0.5",
                  isReachable ? "cursor-pointer" : "cursor-not-allowed",
                  isActive && "bg-primary/10 border-2 border-primary shadow-lg ring-4 ring-primary/10",
                  isCompleted && "bg-muted/50",
                  !isCompleted && !isActive && "bg-muted/30 opacity-70"
                )}
                aria-label={`Paso ${stepNumber}: ${step.label}`}
                aria-current={isActive ? "step" : undefined}
              >
                {/* Icono */}
                <div
                  className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    "ring-2 ring-offset-2 ring-offset-background",
                    isActive && "bg-primary text-primary-foreground ring-primary",
                    isCompleted && "bg-green-600 text-white ring-green-600",
                    !isCompleted && !isActive && "bg-card text-muted-foreground ring-border"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>

                {/* Texto */}
                <div className="text-left">
                  <p className={cn(
                    "font-heading text-sm font-bold transition-colors",
                    isActive && "text-primary",
                    isCompleted && "text-foreground",
                    !isCompleted && "text-muted-foreground"
                  )}>
                    {step.label}
                  </p>
                  <p className={cn(
                    "text-xs transition-colors",
                    isActive && "text-primary/80",
                    isCompleted && "text-foreground/70",
                    !isCompleted && "text-muted-foreground"
                  )}>
                    {step.description}
                  </p>
                </div>

                {/* Efecto hover */}
                {isReachable && !isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>

              {/* Línea conectora */}
              {index < formSteps.length - 1 && (
                <div
                  className={cn(
                    "h-1 w-16 transition-all duration-500",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                  style={{
                    background: isCompleted
                      ? "linear-gradient(to right, var(--primary), var(--primary))"
                      : "linear-gradient(to right, var(--border), var(--border))",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: Tarjetas verticales */}
      <div className="flex lg:hidden flex-col gap-3">
        {formSteps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isReachable = stepNumber <= highestCompletedStep;

          const Icon = iconMap[step.iconName];

          return (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              disabled={!isReachable}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl transition-all duration-300 w-full text-left",
                "hover:shadow-sm",
                isReachable ? "cursor-pointer" : "cursor-not-allowed",
                isActive && "bg-primary/10 border border-primary",
                isCompleted && "bg-muted/50",
                !isCompleted && !isActive && "bg-muted/30 opacity-70"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  isActive && "bg-primary text-primary-foreground",
                  isCompleted && "bg-green-600 text-white",
                  !isCompleted && !isActive && "bg-card text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              <div>
                <p className={cn(
                  "font-heading text-sm font-semibold",
                  isActive && "text-primary",
                  isCompleted && "text-foreground",
                  !isCompleted && "text-muted-foreground"
                )}>
                  {step.label}
                </p>
                <p className={cn(
                  "text-xs",
                  isActive && "text-primary/80",
                  isCompleted && "text-foreground/70",
                  !isCompleted && "text-muted-foreground"
                )}>
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};