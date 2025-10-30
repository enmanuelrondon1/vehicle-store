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
} from "lucide-react";
import { getAvailableFeatures } from "@/constants/form-constants";
import { ImageUploader } from "@/components/shared/forms/ImageUploader";
import { SelectableChip } from "@/components/shared/forms/SelectableChip";
import { Progress } from "@/components/ui/progress";
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

const inputClass = "w-full rounded-xl border-2 border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 pl-4 pr-10 py-4 text-base";

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
  // ESTILO ACTUALIZADO: Clase base para inputs, consistente con los pasos anteriores.
  const inputClass = "w-full rounded-xl border-2 border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 pl-4 pr-10 py-4 text-base";

  // ... (lógica de progreso y useMemo sin cambios)
  const progress = useMemo(() => {
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

    return totalFields > 0 ? (completedCount / totalFields) * 100 : 0;
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
      <div className="p-6 rounded-xl border-2 border-dashed border-border bg-card text-center">
        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-center text-muted-foreground">
          Por favor, regresa al paso 1 y selecciona una categoría para
          continuar.
        </p>
      </div>
    );
  }

  return (
    // ESTILO ACTUALIZADO: Añadida animación de entrada y espaciado consistente.
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
      {/* --- SECCIÓN DE TÍTULO CENTRADA --- */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-xl shadow-lg mb-3 bg-gradient-to-br from-primary to-accent">
          <FileBadge className="w-6 h-6 text-primary-foreground" />
        </div>
        {/* ESTILO ACTUALIZADO: Título con fuente de encabezado. */}
        <h2 className="text-2xl font-heading font-bold text-foreground">
          Características y Multimedia
        </h2>
        <p className="text-muted-foreground text-sm">
          Completa los detalles que enamorarán a los compradores.
        </p>

        {/* --- BARRA DE PROGRESO --- */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-foreground">
              Progreso de la sección
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {hasFeatures && (
            <FeaturesSection
              category={formData.category}
              availableFeatures={availableFeatures}
              selectedFeatures={formData.features || []}
              onFeatureToggle={handleFeatureToggle}
              error={errors.features}
            />
          )}

          <DocumentationSection
            isDocumentationSelected={isDocumentationSelected}
            onDocumentationToggle={handleDocumentationToggle}
            error={errors.documentation}
          />

          <DescriptionSection
            description={formData.description || ""}
            onDescriptionChange={(value) =>
              handleInputChange("description", value)
            }
            error={errors.description}
          />

          <MediaSection
            initialUrls={formData.images || []}
            onUploadChange={handleImagesChange}
            error={errors.images}
          />
        </div>

        <div className="space-y-6">
          <PublicationOptionsSection
            isFeatured={formData.isFeatured || false}
            onFeaturedToggle={(value) => handleSwitchChange("isFeatured", value)}
          />
          <CategoryTips category={formData.category} />
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
}> = ({ category, availableFeatures, selectedFeatures, onFeatureToggle, error }) => {
  const firstCategoryData = Object.values(availableFeatures)[0];

  return (
    // ESTILO ACTUALIZADO: Tarjeta con sombra sutil.
    <Card className="shadow-sm">
      <CardHeader>
        <InputField
          label={`Características del ${getCategoryName(category)}`}
          icon={
            firstCategoryData
              ? getDynamicIcon(firstCategoryData.iconName as keyof typeof iconMap)
              : getDynamicIcon("Car")
          }
          tooltip="Selecciona todo lo que aplique. Más detalles generan más interés."
          error={error}
        >
          <></>
        </InputField>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={Object.keys(availableFeatures)}>
          {Object.entries(availableFeatures).map(
            ([categoryName, categoryData]) => (
              <AccordionItem value={categoryName} key={categoryName}>
                <AccordionTrigger>
                  <h4 className="text-md font-semibold flex items-center text-foreground">
                    {/* ESTILO ACTUALIZADO: Icono con color primario para consistencia. */}
                    <span className="mr-2 text-primary">
                      {getDynamicIcon(
                        categoryData.iconName as keyof typeof iconMap
                      )}
                    </span>
                    {categoryName}
                  </h4>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-3 pt-4">
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
  );
};

const DocumentationSection: React.FC<{
  isDocumentationSelected: (doc: Documentation) => boolean;
  onDocumentationToggle: (doc: Documentation) => void;
  error?: string;
}> = ({ isDocumentationSelected, onDocumentationToggle, error }) => (
  // ESTILO ACTUALIZADO: Tarjeta con sombra sutil.
  <Card className="shadow-sm">
    <CardHeader>
      <InputField
        label="Documentación del Vehículo"
        icon={<FileBadge className="w-4 h-4 text-primary" />}
        tooltip="Tener la documentación en regla es crucial para una venta rápida y segura."
        error={error}
      >
        <></>
      </InputField>
    </CardHeader>
    <CardContent>
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
);

const PublicationOptionsSection: React.FC<{
  isFeatured: boolean;
  onFeaturedToggle: (value: boolean) => void;
}> = ({ isFeatured, onFeaturedToggle }) => (
  // ESTILO ACTUALIZADO: Tarjeta con sombra sutil.
  <Card className="shadow-sm">
    <CardHeader>
      <InputField
        label="Opciones de Publicación"
        icon={<Star className="w-4 h-4 text-primary" />}
        tooltip="Destaca tu vehículo para que aparezca en la sección principal y atraiga más miradas."
      >
        <></>
      </InputField>
    </CardHeader>
    <CardContent>
      {/* ESTILO ACTUALIZADO: Contenedor interactivo con colores de tema. */}
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
);

const DescriptionSection: React.FC<{
  description: string;
  onDescriptionChange: (value: string) => void;
  error?: string;
}> = ({ description, onDescriptionChange, error }) => {
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
    // ESTILO ACTUALIZADO: Tarjeta con sombra sutil.
    <Card className="shadow-sm">
      <CardHeader>
        <InputField
          label="Descripción del Vehículo"
          required
          error={error}
          icon={<FileText className="w-4 h-4 text-primary" />}
          tooltip="Sé detallado: menciona mantenimientos, extras, historial, o cualquier detalle único."
          counter={{ current: localDescription.length, max: 2000 }}
          tips={[
            "✅ Describe el estado real, incluyendo detalles positivos y negativos.",
            "🔧 Menciona mantenimientos recientes o piezas nuevas.",
            "⭐ Destaca características únicas que lo diferencien de otros.",
          ]}
        >
          {/* ESTILO ACTUALIZADO: Textarea usando la clase base para inputs. */}
          <textarea
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            rows={6}
            className={`${inputClass} resize-y`}
            placeholder="Ej: Vehículo en excelentes condiciones, único dueño, cauchos nuevos, servicio de aceite y filtros recién hecho..."
            maxLength={2000}
          />
        </InputField>
      </CardHeader>
    </Card>
  );
};

const MediaSection: React.FC<{
  initialUrls: string[];
  onUploadChange: (urls: string[]) => void;
  error?: string;
}> = ({ initialUrls, onUploadChange, error }) => (
  // ESTILO ACTUALIZADO: Tarjeta con sombra sutil.
  <Card className="shadow-sm">
    <CardHeader>
      <InputField
        label="Fotos del Vehículo"
        required
        icon={<ImageIcon className="w-4 h-4 text-primary" />}
        tooltip="Sube al menos una foto de buena calidad: exterior, interior, motor y detalles."
        error={error}
      >
        <ImageUploader
          onUploadChange={onUploadChange}
          initialUrls={initialUrls}
          maxSizeMB={5}
        />
      </InputField>
    </CardHeader>
  </Card>
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
    // ESTILO ACTUALIZADO: Tarjeta con sombra sutil.
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">
          💡 Tips para Destacar tu {categoryName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <TipItem icon="📸" title="Fotos variadas" content={tips.photos} />
        <TipItem
          icon="📝"
          title="Descripción honesta"
          content="Menciona tanto lo bueno como lo que necesita atención."
        />
        <TipItem icon="⭐" title="Características únicas" content={tips.unique} />
        <TipItem
          icon="📋"
          title="Documentos listos"
          content="Tener los papeles en orden acelera la venta."
        />
      </CardContent>
    </Card>
  );
};

export default Step5_FeaturesAndMedia;