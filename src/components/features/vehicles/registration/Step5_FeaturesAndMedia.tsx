// src/components/features/vehicles/registration/Step5_FeaturesAndMedia.tsx
// VERSIÓN CON DISEÑO UNIFICADO

"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  FileText,
  Image as ImageIcon,
  FileBadge,
  AlertCircle,
  Car,
  Shield,
  Users,
  Package,
  Zap,
  Navigation,
  Wrench,
  Truck,
  Star,
  CheckCircle2,
  Eye,
  Info,
} from "lucide-react";
import { getAvailableFeatures } from "@/constants/form-constants";
import { ImageUploader } from "@/components/shared/forms/ImageUploader";
import { SelectableChip } from "@/components/shared/forms/SelectableChip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Documentation, VehicleCategory, VehicleDataBackend } from "@/types/types";
import { InputField } from "@/components/shared/forms/InputField";
import { useFieldValidation } from "@/hooks/useFieldValidation";

// ... (iconMap y getDynamicIcon sin cambios)
const iconMap = {
  Car,
  Shield,
  Users,
  Package,
  Zap,
  Navigation,
  Wrench,
  Truck,
} as const;

const getDynamicIcon = (iconName: keyof typeof iconMap = "Car") => {
  const IconComponent = iconMap[iconName] || iconMap.Car;
  return <IconComponent className="w-4 h-4" />;
};

// ... (interfaces y constantes sin cambios)
interface FormErrors {
  [key: string]: string | undefined;
}

interface StepProps {
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: string | string[]) => void;
  handleSwitchChange: (field: keyof VehicleDataBackend, value: boolean) => void;
  handleFeatureToggle: (feature: string) => void;
  handleDocumentationToggle: (doc: Documentation) => void;
  isDocumentationSelected: (doc: Documentation) => boolean;
  handleImagesChange: (urls: string[]) => void;
}

const DOCUMENTATION_OPTIONS = [
  { label: "Título de Propiedad", value: Documentation.TITLE },
  { label: "Certificado de Origen", value: Documentation.ORIGIN_CERTIFICATE },
  { label: "Revisión de Tránsito (INTT)", value: Documentation.TRANSIT_REVIEW },
  { label: "Placas Bolivarianas", value: Documentation.BOLIVARIAN_PLATES },
];

// Componente principal corregido
const Step5_FeaturesAndMedia: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
  handleSwitchChange,
  handleFeatureToggle,
  handleDocumentationToggle,
  isDocumentationSelected,
  handleImagesChange,
}) => {
  // ========== Clase Mejorada de Inputs ==========
  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground " +
    "placeholder:text-muted-foreground/60 " +
    "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 " +
    "transition-all duration-200 ease-out hover:border-border/80";

  // ========== Hooks de Validación ==========
  const descriptionValidation = useFieldValidation(formData.description, errors.description);
  const featuresValidation = useFieldValidation(formData.features, errors.features);
  const documentationValidation = useFieldValidation(formData.documentation, errors.documentation);
  const imagesValidation = useFieldValidation(formData.images, errors.images);

  // ========== Cálculo de Progreso ==========
  const { progressPercentage, isComplete } = useMemo(() => {
    const fields = [
      (formData.description?.length || 0) > 50,
      (formData.images?.length || 0) > 0,
    ];

    if (formData.category) {
      const categoryFeatures = getAvailableFeatures(formData.category);
      const categoryHasFeatures = Object.keys(categoryFeatures).length > 0;
      if (categoryHasFeatures) {
        fields.push((formData.features?.length || 0) > 0);
      }
    }

    const completedCount = fields.filter(Boolean).length;
    const totalFields = fields.length;
    const progress = totalFields > 0 ? (completedCount / totalFields) * 100 : 0;

    return { progressPercentage: progress, isComplete: progress === 100 };
  }, [
    formData.description,
    formData.images,
    formData.category,
    formData.features,
  ]);

  const availableFeatures = useMemo(() => {
    if (!formData.category) {
      return {};
    }
    return getAvailableFeatures(formData.category);
  }, [formData.category]);

  const hasFeatures = Object.keys(availableFeatures).length > 0;

  if (!formData.category) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-8 rounded-xl border-2 border-dashed border-border bg-card text-center">
          <div className="p-3 rounded-full bg-muted/50 w-fit mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Categoría no seleccionada
          </h3>
          <p className="text-muted-foreground">
            Por favor, regresa al paso 1 y selecciona una categoría para continuar.
          </p>
        </div>
      </div>
    );
  }

  return (
    // ========== ESTRUCTURA PRINCIPAL CONSISTENTE ==========
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
      {/* ========== ENCABEZADO MEJORADO ========== */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10">
            <FileBadge className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
              Características y Multimedia
            </h2>
            <p className="text-base text-muted-foreground mt-0.5">
              Completa los detalles que enamorarán a los compradores
            </p>
          </div>
        </div>

        {/* ========== BARRA DE PROGRESO MEJORADA ========== */}
        <div className="w-full max-w-md mx-auto pt-2">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-sm font-medium text-muted-foreground">Progreso</span>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2.5 bg-muted" />
        </div>
      </div>

      {/* ========== FORMULARIO ========== */}
      <div className="space-y-7">
        {hasFeatures && (
          <FeaturesSection
            category={formData.category}
            availableFeatures={availableFeatures}
            selectedFeatures={formData.features || []}
            onFeatureToggle={handleFeatureToggle}
            error={errors.features}
            validation={featuresValidation}
            inputClass={inputClass}
          />
        )}

        <DocumentationSection
          isDocumentationSelected={isDocumentationSelected}
          onDocumentationToggle={handleDocumentationToggle}
          error={errors.documentation}
          validation={documentationValidation}
          inputClass={inputClass}
        />

        <DescriptionSection
          description={formData.description || ""}
          onDescriptionChange={(value) => handleInputChange("description", value)}
          error={errors.description}
          validation={descriptionValidation}
          inputClass={inputClass}
        />

        <MediaSection
          initialUrls={formData.images || []}
          onUploadChange={handleImagesChange}
          error={errors.images}
          validation={imagesValidation}
          inputClass={inputClass}
        />

        <PublicationOptionsSection
          isFeatured={formData.isFeatured || false}
          onFeaturedToggle={(value) => handleSwitchChange("isFeatured", value)}
        />

        <CategoryTips category={formData.category} />

        {/* ========== RESUMEN DE COMPLETITUD MEJORADO ========== */}
        <div
          className={`p-5 rounded-xl border-2 shadow-sm transition-all duration-300 ${
            isComplete
              ? "border-green-500/40 bg-green-50/50 dark:bg-green-950/20"
              : "border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  isComplete ? "bg-green-500/20" : "bg-amber-500/20"
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div>
                <p className="font-semibold text-foreground text-base">
                  {isComplete
                    ? "¡Información multimedia completa!"
                    : "Faltan algunos campos obligatorios"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isComplete
                    ? "Puedes continuar al siguiente paso"
                    : `${Math.round(progressPercentage)}% completado`}
                </p>
              </div>
            </div>
            <Badge
              variant={isComplete ? "default" : "secondary"}
              className="text-sm font-bold px-3 py-1"
            >
              {Math.round(progressPercentage)}%
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-componentes especializados ---

const FeaturesSection: React.FC<{
  category: VehicleCategory;
  availableFeatures: ReturnType<typeof getAvailableFeatures>;
  selectedFeatures: string[];
  onFeatureToggle: (feature: string) => void;
  error?: string;
  validation: any;
  inputClass: string;
}> = ({ category, availableFeatures, selectedFeatures, onFeatureToggle, error, validation, inputClass }) => {
  const firstCategoryData = Object.values(availableFeatures)[0];

  return (
    <InputField
      label={`Características del ${getCategoryName(category)}`}
      icon={
        firstCategoryData
          ? getDynamicIcon(firstCategoryData.iconName as keyof typeof iconMap)
          : getDynamicIcon("Car")
      }
      tooltip="Selecciona todo lo que aplique. Más detalles generan más interés."
      error={error}
      success={validation.isValid}
    >
      <Card className="shadow-sm border-border">
        <CardContent className="p-0">
          <Accordion type="multiple" defaultValue={Object.keys(availableFeatures)}>
            {Object.entries(availableFeatures).map(
              ([categoryName, categoryData]) => (
                <AccordionItem value={categoryName} key={categoryName} className="border-border">
                  <AccordionTrigger className="px-5 py-4 hover:no-underline">
                    <h4 className="text-md font-semibold flex items-center text-foreground">
                      <span className="mr-2 text-primary">
                        {getDynamicIcon(
                          categoryData.iconName as keyof typeof iconMap
                        )}
                      </span>
                      {categoryName}
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-3 pt-4 pb-5 px-5">
                      {categoryData.features.map((feature) => (
                        <SelectableChip
                          key={feature}
                          label={feature}
                          isSelected={selectedFeatures.includes(feature)}
                          onToggle={() => onFeatureToggle(feature)}
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
    </InputField>
  );
};

const DocumentationSection: React.FC<{
  isDocumentationSelected: (doc: Documentation) => boolean;
  onDocumentationToggle: (doc: Documentation) => void;
  error?: string;
  validation: any;
  inputClass: string;
}> = ({ isDocumentationSelected, onDocumentationToggle, error, validation }) => (
  <InputField
    label="Documentación del Vehículo"
    icon={<FileBadge className="w-4 h-4 text-primary" />}
    tooltip="Tener la documentación en regla es crucial para una venta rápida y segura."
    error={error}
    success={validation.isValid}
  >
    <Card className="shadow-sm border-border">
      <CardContent className="p-5">
        <div className="flex flex-wrap gap-3">
          {DOCUMENTATION_OPTIONS.map(({ label, value }) => (
            <SelectableChip
              key={value}
              label={label}
              isSelected={isDocumentationSelected(value)}
              onToggle={() => onDocumentationToggle(value)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  </InputField>
);

const PublicationOptionsSection: React.FC<{
  isFeatured: boolean;
  onFeaturedToggle: (value: boolean) => void;
}> = ({ isFeatured, onFeaturedToggle }) => (
  <InputField
    label="Opciones de Publicación"
    icon={<Star className="w-4 h-4 text-primary" />}
    tooltip="Destaca tu vehículo para que aparezca en la sección principal y atraiga más miradas."
  >
    <Card className="shadow-sm border-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
          <Label htmlFor="featured-switch" className="flex flex-col space-y-1 cursor-pointer">
            <span className="font-semibold text-foreground">Destacar Vehículo</span>
            <span className="text-sm text-muted-foreground">
              Aparecerá en la página de inicio y tendrá prioridad en las búsquedas.
            </span>
          </Label>
          <Switch
            id="featured-switch"
            checked={isFeatured}
            onCheckedChange={onFeaturedToggle}
          />
        </div>
      </CardContent>
    </Card>
  </InputField>
);

const DescriptionSection: React.FC<{
  description: string;
  onDescriptionChange: (value: string) => void;
  error?: string;
  validation: any;
  inputClass: string;
}> = ({ description, onDescriptionChange, error, validation, inputClass }) => {
  const [localDescription, setLocalDescription] = useState(description);

  useEffect(() => {
    setLocalDescription(description);
  }, [description]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localDescription !== description) {
        onDescriptionChange(localDescription);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localDescription, onDescriptionChange, description]);

  return (
    <InputField
      label="Descripción del Vehículo"
      required
      error={error}
      success={validation.isValid}
      icon={<FileText className="w-4 h-4 text-primary" />}
      tooltip="Sé detallado: menciona mantenimientos, extras, historial, o cualquier detalle único."
      counter={{ current: localDescription.length, max: 2000 }}
      tips={[
        "✅ Describe el estado real, incluyendo detalles positivos y negativos.",
        "🔧 Menciona mantenimientos recientes o piezas nuevas.",
        "⭐ Destaca características únicas que lo diferencien de otros.",
      ]}
    >
      <textarea
        value={localDescription}
        onChange={(e) => setLocalDescription(e.target.value)}
        rows={6}
        className={`${inputClass} ${validation.getBorderClassName()} resize-y`}
        placeholder="Ej: Vehículo en excelentes condiciones, único dueño, cauchos nuevos, servicio de aceite y filtros recién hecho..."
        maxLength={2000}
      />
    </InputField>
  );
};

const MediaSection: React.FC<{
  initialUrls: string[];
  onUploadChange: (urls: string[]) => void;
  error?: string;
  validation: any;
  inputClass: string;
}> = ({ initialUrls, onUploadChange, error, validation }) => (
  <InputField
    label="Fotos del Vehículo"
    required
    icon={<ImageIcon className="w-4 h-4 text-primary" />}
    tooltip="Sube al menos una foto de buena calidad: exterior, interior, motor y detalles."
    error={error}
    success={validation.isValid}
  >
    <ImageUploader
      onUploadChange={onUploadChange}
      initialUrls={initialUrls}
      maxSizeMB={5}
    />
  </InputField>
);

// --- Helpers (sin cambios) ---
const getCategoryName = (category: VehicleCategory | undefined): string => {
  if (!category) return "Vehículo";
  const names: Record<VehicleCategory, string> = {
    [VehicleCategory.CAR]: "Vehículo",
    [VehicleCategory.MOTORCYCLE]: "Motocicleta",
    [VehicleCategory.TRUCK]: "Camión",
    [VehicleCategory.BUS]: "Autobús",
    [VehicleCategory.SUV]: "SUV",
    [VehicleCategory.VAN]: "Van",
  };
  return names[category] || "Vehículo";
};

const categoryTips: Record<VehicleCategory, { photos: string; unique: string }> = {
  [VehicleCategory.CAR]: {
    photos: "Exterior, interior, motor y detalles únicos",
    unique: "Destaca lo que hace especial tu vehículo",
  },
  [VehicleCategory.SUV]: {
    photos: "Exterior, interior, maletero y tracción",
    unique: "Menciona su versatilidad y capacidad",
  },
  [VehicleCategory.VAN]: {
    photos: "Exterior, espacio de carga/pasajeros y cabina",
    unique: "Ideal para trabajo o familia numerosa",
  },
  [VehicleCategory.MOTORCYCLE]: {
    photos: "Lateral, motor, odómetro y detalles",
    unique: "Destaca modificaciones o accesorios",
  },
  [VehicleCategory.TRUCK]: {
    photos: "Exterior, cabina, carrocería y motor",
    unique: "Menciona capacidad y tipo de uso",
  },
  [VehicleCategory.BUS]: {
    photos: "Exterior, interior de pasajeros y cabina",
    unique: "Menciona capacidad de pasajeros y comodidades",
  },
};

const getCategoryTips = (category: VehicleCategory | undefined) => {
  if (!category) return categoryTips[VehicleCategory.CAR];
  return categoryTips[category] || categoryTips[VehicleCategory.CAR];
};

const CategoryTips: React.FC<{ category: VehicleCategory | undefined }> = ({
  category,
}) => {
  const categoryName = getCategoryName(category);
  const tips = getCategoryTips(category);

  const TipItem: React.FC<{ icon: string; title: string; content: string }> = ({
    icon,
    title,
    content,
  }) => (
    <div className="p-3 rounded-lg bg-muted/50">
      <p className="text-sm text-muted-foreground">
        {icon} <strong>{title}:</strong> {content}
      </p>
    </div>
  );

  if (!category) return null;

  return (
    <div className="p-5 rounded-xl border-2 border-primary/20 bg-primary/5">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
          <Info className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-base text-foreground mb-3">
            💡 Tips para Destacar tu {categoryName}
          </h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 font-bold">•</span>
              <span>
                <strong>Fotos variadas:</strong> {tips.photos}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 font-bold">•</span>
              <span>
                <strong>Descripción honesta:</strong> Menciona tanto lo bueno como lo que necesita atención.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 font-bold">•</span>
              <span>
                <strong>Características únicas:</strong> {tips.unique}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5 font-bold">•</span>
              <span>
                <strong>Documentos listos:</strong> Tener los papeles en orden acelera la venta.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Step5_FeaturesAndMedia;