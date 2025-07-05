"use client";
import React, { useState } from "react";
import { VehicleDataBackend } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";
import VehicleFormStepsPart1 from "./VehicleFormStepsPart1";
import VehicleFormStepsPart2 from "./VehicleFormStepsPart2";
import { useDarkMode } from "@/context/DarkModeContext";

interface FormErrors {
  [key: string]: string;
}

// Tipos específicos para los valores del formulario
type FormFieldValue = string | number | boolean | string[] | File[] | undefined;

interface VehicleFormStepsProps {
  currentStep: number;
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: FormFieldValue) => void;
  handleFeatureToggle: (feature: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  isLoading: boolean;
  setFormData: (data: Partial<VehicleDataBackend>) => void;
  setCurrentStep: (step: number) => void;
  phoneCodes?: string[];
}

const VehicleFormSteps: React.FC<VehicleFormStepsProps> = ({
  currentStep,
  formData,
  errors,
  handleInputChange,
  handleFeatureToggle,
  handleImageUpload,
  handleRemoveImage,
  isLoading,
  setFormData,
  setCurrentStep,
  phoneCodes,
}) => {
  const { isDarkMode } = useDarkMode();
  const [openDialog, setOpenDialog] = useState(false);

  const confirmReset = () => {
    setFormData({
      features: [],
      images: [],
      sellerContact: { name: "", email: "", phone: "" },
      year: new Date().getFullYear(),
    });
    setCurrentStep(1);
    setOpenDialog(false);
  };

  const openBankSelection = () => {
    window.open("/banks", "_blank", "noopener,noreferrer");
  };

  const openUploadProof = () => {
    const vehicleId = formData._id?.toString() || "";
    if (!vehicleId) {
      const errorMessage = document.createElement("div");
      errorMessage.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-2 ${
        isDarkMode ? "bg-red-700 text-white" : "bg-red-500 text-white"
      }`;
      errorMessage.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <span>Error: No se encontró el ID del vehículo.</span>
      `;
      document.body.appendChild(errorMessage);
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 5000);
      return;
    }
    window.open(`/upload-payment-proof?vehicleId=${vehicleId}`, "_blank", "noopener,noreferrer");
  };

  if (currentStep === 6) {
    return (
      <div
        className={`flex items-center justify-center min-h-[calc(100vh-20rem)] py-8 px-4 ${
          isDarkMode
            ? "bg-gray-900 text-gray-100"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-gray-800"
        }`}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-4">
            <div className="flex justify-center mb-2">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              ¡Anuncio enviado con éxito!
            </h2>
            <p
              className={`text-gray-600 text-sm mt-1 ${
                isDarkMode ? "text-gray-400" : ""
              }`}
            >
              Completa los siguientes pasos para activar tu publicación.
            </p>
          </div>
          <div className="space-y-4">
            <div
              className={`p-6 rounded-xl shadow-lg border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-2`}
              >
                Activa tu anuncio realizando el pago
              </h3>
              <p
                className={`text-sm mb-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Activa tu anuncio realizando el pago a través del banco de tu elección. ¡Tu publicación estará lista en minutos!
              </p>
              <Button
                onClick={openBankSelection}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                Seleccionar Banco para Pago
              </Button>
            </div>
            <div
              className={`p-6 rounded-xl shadow-lg border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-gray-200"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                } mb-2`}
              >
                Sube tu comprobante de pago
              </h3>
              <p
                className={`text-sm mb-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Sube tu comprobante de pago para verificar tu transacción y activar tu anuncio rápidamente.
              </p>
              <Button
                onClick={openUploadProof}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                Cargar Comprobante de Pago
              </Button>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Restablecer Formulario</Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                className={isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle
                    className={isDarkMode ? "text-gray-100" : "text-gray-800"}
                  >
                    ¿Confirmar restablecimiento?
                  </AlertDialogTitle>
                  <AlertDialogDescription
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    ¿Estás seguro de que quieres restablecer todos los datos? Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className={isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}
                  >
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={confirmReset}
                    className={isDarkMode ? "bg-red-700 text-white" : "bg-red-600 text-white"}
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep <= 3) {
    return (
      <div
        className={`py-8 px-4 ${
          isDarkMode
            ? "bg-gray-900 text-gray-100"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-gray-800"
        }`}
      >
        <div className="flex justify-end mb-4">
          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Restablecer Formulario</Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className={isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}
            >
              <AlertDialogHeader>
                <AlertDialogTitle
                  className={isDarkMode ? "text-gray-100" : "text-gray-800"}
                >
                  ¿Confirmar restablecimiento?
                </AlertDialogTitle>
                <AlertDialogDescription
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                >
                  ¿Estás seguro de que quieres restablecer todos los datos? Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className={isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmReset}
                  className={isDarkMode ? "bg-red-700 text-white" : "bg-red-600 text-white"}
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <VehicleFormStepsPart1
          currentStep={currentStep}
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
        />
      </div>
    );
  } else {
    return (
      <div
        className={`py-8 px-4 ${
          isDarkMode
            ? "bg-gray-900 text-gray-100"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-gray-800"
        }`}
      >
        <div className="flex justify-end mb-4">
          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Restablecer Formulario</Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className={isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}
            >
              <AlertDialogHeader>
                <AlertDialogTitle
                  className={isDarkMode ? "text-gray-100" : "text-gray-800"}
                >
                  ¿Confirmar restablecimiento?
                </AlertDialogTitle>
                <AlertDialogDescription
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                >
                  ¿Estás seguro de que quieres restablecer todos los datos? Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className={isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmReset}
                  className={isDarkMode ? "bg-red-700 text-white" : "bg-red-600 text-white"}
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <VehicleFormStepsPart2
          currentStep={currentStep}
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
          handleFeatureToggle={handleFeatureToggle}
          handleImageUpload={handleImageUpload}
          handleRemoveImage={handleRemoveImage}
          isLoading={isLoading}
          phoneCodes={phoneCodes || []}
        />
      </div>
    );
  }
};

export default VehicleFormSteps;