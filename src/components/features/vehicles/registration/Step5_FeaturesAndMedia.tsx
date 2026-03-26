// src/components/features/vehicles/registration/Step5_FeaturesAndMedia.tsx
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
  Sparkles,
} from "lucide-react";
import { getAvailableFeatures } from "@/constants/form-constants";
import { ImageUploader } from "@/components/shared/forms/ImageUploader";
import { SelectableChip } from "@/components/shared/forms/SelectableChip";
import CompletionSummary from "@/components/shared/forms/CompletionSummary";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ===========================================
// TIPOS
// ===========================================
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

// ===========================================
// CONSTANTES
// ✅ getCategoryName definida UNA sola vez (antes estaba duplicada en FeaturesSection y CategoryTips)
// ✅ ICON_MAP fuera del componente — no se recrea en cada render
// ===========================================
const CATEGORY_NAMES: Record<VehicleCategory, string> = {
  [VehicleCategory.CAR]:        "Vehículo",
  [VehicleCategory.MOTORCYCLE]: "Motocicleta",
  [VehicleCategory.TRUCK]:      "Camión",
  [VehicleCategory.BUS]:        "Autobús",
  [VehicleCategory.SUV]:        "SUV",
  [VehicleCategory.VAN]:        "Van",
};

const ICON_MAP = { Car, Shield, Users, Package, Zap, Navigation, Wrench, Truck } as const;

const DOCUMENTATION_OPTIONS = [
  { label: "Título de Propiedad",          value: Documentation.TITLE },
  { label: "Certificado de Origen",        value: Documentation.ORIGIN_CERTIFICATE },
  { label: "Revisión de Tránsito (INTT)",  value: Documentation.TRANSIT_REVIEW },
  { label: "Placas Bolivarianas",          value: Documentation.BOLIVARIAN_PLATES },
];

// ✅ CategoryTips: 4 <li> con estructura idéntica → array + loop
const CATEGORY_TIPS_DATA: Record<VehicleCategory, { photos: string; unique: string }> = {
  [VehicleCategory.CAR]:        { photos: "Exterior, interior, motor y detalles únicos",       unique: "Destaca lo que hace especial tu vehículo" },
  [VehicleCategory.SUV]:        { photos: "Exterior, interior, maletero y tracción",            unique: "Menciona su versatilidad y capacidad" },
  [VehicleCategory.VAN]:        { photos: "Exterior, espacio de carga/pasajeros y cabina",      unique: "Ideal para trabajo o familia numerosa" },
  [VehicleCategory.MOTORCYCLE]: { photos: "Lateral, motor, odómetro y detalles",               unique: "Destaca modificaciones o accesorios" },
  [VehicleCategory.TRUCK]:      { photos: "Exterior, cabina, carrocería y motor",               unique: "Menciona capacidad y tipo de uso" },
  [VehicleCategory.BUS]:        { photos: "Exterior, interior de pasajeros y cabina",           unique: "Menciona capacidad de pasajeros y comodidades" },
};

const getDynamicIcon = (iconName?: string) => {
  const IconComponent = (iconName && ICON_MAP[iconName as keyof typeof ICON_MAP]) || Car;
  return <IconComponent className="w-4 h-4" />;
};

// ===========================================
// SUB-COMPONENTE: Sección de Características
// ===========================================
const FeaturesSection: React.FC<{
  category: VehicleCategory;
  availableFeatures: ReturnType<typeof getAvailableFeatures>;
  selectedFeatures: string[];
  onFeatureToggle: (feature: string) => void;
  error?: string;
  validation: { isValid: boolean };
}> = ({ category, availableFeatures, selectedFeatures, onFeatureToggle, error, validation }) => (
  <InputField
    label={`Características del ${CATEGORY_NAMES[category] ?? "Vehículo"}`}
    icon={getDynamicIcon(Object.values(availableFeatures)[0]?.iconName)}
    tooltip="Selecciona todo lo que aplique. Más detalles generan más interés."
    error={error}
    success={validation.isValid}
  >
    <Card className="card-glass border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <Accordion type="multiple" defaultValue={Object.keys(availableFeatures)}>
          {Object.entries(availableFeatures).map(([categoryName, categoryData]) => (
            <AccordionItem value={categoryName} key={categoryName} className="border-border">
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <h4 className="text-md font-semibold flex items-center text-foreground">
                  <span className="mr-2 text-primary">{getDynamicIcon(categoryData.iconName)}</span>
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
          ))}
        </Accordion>
      </CardContent>
    </Card>
  </InputField>
);

// ===========================================
// SUB-COMPONENTE: Sección de Documentación
// ===========================================
const DocumentationSection: React.FC<{
  isDocumentationSelected: (doc: Documentation) => boolean;
  onDocumentationToggle: (doc: Documentation) => void;
  error?: string;
  validation: { isValid: boolean };
}> = ({ isDocumentationSelected, onDocumentationToggle, error, validation }) => (
  <InputField
    label="Documentación del Vehículo"
    icon={<FileBadge className="w-4 h-4 text-primary" />}
    tooltip="Tener la documentación en regla es crucial para una venta rápida y segura."
    error={error}
    success={validation.isValid}
  >
    <Card className="card-glass border-border/50 overflow-hidden">
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

// ===========================================
// SUB-COMPONENTE: Sección de Descripción
// ===========================================
const INPUT_CLASS =
  "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground " +
  "placeholder:text-muted-foreground/60 " +
  "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 " +
  "transition-all duration-200 ease-out hover:border-border/80";

const DescriptionSection: React.FC<{
  description: string;
  onDescriptionChange: (value: string) => void;
  error?: string;
  validation: { isValid: boolean; getBorderClassName: () => string };
}> = ({ description, onDescriptionChange, error, validation }) => {
  const [localDescription, setLocalDescription] = useState(description);

  useEffect(() => { setLocalDescription(description); }, [description]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localDescription !== description) onDescriptionChange(localDescription);
    }, 500);
    return () => clearTimeout(handler);
  }, [localDescription, onDescriptionChange, description]);

  return (
    <InputField
      label="Descripción del Vehículo" required
      error={error} success={validation.isValid}
      icon={<FileText className="w-4 h-4 text-primary" />}
      tooltip="Sé detallado: menciona mantenimientos, extras, historial, o cualquier detalle único."
      counter={{ current: localDescription.length, max: 2000 }}
      tips={[
        "✅ Describe el estado real, incluyendo detalles positivos y negativos.",
        "🔧 Menciona mantenimientos recientes o piezas nuevas.",
        "⭐ Destaca características únicas que lo diferencian de otros.",
      ]}
    >
      <textarea
        value={localDescription}
        onChange={(e) => setLocalDescription(e.target.value)}
        rows={6}
        className={`${INPUT_CLASS} ${validation.getBorderClassName()} resize-y`}
        placeholder="Ej: Vehículo en excelentes condiciones, único dueño, cauchos nuevos, servicio de aceite y filtros recién hecho..."
        maxLength={2000}
      />
    </InputField>
  );
};

// ===========================================
// SUB-COMPONENTE: Sección de Multimedia
// ===========================================
const MediaSection: React.FC<{
  initialUrls: string[];
  onUploadChange: (urls: string[]) => void;
  error?: string;
  validation: { isValid: boolean };
}> = ({ initialUrls, onUploadChange, error, validation }) => (
  <InputField
    label="Fotos del Vehículo" required
    icon={<ImageIcon className="w-4 h-4 text-primary" />}
    tooltip="Sube al menos una foto de buena calidad: exterior, interior, motor y detalles."
    error={error} success={validation.isValid}
  >
    <ImageUploader onUploadChange={onUploadChange} initialUrls={initialUrls} maxSizeMB={5} />
  </InputField>
);

// ===========================================
// SUB-COMPONENTE: Opciones de Publicación
// ===========================================
const PublicationOptionsSection: React.FC<{
  isFeatured: boolean;
  onFeaturedToggle: (value: boolean) => void;
}> = ({ isFeatured, onFeaturedToggle }) => (
  <InputField
    label="Opciones de Publicación"
    icon={<Star className="w-4 h-4 text-primary" />}
    tooltip="Opciones para mejorar la visibilidad de tu anuncio."
  >
    <Card className={`card-glass border-border/50 overflow-hidden transition-all duration-300 ${isFeatured ? "border-primary/50" : ""}`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between rounded-lg border border-transparent p-4 transition-colors hover:bg-muted/50">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={`p-2 rounded-full ${isFeatured ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <Star className="h-5 w-5" />
              </div>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="featured-switch" className="font-semibold text-foreground cursor-pointer">
                Destacar Vehículo
              </Label>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Tu anuncio aparecerá en la página principal y en los primeros resultados de búsqueda.</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Al destacar tu vehículo, aumentas su visibilidad significativamente.
                        Aparecerá en la sección "Destacados" de la página de inicio y
                        tendrá una posición prioritaria en los resultados de búsqueda,
                        llegando a más compradores potenciales.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Switch id="featured-switch" checked={isFeatured} onCheckedChange={onFeaturedToggle} />
            <span className="text-sm font-medium text-primary">$5.00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </InputField>
);

// ===========================================
// SUB-COMPONENTE: Consejos por Categoría
// ✅ 4 <li> hardcodeados → array + loop
// ===========================================
const CategoryTips: React.FC<{ category: VehicleCategory | undefined }> = ({ category }) => {
  if (!category) return null;
  const tips = CATEGORY_TIPS_DATA[category];
  const categoryName = CATEGORY_NAMES[category] ?? "Vehículo";

  const tipItems = [
    { title: "Fotos variadas",       desc: tips.photos },
    { title: "Descripción honesta",  desc: "Menciona tanto lo bueno como lo que necesita atención." },
    { title: "Características únicas", desc: tips.unique },
    { title: "Documentos listos",    desc: "Tener los papeles en orden acelera la venta." },
  ];

  return (
    <Card className="card-glass border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border/30">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Tips para Destacar tu {categoryName}
          </h4>
        </div>
        <div className="p-5">
          <ul className="space-y-3">
            {tipItems.map(({ title, desc }, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-primary font-bold text-xs">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// ===========================================
// COMPONENTE PRINCIPAL
// ✅ FormHeader eliminado (ya existe en VehicleRegistrationForm)
// ✅ CompletionSummary local → componente compartido
// ✅ Progress eliminado de imports
// ✅ getCategoryName duplicado → CATEGORY_NAMES constante única
// ✅ iconMap dentro de FeaturesSection → ICON_MAP constante fuera
// ✅ CategoryTips 4 <li> hardcodeados → array + loop
// ===========================================
const Step5_FeaturesAndMedia: React.FC<StepProps> = ({
  formData, errors, handleInputChange, handleSwitchChange,
  handleFeatureToggle, handleDocumentationToggle,
  isDocumentationSelected, handleImagesChange,
}) => {
  const descriptionValidation  = useFieldValidation(formData.description,   errors.description);
  const featuresValidation      = useFieldValidation(formData.features,      errors.features);
  const documentationValidation = useFieldValidation(formData.documentation, errors.documentation);
  const imagesValidation        = useFieldValidation(formData.images,        errors.images);

  const availableFeatures = useMemo(
    () => formData.category ? getAvailableFeatures(formData.category) : {},
    [formData.category]
  );

  const hasFeatures = Object.keys(availableFeatures).length > 0;

  const { progressPercentage } = useMemo(() => {
    const fields = [
      (formData.description?.length || 0) > 50,
      (formData.images?.length || 0) > 0,
      ...(hasFeatures ? [(formData.features?.length || 0) > 0] : []),
    ];
    const completed = fields.filter(Boolean).length;
    return { progressPercentage: fields.length > 0 ? (completed / fields.length) * 100 : 0 };
  }, [formData.description, formData.images, formData.features, hasFeatures]);

  if (!formData.category) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="card-glass border-border/50">
          <CardContent className="p-8 text-center">
            <div className="p-3 rounded-full bg-muted/50 w-fit mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Categoría no seleccionada</h3>
            <p className="text-muted-foreground">
              Por favor, regresa al paso 1 y selecciona una categoría para continuar.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-7">
        {hasFeatures && (
          <FeaturesSection
            category={formData.category}
            availableFeatures={availableFeatures}
            selectedFeatures={formData.features || []}
            onFeatureToggle={handleFeatureToggle}
            error={errors.features}
            validation={featuresValidation}
          />
        )}

        <DocumentationSection
          isDocumentationSelected={isDocumentationSelected}
          onDocumentationToggle={handleDocumentationToggle}
          error={errors.documentation}
          validation={documentationValidation}
        />

        <DescriptionSection
          description={formData.description || ""}
          onDescriptionChange={(value) => handleInputChange("description", value)}
          error={errors.description}
          validation={descriptionValidation}
        />

        <MediaSection
          initialUrls={formData.images || []}
          onUploadChange={handleImagesChange}
          error={errors.images}
          validation={imagesValidation}
        />

        <PublicationOptionsSection
          isFeatured={formData.isFeatured || false}
          onFeaturedToggle={(value) => handleSwitchChange("isFeatured", value)}
        />

        <CategoryTips category={formData.category} />

        <CompletionSummary
          progress={progressPercentage}
          completeLabel="¡Información multimedia completa!"
        />
      </div>
    </div>
  );
};

export default Step5_FeaturesAndMedia;