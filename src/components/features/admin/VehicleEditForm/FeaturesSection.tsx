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
import { InputField } from "@/components/shared/forms/InputField";
import { SelectableChip } from "@/components/shared/forms/SelectableChip";
import { getAvailableFeatures } from "@/constants/form-constants";
import {
  VehicleCategory,
  Documentation,
  VehicleDataBackend,
} from "@/types/types";
import ImageManager from "../ImageManager";
import { FileText, Image, Star, CheckCircle2, Sparkles } from "lucide-react";

// --- Validación ---
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
  handleBlur: (field: string) => void;
  isSubmitting: boolean;
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
    <div className="space-y-8">
      {/* 🎯 Características */}
      {Object.keys(availableFeatures).length > 0 && (
        <section className="animate-fade-in">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-accent/10">
              <CheckCircle2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-foreground">
                Características
              </h3>
              <p className="text-sm text-muted-foreground">
                Selecciona las características de tu vehículo
              </p>
            </div>
          </div>
          
          <Card className="card-premium border-border/50 shadow-soft overflow-hidden">
            <CardContent className="p-0">
              <Accordion type="multiple" className="border-b-0">
                {Object.entries(availableFeatures).map(([categoryName, categoryData], index) => (
                  <AccordionItem 
                    value={categoryName} 
                    key={categoryName} 
                    className="border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                          {categoryData.features.filter(f => formData.features?.includes(f)).length}
                        </span>
                        <h4 className="text-base font-heading font-semibold text-left group-hover:text-accent transition-colors">
                          {categoryName}
                        </h4>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2.5 pt-2 pb-6 px-6 bg-muted/20">
                        {categoryData.features.map((feature) => (
                          <SelectableChip
                            key={feature}
                            label={feature}
                            isSelected={formData.features?.includes(feature) || false}
                            onToggle={() => handleFeatureToggleSafe(feature)}
                            disabled={isSubmitting}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>
      )}

      {/* 📄 Documentación */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-success/10">
            <FileText className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-foreground">
              Documentación
            </h3>
            <p className="text-sm text-muted-foreground">
              Documentos disponibles del vehículo
            </p>
          </div>
        </div>
        
        <Card className="card-premium border-border/50 shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2.5">
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
      </section>

      {/* ✍️ Descripción */}
      <section className="animate-fade-in">
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
            className={`input-premium min-h-[160px] resize-none ${getInputClassName("description")}`}
            placeholder="Describe tu vehículo: estado general, mantenimientos recientes, detalles únicos..."
            rows={6}
            maxLength={2000}
            disabled={isSubmitting}
          />
        </InputField>
      </section>

      {/* 📸 Imágenes */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-primary/10">
            <Image className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-foreground">
              Imágenes del Vehículo
            </h3>
            <p className="text-sm text-muted-foreground">
              {formData.images?.length || 0} de {VALIDATION_CONFIG.images.max} imágenes
            </p>
          </div>
        </div>
        
        <Card className={`card-premium shadow-soft transition-all duration-300 ${
          !imagesValidation.isValid 
            ? "border-destructive/50 bg-destructive/5" 
            : "border-border/50"
        }`}>
          <CardContent className="p-6">
            <ImageManager
              vehicleId={vehicleId}
              images={formData.images || []}
              onImagesChange={handleImagesChange}
            />
            <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="text-accent mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Arrastra las imágenes para reordenarlas. La primera imagen será la portada del vehículo.
              </p>
            </div>
            {!imagesValidation.isValid && (
              <p className="text-sm text-destructive mt-3 font-medium">
                {imagesValidation.error}
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ⭐ Destacar Vehículo */}
      <section className="animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-accent/10">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-foreground">
              Opciones de Publicación
            </h3>
            <p className="text-sm text-muted-foreground">
              Mejora la visibilidad de tu publicación
            </p>
          </div>
        </div>
        
        <Card className="card-premium border-border/50 shadow-soft overflow-hidden">
          <CardContent className="p-0">
            <div className={`flex items-center justify-between p-6 transition-all duration-300 ${
              formData.isFeatured 
                ? "bg-gradient-to-r from-accent/10 to-transparent border-l-4 border-accent" 
                : "hover:bg-muted/30"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  formData.isFeatured 
                    ? "bg-accent text-accent-foreground shadow-lg" 
                    : "bg-muted"
                }`}>
                  <Star className={`w-5 h-5 ${formData.isFeatured ? "fill-current" : ""}`} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-foreground">
                      Destacar Vehículo
                    </span>
                    {formData.isFeatured && (
                      <span className="badge-accent text-xs">
                        Activo
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Aparecerá en la página de inicio y tendrá prioridad en las búsquedas
                  </p>
                </div>
              </div>
              <Switch
                id="isFeatured"
                checked={formData.isFeatured || false}
                onCheckedChange={handleFeaturedChange}
                disabled={isSubmitting}
                className="data-[state=checked]:bg-accent"
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}