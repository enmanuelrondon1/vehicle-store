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
  Star, // ✅ Añadido: Ícono para destacar
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
import { Switch } from "@/components/ui/switch"; // ✅ Añadido: Importar Switch
import { Label } from "@/components/ui/label"; // ✅ Añadido: Importar Label

// Importaciones corregidas - usar re-exportaciones de types.ts
import { Documentation, VehicleCategory, VehicleDataBackend } from "@/types/types";

// Función para obtener el ícono - versión mejorada y segura
import { InputField } from "@/components/shared/forms/InputField";
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


// Tipos
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

// Opciones de documentación - usar valores del enum
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
  // --- CÁLCULO DE PROGRESO ---
  const progress = useMemo(() => {
    const fields = [
      // La descripción es válida si tiene más de 50 caracteres
      (formData.description?.length || 0) > 50,
      // Las imágenes son válidas si hay al menos una
      (formData.images?.length || 0) > 0,
    ];

    // Las características solo cuentan si la categoría las tiene
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

  // Obtener características dinámicamente según la categoría
  const availableFeatures = useMemo(() => {
    if (!formData.category) {
      return {};
    }
    return getAvailableFeatures(formData.category);
  }, [formData.category]);

  // Verificar si tenemos características disponibles
  const hasFeatures = Object.keys(availableFeatures).length > 0;

  // Si no hay categoría, mostrar mensaje de error
  if (!formData.category) {
    return (
      <div className="p-6 rounded-xl border-2 border-dashed border-border text-muted-foreground">
        <AlertCircle className="w-6 h-6 mx-auto mb-2" />
        <p className="text-center">
          Por favor, regresa al paso 1 y selecciona una categoría para
          continuar.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* --- SECCIÓN DE TÍTULO CENTRADA --- */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-xl shadow-lg mb-3 bg-primary/10">
          <FileBadge className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
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
          {/* ✅ Nuevo: Sección de Opciones de Publicación */}
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
}> = ({
  category,
  availableFeatures,
  selectedFeatures,
  onFeatureToggle,
  error,
}) => {
  const firstCategoryData = Object.values(availableFeatures)[0];

  return (
    <Card>
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
                    <span className={`mr-2 ${categoryData.color}`}>
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
  <Card>
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

{/* ✅ Nuevo: Sub-componente para Opciones de Publicación */}
const PublicationOptionsSection: React.FC<{
  isFeatured: boolean;
  onFeaturedToggle: (value: boolean) => void;
}> = ({ isFeatured, onFeaturedToggle }) => (
  <Card>
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
      <div className="flex items-center justify-between rounded-lg border p-4">
        <Label htmlFor="featured-switch" className="flex flex-col space-y-1">
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

  // Sincroniza el estado local si la prop externa cambia
  useEffect(() => {
    setLocalDescription(description);
  }, [description]);

  // Debounce para actualizar el estado global
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localDescription !== description) {
        onDescriptionChange(localDescription);
      }
    }, 500); // 500ms de retraso

    return () => {
      clearTimeout(handler);
    };
  }, [localDescription, onDescriptionChange, description]);

  return (
    <Card>
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
          <textarea
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            rows={6}
            className="input-class w-full resize-y"
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
  <Card>
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

// --- Helpers ---

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

  if (!category) return null; // No renderizar nada si no hay categoría

  return (
    <Card>
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