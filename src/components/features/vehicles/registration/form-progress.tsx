// src/components/features/vehicles/registration/form-progress.tsx

import type React from "react"
import { CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { formSteps } from "@/constants/form-constants"

interface FormProgressProps {
  currentStep: number
  isDarkMode: boolean
}

export const FormProgress: React.FC<FormProgressProps> = ({ currentStep, isDarkMode }) => {
  return (
    <>
      {/* Desktop Progress */}
      <div className="mb-6 hidden md:block">
        <div className="flex justify-between items-center mb-4">
          {formSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative flex-1">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 ${
                  index + 1 < currentStep
                    ? isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-blue-500 text-white"
                    : index + 1 === currentStep
                      ? isDarkMode
                        ? "bg-gray-600 text-white ring-2 ring-gray-800"
                        : "bg-blue-600 text-white ring-2 ring-blue-100"
                      : isDarkMode
                        ? "bg-gray-800 text-gray-500"
                        : "bg-gray-200 text-gray-400"
                }`}
              >
                {index + 1 < currentStep ? <CheckCircle className="w-5 h-5" /> : step.icon}
              </div>
              <p
                className={`mt-2 text-xs ${
                  index + 1 <= currentStep
                    ? isDarkMode
                      ? "text-gray-300"
                      : "text-blue-600"
                    : isDarkMode
                      ? "text-gray-500"
                      : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
              {index < 5 && (
                <div
                  className={`absolute top-6 left-1/2 w-full h-1 -z-10 ${
                    index + 1 < currentStep
                      ? isDarkMode
                        ? "bg-gray-700"
                        : "bg-blue-500"
                      : isDarkMode
                        ? "bg-gray-800"
                        : "bg-gray-200"
                  }`}
                  style={{
                    marginLeft: "24px",
                    width: "calc(100% - 48px)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className={`text-sm font-bold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
            Paso {currentStep} de 6
          </p>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {Math.round(((currentStep - 1) / 5) * 100)}% completado
          </p>
        </div>
        <Progress value={((currentStep - 1) / 5) * 100} className={isDarkMode ? "bg-gray-700" : "bg-gray-200"} />
      </div>
    </>
  )
}
