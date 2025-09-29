// src/components/features/vehicles/registration/VehicleRegistrationForm.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Car, AlertCircle, Trash2, ArrowLeft, ArrowRight, Save, AlertTriangle } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/features/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Importar AlertDialog
import { useDarkMode } from "@/context/DarkModeContext";
import { useVehicleForm } from "@/hooks/use-vehicle-form";
import { phoneCodes } from "@/constants/form-constants";
import { FormProgress } from "./form-progress";
import { PaymentConfirmation } from "../../payment/payment-confirmation";
import { SuccessScreen } from "./success-screen";
// Importar los nuevos componentes de pasos
import Step1_BasicInfo from "./Step1_BasicInfo";
import Step2_PriceAndCondition from "./Step2_PriceAndCondition";
import Step3_Specs from "./Step3_Specs";
import Step4_ContactInfo from "./Step4_ContactInfo";
import Step5_FeaturesAndMedia from "./Step5_FeaturesAndMedia";

// Importar tipos desde la misma fuente centralizada 
import type { VehicleDataBackend } from "@/types/types";

const VehicleRegistrationForm: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const router = useRouter();
  const [showClearConfirm, setShowClearConfirm] = useState(false); // Estado para el diálogo

  const {
    currentStep,
    highestCompletedStep,
    formData,
    isCurrentStepValid,
    errors,
    isSubmitting,
    isLoading,
    saveStatus,
    submissionStatus,
    selectedBank,
    paymentProof,
    referenceNumber,
    setCurrentStep,
    resetForm,
    setSelectedBank,
    setPaymentProof,
    setReferenceNumber,
    handleInputChange,
    handleFeatureToggle,
    handleDocumentationToggle,
    isDocumentationSelected,
    handleImagesChange,
    nextStep,
    prevStep,
    manualSave,
    handleSubmit,
  } = useVehicleForm();

  // Función para limpiar el formulario. Resetea el estado y vuelve al paso 1.
  const handleClearForm = () => {
    resetForm(); // Usamos la función del hook que ya hace esto
    setShowClearConfirm(false); // Cerramos el diálogo
  };

  const handleCreateNew = () => setCurrentStep(1);
  const handleViewAds = () => router.push("/vehicleList");

  // Cast explícito del formData para asegurar compatibilidad de tipos
  const formDataTyped = formData as Partial<VehicleDataBackend>;

  // Las funciones del hook ya usan el tipo correcto, no necesitamos wrappers
  const handleDocumentationToggleWrapper = handleDocumentationToggle;
  const isDocumentationSelectedWrapper = isDocumentationSelected;

  // Memoización para verificar si el paso 5 está completo
  const isStep5Complete = useMemo(() => {
    return (
      (formData.images?.length ?? 0) > 0 &&
      (formData.description?.length ?? 0) > 50 // Un mínimo de 50 caracteres para la descripción
    );
  }, [formData.images, formData.description]);

  return (
    <ProtectedRoute>
      <Head>
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="robots" content="noindex, nofollow" />
        <title>Publicar Anuncio - Vehicle Store</title>
      </Head>

      <div
        className={`min-h-screen py-8 px-4 ${
          isDarkMode
            ? "bg-gray-900 text-gray-100"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
        }`}
      >
        <div className="relative">
          {" "}
          {/* Contenedor relativo para el botón flotante */}
          <div className="max-w-6xl mx-auto">
            <Card
              className={
                isDarkMode
                  ? "bg-gray-800 text-gray-100 border-gray-700"
                  : "bg-white border-gray-200"
              }
            >
              <CardHeader className="text-center relative">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-4 ${
                    isDarkMode
                      ? "bg-gray-700"
                      : "bg-gradient-to-r from-blue-500 to-purple-600"
                  }`}
                >
                  <Car className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold">
                  Registrar Vehículo
                </CardTitle>
                <p
                  className={`text-md ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Completa este formulario profesional para publicar tu vehículo
                  y conectar con compradores potenciales
                </p>

                {/* Botón de limpiar en la esquina superior derecha del header */}
                <div className="absolute top-4 right-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowClearConfirm(true)}
                    className={`flex items-center gap-2 border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 ${
                      isDarkMode
                        ? "border-gray-600 text-gray-400 hover:bg-red-900/20 hover:border-red-500 hover:text-red-400"
                        : "border-gray-300 text-gray-600"
                    }`}
                    aria-label="Limpiar formulario"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Limpiar</span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <FormProgress
                  currentStep={currentStep}
                  highestCompletedStep={highestCompletedStep}
                  isDarkMode={isDarkMode}
                  onStepClick={setCurrentStep}
                />

                {submissionStatus === "error" && (
                  <div
                    className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 ${
                      isDarkMode
                        ? "bg-red-700 text-white"
                        : "bg-red-500 text-white"
                    }`}
                    role="alert"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span>
                      {errors.general ||
                        "Hubo un error al registrar el vehículo. Por favor, inténtalo de nuevo."}
                    </span>
                  </div>
                )}

                {currentStep === 6 ? (
                  <PaymentConfirmation
                    selectedBank={selectedBank}
                    setSelectedBank={setSelectedBank}
                    referenceNumber={referenceNumber}
                    setReferenceNumber={setReferenceNumber}
                    paymentProof={paymentProof}
                    setPaymentProof={setPaymentProof}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    isDarkMode={isDarkMode}
                    onSubmit={handleSubmit}
                    onPrevStep={prevStep}
                  />
                ) : currentStep === 7 ? (
                  <SuccessScreen
                    isDarkMode={isDarkMode}
                    onCreateNew={handleCreateNew}
                    onViewAds={handleViewAds}
                  />
                ) : (
                  <div>
                    {/* Renderizado condicional de los nuevos componentes de paso */}
                    {currentStep === 1 && (
                      <Step1_BasicInfo
                        formData={formDataTyped}
                        errors={errors}
                        handleInputChange={handleInputChange}
                        isLoading={isLoading}
                      />
                    )}
                    {currentStep === 2 && (
                      <Step2_PriceAndCondition
                        formData={formDataTyped}
                        errors={errors}
                        handleInputChange={handleInputChange}
                      />
                    )}
                    {currentStep === 3 && (
                      <Step3_Specs
                        formData={formDataTyped}
                        errors={errors}
                        handleInputChange={handleInputChange}
                      />
                    )}
                    {currentStep === 4 && (
                      <Step4_ContactInfo
                        formData={formDataTyped}
                        errors={errors}
                        handleInputChange={handleInputChange}
                        phoneCodes={phoneCodes}
                      />
                    )}
                    {currentStep === 5 && (
                      <Step5_FeaturesAndMedia
                        formData={formDataTyped}
                        errors={errors}
                        handleInputChange={handleInputChange}
                        handleFeatureToggle={handleFeatureToggle}
                        handleDocumentationToggle={
                          handleDocumentationToggleWrapper
                        }
                        isDocumentationSelected={isDocumentationSelectedWrapper}
                        handleImagesChange={handleImagesChange}
                      />
                    )}
                    
                    {/* --- INICIO DE LA SECCIÓN DE BOTONES MEJORADA --- */}
                    <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      {/* Botón "Anterior" - Siempre a la izquierda si aplica */}
                      <div>
                        {currentStep > 1 && currentStep < 6 && (
                          <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={isSubmitting}
                            className="flex w-full sm:w-auto items-center justify-center gap-2 border-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Anterior
                          </Button>
                        )}
                      </div>

                      {/* Grupo de botones de acción - Siempre a la derecha */}
                      <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3">
                        {currentStep === 5 && (
                           <Button
                           variant="outline"
                           onClick={manualSave}
                           disabled={isSubmitting}
                           className="flex w-full sm:w-auto items-center justify-center gap-2 border-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                         >
                           <Save className="w-4 h-4" />
                           {saveStatus === "saving"
                             ? "Guardando..."
                             : saveStatus === "saved"
                             ? "Guardado"
                             : "Guardar"}
                         </Button>
                        )}

                        {currentStep < 5 && (
                          <Button onClick={nextStep} disabled={isSubmitting || !isCurrentStepValid} className="flex w-full sm:w-auto items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600">
                            Siguiente
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        )}

                        {currentStep === 5 && (
                          <Button onClick={nextStep} disabled={isSubmitting || !isStep5Complete} className="flex w-full sm:w-auto items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white">
                            Finalizar y Pagar
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                    {/* --- FIN DE LA SECCIÓN DE BOTONES MEJORADA --- */}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-12 text-center">
              <div
                className={`inline-flex items-center px-6 py-3 rounded-full border shadow-md ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-gray-300"
                    : "bg-white/60 border-white/20 text-gray-600"
                }`}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
                <p className="text-sm">
                  🔒 Tus datos están seguros y protegidos
                </p>
              </div>
            </div>
          </div>
          {/* Botón flotante para limpiar el formulario */}
          {/* <div className="fixed bottom-6 right-6 z-50">
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowClearConfirm(true)}
              className="w-14 h-14 rounded-full shadow-lg"
              aria-label="Limpiar formulario"
            >
              <Trash2 className="w-6 h-6" />
            </Button>
          </div> */}
          {/* Diálogo de confirmación para limpiar */}
          <AlertDialog
            open={showClearConfirm}
            onOpenChange={setShowClearConfirm}
          >
            <AlertDialogContent className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
              <AlertDialogHeader>
                <div className="flex items-center space-x-3">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                  </div>
                  <AlertDialogTitle className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    ¿Estás realmente seguro?
                  </AlertDialogTitle>
                </div>
                <AlertDialogDescription className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Esta acción eliminará permanentemente todos los datos que has
                  ingresado en el formulario. No podrás recuperarlos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="mt-2 sm:mt-0">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearForm}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Sí, limpiar todo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default VehicleRegistrationForm;
