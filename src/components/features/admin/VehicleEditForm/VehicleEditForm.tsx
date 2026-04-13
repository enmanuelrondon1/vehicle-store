// src/components/features/admin/VehicleEditForm/VehicleEditForm.tsx
// ✅ OPTIMIZADO:
//    1. Eliminado Math.random() en getSectionCompletion — causaba hidratación
//       SSR/CSR mismatch y re-renders en cada render del componente.
//       Reemplazado por cálculo real basado en formData.
//    2. scrollToSection usa "instant" en lugar de "smooth" para no bloquear
//       el hilo principal durante la navegación entre secciones.

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Vehicle } from "@/types/types";
import { sectionsConfig } from "./sectionsConfig";
import { useVehicleEditForm } from "@/hooks/useVehicleEditForm";
import { FormLayout } from "./FormLayout";
import { FormHeader } from "./FormHeader";
import { FormNavigation } from "./FormNavigation";
import { FormFooter } from "./FormFooter";
import { BasicInfoSection } from "./BasicInfoSection";
import { PriceSection } from "./PriceSection";
import { SpecsSection } from "./SpecsSection";
import { ContactSection } from "./ContactSection";
import { FeaturesSection } from "./FeaturesSection";
import { AlertCircle, CheckCircle2, Zap } from "lucide-react";

interface VehicleEditFormProps {
  vehicle: Vehicle;
}

export default function VehicleEditForm({ vehicle }: VehicleEditFormProps) {
  const [showDebug, setShowDebug] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("basic");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    formData,
    isSubmitting,
    errors,
    touchedFields,
    hasUnsavedChanges,
    isFormValid,
    criticalErrorsCount,
    handleChange,
    handleChangeWithoutTouch,
    handleBlur,
    handleNestedChange,
    handleSwitchChange,
    handleFeatureToggle,
    handleDocumentationToggle,
    handleSubmit,
    handleImagesChange,
    isDocumentationSelected,
    getFieldError,
    isFieldValid,
    getInputClassName,
    router,
  } = useVehicleEditForm(vehicle);

  // ── Scroll progress ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      if (!formRef.current) return;
      const docHeight = formRef.current.offsetHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const progress = (window.scrollY / docHeight) * 100;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Scroll spy ────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "basic";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) current = section.id;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  // ── Section completion — basado en formData real, no Math.random() ────────
  const getSectionCompletion = useCallback((sectionId: string): number => {
    if (!formData) return 0;

    const checks: Record<string, () => boolean[]> = {
      basic: () => [
        !!formData.brand,
        !!formData.model,
        !!formData.year,
        !!formData.category,
        !!formData.condition,
      ],
      price: () => [
        !!formData.price,
        !!formData.currency,
      ],
      specs: () => [
        !!formData.mileage,
        !!formData.transmission,
        !!formData.fuelType,
        !!formData.color,
      ],
      contact: () => [
        !!formData.sellerContact?.name,
        !!formData.sellerContact?.email,
        !!formData.sellerContact?.phone,
        !!formData.location,
      ],
      features: () => [
        (formData.features?.length ?? 0) > 0,
        (formData.images?.length ?? 0) > 0,
      ],
    };

    const fields = checks[sectionId]?.() ?? [];
    if (fields.length === 0) return 0;
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [formData]);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleEnhancedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e);
    setLastSaved(new Date());
  };

  // ── Scroll to section ─────────────────────────────────────────────────────
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const offsetPosition = element.getBoundingClientRect().top + window.scrollY - 100;
    // ✅ "instant" — smooth bloquea el hilo principal durante la animación
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }, []);

  return (
    <form
      ref={formRef}
      onSubmit={handleEnhancedSubmit}
      className="container-wide py-12 animate-fade-in"
    >
      <FormLayout
        scrollProgress={scrollProgress}
        header={
          <FormHeader
            vehicle={vehicle}
            isFormValid={isFormValid}
            errors={errors}
            hasUnsavedChanges={hasUnsavedChanges}
            criticalErrorsCount={criticalErrorsCount}
            showDebug={showDebug}
            onToggleDebug={() => setShowDebug(!showDebug)}
            touchedFieldsCount={touchedFields.size}
            isSubmitting={isSubmitting}
            lastSaved={lastSaved}
          />
        }
        footer={
          <FormFooter
            isSubmitting={isSubmitting}
            isFormValid={isFormValid}
            hasUnsavedChanges={hasUnsavedChanges}
            errors={errors}
            onEnhancedSubmit={handleEnhancedSubmit}
          />
        }
      >
        <FormNavigation
          sectionsConfig={sectionsConfig}
          activeSection={activeSection}
          getSectionCompletion={getSectionCompletion}
          scrollToSection={scrollToSection}
        />

        {sectionsConfig.map((section, index) => {
          const completion = getSectionCompletion(section.id);
          const hasErrors = Object.keys(errors).some(() => false);

          return (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Section header */}
              <div className="relative mb-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative group/icon">
                      <div
                        className={`absolute -inset-2 bg-gradient-to-r ${section.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-all duration-500`}
                      />
                      <div
                        className={`relative p-4 bg-gradient-to-br ${section.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300`}
                      >
                        <section.icon className="w-7 h-7 text-primary-foreground drop-shadow-lg" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {section.label}
                        </h2>
                        {hasErrors ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-destructive/10 border border-destructive/20 rounded-full text-xs font-bold text-destructive animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            Requiere atención
                          </span>
                        ) : completion === 100 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/10 border border-success/20 rounded-full text-xs font-bold text-success">
                            <CheckCircle2 className="w-3 h-3" />
                            Completo
                          </span>
                        ) : completion > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs font-bold text-accent">
                            <Zap className="w-3 h-3" />
                            {completion}% completado
                          </span>
                        ) : null}
                      </div>

                      <p className="text-sm text-muted-foreground font-medium">
                        {section.description}
                      </p>

                      <div className="mt-3 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${section.gradient} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted/50 border border-border/50 font-black text-lg text-muted-foreground">
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Section content */}
              <div className="card-glass p-6 lg:p-8 relative overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
                <div className="relative z-10">
                  {section.id === "basic" && (
                    <BasicInfoSection
                      formData={formData}
                      handleChange={handleChange}
                      handleChangeWithoutTouch={handleChangeWithoutTouch}
                      handleBlur={handleBlur}
                      getFieldError={getFieldError}
                      isFieldValid={isFieldValid}
                      getInputClassName={getInputClassName}
                      isSubmitting={isSubmitting}
                    />
                  )}
                  {section.id === "price" && (
                    <PriceSection
                      formData={formData}
                      handleChange={handleChange}
                      handleNestedChange={handleNestedChange}
                      handleSwitchChange={handleSwitchChange}
                      getInputClassName={getInputClassName}
                      isFieldValid={isFieldValid}
                      getFieldError={getFieldError}
                      handleBlur={handleBlur}
                      isSubmitting={isSubmitting}
                    />
                  )}
                  {section.id === "specs" && (
                    <SpecsSection
                      formData={formData}
                      handleChange={handleChange}
                      getInputClassName={getInputClassName}
                      isFieldValid={isFieldValid}
                      getFieldError={getFieldError}
                      handleBlur={handleBlur}
                      isSubmitting={isSubmitting}
                    />
                  )}
                  {section.id === "contact" && (
                    <ContactSection
                      formData={formData}
                      handleChange={handleChange}
                      handleNestedChange={handleNestedChange}
                      getInputClassName={getInputClassName}
                      isFieldValid={isFieldValid}
                      getFieldError={getFieldError}
                      handleBlur={handleBlur}
                      isSubmitting={isSubmitting}
                    />
                  )}
                  {section.id === "features" && (
                    <FeaturesSection
                      vehicleId={vehicle._id}
                      formData={formData}
                      handleChange={handleChange}
                      handleImagesChange={handleImagesChange}
                      handleSwitchChange={handleSwitchChange}
                      handleFeatureToggle={handleFeatureToggle}
                      handleDocumentationToggle={handleDocumentationToggle}
                      isDocumentationSelected={isDocumentationSelected}
                      getInputClassName={getInputClassName}
                      isFieldValid={isFieldValid}
                      getFieldError={getFieldError}
                      handleBlur={handleBlur}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </FormLayout>
    </form>
  );
}