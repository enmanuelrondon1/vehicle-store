"use client";

import type React from "react";
import { Car, AlertCircle } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/sections/ProtectedRoute/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useDarkMode } from "@/context/DarkModeContext";
import { useVehicleForm } from "@/hooks/use-vehicle-form";
import { phoneCodes } from "@/constants/form-constants";
import { FormProgress } from "./components/form-progress";
import { PaymentConfirmation } from "./components/payment-confirmation";
import { SuccessScreen } from "./components/success-screen";
import VehicleFormSteps from "./components/VehicleFormSteps";

const VehicleRegistrationForm: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const router = useRouter();

  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    isLoading,
    saveStatus,
    submissionStatus,
    selectedBank,
    paymentProof,
    referenceNumber,
    setCurrentStep,
    setSelectedBank,
    setPaymentProof,
    setReferenceNumber,
    handleInputChange,
    handleFeatureToggle,
    handleImageUpload,
    handleRemoveImage,
    nextStep,
    prevStep,
    manualSave,
    handleSubmit,
  } = useVehicleForm();

  const handleCreateNew = () => setCurrentStep(1);
  const handleViewAds = () => router.push("/vehicleList");

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
        <div className="max-w-6xl mx-auto">
          <Card
            className={
              isDarkMode
                ? "bg-gray-800 text-gray-100 border-gray-700"
                : "bg-white border-gray-200"
            }
          >
            <CardHeader className="text-center">
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
                Completa este formulario profesional para publicar tu vehículo y
                conectar con compradores potenciales
              </p>
            </CardHeader>

            <CardContent>
              <FormProgress currentStep={currentStep} isDarkMode={isDarkMode} />

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
                      "Error al registrar el vehículo. Por favor, intenta de nuevo."}
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
                  onPrevStep={prevStep} // Pasamos prevStep como prop
                />
              ) : currentStep === 7 ? (
                <SuccessScreen
                  isDarkMode={isDarkMode}
                  onCreateNew={handleCreateNew}
                  onViewAds={handleViewAds}
                />
              ) : (
                <div>
                  <VehicleFormSteps
                    currentStep={currentStep}
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange}
                    handleFeatureToggle={handleFeatureToggle}
                    handleImageUpload={handleImageUpload}
                    handleRemoveImage={handleRemoveImage}
                    isLoading={isLoading}
                    setFormData={() => {}} // No longer needed with the hook
                    setCurrentStep={setCurrentStep}
                    phoneCodes={phoneCodes}
                  />

                  <CardFooter className="flex justify-between mt-4 gap-2">
                    {currentStep > 1 && currentStep < 6 && ( // Solo muestra el botón "Anterior" en pasos 2-5
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={isSubmitting}
                      >
                        Anterior
                      </Button>
                    )}
                    {currentStep === 5 ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={manualSave}
                          disabled={isSubmitting}
                        >
                          {saveStatus === "saving"
                            ? "Guardando..."
                            : saveStatus === "saved"
                            ? "Guardado"
                            : "Guardar Progreso"}
                        </Button>
                        <Button onClick={nextStep} disabled={isSubmitting}>
                          Siguiente
                        </Button>
                      </div>
                    ) : currentStep < 5 ? (
                      <Button onClick={nextStep} disabled={isSubmitting}>
                        Siguiente
                      </Button>
                    ) : null}
                  </CardFooter>
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
              <p className="text-sm">🔒 Tus datos están seguros y protegidos</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default VehicleRegistrationForm;