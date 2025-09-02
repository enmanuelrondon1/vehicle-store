"use client";
import React, { useState, useMemo } from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import {
  FileText,
  Image as ImageIcon,
  FileBadge,
  Check,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Car,
  Shield,
  Users,
  Package,
  Zap,
  Navigation,
  Wrench,
  Truck
} from "lucide-react";
import { ImageUploader } from "@/components/shared/forms/ImageUploader";

// Importaciones corregidas - usar re-exportaciones de types.ts
import { Documentation, VehicleCategory } from "@/types/types";

// Función para obtener el ícono - versión mejorada y segura
const iconMap = {
  Car, Shield, Users, Package, Zap, Navigation, Wrench, Truck
} as const;

const getDynamicIcon = (iconName: keyof typeof iconMap = 'Car') => {
  const IconComponent = iconMap[iconName] || iconMap.Car;
  return <IconComponent className="w-4 h-4" />;
};

// Tipos para las características
interface FeatureCategory {
  iconName: keyof typeof iconMap;
  color: string;
  features: string[];
}

interface FeatureCategories {
  [key: string]: FeatureCategory;
}

// Función para características con manejo dinámico de todas las categorías
const getAvailableFeatures = (category: VehicleCategory): FeatureCategories => {
  // Definir características base para cada categoría conocida
  const baseFeatures: Partial<Record<VehicleCategory, FeatureCategories>> = {
    [VehicleCategory.CAR]: {
      "Seguridad": {
        iconName: "Shield",
        color: "text-blue-500",
        features: ["ABS", "Airbags", "Control de estabilidad", "Sensores de reversa"]
      },
      "Comodidad": {
        iconName: "Users",
        color: "text-green-500", 
        features: ["Aire acondicionado", "Asientos de cuero", "GPS", "Bluetooth"]
      }
    },
    [VehicleCategory.MOTORCYCLE]: {
      "Motor": {
        iconName: "Zap",
        color: "text-yellow-500",
        features: ["Inyección electrónica", "Arranque eléctrico", "ABS"]
      }
    },
    [VehicleCategory.TRUCK]: {
      "Carga": {
        iconName: "Package",
        color: "text-orange-500",
        features: ["Plataforma", "Grúa", "Refrigeración", "Doble tracción"]
      }
    },
    [VehicleCategory.BUS]: {
      "Pasajeros": {
        iconName: "Users",
        color: "text-purple-500",
        features: ["Aire acondicionado", "Asientos reclinables", "TV", "Baño"]
      }
    }
  };

  // Agregar dinámicamente otras categorías que puedan existir
  const allCategories = Object.values(VehicleCategory);
  allCategories.forEach(cat => {
    if (!baseFeatures[cat]) {
      // Características genéricas para categorías no definidas
      baseFeatures[cat] = {
        "Características Generales": {
          iconName: "Car",
          color: "text-gray-500",
          features: ["Aire acondicionado", "Radio", "Luces LED", "Asientos cómodos"]
        }
      };
    }
  });

  return baseFeatures[category] || {};
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
  onNext?: () => void;
  onPrevious?: () => void;
}

// Opciones de documentación - usar valores del enum
const DOCUMENTATION_OPTIONS = [
  { label: "Título de Propiedad", value: Documentation.TITLE },
  { label: "Certificado de Origen", value: Documentation.ORIGIN_CERTIFICATE },
  { label: "Revisión de Tránsito (INTT)", value: Documentation.TRANSIT_REVIEW },
  { label: "Placas Bolivarianas", value: Documentation.BOLIVARIAN_PLATES },
];

// InputField component (sin cambios)
interface InputFieldProps {
  label: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  infoText?: string;
  tooltip?: string;
  isValid?: boolean;
  showValidation?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  success,
  icon,
  children,
  infoText,
  tooltip,
  isValid,
  showValidation = false,
}) => {
  const { isDarkMode } = useDarkMode();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm font-semibold text-gray-800">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          {tooltip && (
            <div className="relative ml-2">
              <HelpCircle
                className="w-3 h-3 text-gray-400 cursor-help"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              />
              {showTooltip && (
                <div className={`absolute left-0 top-5 z-10 w-64 p-2 text-xs rounded-lg shadow-lg ${
                  isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-800 text-white"
                }`}>
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </label>
        {showValidation && (
          <div className="flex items-center">
            {isValid ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : error ? (
              <XCircle className="w-4 h-4 text-red-500" />
            ) : null}
          </div>
        )}
      </div>
      {children}
      {infoText && <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{infoText}</p>}
      {error && (
        <p className="text-sm text-red-500 mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
      {success && !error && (
        <p className="text-sm text-green-500 mt-1 flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" />
          ¡Perfecto!
        </p>
      )}
    </div>
  );
};

// SelectableChip component (sin cambios)
const SelectableChip: React.FC<{
  label: string;
  isSelected: boolean;
  onToggle: () => void;
}> = ({ label, isSelected, onToggle }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        flex items-center justify-center px-3 py-2 rounded-full border-2 text-sm font-medium
        transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500/50
        ${
          isSelected
            ? "bg-teal-600 border-teal-700 text-white shadow-lg"
            : isDarkMode
            ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
        }
      `}
    >
      {isSelected && <Check className="w-4 h-4 mr-2" />}
      {label}
    </button>
  );
};

// ProgressSummary component (sin cambios)
const ProgressSummary: React.FC<{
  imagesCount: number;
  hasDescription: boolean;
  featuresCount: number;
  documentsCount: number;
}> = ({
  imagesCount,
  hasDescription,
  featuresCount,
  documentsCount,
}) => {
  const { isDarkMode } = useDarkMode();
  const completedItems = [
    { label: "Fotos", completed: imagesCount > 0, count: imagesCount },
    {
      label: "Descripción",
      completed: hasDescription,
      extra: hasDescription ? "Completa" : "Pendiente",
    },
    {
      label: "Características",
      completed: featuresCount > 0,
      count: featuresCount,
    },
    {
      label: "Documentos",
      completed: documentsCount > 0,
      count: documentsCount,
    },
  ];

  const completedCount = completedItems.filter((item) => item.completed).length;
  const totalRequired = 4;
  const progressPercentage = (completedCount / totalRequired) * 100;

  return (
    <div
      className={`mt-8 p-6 rounded-xl border-2 ${
        completedCount >= totalRequired
          ? isDarkMode ? "bg-green-900/20 border-green-700" : "bg-green-50 border-green-200"
          : isDarkMode ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200"
      }`}
    >
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3
            className={`font-semibold ${
              completedCount >= totalRequired
                ? isDarkMode ? "text-green-300" : "text-green-800"
                : isDarkMode ? "text-blue-300" : "text-blue-800"
            }`}
          >
            Progreso del registro
          </h3>
          <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className={`w-full rounded-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              completedCount >= totalRequired ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      <ul className={`space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        {completedItems.map((item, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              {item.completed ? (
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 mr-2 text-gray-400" />
              )}
              <span>{item.label}</span>
            </div>
            <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {typeof item.count !== "undefined" ? item.count : item.extra}
            </span>
          </li>
        ))}
      </ul>
      {completedCount >= totalRequired ? (
        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-green-900/30" : "bg-green-100"}`}>
          <p className={`text-sm font-medium ${isDarkMode ? "text-green-300" : "text-green-800"}`}>
            🎉 ¡Excelente! Has completado toda la información necesaria
          </p>
        </div>
      ) : (
        <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-blue-900/30" : "bg-blue-100"}`}>
          <p className={`text-sm ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}>
            💡 Completa {totalRequired - completedCount} elemento
            {totalRequired - completedCount !== 1 ? "s" : ""} más para finalizar
          </p>
        </div>
      )}
    </div>
  );
};

// Componente principal corregido
const Step5_FeaturesAndMedia: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
  handleFeatureToggle,
  handleDocumentationToggle,
  isDocumentationSelected,
  handleImagesChange,
  onPrevious,
  onNext,
}) => {
  const { isDarkMode } = useDarkMode();

  // Obtener características dinámicamente según la categoría
  const availableFeatures = useMemo(() => {
    if (!formData.category) {
      return {};
    }
    return getAvailableFeatures(formData.category);
  }, [formData.category]);

  // Verificar si tenemos características disponibles
  const hasFeatures = Object.keys(availableFeatures).length > 0;

  const descriptionLength = (formData.description || "").length;
  const maxDescriptionLength = 2000;

  const isNearLimit = descriptionLength > maxDescriptionLength * 0.9;
  const charCounterColor = isNearLimit
    ? isDarkMode
      ? "text-orange-400"
      : "text-orange-500"
    : isDarkMode
    ? "text-gray-400"
    : "text-gray-500";

  const isFormComplete =
    (formData.images?.length || 0) > 0 &&
    (formData.description?.length || 0) > 0 &&
    (formData.features?.length || 0) > 0 &&
    (formData.documentation?.length || 0) > 0;

  // Si no hay categoría, mostrar mensaje de error
  if (!formData.category) {
    return (
      <div className={`p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className={`p-6 rounded-xl border-2 border-red-500 ${isDarkMode ? "bg-red-900/20" : "bg-red-50"}`}>
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
              <div>
                <h3 className={`font-semibold ${isDarkMode ? "text-red-300" : "text-red-800"}`}>
                  Error: Categoría no especificada
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                  No se puede mostrar las características sin conocer el tipo de vehículo.
                  Por favor, regresa al paso anterior y selecciona la categoría.
                </p>
              </div>
            </div>
            {onPrevious && (
              <button
                onClick={onPrevious}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Regresar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const getCategoryName = (category: VehicleCategory): string => {
    // Definir nombres base para categorías conocidas
    const baseNames: Partial<Record<VehicleCategory, string>> = {
      [VehicleCategory.CAR]: 'Vehículo',
      [VehicleCategory.MOTORCYCLE]: 'Motocicleta',
      [VehicleCategory.TRUCK]: 'Camión',
      [VehicleCategory.BUS]: 'Autobús'
    };

    // Agregar dinámicamente otras categorías
    const allCategories = Object.values(VehicleCategory);
    allCategories.forEach(cat => {
      if (!baseNames[cat]) {
        // Nombre genérico basado en el valor del enum
        const categoryStr = cat.toString();
        baseNames[cat] = categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1).toLowerCase();
      }
    });

    return baseNames[category] || 'Vehículo';
  };

  return (
    <div className={`p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className={`p-3 rounded-xl shadow-lg ${
            isDarkMode ? "bg-gray-700" : "bg-gradient-to-br from-teal-500 to-teal-600"
          }`}>
            <FileBadge className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              Características y Multimedia
            </h2>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>
              Completa los detalles del vehículo ({getCategoryName(formData.category).toUpperCase()})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Características dinámicas por categoría */}
            {hasFeatures && (
              <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
                <InputField
                  label={`Características del ${getCategoryName(formData.category)}`}
                  icon={(() => {
                    const firstCategory = Object.values(availableFeatures)[0];
                    return firstCategory ? getDynamicIcon(firstCategory.iconName) : getDynamicIcon('Car');
                  })()}
                  tooltip="Selecciona todo lo que aplique. Más detalles generan más interés en los compradores."
                  error={errors.features}
                >
                  <div className="space-y-6 mt-3">
                    {Object.entries(availableFeatures).map(([categoryName, categoryData]) => (
                      <div key={categoryName}>
                        <h4 className={`text-md font-semibold mb-3 flex items-center ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                          <span className={`mr-2 ${categoryData.color}`}>
                            {getDynamicIcon(categoryData.iconName)}
                          </span>
                          {categoryName}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {categoryData.features.map((feature) => (
                            <SelectableChip
                              key={feature}
                              label={feature}
                              isSelected={formData.features?.includes(feature) || false}
                              onToggle={() => handleFeatureToggle(feature)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </InputField>
              </div>
            )}

            {/* Documentación */}
            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
              <InputField
                label="Documentación del Vehículo"
                icon={<FileBadge className="w-4 h-4 text-indigo-600" />}
                infoText="Selecciona los documentos que posees. Esto genera confianza en los compradores."
                tooltip="Tener la documentación en regla es crucial para una venta rápida y segura."
                error={errors.documentation}
              >
                <div className="flex flex-wrap gap-3 mt-3">
                  {DOCUMENTATION_OPTIONS.map(({ label, value }) => (
                    <SelectableChip
                      key={value}
                      label={label}
                      isSelected={isDocumentationSelected(value)}
                      onToggle={() => handleDocumentationToggle(value)}
                    />
                  ))}
                </div>
              </InputField>
            </div>

            {/* Descripción */}
            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
              <InputField
                label="Descripción del Vehículo"
                error={errors.description}
                icon={<FileText className="w-4 h-4 text-teal-600" />}
                tooltip="Sé detallado: menciona mantenimientos, extras, historial, o cualquier detalle único."
                isValid={!errors.description && (formData.description?.length ?? 0) > 0}
                showValidation={true}
              >
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 resize-none ${
                    isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200"
                  } ${
                    errors.description
                      ? "border-red-500"
                      : !errors.description && (formData.description?.length ?? 0) > 0
                      ? "border-green-500"
                      : ""
                  }`}
                  placeholder="Describe tu vehículo: estado general, historial de mantenimiento, razón de venta, etc."
                  maxLength={maxDescriptionLength}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className={`text-xs ${charCounterColor}`}>
                    {descriptionLength}/{maxDescriptionLength} caracteres
                  </div>
                  {descriptionLength > 0 && (
                    <div className={`text-xs ${charCounterColor}`}>
                      {maxDescriptionLength - descriptionLength} restantes
                    </div>
                  )}
                </div>
              </InputField>
            </div>

            {/* Fotos */}
            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
              <InputField
                label="Fotos del Vehículo"
                icon={<ImageIcon className="w-4 h-4 text-teal-600" />}
                tooltip="Sube al menos una foto de buena calidad: exterior, interior, motor y detalles."
                infoText="Las fotos de calidad aumentan significativamente las posibilidades de venta."
                error={errors.images}
              >
                <ImageUploader
                  onUploadChange={handleImagesChange}
                  initialUrls={formData.images || []}
                  maxSizeMB={5}
                />
              </InputField>
            </div>

            {/* Botones de navegación */}
            <div className="flex gap-4">
              {onPrevious && (
                <button
                  onClick={onPrevious}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                    isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Anterior
                </button>
              )}
              {onNext && (
                <button
                  onClick={onNext}
                  disabled={!isFormComplete}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                    isFormComplete
                      ? "bg-teal-600 text-white hover:bg-teal-700 shadow-lg"
                      : isDarkMode
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Finalizar y Pagar
                </button>
              )}
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            <ProgressSummary
              imagesCount={formData.images?.length || 0}
              hasDescription={(formData.description?.length || 0) > 0}
              featuresCount={formData.features?.length || 0}
              documentsCount={formData.documentation?.length || 0}
            />

            {/* Tips específicos por categoría */}
            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                💡 Tips para Destacar tu {getCategoryName(formData.category)}
              </h3>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    📸 <strong>Fotos variadas:</strong> 
                    {(() => {
                      switch(formData.category) {
                        case VehicleCategory.MOTORCYCLE:
                          return " Lateral, motor, odómetro y detalles";
                        case VehicleCategory.TRUCK:
                          return " Exterior, cabina, carrocería y motor";
                        default:
                          return " Exterior, interior, motor y detalles únicos";
                      }
                    })()}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    📝 <strong>Descripción honesta:</strong> Menciona tanto lo bueno como lo que necesita atención
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    ⭐ <strong>Características únicas:</strong> 
                    {(() => {
                      switch(formData.category) {
                        case VehicleCategory.MOTORCYCLE:
                          return " Destaca modificaciones o accesorios";
                        case VehicleCategory.TRUCK:
                          return " Menciona capacidad y tipo de uso";
                        default:
                          return " Destaca lo que hace especial tu vehículo";
                      }
                    })()}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    📋 <strong>Documentos listos:</strong> Tener los papeles en orden acelera la venta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5_FeaturesAndMedia;