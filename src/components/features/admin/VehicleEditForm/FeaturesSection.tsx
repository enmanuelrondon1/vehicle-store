// src/components/features/admin/VehicleEditForm/FeaturesSection.tsx
"use client";

import { useMemo, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InputField } from "@/components/shared/forms/InputField"; // Usamos InputField para consistencia
import { SelectableChip } from "@/components/shared/forms/SelectableChip";
import { getAvailableFeatures } from "@/constants/form-constants";
import {
  VehicleCategory,
  Documentation,
  VehicleDataBackend,
} from "@/types/types";
// import { ImageManager } from "../ImageManager";
import { FileText, Image, Star } from "lucide-react";
import ImageManager from "../ImageManager";

// --- (Lógica de validación y constantes sin cambios, ya es eficiente) ---
const VALIDATION_CONFIG = {
  description: { minLength: 50, maxLength: 2000 },
  images: { min: 1, max: 10 },
};
const validateDescription = (
  description?: string
): { isValid: boolean; error?: string } => {
  if (
    !description ||
    description.length < VALIDATION_CONFIG.description.minLength
  )
    return {
      isValid: false,
      error: `La descripción debe tener al menos ${VALIDATION_CONFIG.description.minLength} caracteres.`,
    };
  if (description.length > VALIDATION_CONFIG.description.maxLength)
    return {
      isValid: false,
      error: `La descripción no puede exceder los ${VALIDATION_CONFIG.description.maxLength} caracteres.`,
    };
  return { isValid: true };
};
const validateImages = (
  images?: string[]
): { isValid: boolean; error?: string } => {
  if (!images || images.length < VALIDATION_CONFIG.images.min)
    return {
      isValid: false,
      error: `Debes subir al menos ${VALIDATION_CONFIG.images.min} imagen.`,
    };
  if (images.length > VALIDATION_CONFIG.images.max)
    return {
      isValid: false,
      error: `No puedes subir más de ${VALIDATION_CONFIG.images.max} imágenes.`,
    };
  return { isValid: true };
};
const DOCUMENTATION_OPTIONS = [
  { label: "Título de Propiedad", value: Documentation.TITLE },
  { label: "Certificado de Origen", value: Documentation.ORIGIN_CERTIFICATE },
  { label: "Revisión de Tránsito (INTT)", value: Documentation.TRANSIT_REVIEW },
  { label: "Placas Bolivarianas", value: Documentation.BOLIVARIAN_PLATES },
];

// --- Interfaz actualizada con las props faltantes ---
interface FeaturesSectionProps {
  vehicleId: string;
  formData: Partial<VehicleDataBackend>;
  handleChange: (field: string, value: any) => void;
  handleImagesChange: (images: string[]) => void;
  handleSwitchChange: (field: string, checked: boolean) => void;
  handleFeatureToggle: (feature: string) => void;
  handleDocumentationToggle: (doc: string) => void;
  isDocumentationSelected: (doc: string) => boolean;
  getInputClassName: (field: string) => string;
  isFieldValid: (field: string) => boolean;
  getFieldError: (field: string) => string | undefined;
  handleBlur: (field: string) => void; // Añadida
  isSubmitting: boolean; // Añadida
}

export function FeaturesSection({
  vehicleId,
  formData,
  handleChange,
  handleImagesChange,
  handleSwitchChange,
  handleFeatureToggle,
  handleDocumentationToggle,
  isDocumentationSelected,
  getInputClassName,
  isFieldValid,
  getFieldError,
  handleBlur,
  isSubmitting,
}: FeaturesSectionProps) {
  // --- Lógica de useMemo (sin cambios, ya es eficiente) ---
  const availableFeatures = useMemo(() => {
    if (!formData.category) return {};
    return getAvailableFeatures(formData.category as VehicleCategory);
  }, [formData.category]);

  const descriptionValidation = useMemo(
    () => validateDescription(formData.description),
    [formData.description]
  );
  const imagesValidation = useMemo(
    () => validateImages(formData.images),
    [formData.images]
  );

  // --- 1. MANEJADORES DE EVENTOS REFACTORIZADOS ---
  const handleDescriptionChange = useCallback(
    (value: string) => handleChange("description", value),
    [handleChange]
  );
  const handleFeatureToggleSafe = useCallback(
    (feature: string) => {
      if (!isSubmitting) handleFeatureToggle(feature);
    },
    [handleFeatureToggle, isSubmitting]
  );
  const handleDocumentationToggleSafe = useCallback(
    (doc: string) => {
      if (!isSubmitting) handleDocumentationToggle(doc);
    },
    [handleDocumentationToggle, isSubmitting]
  );
  const handleFeaturedChange = useCallback(
    (checked: boolean) => handleSwitchChange("isFeatured", checked),
    [handleSwitchChange]
  );

  return (
    // 2. CONTENEDOR UNIFICADO: Usamos 'space-y-6' porque los bloques son grandes y distintos.
    <div className="space-y-6 p-6 -m-6 rounded-lg transition-all duration-300 hover:bg-muted/20">
      {/* Sección de Características */}
      {Object.keys(availableFeatures).length > 0 && (
        <div>
          <h3 className="text-lg font-heading text-foreground mb-4">Características</h3>
          <Card>
            <CardContent className="p-0">
              <Accordion type="multiple" className="border-b-0">
                {Object.entries(availableFeatures).map(([categoryName, categoryData]) => (
                  <AccordionItem value={categoryName} key={categoryName} className="border-border">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline">
                        <h4 className="text-md font-semibold text-left">
                          {categoryName}
                        </h4>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-wrap gap-3 pt-4 pb-5 px-5">
                          {categoryData.features.map((feature) => (
                            <SelectableChip
                              key={feature}
                              label={feature}
                              isSelected={
                                formData.features?.includes(feature) || false
                              }
                              onToggle={() => handleFeatureToggleSafe(feature)}
                              disabled={isSubmitting}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                )}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sección de Documentación */}
      <div>
        <h3 className="text-lg font-heading text-foreground mb-4">
          Documentación
        </h3>
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-3">
              {DOCUMENTATION_OPTIONS.map(({ label, value }) => (
                <SelectableChip
                  key={value}
                  label={label}
                  isSelected={isDocumentationSelected(value)}
                  onToggle={() => handleDocumentationToggleSafe(value)}
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Descripción */}
      <div>
        <InputField
          label="Descripción"
          required
          counter={{ current: formData.description?.length || 0, max: 2000 }}
          tooltip="Mínimo 50 caracteres. Describe el estado, historial y detalles únicos"
          error={descriptionValidation.error}
          success={descriptionValidation.isValid}
          icon={<FileText />}
        >
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            onBlur={() => handleBlur("description")}
            className={getInputClassName("description")}
            placeholder="Describe tu vehículo: estado general, mantenimientos recientes, detalles únicos..."
            rows={6}
            maxLength={2000}
            disabled={isSubmitting}
          />
        </InputField>
      </div>

      {/* Sección de Imágenes */}
      <div>
        <h3 className="text-lg font-heading text-foreground mb-4">
          Imágenes del Vehículo
        </h3>
        <Card className={!imagesValidation.isValid ? "border-destructive" : ""}>
          <CardContent className="p-5">
            <ImageManager
              vehicleId={vehicleId}
              images={formData.images || []}
              onImagesChange={handleImagesChange}
            />
            <p className="text-xs text-muted-foreground mt-3">
              Arrastra las imágenes para reordenarlas. La primera imagen será la
              portada.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Opciones de Publicación */}
      <div>
        <h3 className="text-lg font-heading text-foreground mb-4">
          Opciones de Publicación
        </h3>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
              <div className="flex flex-col space-y-1">
                <span className="font-semibold">Destacar Vehículo</span>
                <span className="text-sm text-muted-foreground">
                  Aparecerá en la página de inicio y tendrá prioridad en las
                  búsquedas
                </span>
              </div>
              <Switch
                id="isFeatured"
                checked={formData.isFeatured || false}
                onCheckedChange={handleFeaturedChange}
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}