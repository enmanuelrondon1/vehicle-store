// src/components/features/admin/VehicleEditForm/VehicleEditForm.tsx
"use client";

import { useState } from "react";
import { Vehicle } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"; // Importamos CardHeader
import { Separator } from "@/components/ui/separator";
import { Loader2, Save } from "lucide-react";
import { VehicleEditFormHeader } from "./VehicleEditFormHeader";
import { BasicInfoSection } from "./BasicInfoSection";
import { PriceSection } from "./PriceSection";
import { SpecsSection } from "./SpecsSection";
import { ContactSection } from "./ContactSection";
import { FeaturesSection } from "./FeaturesSection";
import { useVehicleEditForm } from "@/hooks/useVehicleEditForm";

interface VehicleEditFormProps {
  vehicle: Vehicle;
}

export default function VehicleEditForm({ vehicle }: VehicleEditFormProps) {
  const [showDebug, setShowDebug] = useState(false);

  const {
    // State
    formData,
    isSubmitting,
    errors,
    touchedFields,
    hasUnsavedChanges,
    
    // Computed
    isFormValid,
    criticalErrorsCount,
    
    // Handlers
    handleChange,
    handleChangeWithoutTouch,
    handleBlur,
    handleNestedChange,
    handleSwitchChange,
    handleFeatureToggle,
    handleDocumentationToggle,
    handleSubmit,
    handleImagesChange,
    
    // Utilities
    isDocumentationSelected,
    getFieldError,
    isFieldValid,
    getInputClassName,
    
    // Router
    router,
  } = useVehicleEditForm(vehicle);

  return (
    // 1. CONTENEDOR PRINCIPAL: Limita el ancho y centra el formulario en pantallas grandes.
    <div className="container-max py-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 2. TARJETA PRINCIPAL: Añadimos sombra y un borde más definido usando tus variables. */}
        <Card className="shadow-lg border-border">
          {/* 3. CABECERA DIFERENCIADA: Usamos CardHeader con un fondo sutil para separarla visualmente. */}
          <CardHeader className="bg-muted/30 border-b">
            <VehicleEditFormHeader
              vehicle={vehicle}
              isFormValid={isFormValid}
              errorsCount={Object.keys(errors).length}
              hasUnsavedChanges={hasUnsavedChanges}
              criticalErrorsCount={criticalErrorsCount}
              showDebug={showDebug}
              onToggleDebug={() => setShowDebug(!showDebug)}
              touchedFieldsCount={touchedFields.size}
              isSubmitting={isSubmitting}
              errors={errors}
            />
          </CardHeader>

          {/* 4. CONTENIDO CON MÁS ESPACIO: Aumentamos el padding para dar más aire. */}
          <CardContent className="p-8 space-y-10">
            {/* 5. SECCIONES ENVUELTAS: Cada sección ahora es un "bloque" visual. */}
            <div className="space-y-2">
              <h2 className="text-xl font-heading text-foreground">Información Básica</h2>
              <div className="p-6 bg-card rounded-lg border border-border">
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
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h2 className="text-xl font-heading text-foreground">Precio y Financiación</h2>
              <div className="p-6 bg-card rounded-lg border border-border">
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
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h2 className="text-xl font-heading text-foreground">Especificaciones Técnicas</h2>
              <div className="p-6 bg-card rounded-lg border border-border">
                <SpecsSection
                  formData={formData}
                  handleChange={handleChange}
                  getInputClassName={getInputClassName}
                  isFieldValid={isFieldValid}
                  getFieldError={getFieldError}
                  handleBlur={handleBlur}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h2 className="text-xl font-heading text-foreground">Información de Contacto</h2>
              <div className="p-6 bg-card rounded-lg border border-border">
                <ContactSection
                  formData={formData}
                  handleChange={handleChange}
                  handleNestedChange={handleNestedChange}
                  getInputClassName={getInputClassName}
                  isFieldValid={isFieldValid}
                  getFieldError={getFieldError}
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h2 className="text-xl font-heading text-foreground">Características y Multimedia</h2>
              <div className="p-6 bg-card rounded-lg border border-border">
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
                />
              </div>
            </div>
          </CardContent>

          {/* 6. FOOTER REFORZADO: Mejoramos el espaciado y la separación. */}
          <CardFooter className="flex justify-between items-center border-t bg-muted/20 p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <div className="flex items-center gap-3">
              {/* 7. TEXTO DE ESTADO DINÁMICO: Añadimos color para dar más feedback. */}
              <span className={`text-sm font-medium transition-colors ${
                isSubmitting 
                  ? 'text-muted-foreground' 
                  : !isFormValid 
                    ? 'text-destructive' 
                    : 'text-green-600 dark:text-green-400'
              }`}>
                {isSubmitting 
                  ? 'Enviando...' 
                  : !isFormValid 
                    ? `Revisar ${Object.keys(errors).length} error(es)` 
                    : 'Todos los cambios están listos'}
              </span>
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="min-w-[150px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}