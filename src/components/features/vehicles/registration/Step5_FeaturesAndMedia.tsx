// src/components/features/vehicles/registration/Step5_FeaturesAndMedia.tsx
"use client";
import React, { useState } from "react";
import {
  FileText,
  Shield,
  Image as ImageIcon,
  FileBadge,
  Check,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { ImageUploader } from "@/components/shared/forms/ImageUploader";

// ✅ CAMBIO PRINCIPAL: Importar Documentation desde shared.ts en lugar de definirlo aquí
import { Documentation } from "@/types/shared";

// Tipos que coinciden con tu estructura original
interface VehicleDataBackend {
  features?: string[];
  documentation?: string[];
  description?: string;
  images?: string[];
}

interface FormErrors {
  [key: string]: string | undefined;
}

// ✅ CAMBIO: Actualizar StepProps para usar Documentation importado
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

const AVAILABLE_FEATURES = {
  Básico: [
    "Aire Acondicionado",
    "Radio AM/FM",
    "Vidrios Eléctricos",
    "Dirección Hidráulica",
    "Alarma",
    "Caucho de Repuesto",
  ],
  Comodidad: [
    "Tapicería de Cuero",
    "Asientos de Tela",
    "Volante Ajustable",
    "Espejos Eléctricos",
    "Vidrios Polarizados",
    "Techo Solar",
    "Bluetooth",
    "Sistema de Sonido Premium",
    "Arranque por Botón",
  ],
  Seguridad: [
    "Frenos ABS",
    "Airbags",
    "Cinturones de Seguridad",
    "Frenos de Disco",
    "Luces Antiniebla",
    "Cámara de Reversa",
    "Sensores de Estacionamiento",
    "Blindaje",
    "Seriales Intactos",
  ],
  Comercial: [
    "Capacidad de Carga (kg)",
    "Ganchos de Remolque",
    "Compartimento de Carga",
    "Asientos Plegables",
    "Racks de Techo",
  ],
};

// ✅ CAMBIO: Usar los valores correctos de shared.ts (minúsculas)
const DOCUMENTATION_OPTIONS = [
  { label: "Título de Propiedad", value: Documentation.TITLE },
  { label: "Certificado de Origen", value: Documentation.ORIGIN_CERTIFICATE },
  { label: "Revisión de Tránsito (INTT)", value: Documentation.TRANSIT_REVIEW },
  { label: "Placas Bolivarianas", value: Documentation.BOLIVARIAN_PLATES },
];

// Componente InputField
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
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="space-y-2 text-gray-700">
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
                <div className="absolute left-0 top-5 z-10 w-64 p-2 text-xs bg-gray-800 text-white rounded-lg shadow-lg">
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
      {infoText && <p className="text-xs mt-1 text-gray-500">{infoText}</p>}
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

// Componente SelectableChip
const SelectableChip: React.FC<{
  label: string;
  isSelected: boolean;
  onToggle: () => void;
}> = ({ label, isSelected, onToggle }) => {
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
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
        }
      `}
    >
      {isSelected && <Check className="w-4 h-4 mr-2" />}
      {label}
    </button>
  );
};

// Componente ProgressSummary
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
          ? "bg-green-50 border-green-200"
          : "bg-blue-50 border-blue-200"
      }`}
    >
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3
            className={`font-semibold ${
              completedCount >= totalRequired
                ? "text-green-800"
                : "text-blue-800"
            }`}
          >
            Progreso del registro
          </h3>
          <span className="text-sm text-gray-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full rounded-full h-2 bg-gray-200">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              completedCount >= totalRequired ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      <ul className="space-y-2 text-sm text-gray-700">
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
            <span className="text-xs text-gray-600">
              {typeof item.count !== "undefined" ? item.count : item.extra}
            </span>
          </li>
        ))}
      </ul>
      {completedCount >= totalRequired ? (
        <div className="mt-4 p-3 rounded-lg bg-green-100">
          <p className="text-sm font-medium text-green-800">
            🎉 ¡Excelente! Has completado toda la información necesaria
          </p>
        </div>
      ) : (
        <div className="mt-4 p-3 rounded-lg bg-blue-100">
          <p className="text-sm text-blue-800">
            💡 Completa {totalRequired - completedCount} elemento
            {totalRequired - completedCount !== 1 ? "s" : ""} más para finalizar
          </p>
        </div>
      )}
    </div>
  );
};

// Componente principal con todas las props necesarias
const Step5_FeaturesAndMedia: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
  handleFeatureToggle,
  handleDocumentationToggle,
  isDocumentationSelected,
  handleImagesChange,
  onPrevious,
}) => {
  // Validación en tiempo real
  // const validateDescription = (value: string): string | undefined => {
  //   if (value.length > 2000)
  //     return "La descripción no puede exceder 2000 caracteres";
  //   return undefined;
  // };

  const handleDescriptionChange = (value: string) => {
    handleInputChange("description", value);
  };




  const descriptionLength = (formData.description || "").length;
  const maxDescriptionLength = 2000;
  const charCounterColor =
    descriptionLength > maxDescriptionLength * 0.9
      ? "text-orange-500"
      : "text-gray-500";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-teal-500 to-teal-600">
            <FileBadge className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Características y Multimedia
            </h2>
            <p className="text-gray-600 text-sm">
              Completa los detalles del vehículo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Características */}
            <div className="p-6 rounded-xl shadow-lg bg-white">
              <InputField
                label="Características del Vehículo"
                icon={<Shield className="w-4 h-4 text-teal-600" />}
                tooltip="Selecciona todo lo que aplique. Más detalles generan más interés en los compradores."
                error={errors.features}
              >
                <div className="space-y-6 mt-3">
                  {Object.entries(AVAILABLE_FEATURES).map(
                    ([category, features]) => (
                      <div key={category}>
                        <h4 className="text-md font-semibold mb-3 text-gray-800">
                          {category}
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {features.map((feature) => (
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
                      </div>
                    )
                  )}
                </div>
              </InputField>
            </div>

            {/* Documentación */}
            <div className="p-6 rounded-xl shadow-lg bg-white">
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
            <div className="p-6 rounded-xl shadow-lg bg-white">
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
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 resize-none bg-white border-gray-200 ${
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
            <div className="p-6 rounded-xl shadow-lg bg-white">
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
                />
              </InputField>
            </div>

            {/* Botones de navegación */}
            <div className="flex gap-4">
              {onPrevious && (
                <button
                  onClick={onPrevious}
                  className="flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Anterior
                </button>
              )}
              {/* El botón de "Siguiente" se convierte en "Finalizar y Pagar" en este paso */}
              {/* <button
                onClick={handleNextStep}
                disabled={!isFormValid}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${isFormValid ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                Finalizar y Pagar
              </button> */}
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

            {/* Tips para mejorar la venta */}
            <div className="p-6 rounded-xl shadow-lg bg-white">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                💡 Tips para Destacar
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">
                    📸 <strong>Fotos variadas:</strong> Exterior, interior,
                    motor y detalles únicos
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">
                    📝 <strong>Descripción honesta:</strong> Menciona tanto lo
                    bueno como lo que necesita atención
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">
                    ⭐ <strong>Características únicas:</strong> Destaca lo que
                    hace especial tu vehículo
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600">
                    📋 <strong>Documentos listos:</strong> Tener los papeles en
                    orden acelera la venta
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