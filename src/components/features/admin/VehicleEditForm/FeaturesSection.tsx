// src/components/features/admin/VehicleEditForm/FeaturesSection.tsx
"use client";

import { useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SelectableChip } from "@/components/shared/forms/SelectableChip";
import { getAvailableFeatures } from "@/constants/form-constants";
import {
  VehicleCategory,
  Documentation,
  VehicleDataBackend,
} from "@/types/types";
import { FieldWrapper } from "./FieldWrapper";
import ImageManager from "../ImageManager";

const VALIDATION_CONFIG = {
  description: {
    minLength: 50,
    maxLength: 2000,
  },
  images: {
    min: 1,
    max: 10,
  },
};

const validateDescription = (
  description?: string
): { isValid: boolean; error?: string } => {
  if (
    !description ||
    description.length < VALIDATION_CONFIG.description.minLength
  ) {
    return {
      isValid: false,
      error: `La descripción debe tener al menos ${VALIDATION_CONFIG.description.minLength} caracteres.`,
    };
  }
  if (description.length > VALIDATION_CONFIG.description.maxLength) {
    return {
      isValid: false,
      error: `La descripción no puede exceder los ${VALIDATION_CONFIG.description.maxLength} caracteres.`,
    };
  }
  return { isValid: true };
};

const validateImages = (
  images?: string[]
): { isValid: boolean; error?: string } => {
  if (!images || images.length < VALIDATION_CONFIG.images.min) {
    return {
      isValid: false,
      error: `Debes subir al menos ${VALIDATION_CONFIG.images.min} imagen.`,
    };
  }
  if (images.length > VALIDATION_CONFIG.images.max) {
    return {
      isValid: false,
      error: `No puedes subir más de ${VALIDATION_CONFIG.images.max} imágenes.`,
    };
  }
  return { isValid: true };
};

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
}

const DOCUMENTATION_OPTIONS = [
  { label: "Título de Propiedad", value: Documentation.TITLE },
  { label: "Certificado de Origen", value: Documentation.ORIGIN_CERTIFICATE },
  { label: "Revisión de Tránsito (INTT)", value: Documentation.TRANSIT_REVIEW },
  { label: "Placas Bolivarianas", value: Documentation.BOLIVARIAN_PLATES },
];

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
}: FeaturesSectionProps) {
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

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
          5
        </span>
        Características y Multimedia
      </h3>

      {/* Características */}
      {Object.keys(availableFeatures).length > 0 && (
        <div className="mb-6">
          <FieldWrapper
            label="Características"
            field="features"
            tooltip="Selecciona todas las características que apliquen"
            error={getFieldError("features")}
            isValid={isFieldValid("features")}
          >
            <Card>
              <CardContent className="p-0">
                <Accordion
                  type="multiple"
                  defaultValue={Object.keys(availableFeatures)}
                >
                  {Object.entries(availableFeatures).map(
                    ([categoryName, categoryData]) => (
                      <AccordionItem value={categoryName} key={categoryName}>
                        <AccordionTrigger className="px-5 py-4">
                          <h4 className="text-md font-semibold">
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
                                onToggle={() => handleFeatureToggle(feature)}
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
          </FieldWrapper>
        </div>
      )}

      {/* Documentación */}
      <div className="mb-6">
        <FieldWrapper
          label="Documentación"
          field="documentation"
          tooltip="Documentos disponibles del vehículo"
          error={getFieldError("documentation")}
          isValid={isFieldValid("documentation")}
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-3">
                {DOCUMENTATION_OPTIONS.map(({ label, value }) => (
                  <SelectableChip
                    key={value}
                    label={label}
                    isSelected={isDocumentationSelected(value)}
                    onToggle={() => handleDocumentationToggle(value)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </FieldWrapper>
      </div>

      {/* Descripción */}
      <div className="mb-6">
        <FieldWrapper
          label="Descripción"
          field="description"
          required
          counter={{
            current: formData.description?.length || 0,
            max: 2000,
          }}
          tooltip="Mínimo 50 caracteres. Describe el estado, historial y detalles únicos"
          error={descriptionValidation.error}
          isValid={descriptionValidation.isValid}
        >
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className={getInputClassName("description")}
            placeholder="Describe tu vehículo: estado general, mantenimientos recientes, detalles únicos..."
            rows={6}
            maxLength={2000}
          />
        </FieldWrapper>
      </div>

      {/* Imágenes */}
      <div className="mb-6">
        <FieldWrapper
          label="Imágenes del Vehículo"
          field="images"
          required
          tooltip="Mínimo 1 imagen, máximo 10 imágenes"
          error={imagesValidation.error}
          isValid={imagesValidation.isValid}
        >
          <Card
            className={!imagesValidation.isValid ? "border-destructive" : ""}
          >
            <CardContent className="p-5">
              <ImageManager
                vehicleId={vehicleId}
                images={formData.images || []}
                onImagesChange={handleImagesChange}
              />
              <p className="text-xs text-muted-foreground mt-3">
                Arrastra las imágenes para reordenarlas. La primera imagen será
                la portada.
              </p>
            </CardContent>
          </Card>
        </FieldWrapper>
      </div>

      {/* Vehículo Destacado */}
      <div>
        <FieldWrapper label="Opciones de Publicación" field="isFeatured">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <Label
                  htmlFor="isFeatured"
                  className="flex flex-col space-y-1 cursor-pointer"
                >
                  <span className="font-semibold">Destacar Vehículo</span>
                  <span className="text-sm text-muted-foreground">
                    Aparecerá en la página de inicio y tendrá prioridad en las
                    búsquedas
                  </span>
                </Label>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured || false}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isFeatured", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </FieldWrapper>
      </div>
    </div>
  );
}