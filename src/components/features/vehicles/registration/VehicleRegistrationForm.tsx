// src/components/features/vehicles/registration/VehicleRegistrationForm.tsx
"use client";

import React, { useState, useMemo, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Car,
  AlertCircle,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Save,
  AlertTriangle,
} from "lucide-react";

// UI
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
} from "@/components/ui/alert-dialog";

// Auth
import ProtectedRoute from "@/components/features/auth/ProtectedRoute";

// Hooks
import { useVehicleForm } from "@/hooks/use-vehicle-form";

// Constants
import { phoneCodes } from "@/constants/form-constants";

// Components
import { FormProgress } from "./form-progress";
// import { PaymentConfirmation } from "../../payment/payment-confirmation href="../../payment/payment-confirmation";
import { PaymentConfirmation } from "../../payment/payment-confirmation";
import { SuccessScreen } from "./success-screen";
import Step1_BasicInfo from "./Step1_BasicInfo";
import Step2_PriceAndCondition from "./Step2_PriceAndCondition";
import Step3_Specs from "./Step3_Specs";
import Step4_ContactInfo from "./Step4_ContactInfo";
import Step5_FeaturesAndMedia from "./Step5_FeaturesAndMedia";

// Types
import type { VehicleDataBackend } from "@/types/types";

const VehicleRegistrationForm: React.FC = () => {
  const router = useRouter();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

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
    handleSwitchChange,
  } = useVehicleForm({ formRef });

  // Error toast
  React.useEffect(() => {
    if (submissionStatus === "error" && errors.general) {
      toast.error(errors.general, {
        description: "Por favor, revisa los campos e inténtalo de nuevo.",
        action: { label: "Reintentar", onClick: () => handleSubmit() },
      });
    }
  }, [submissionStatus, errors.general, handleSubmit]);

  // Scroll to top on step change
  const scrollToTop = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextStep = () => {
    nextStep();
    setTimeout(scrollToTop, 100);
  };

  const handlePrevStep = () => {
    prevStep();
    setTimeout(scrollToTop, 100);
  };

  const handleClearForm = () => {
    resetForm();
    setShowClearConfirm(false);
    toast.success("Formulario limpiado correctamente.");
  };

  const handleCreateNew = () => setCurrentStep(1);
  const handleViewAds = () => router.push("/vehicleList");

  const formDataTyped = formData as Partial<VehicleDataBackend>;

  const isStep5Complete = useMemo(() => {
    return (
      (formData.images?.length ?? 0) > 0 &&
      (formData.description?.length ?? 0) >= 50
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
        <title>Publicar Anuncio - 1AutoMarket</title>
      </Head>

      <div className="min-h-screen bg-background text-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* MAIN CARD */}
          <div data-aos="fade-up" data-aos-delay="100">
            <Card className="shadow-xl border-border card-hover" ref={formRef}>
              {/* HEADER */}
              <div data-aos="fade-down" data-aos-delay="200">
                <CardHeader className="text-center relative bg-muted/30 border-b">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-4 bg-primary/10 border-2 border-primary/20">
                    <Car className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-heading font-bold text-foreground">
                    Registrar Vehículo
                  </CardTitle>
                  <p className="text-md text-muted-foreground max-w-lg mx-auto">
                    Completa este formulario profesional para publicar tu
                    vehículo y conectar con compradores potenciales.
                  </p>

                  {/* CLEAR BUTTON */}
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowClearConfirm(true)}
                      className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-all rounded-full px-3 py-1.5 shadow-sm hover:bg-destructive/10"
                      data-aos="fade-left"
                      data-aos-delay="300"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Limpiar</span>
                    </Button>
                  </div>
                </CardHeader>
              </div>

              <CardContent className="p-6 lg:p-8 space-y-6">
                {/* PROGRESS BAR */}
                <div data-aos="fade-up" data-aos-delay="300">
                  <FormProgress
                    currentStep={currentStep}
                    highestCompletedStep={highestCompletedStep}
                    onStepClick={setCurrentStep}
                  />
                </div>

                {/* STEPS */}
                {currentStep === 6 ? (
                  <div data-aos="fade-up" data-aos-delay="400">
                    <PaymentConfirmation
                      selectedBank={selectedBank}
                      setSelectedBank={setSelectedBank}
                      referenceNumber={referenceNumber}
                      setReferenceNumber={setReferenceNumber}
                      paymentProof={paymentProof}
                      setPaymentProof={setPaymentProof}
                      errors={errors}
                      isSubmitting={isSubmitting}
                      onSubmit={handleSubmit}
                      onPrevStep={prevStep}
                    />
                  </div>
                ) : currentStep === 7 ? (
                  <div data-aos="fade-up" data-aos-delay="400">
                    <SuccessScreen
                      onCreateNew={handleCreateNew}
                      onViewAds={handleViewAds}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentStep === 1 && (
                      <div data-aos="fade-up" data-aos-delay="400">
                        <Step1_BasicInfo
                          formData={formDataTyped}
                          errors={errors}
                          handleInputChange={handleInputChange}
                          isLoading={isLoading}
                        />
                      </div>
                    )}
                    {currentStep === 2 && (
                      <div data-aos="fade-up" data-aos-delay="400">
                        <Step2_PriceAndCondition
                          formData={formDataTyped}
                          errors={errors}
                          handleInputChange={handleInputChange}
                          handleSwitchChange={handleSwitchChange}
                        />
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div data-aos="fade-up" data-aos-delay="400">
                        <Step3_Specs
                          formData={formDataTyped}
                          errors={errors}
                          handleInputChange={handleInputChange}
                        />
                      </div>
                    )}
                    {currentStep === 4 && (
                      <div data-aos="fade-up" data-aos-delay="400">
                        <Step4_ContactInfo
                          formData={formDataTyped}
                          errors={errors}
                          handleInputChange={handleInputChange}
                          phoneCodes={phoneCodes}
                        />
                      </div>
                    )}
                    {currentStep === 5 && (
                      <div data-aos="fade-up" data-aos-delay="400">
                        <Step5_FeaturesAndMedia
                          formData={formDataTyped}
                          errors={errors}
                          handleInputChange={handleInputChange}
                          handleFeatureToggle={handleFeatureToggle}
                          handleDocumentationToggle={handleDocumentationToggle}
                          isDocumentationSelected={isDocumentationSelected}
                          handleImagesChange={handleImagesChange}
                          handleSwitchChange={handleSwitchChange}
                        />
                      </div>
                    )}

                    {/* FOOTER BUTTONS */}
                    <div data-aos="fade-up" data-aos-delay="500">
                      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t bg-muted/5 rounded-b-lg">
                        <div>
                          {currentStep > 1 && currentStep < 6 && (
                            <Button
                              variant="outline"
                              onClick={handlePrevStep}
                              disabled={isSubmitting}
                              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-4 py-2.5 shadow-sm border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
                              data-aos="fade-right"
                              data-aos-delay="100"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              Anterior
                            </Button>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3">
                          {currentStep === 5 && (
                            <Button
                              variant="outline"
                              onClick={manualSave}
                              disabled={isSubmitting}
                              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-4 py-2.5 shadow-sm bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 transition-all"
                              data-aos="zoom-in"
                              data-aos-delay="200"
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
                            <Button
                              onClick={handleNextStep}
                              disabled={isSubmitting || !isCurrentStepValid}
                              className="flex w-full sm:w-auto items-center justify-center gap-2 bg-primary hover:bg-primary/90 rounded-xl px-6 py-2.5 shadow-lg transition-all disabled:opacity-50"
                              data-aos="fade-left"
                              data-aos-delay="300"
                            >
                              Siguiente
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          )}

                          {currentStep === 5 && (
                            <Button
                              onClick={handleNextStep}
                              disabled={isSubmitting || !isStep5Complete}
                              className="flex w-full sm:w-auto items-center justify-center gap-2 bg-accent hover:bg-accent/90 rounded-xl px-6 py-2.5 shadow-lg transition-all disabled:opacity-50"
                              data-aos="zoom-in"
                              data-aos-delay="400"
                            >
                              Finalizar y Pagar
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardFooter>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* SECURITY BADGE */}
          <div
            className="mt-12 text-center"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full border bg-card shadow-md text-muted-foreground transition-all hover:shadow-lg">
              <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse" />
              <p className="text-sm">Tus datos están seguros y protegidos</p>
            </div>
          </div>
        </div>

        {/* ALERT DIALOG */}
        <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
          <AlertDialogContent
            className="sm:max-w-md"
            data-aos="zoom-in"
            data-aos-duration="300"
          >
            <AlertDialogHeader>
              <div className="flex items-center space-x-3">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10 sm:mx-0 sm:h-10 sm:w-10 border border-destructive/20">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <AlertDialogTitle className="text-lg font-heading font-semibold">
                  ¿Estás realmente seguro?
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="mt-2 text-sm text-muted-foreground">
                Esta acción eliminará permanentemente todos los datos que has
                ingresado en el formulario. No podrás recuperarlos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel className="rounded-xl px-4 py-2 border-border hover:border-primary/50 transition-all">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearForm}
                className="bg-destructive hover:bg-destructive/90 rounded-xl px-4 py-2 shadow-sm transition-all"
              >
                Sí, limpiar todo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  );
};

export default VehicleRegistrationForm;
