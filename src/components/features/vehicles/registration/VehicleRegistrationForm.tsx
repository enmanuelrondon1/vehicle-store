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
  Shield,
  Zap,
  Star,
  Sparkles,
  CheckCircle2,
  Loader2,
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
import { useSession } from "next-auth/react";

// Hooks
import { useVehicleForm } from "@/hooks/use-vehicle-form";

// Constants
import { phoneCodes } from "@/constants/form-constants";

// Components
import { FormProgress } from "./form-progress";
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
  const { data: session } = useSession();

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

  // Step information for enhanced UI
  const stepInfo = [
    {
      id: 1,
      title: "Información Básica",
      icon: Car,
      description: "Datos principales del vehículo",
    },
    {
      id: 2,
      title: "Precio y Condición",
      icon: Star,
      description: "Define el valor y estado",
    },
    {
      id: 3,
      title: "Especificaciones",
      icon: Zap,
      description: "Detalles técnicos",
    },
    {
      id: 4,
      title: "Contacto",
      icon: Shield,
      description: "Información de contacto",
    },
    {
      id: 5,
      title: "Fotos y Extras",
      icon: Sparkles,
      description: "Imágenes y características",
    },
  ];

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

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* PREMIUM HEADER */}

          <div className="relative mb-10">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 rounded-3xl transform -skew-y-1"></div>

            {/* Contenido del header */}
            <div className="relative text-center py-8 px-6 animate-fade-in">
              {/* Icono decorativo */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg mb-6">
                <Car className="w-8 h-8 text-white" />
              </div>

              {/* Título principal con gradiente mejorado */}
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">
                <span className="text-foreground">Publica tu </span>
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-sm">
                  Vehículo
                </span>
              </h1>

              {/* Subtítulo con mejor espaciado */}
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Conecta con miles de compradores potenciales a través de nuestra
                plataforma premium
              </p>

              {/* Línea decorativa */}
              <div className="mt-6 flex justify-center">
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full"></div>
              </div>
            </div>
          </div>

          {/* MAIN CARD */}
          <div className="animate-slide-up">
            <Card
              className="card-premium shadow-xl overflow-hidden border-0"
              ref={formRef}
            >
              {/* PREMIUM HEADER */}
              <div className="relative bg-gradient-to-r from-primary/5 to-accent/5 p-8 border-b border-border/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>

                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 shadow-lg">
                    <Car className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-heading font-bold text-foreground mb-2">
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
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Limpiar</span>
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 lg:p-8 space-y-6">
                {/* ENHANCED PROGRESS BAR */}
                <div className="mb-8">
                  <FormProgress
                    currentStep={currentStep}
                    highestCompletedStep={highestCompletedStep}
                    onStepClick={setCurrentStep}
                  />

                  {/* Step info display */}
                  <div className="mt-6 text-center animate-fade-in">
                    {currentStep <= 5 && (
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-muted/30 border border-border/50">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          {React.createElement(stepInfo[currentStep - 1].icon, {
                            className: "w-4 h-4 text-primary",
                          })}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">
                            {stepInfo[currentStep - 1].title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {stepInfo[currentStep - 1].description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* STEPS */}
                {currentStep === 6 ? (
                  <div className="animate-scale-in">
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
                  <div className="animate-scale-in">
                    <SuccessScreen
                      onCreateNew={handleCreateNew}
                      onViewAds={handleViewAds}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentStep === 1 && (
                      <div className="animate-fade-in">
                        <Step1_BasicInfo
                          formData={formDataTyped}
                          errors={errors}
                          handleInputChange={handleInputChange}
                          isLoading={isLoading}
                        />
                      </div>
                    )}
                    {currentStep === 2 && (
                      <div className="animate-fade-in">
                        <Step2_PriceAndCondition
                          formData={formDataTyped}
                          errors={errors}
                          handleInputChange={handleInputChange}
                          handleSwitchChange={handleSwitchChange}
                        />
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="animate-fade-in">
                        <Step3_Specs
                          formData={formDataTyped}
                          errors={errors}
                          handleInputChange={handleInputChange}
                        />
                      </div>
                    )}
                    {currentStep === 4 && (
                      <div className="animate-fade-in">
                        <Step4_ContactInfo
                          formData={formDataTyped}
                          errors={errors}
                          handleInputChange={handleInputChange}
                          phoneCodes={phoneCodes}
                          userSession={session?.user}
                        />
                      </div>
                    )}
                    {currentStep === 5 && (
                      <div className="animate-fade-in">
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

                    {/* ENHANCED FOOTER BUTTONS */}
                    <div className="mt-8 pt-6 border-t border-border/50 bg-muted/10 rounded-b-lg p-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          {currentStep > 1 && currentStep < 6 && (
                            <Button
                              variant="outline"
                              onClick={handlePrevStep}
                              disabled={isSubmitting}
                              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-2.5 shadow-sm border-border hover:border-primary/50 hover:bg-primary/5 transition-all hover:-translate-y-0.5"
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
                              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-2.5 shadow-sm bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 transition-all hover:-translate-y-0.5"
                            >
                              {saveStatus === "saving" ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Guardando...
                                </>
                              ) : saveStatus === "saved" ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  Guardado
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4" />
                                  Guardar
                                </>
                              )}
                            </Button>
                          )}

                          {currentStep < 5 && (
                            <Button
                              onClick={handleNextStep}
                              disabled={isSubmitting || !isCurrentStepValid}
                              className="btn-primary flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-2.5 shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Siguiente
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          )}

                          {currentStep === 5 && (
                            <Button
                              onClick={handleNextStep}
                              disabled={isSubmitting || !isStep5Complete}
                              className="btn-accent flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-2.5 shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shimmer-effect"
                            >
                              Finalizar y Pagar
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ENHANCED SECURITY BADGE */}
          <div className="mt-12 text-center animate-fade-in">
            <div className="inline-flex items-center px-6 py-3 rounded-full border border-border/50 bg-card shadow-md text-muted-foreground transition-all hover:shadow-lg hover:-translate-y-0.5 card-hover">
              <div className="w-2 h-2 bg-success rounded-full mr-3 animate-pulse"></div>
              <Shield className="w-4 h-4 mr-2 text-success" />
              <p className="text-sm font-medium">
                Tus datos están encriptados y protegidos
              </p>
            </div>
          </div>

          {/* PREMIUM FEATURES SECTION */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            <div className="card-glass p-6 card-hover text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Publicación Rápida</h3>
              <p className="text-sm text-muted-foreground">
                Tu vehículo estará visible en menos de 24 horas tras la
                verificación
              </p>
            </div>

            <div className="card-glass p-6 card-hover text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Alcance Premium</h3>
              <p className="text-sm text-muted-foreground">
                Tu anuncio será destacado y visto por miles de compradores
                potenciales
              </p>
            </div>

            <div className="card-glass p-6 card-hover text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-4">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Resultados Garantizados</h3>
              <p className="text-sm text-muted-foreground">
                El 90% de nuestros usuarios venden su vehículo en menos de 30
                días
              </p>
            </div>
          </div>
        </div>

        {/* ENHANCED ALERT DIALOG */}
        <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
          <AlertDialogContent className="sm:max-w-md card-premium border-0">
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
