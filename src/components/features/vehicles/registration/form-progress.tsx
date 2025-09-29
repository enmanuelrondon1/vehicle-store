// src/components/features/vehicles/registration/form-progress.tsx
"use client";

import React from 'react';

const formSteps = [
  { label: "Información Básica", description: "Marca, modelo y año", iconName: "Car" },
  { label: "Precio y Condición", description: "Valor y estado del vehículo", iconName: "DollarSign" },
  { label: "Especificaciones", description: "Detalles técnicos y motor", iconName: "FileText" },
  { label: "Contacto", description: "Tus datos de vendedor", iconName: "MapPin" },
  { label: "Multimedia y Extras", description: "Fotos y características", iconName: "Camera" },
];
import { Car, DollarSign, FileText, MapPin, Camera, CheckCircle } from "lucide-react";

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
  isDarkMode: boolean;
  onStepClick: (step: number) => void;
}

export const FormProgress: React.FC<FormProgressProps> = ({
  currentStep,
  highestCompletedStep,
  isDarkMode,
  onStepClick,
}) => {
  const handleStepClick = (stepIndex: number) => {
    // Permite navegar a cualquier paso ya completado o al actual.
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
                ? isDarkMode
                  ? "bg-blue-900/50 border-2 border-blue-600 shadow-lg"
                  : "bg-blue-50 border-2 border-blue-500 shadow-lg"
                : isCompleted
                  ? isDarkMode
                    ? "bg-gray-700/50 hover:bg-gray-700/80"
                    : "bg-gray-100 hover:bg-gray-200/80"
                  : isDarkMode
                  ? "bg-gray-800 opacity-50"
                  : "bg-gray-50 opacity-50"
            }
          `;

          const iconClasses = `
            w-10 h-10 p-2 rounded-full transition-all duration-300
            ${
              isActive
                ? isDarkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : isCompleted
                ? isDarkMode
                  ? "bg-green-700 text-white"
                  : "bg-green-500 text-white"
                : isDarkMode
                ? "bg-gray-700 text-gray-500"
                : "bg-gray-200 text-gray-400"
            }
          `;

          const textClasses = `
            transition-colors duration-300
            ${
              isActive
                ? isDarkMode
                  ? "text-blue-300"
                  : "text-blue-700"
                : isCompleted
                ? isDarkMode
                  ? "text-gray-200"
                  : "text-gray-800"
                : isDarkMode
                ? "text-gray-500"
                : "text-gray-400"
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