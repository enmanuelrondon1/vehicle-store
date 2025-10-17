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

          const stepClasses = `
            flex items-center p-3 rounded-xl transition-all duration-300 w-full lg:flex-1
            ${isReachable ? "cursor-pointer" : "cursor-not-allowed"} 
            ${
              isActive
                ? "bg-blue-50 dark:bg-blue-900/50 border-2 border-blue-500 dark:border-blue-600 shadow-lg"
                : isCompleted
                  ? "bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200/80 dark:hover:bg-gray-700/80"
                  : "bg-gray-50 dark:bg-gray-800 opacity-50"
            }
          `;

          const iconClasses = `
            w-10 h-10 p-2 rounded-full transition-all duration-300
            ${
              isActive
                ? "bg-blue-500 dark:bg-blue-600 text-white"
                : isCompleted
                ? "bg-green-500 dark:bg-green-700 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
            }
          `;

          const textClasses = `
            transition-colors duration-300
            ${
              isActive
                ? "text-blue-700 dark:text-blue-300"
                : isCompleted
                ? "text-gray-800 dark:text-gray-200"
                : "text-gray-400 dark:text-gray-500"
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
                  <p className={`font-bold text-sm ${textClasses}`}>
                    {step.label}
                  </p>
                  <p className={`text-xs hidden md:block ${textClasses}`}>{step.description}</p>
                </div>
              </div>
              {index < formSteps.length - 1 && (
                <div
                  className={`
                    h-px w-full md:h-auto md:w-px flex-shrink-0 my-2 md:my-0 md:mx-2
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
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