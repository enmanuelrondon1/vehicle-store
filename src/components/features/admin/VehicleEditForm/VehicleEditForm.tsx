// src/components/features/admin/VehicleEditForm/VehicleEditForm.tsx (VERSIÓN FINAL Y CORREGIDA)
"use client";

// 1. React & Hooks (siempre primero)
import { useState, useEffect, useRef } from "react";

// 2. Types y Configuraciones (dependencias base)
import { Vehicle } from "@/types/types";
import { sectionsConfig } from "./sectionsConfig";

// 3. Hooks personalizados
import { useVehicleEditForm } from "@/hooks/useVehicleEditForm";

// 4. Componentes de Layout (estructura principal)
import { FormLayout } from "./FormLayout";
import { FormHeader } from "./FormHeader";
import { FormNavigation } from "./FormNavigation";
import { FormFooter } from "./FormFooter";

// 5. Componentes de Sección (en orden de renderizado)
import { BasicInfoSection } from "./BasicInfoSection";
import { PriceSection } from "./PriceSection";
import { SpecsSection } from "./SpecsSection";
import { ContactSection } from "./ContactSection";
import { FeaturesSection } from "./FeaturesSection";

// 6. Iconos (dependencias visuales)
import { AlertCircle, CheckCircle2, Zap } from "lucide-react";

interface VehicleEditFormProps {
  vehicle: Vehicle;
}

export default function VehicleEditForm({ vehicle }: VehicleEditFormProps) {
  // ... (el resto del código permanece igual)
  const [showDebug, setShowDebug] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("basic");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // 👇 TIPO CORREGIDO: Ahora es un ref para un <form>
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

  // ========================================
  // 🎯 SCROLL PROGRESS TRACKING (Premium UX)
  // ========================================
  useEffect(() => {
    const handleScroll = () => {
      if (!formRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = formRef.current.offsetHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ========================================
  // 🔍 ACTIVE SECTION DETECTION (Scroll Spy)
  // ========================================
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "basic";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  // ========================================
  // 📈 SECTION COMPLETION CALCULATOR
  // ========================================
  const getSectionCompletion = (sectionId: string): number => {
    const section = sectionsConfig.find((s) => s.id === sectionId);
    if (!section) return 0;
    
    // TODO: Replace with actual field validation logic
    const filledFields = Math.floor(Math.random() * section.fields);
    return Math.round((filledFields / section.fields) * 100);
  };

  // ========================================
  // 💾 ENHANCED SUBMIT HANDLER
  // ========================================
  const handleEnhancedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e);
    setLastSaved(new Date());
  };

  // ========================================
  // 🎯 SMOOTH SCROLL TO SECTION
  // ========================================
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    // 👇 ELEMENTO CORREGIDO: Usamos <form> en lugar de <div>
    <form ref={formRef} onSubmit={handleEnhancedSubmit} className="container-wide py-12 animate-fade-in">
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
        {/* ========================================
            🧭 FLOATING NAVIGATION (Desktop Only)
            ======================================== */}
        <FormNavigation
          sectionsConfig={sectionsConfig}
          activeSection={activeSection}
          getSectionCompletion={getSectionCompletion}
          scrollToSection={scrollToSection}
        />

        {/* ========================================
            📦 CONTENT SECTIONS
            ======================================== */}
        {sectionsConfig.map((section, index) => {
          const completion = getSectionCompletion(section.id);
          const hasErrors = Object.keys(errors).some((key) => {
            // TODO: Implement actual error checking by section
            return false;
          });

          return (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Premium Section Header */}
              <div className="relative mb-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Animated Icon with Glow */}
                    <div className="relative group/icon">
                      <div
                        className={`absolute -inset-2 bg-gradient-to-r ${section.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-all duration-500`}
                      ></div>
                      <div
                        className={`relative p-4 bg-gradient-to-br ${section.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300`}
                      >
                        <section.icon className="w-7 h-7 text-primary-foreground drop-shadow-lg" />
                      </div>
                    </div>

                    <div className="flex-1">
                      {/* Section Title & Status */}
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {section.label}
                        </h2>

                        {/* Dynamic Status Badges */}
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

                      {/* Micro Progress Bar */}
                      <div className="mt-3 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${section.gradient} rounded-full transition-all duration-700 ease-out`}
                          style={{ width: `${completion}%` }}
                        >
                          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section Number Badge */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-muted/50 border border-border/50 font-black text-lg text-muted-foreground">
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Content Card with Premium Hover */}
              <div className="card-glass p-6 lg:p-8 relative overflow-hidden group-hover:shadow-xl transition-all duration-500">
                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>

                {/* Section Content Renderer */}
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