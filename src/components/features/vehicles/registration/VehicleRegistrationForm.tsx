// src/components/features/vehicles/registration/VehicleRegistrationForm.tsx
"use client";

import React, { useState, useMemo, useRef } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Car, Trash2, ArrowLeft, ArrowRight, Save, AlertTriangle,
  Shield, Zap, Star, Sparkles, CheckCircle2, Loader2,
  ClipboardList, Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import ProtectedRoute from "@/components/features/auth/ProtectedRoute";
import { useSession } from "next-auth/react";
import { useVehicleForm } from "@/hooks/use-vehicle-form";
import { phoneCodes } from "@/constants/form-constants";
import { FormProgress } from "./form-progress";
import { PaymentConfirmation } from "../../payment/payment-confirmation";
import { SuccessScreen } from "./success-screen";

// ✅ Step1 carga inmediata — es lo primero que ve el usuario
import Step1_BasicInfo from "./Step1_BasicInfo";

// ✅ Steps 2-5 lazy — solo se descargan cuando el usuario llega a ese paso
const Step2_PriceAndCondition = dynamic(() => import("./Step2_PriceAndCondition"), {
  loading: () => <FormLoadingSkeleton />,
});
const Step3_Specs = dynamic(() => import("./Step3_Specs"), {
  loading: () => <FormLoadingSkeleton />,
});
const Step4_ContactInfo = dynamic(() => import("./Step4_ContactInfo"), {
  loading: () => <FormLoadingSkeleton />,
});
const Step5_FeaturesAndMedia = dynamic(() => import("./Step5_FeaturesAndMedia"), {
  loading: () => <FormLoadingSkeleton />,
});

import type { VehicleDataBackend } from "@/types/types";

const STEP_INFO = [
  { id: 1, title: "Información Básica",  icon: Car,      description: "Datos principales del vehículo" },
  { id: 2, title: "Precio y Condición",  icon: Star,     description: "Define el valor y estado" },
  { id: 3, title: "Especificaciones",    icon: Zap,      description: "Detalles técnicos" },
  { id: 4, title: "Contacto",            icon: Shield,   description: "Información de contacto" },
  { id: 5, title: "Fotos y Extras",      icon: Sparkles, description: "Imágenes y características" },
];

const FEATURE_CARDS = [
  { icon: Zap,          color: "primary", title: "Publicación Rápida",      desc: "Tu vehículo estará visible en menos de 24 horas tras la verificación" },
  { icon: Star,         color: "accent",  title: "Alcance Premium",         desc: "Tu anuncio será destacado y visto por miles de compradores potenciales" },
  { icon: CheckCircle2, color: "success", title: "Resultados Garantizados", desc: "El 90% de nuestros usuarios venden su vehículo en menos de 30 días" },
];

const SaveButtonContent: React.FC<{ status: "idle" | "saving" | "saved" }> = ({ status }) => {
  if (status === "saving") return <><Loader2 className="w-4 h-4 animate-spin" />Guardando...</>;
  if (status === "saved")  return <><CheckCircle2 className="w-4 h-4" />Guardado</>;
  return <><Save className="w-4 h-4" />Guardar</>;
};

function FormLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="pt-6 border-t border-border/50 flex justify-between">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}

const formatSavedAt = (isoString?: string): string => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1)   return "hace unos segundos";
    if (diffMins < 60)  return `hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
    if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffDays === 1) return "ayer";
    if (diffDays < 7)   return `hace ${diffDays} días`;
    return date.toLocaleDateString("es-VE", { day: "numeric", month: "long" });
  } catch { return ""; }
};

const VehicleRegistrationForm: React.FC = () => {
  const router = useRouter();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const {
    currentStep, highestCompletedStep, formData, isCurrentStepValid,
    errors, isSubmitting, isLoading, saveStatus, submissionStatus,
    selectedBank, paymentProof, referenceNumber, hasSavedProgress,
    savedProgressInfo, confirmResume, discardSaved, setCurrentStep,
    resetForm, setSelectedBank, setPaymentProof, setReferenceNumber,
    handleInputChange, handleFeatureToggle, handleDocumentationToggle,
    isDocumentationSelected, handleImagesChange, nextStep, prevStep,
    manualSave, handleSubmit, handleSwitchChange,
  } = useVehicleForm({ formRef });

  React.useEffect(() => {
    if (submissionStatus === "error" && errors.general) {
      toast.error(errors.general, {
        description: "Por favor, revisa los campos e inténtalo de nuevo.",
        action: { label: "Reintentar", onClick: () => handleSubmit() },
      });
    }
  }, [submissionStatus, errors.general, handleSubmit]);

  const scrollToTop = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextStep = () => { nextStep(); setTimeout(scrollToTop, 100); };
  const handlePrevStep = () => { prevStep(); setTimeout(scrollToTop, 100); };
  const handleClearForm = () => { resetForm(); setShowClearConfirm(false); toast.success("Formulario limpiado correctamente."); };
  const handleCreateNew = () => setCurrentStep(1);
  const handleViewAds   = () => router.push("/vehicleList");

  const formDataTyped = formData as Partial<VehicleDataBackend>;

  const isStep5Complete = useMemo(() => (
    (formData.images?.length ?? 0) > 0 &&
    (formData.description?.length ?? 0) >= 50
  ), [formData.images, formData.description]);

  const stepProps = {
    1: { formData: formDataTyped, errors, handleInputChange, isLoading },
    2: { formData: formDataTyped, errors, handleInputChange, handleSwitchChange },
    3: { formData: formDataTyped, errors, handleInputChange },
    4: { formData: formDataTyped, errors, handleInputChange, phoneCodes, userSession: session?.user },
    5: { formData: formDataTyped, errors, handleInputChange, handleFeatureToggle, handleDocumentationToggle, isDocumentationSelected, handleImagesChange, handleSwitchChange },
  } as const;

  const currentStepInfo = STEP_INFO[currentStep - 1];

  return (
    <ProtectedRoute>
      <Head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="robots" content="noindex, nofollow" />
        <title>Publicar Anuncio - 1AutoMarket</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-slide-up">
            <Card className="card-premium shadow-xl overflow-hidden border-0" ref={formRef}>

              {/* HEADER */}
              <div className="relative bg-gradient-to-r from-primary/5 to-accent/5 p-8 border-b border-border/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 shadow-lg">
                    <Car className="w-10 h-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-heading font-bold text-foreground mb-2">
                    Registrar Vehículo
                  </CardTitle>
                  <p className="text-md text-muted-foreground max-w-lg mx-auto">
                    Completa este formulario profesional para publicar tu vehículo y conectar con compradores potenciales.
                  </p>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost" size="sm"
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
                {/* PROGRESS */}
                <div className="mb-8">
                  <FormProgress
                    currentStep={currentStep}
                    highestCompletedStep={highestCompletedStep}
                    onStepClick={setCurrentStep}
                  />
                  {currentStep <= 5 && currentStepInfo && (
                    <div className="mt-6 text-center animate-fade-in">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-muted/30 border border-border/50">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          {React.createElement(currentStepInfo.icon, { className: "w-4 h-4 text-primary" })}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">{currentStepInfo.title}</p>
                          <p className="text-xs text-muted-foreground">{currentStepInfo.description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* STEP CONTENT */}
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
                    <SuccessScreen onCreateNew={handleCreateNew} onViewAds={handleViewAds} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {isLoading ? (
                      <FormLoadingSkeleton />
                    ) : (
                      <div className="animate-fade-in">
                        {currentStep === 1 && <Step1_BasicInfo        {...stepProps[1]} />}
                        {currentStep === 2 && <Step2_PriceAndCondition {...stepProps[2]} />}
                        {currentStep === 3 && <Step3_Specs             {...stepProps[3]} />}
                        {currentStep === 4 && <Step4_ContactInfo       {...stepProps[4]} />}
                        {currentStep === 5 && <Step5_FeaturesAndMedia  {...stepProps[5]} />}
                      </div>
                    )}

                    {!isLoading && (
                      <div className="mt-8 pt-6 border-t border-border/50 bg-muted/10 rounded-b-lg p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div>
                            {currentStep > 1 && currentStep < 6 && (
                              <Button
                                variant="outline" onClick={handlePrevStep} disabled={isSubmitting}
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
                                variant="outline" onClick={manualSave} disabled={isSubmitting}
                                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-2.5 shadow-sm bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 transition-all hover:-translate-y-0.5"
                              >
                                <SaveButtonContent status={saveStatus} />
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
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* SECURITY BADGE */}
          <div className="mt-12 text-center animate-fade-in">
            <div className="inline-flex items-center px-6 py-3 rounded-full border border-border/50 bg-card shadow-md text-muted-foreground transition-all hover:shadow-lg hover:-translate-y-0.5 card-hover">
              <div className="w-2 h-2 bg-success rounded-full mr-3 animate-pulse" />
              <Shield className="w-4 h-4 mr-2 text-success" />
              <p className="text-sm font-medium">Tus datos están encriptados y protegidos</p>
            </div>
          </div>

          {/* FEATURE CARDS */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            {FEATURE_CARDS.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="card-glass p-6 card-hover text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${color}/10 mb-4`}>
                  <Icon className={`w-6 h-6 text-${color}`} />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal recuperación de sesión */}
        <AlertDialog open={hasSavedProgress} onOpenChange={() => {}}>
          <AlertDialogContent className="sm:max-w-md card-premium border-0">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <AlertDialogTitle className="text-lg font-heading font-semibold">
                  Tienes un anuncio en progreso
                </AlertDialogTitle>
              </div>
              {savedProgressInfo && (
                <div className="mt-3 p-4 rounded-xl bg-muted/40 border border-border/50 space-y-3">
                  {(savedProgressInfo.brand || savedProgressInfo.model) && (
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-semibold text-foreground">
                        {[savedProgressInfo.brand, savedProgressInfo.model, savedProgressInfo.year].filter(Boolean).join(" ")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Progreso:</span>
                      <Badge variant="secondary" className="font-medium">
                        Paso {savedProgressInfo.highestStep} de 5
                      </Badge>
                    </div>
                    {savedProgressInfo.savedAt && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatSavedAt(savedProgressInfo.savedAt)}
                      </div>
                    )}
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${(savedProgressInfo.highestStep / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              <AlertDialogDescription className="mt-3 text-sm text-muted-foreground">
                ¿Deseas continuar donde lo dejaste o empezar un anuncio nuevo?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 flex-col sm:flex-row">
              <AlertDialogCancel onClick={discardSaved} className="rounded-xl px-4 py-2 border-border hover:border-destructive/50 hover:text-destructive transition-all">
                Empezar de nuevo
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmResume} className="btn-primary rounded-xl px-4 py-2 shadow-sm transition-all">
                Continuar anuncio
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Modal limpiar formulario */}
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
                Esta acción eliminará permanentemente todos los datos que has ingresado en el formulario. No podrás recuperarlos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel className="rounded-xl px-4 py-2 border-border hover:border-primary/50 transition-all">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleClearForm} className="bg-destructive hover:bg-destructive/90 rounded-xl px-4 py-2 shadow-sm transition-all">
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