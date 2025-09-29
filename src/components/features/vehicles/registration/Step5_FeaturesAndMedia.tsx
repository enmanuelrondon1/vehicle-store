// src/componentes/features/vehicles/registration/Step5_FeaturesAndMedia
"use client";
import React, { useState, useMemo,  } from "react";
import { useDarkMode } from "@/context/DarkModeContext";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getAvailableFeatures } from "@/constants/form-constants";
import { ImageUploader } from "@/components/shared/forms/ImageUploader";
import { SelectableChip } from "@/components/shared/forms/SelectableChip";

// Importaciones corregidas - usar re-exportaciones de types.ts
import { Documentation, VehicleCategory } from "@/types/types";

// Función para obtener el ícono - versión mejorada y segura
import { InputField } from "@/components/shared/forms/InputField";
const iconMap = {
  Car, Shield, Users, Package, Zap, Navigation, Wrench, Truck
} as const;

const getDynamicIcon = (iconName: keyof typeof iconMap = 'Car') => {
  const IconComponent = iconMap[iconName] || iconMap.Car;
  return <IconComponent className="w-4 h-4" />;
};

// Tipos
interface VehicleDataBackend {
  category?: VehicleCategory;
  features?: string[];
  documentation?: string[];
  description?: string;
  images?: string[];
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface StepProps {
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: string | string[]) => void;
  handleFeatureToggle: (feature: string) => void;
  handleDocumentationToggle: (doc: Documentation) => void;
  isDocumentationSelected: (doc: Documentation) => boolean;
  handleImagesChange: (urls: string[]) => void;
}

// --- Sub-componente para la Barra de Progreso ---
const ProgressBar: React.FC<{ progress: number; isDarkMode: boolean }> = ({ progress, isDarkMode }) => (
  <div className="mt-6">
    <div className="flex justify-between items-center mb-1">
      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Progreso de la sección
      </span>
      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {Math.round(progress)}%
      </span>
    </div>
    <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
      <div
        className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);


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
  handleFeatureToggle,
  handleDocumentationToggle,
  isDocumentationSelected,
  handleImagesChange,
}) => {
  const { isDarkMode } = useDarkMode();

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
  }, [formData.description, formData.images, formData.category, formData.features]);

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
      <div className={`p-6 rounded-xl border-2 border-dashed ${isDarkMode ? "border-gray-700 text-gray-500" : "border-gray-300 text-gray-500"}`}>
        <AlertCircle className="w-6 h-6 mx-auto mb-2" />
        <p className="text-center">
          Por favor, regresa al paso 1 y selecciona una categoría para continuar.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* --- SECCIÓN DE TÍTULO CENTRADA --- */}
      <div className="mb-8 text-center">
        <div className={`inline-flex items-center justify-center p-3 rounded-xl shadow-lg mb-3 ${isDarkMode ? "bg-gray-700" : "bg-gradient-to-br from-teal-500 to-teal-600"}`}>
          <FileBadge className="w-6 h-6 text-white" />
        </div>
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
          Características y Multimedia
        </h2>
        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
          Completa los detalles que enamorarán a los compradores.
        </p>

        {/* --- BARRA DE PROGRESO --- */}
        <ProgressBar progress={progress} isDarkMode={isDarkMode} />
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
            onDescriptionChange={(value) => handleInputChange("description", value)}
            error={errors.description}
          />

          <MediaSection
            initialUrls={formData.images || []}
            onUploadChange={handleImagesChange}
            error={errors.images}
          />
        </div>

        <div className="space-y-6">
          <CategoryTips category={formData.category} />
        </div>
      </div>
    </div>
  );
};

// --- Sub-componentes especializados ---

const SectionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
      {children}
    </div>
  );
};

const CollapsibleSection: React.FC<{
  title: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const { isDarkMode } = useDarkMode();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        {title}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`lg:hidden p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-screen mt-3' : 'max-h-0 lg:max-h-screen lg:mt-3'}`}>
        {children}
      </div>
    </>
  );
};

const FeaturesSection: React.FC<{
  category: VehicleCategory;
  availableFeatures: ReturnType<typeof getAvailableFeatures>;
  selectedFeatures: string[];
  onFeatureToggle: (feature: string) => void;
  error?: string;
}> = ({ category, availableFeatures, selectedFeatures, onFeatureToggle, error }) => {
  const { isDarkMode } = useDarkMode();
  const firstCategoryData = Object.values(availableFeatures)[0];

  return (
    <SectionWrapper>
      <CollapsibleSection
        title={
          <InputField
            label={`Características del ${getCategoryName(category)}`}
            icon={firstCategoryData ? getDynamicIcon(firstCategoryData.iconName as keyof typeof iconMap) : getDynamicIcon('Car')}
            tooltip="Selecciona todo lo que aplique. Más detalles generan más interés."
            error={error}
          ><></></InputField>
        }
      >
        <div className="space-y-6">
          {Object.entries(availableFeatures).map(([categoryName, categoryData]) => (
            <div key={categoryName}>
              <h4 className={`text-md font-semibold mb-3 flex items-center ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                <span className={`mr-2 ${categoryData.color}`}>
                  {getDynamicIcon(categoryData.iconName as keyof typeof iconMap)}
                </span>
                {categoryName}
              </h4>
              <div className="flex flex-wrap gap-3">
                {categoryData.features.map((feature) => (
                  <SelectableChip
                    key={feature}
                    label={feature}
                    isSelected={selectedFeatures.includes(feature)}
                    onToggle={() => onFeatureToggle(feature)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </SectionWrapper>
  );
};

const DocumentationSection: React.FC<{
  isDocumentationSelected: (doc: Documentation) => boolean;
  onDocumentationToggle: (doc: Documentation) => void;
  error?: string;
}> = ({ isDocumentationSelected, onDocumentationToggle, error }) => (
  <SectionWrapper>
    <CollapsibleSection
      title={
        <InputField
          label="Documentación del Vehículo"
          icon={<FileBadge className="w-4 h-4 text-indigo-600" />}
          tooltip="Tener la documentación en regla es crucial para una venta rápida y segura."
          error={error}
        ><></></InputField>
      }
    >
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
    </CollapsibleSection>
  </SectionWrapper>
);

const DescriptionSection: React.FC<{
  description: string;
  onDescriptionChange: (value: string) => void;
  error?: string;
}> = ({ description, onDescriptionChange, error }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <SectionWrapper>
      <InputField
        label="Descripción del Vehículo"
        required
        error={error}
        icon={<FileText className="w-4 h-4 text-teal-600" />}
        tooltip="Sé detallado: menciona mantenimientos, extras, historial, o cualquier detalle único."
        counter={{ current: description.length, max: 2000 }}
        tips={[
          "✅ Describe el estado real, incluyendo detalles positivos y negativos.",
          "🔧 Menciona mantenimientos recientes o piezas nuevas.",
          "⭐ Destaca características únicas que lo diferencien de otros."
        ]}
      >
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={6}
          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 resize-y ${isDarkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-200"}`}
          placeholder="Ej: Vehículo en excelentes condiciones, único dueño, cauchos nuevos, servicio de aceite y filtros recién hecho..."
          maxLength={2000}
        />
      </InputField>
    </SectionWrapper>
  );
};

const MediaSection: React.FC<{
  initialUrls: string[];
  onUploadChange: (urls: string[]) => void;
  error?: string;
}> = ({ initialUrls, onUploadChange, error }) => (
  <SectionWrapper>
    <InputField
      label="Fotos del Vehículo"
      required
      icon={<ImageIcon className="w-4 h-4 text-teal-600" />}
      tooltip="Sube al menos una foto de buena calidad: exterior, interior, motor y detalles."
      error={error}
    >
      <ImageUploader
        onUploadChange={onUploadChange}
        initialUrls={initialUrls}
        maxSizeMB={5}
      />
    </InputField>
  </SectionWrapper>
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
  [VehicleCategory.CAR]: { photos: "Exterior, interior, motor y detalles únicos", unique: "Destaca lo que hace especial tu vehículo" },
  [VehicleCategory.SUV]: { photos: "Exterior, interior, maletero y tracción", unique: "Menciona su versatilidad y capacidad" },
  [VehicleCategory.VAN]: { photos: "Exterior, espacio de carga/pasajeros y cabina", unique: "Ideal para trabajo o familia numerosa" },
  [VehicleCategory.MOTORCYCLE]: { photos: "Lateral, motor, odómetro y detalles", unique: "Destaca modificaciones o accesorios" },
  [VehicleCategory.TRUCK]: { photos: "Exterior, cabina, carrocería y motor", unique: "Menciona capacidad y tipo de uso" },
  [VehicleCategory.BUS]: { photos: "Exterior, interior de pasajeros y cabina", unique: "Menciona capacidad de pasajeros y comodidades" },
};

const getCategoryTips = (category: VehicleCategory | undefined) => {
  if (!category) return categoryTips[VehicleCategory.CAR];
  return categoryTips[category] || categoryTips[VehicleCategory.CAR];
};

const CategoryTips: React.FC<{ category: VehicleCategory | undefined }> = ({
  category,
}) => {
  const { isDarkMode } = useDarkMode();
  const categoryName = getCategoryName(category);
  const tips = getCategoryTips(category);

  const TipItem: React.FC<{ icon: string; title: string; content: string }> = ({ icon, title, content }) => (
    <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
        {icon} <strong>{title}:</strong> {content}
      </p>
    </div>
  );
  
  if (!category) return null; // No renderizar nada si no hay categoría

  return (
    <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
      <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
        💡 Tips para Destacar tu {categoryName}
      </h3>
      <div className="space-y-3">
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
      </div>
    </div>
  );
};

export default Step5_FeaturesAndMedia;