
// src/components/features/vehicles/registration/Step3_Specs.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Settings,
  Fuel,
  Wrench,
  Calendar,
  Gauge,
  Cog,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Eye,
} from "lucide-react";

// IMPORTAR TIPOS DESDE TU SISTEMA CENTRALIZADO
import type { VehicleDataBackend, FormErrors } from "@/types/types";

import {
  VehicleCategory,
  TransmissionType,
  FuelType,
  TRANSMISSION_TYPES_LABELS,
  FUEL_TYPES_LABELS,
} from "@/types/types";

// Definir DriveType localmente o moverlo a shared.ts si lo usas en otros lugares
enum DriveType {
  FWD = "fwd",
  RWD = "rwd",
  AWD = "awd",
  FOUR_WD = "4wd",
}

const DRIVE_TYPE_LABELS = {
  [DriveType.FWD]: "Delantera (FWD)",
  [DriveType.RWD]: "Trasera (RWD)",
  [DriveType.AWD]: "Integral (AWD)",
  [DriveType.FOUR_WD]: "4x4",
};

// Simulando datos de categoría - también podrías mover esto a constants
const CATEGORY_DATA = {
  [VehicleCategory.CAR]: {
    colors: [
      "Blanco",
      "Negro",
      "Gris",
      "Plata",
      "Azul",
      "Rojo",
      "Verde",
      "Amarillo",
      "Marrón",
      "Naranja",
    ],
  },
  [VehicleCategory.MOTORCYCLE]: {
    colors: [
      "Negro",
      "Blanco",
      "Rojo",
      "Azul",
      "Verde",
      "Amarillo",
      "Gris",
      "Naranja",
    ],
  },
  [VehicleCategory.TRUCK]: {
    colors: ["Blanco", "Azul", "Rojo", "Verde", "Gris", "Negro", "Amarillo"],
  },
  [VehicleCategory.SUV]: {
    colors: [
      "Negro",
      "Blanco",
      "Gris",
      "Plata",
      "Azul",
      "Rojo",
      "Verde",
      "Marrón",
    ],
  },
  [VehicleCategory.VAN]: {
    colors: ["Blanco", "Gris", "Azul", "Negro", "Rojo"],
  },
  [VehicleCategory.BUS]: {
    colors: ["Blanco", "Azul", "Verde", "Rojo", "Amarillo", "Gris"],
  },
};

type FormFieldValue = string | number | undefined;

interface StepProps {
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: FormFieldValue) => void;
}

// Hook para validación en tiempo real
const useRealTimeValidation = (
  value: FormFieldValue | null,
  field: string,
  category?: VehicleCategory
) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState<string>("");

  useEffect(() => {
    if (value === undefined || value === "" || value === null) {
      setIsValid(null);
      setValidationMessage("");
      return;
    }

    let valid = false;
    let message = "";

    switch (field) {
      case "year":
        const currentYear = new Date().getFullYear();
        const year = typeof value === "string" ? parseInt(value) : value;
        if (isNaN(year)) {
          message = "Debe ser un año válido";
        } else if (year < 1990 || year > currentYear + 1) {
          message = `Año debe estar entre 1990 y ${currentYear + 1}`;
        } else {
          valid = true;
          message = "Año válido seleccionado";
        }
        break;

      case "color":
        if (typeof value === "string" && value.length > 0) {
          valid = true;
          message = `Color ${value} seleccionado`;
        } else {
          message = "Selecciona un color";
        }
        break;

      case "displacement":
        if (typeof value === "string" && value.length > 0) {
          valid = true;
          message = `Cilindraje ${value} seleccionado`;
        }
        break;

      case "transmission":
        if (
          Object.values(TransmissionType).includes(value as TransmissionType)
        ) {
          valid = true;
          message = `Transmisión ${
            TRANSMISSION_TYPES_LABELS[value as TransmissionType]
          } seleccionada`;
        } else {
          message = "Selecciona tipo de transmisión";
        }
        break;

      case "fuelType":
        if (Object.values(FuelType).includes(value as FuelType)) {
          valid = true;
          message = `Combustible ${
            FUEL_TYPES_LABELS[value as FuelType]
          } seleccionado`;
        } else {
          message = "Selecciona tipo de combustible";
        }
        break;

      case "driveType":
        if (Object.values(DriveType).includes(value as DriveType)) {
          valid = true;
          message = `Tracción ${
            DRIVE_TYPE_LABELS[value as DriveType]
          } seleccionada`;
        }
        break;

      case "doors":
        if (
          category &&
          [
            VehicleCategory.CAR,
            VehicleCategory.SUV,
            VehicleCategory.VAN,
            VehicleCategory.BUS,
          ].includes(category)
        ) {
          const doors = typeof value === "string" ? parseInt(value) : value;
          if (isNaN(doors)) {
            message = "Debe ser un número válido";
          } else if (doors < 2 || doors > 5) {
            message = "Debe tener entre 2 y 5 puertas";
          } else {
            valid = true;
            message = `${doors} puertas configuradas`;
          }
        }
        break;

      case "seats":
        if (
          category &&
          [
            VehicleCategory.CAR,
            VehicleCategory.SUV,
            VehicleCategory.VAN,
            VehicleCategory.BUS,
          ].includes(category)
        ) {
          const seats = typeof value === "string" ? parseInt(value) : value;
          let maxSeats = 50;
          if (category === VehicleCategory.CAR) maxSeats = 9;
          if (category === VehicleCategory.SUV) maxSeats = 8;
          if (category === VehicleCategory.VAN) maxSeats = 15;

          if (isNaN(seats)) {
            message = "Debe ser un número válido";
          } else if (seats < 2 || seats > maxSeats) {
            message = `Debe tener entre 2 y ${maxSeats} asientos`;
          } else {
            valid = true;
            message = `${seats} asientos configurados`;
          }
        }
        break;

      case "engine":
        if (typeof value === "string" && value.length > 100) {
          message = "Máximo 100 caracteres";
        } else if (typeof value === "string" && value.length > 0) {
          valid = true;
          message = "Especificaciones del motor agregadas";
        }
        break;

      case "loadCapacity":
        const capacity = typeof value === "string" ? parseFloat(value) : value;
        if (isNaN(capacity)) {
          message = "Debe ser un número válido";
        } else if (capacity <= 0) {
          message = "La capacidad debe ser mayor a 0";
        } else {
          valid = true;
          message = `Capacidad de ${capacity}kg configurada`;
        }
        break;

      default:
        valid = true;
        message = "";
    }

    setIsValid(valid);
    setValidationMessage(message);
  }, [value, field, category]);

  return { isValid, validationMessage };
};

// Componente de Tooltip
const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({
  content,
  children,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-10 p-2 text-xs rounded-lg shadow-lg w-48 bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-gray-200">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

// Componente de barra de progreso
const ProgressBar: React.FC<{ formData: Partial<VehicleDataBackend> }> = ({
  formData,
}) => {
  const progress = useMemo(() => {
    const requiredFields = ["year", "color", "transmission", "fuelType"];
    const conditionalFields = [];

    if (
      formData.category &&
      [
        VehicleCategory.CAR,
        VehicleCategory.SUV,
        VehicleCategory.VAN,
        VehicleCategory.BUS,
      ].includes(formData.category)
    ) {
      conditionalFields.push("doors", "seats");
    }

    const allRequiredFields = [...requiredFields, ...conditionalFields];
    const completedFields = allRequiredFields.filter((field) => {
      const value = formData[field as keyof VehicleDataBackend];
      return value !== undefined && value !== "" && value !== null;
    });

    return (completedFields.length / allRequiredFields.length) * 100;
  }, [formData]);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-300">
          Progreso del formulario
        </span>
        <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

// Componente de consejo
const TipCard: React.FC<{ category?: VehicleCategory }> = ({ category }) => {
  const getTip = () => {
    switch (category) {
      case VehicleCategory.MOTORCYCLE:
        return "💡 Las motos con cilindraje 125cc-150cc son las más demandadas en Venezuela";
      case VehicleCategory.CAR:
        return "💡 Los carros con transmisión manual suelen venderse más rápido";
      case VehicleCategory.TRUCK:
        return "💡 Incluye la capacidad de carga para atraer compradores comerciales";
      default:
        return "💡 Completa todos los campos para mejorar tus posibilidades de venta";
    }
  };

  return (
    <div className="bg-gray-800 border-l-4 border-cyan-400 p-4 rounded-r-lg mb-6">
      <div className="flex items-center">
        <TrendingUp className="w-5 h-5 text-cyan-400 mr-2" />
        <p className="text-sm text-cyan-300">{getTip()}</p>
      </div>
    </div>
  );
};

// Componente InputField mejorado
const InputField: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  infoText?: string;
  tooltip?: string;
  field: string;
  value: FormFieldValue;
  category?: VehicleCategory;
  maxLength?: number;
  isValid?: boolean | null;
  validationMessage?: string;
  tips?: string[];
}> = ({
  label,
  required,
  error,
  icon,
  children,
  infoText,
  tooltip,
  value,
  maxLength,
  isValid,
  validationMessage,
  tips,
}) => {
  const [showTips, setShowTips] = useState(false);

  const getValidationIcon = () => {
    if (isValid === true) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (isValid === false) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm font-semibold text-gray-300">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
          {tooltip && (
            <Tooltip content={tooltip}>
              <Info className="w-4 h-4 text-gray-400 ml-1 cursor-help hover:text-gray-300" />
            </Tooltip>
          )}
        </label>
        <div className="flex items-center space-x-2">
          {maxLength && typeof value === "string" && (
            <span
              className={`text-xs ${
                value.length > maxLength * 0.8
                  ? "text-orange-400"
                  : "text-gray-500"
              }`}
            >
              {value.length}/{maxLength}
            </span>
          )}
          {getValidationIcon()}
          {tips && (
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="text-xs px-2 py-1 rounded-full transition-colors bg-blue-900/50 text-blue-300 hover:bg-blue-800/70"
            >
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Tips
            </button>
          )}
        </div>
      </div>

      {children}

      {/* Mensaje de validación en tiempo real */}
      {validationMessage && (
        <p
          className={`text-xs mt-1 flex items-center ${
            isValid ? "text-green-600" : "text-orange-500"
          }`}
        >
          {isValid ? "✅" : "⚠️"} {validationMessage}
        </p>
      )}

      {infoText && !validationMessage && (
        <p className="text-xs mt-1 text-gray-500 flex items-center">
          <Info className="w-3 h-3 mr-1" />
          {infoText}
        </p>
      )}

      {/* Error del formulario */}
      {error && <p className="text-sm text-red-500 mt-1">🚨 {error}</p>}

      {/* Tips expandibles */}
      {showTips && tips && (
        <div className="mt-2 p-3 rounded-lg space-y-1 bg-blue-900/20 border border-blue-800/30">
          {tips.map((tip, index) => (
            <p key={index} className="text-xs text-blue-300">
              {tip}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// Vista previa de datos
const DataPreview: React.FC<{ formData: Partial<VehicleDataBackend> }> = ({
  formData,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  if (!showPreview) {
    return (
      <button
        onClick={() => setShowPreview(true)}
        className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 mb-4 transition-colors"
      >
        <Eye className="w-4 h-4 mr-1" />
        Ver vista previa
      </button>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-200">Vista previa</h3>
        <button
          onClick={() => setShowPreview(false)}
          className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          Ocultar
        </button>
      </div>
      <div className="text-sm space-y-1 text-gray-300">
        {formData.year && (
          <p>
            <strong className="text-gray-200">Año:</strong> {formData.year}
          </p>
        )}
        {formData.color && (
          <p>
            <strong className="text-gray-200">Color:</strong> {formData.color}
          </p>
        )}
        {formData.displacement && (
          <p>
            <strong className="text-gray-200">Cilindraje:</strong>{" "}
            {formData.displacement}
          </p>
        )}
        {formData.transmission && (
          <p>
            <strong className="text-gray-200">Transmisión:</strong>{" "}
            {TRANSMISSION_TYPES_LABELS[formData.transmission]}
          </p>
        )}
        {formData.fuelType && (
          <p>
            <strong className="text-gray-200">Combustible:</strong>{" "}
            {FUEL_TYPES_LABELS[formData.fuelType]}
          </p>
        )}
        {formData.doors && (
          <p>
            <strong className="text-gray-200">Puertas:</strong> {formData.doors}
          </p>
        )}
        {formData.seats && (
          <p>
            <strong className="text-gray-200">Asientos:</strong>{" "}
            {formData.seats}
          </p>
        )}
      </div>
    </div>
  );
};

const Step3_Specs: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const currentCategory = formData.category as VehicleCategory | undefined;
  const categoryData = currentCategory ? CATEGORY_DATA[currentCategory] : null;

  // Validaciones en tiempo real para cada campo
  const yearValidation = useRealTimeValidation(
    formData.year,
    "year",
    currentCategory
  );
  const colorValidation = useRealTimeValidation(
    formData.color,
    "color",
    currentCategory
  );
  const displacementValidation = useRealTimeValidation(
    formData.displacement,
    "displacement",
    currentCategory
  );
  const engineValidation = useRealTimeValidation(
    formData.engine,
    "engine",
    currentCategory
  );
  const transmissionValidation = useRealTimeValidation(
    formData.transmission,
    "transmission",
    currentCategory
  );
  const fuelTypeValidation = useRealTimeValidation(
    formData.fuelType,
    "fuelType",
    currentCategory
  );
  const driveTypeValidation = useRealTimeValidation(
    formData.driveType,
    "driveType",
    currentCategory
  );
  const doorsValidation = useRealTimeValidation(
    formData.doors,
    "doors",
    currentCategory
  );
  const seatsValidation = useRealTimeValidation(
    formData.seats,
    "seats",
    currentCategory
  );
  const loadCapacityValidation = useRealTimeValidation(
    formData.loadCapacity,
    "loadCapacity",
    currentCategory
  );

  // Función para manejar el año con validación en tiempo real
  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 4);

      if (numericValue === "") {
        handleInputChange("year", undefined);
      } else {
        const year = parseInt(numericValue, 10);
        handleInputChange("year", year);
      }
    },
    [handleInputChange]
  );

  // Función para manejar puertas con validación
  const handleDoorsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      if (isNaN(value)) {
        handleInputChange("doors", undefined);
      } else {
        handleInputChange("doors", value);
      }
    },
    [handleInputChange]
  );

  // Función para manejar asientos con validación por categoría
  const handleSeatsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      if (isNaN(value)) {
        handleInputChange("seats", undefined);
      } else {
        handleInputChange("seats", value);
      }
    },
    [handleInputChange]
  );

  // Generar opciones de cilindraje comunes en Venezuela
  const generateDisplacementOptions = () => {
    const displacements = [
      "1.0",
      "1.2",
      "1.3",
      "1.4",
      "1.5",
      "1.6",
      "1.8",
      "2.0",
      "2.2",
      "2.4",
      "2.5",
      "2.7",
      "3.0",
      "3.5",
      "4.0",
      "4.6",
      "5.0",
    ];

    if (currentCategory === VehicleCategory.MOTORCYCLE) {
      return [
        "110cc",
        "125cc",
        "150cc",
        "200cc",
        "250cc",
        "300cc",
        "400cc",
        "500cc",
        "600cc",
        "750cc",
        "1000cc",
      ];
    }

    return displacements.map((d) => `${d}L`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Especificaciones Técnicas
              </h2>
              <p className="text-gray-400 text-sm">
                Detalles técnicos del vehículo
              </p>
            </div>
          </div>
        </div>

        <ProgressBar formData={formData} />
        <TipCard category={currentCategory} />
        <DataPreview formData={formData} />

        <div className="space-y-6">
          {/* Año - Campo muy importante */}
          <InputField
            label="Año"
            required
            error={errors.year}
            icon={<Calendar className="w-4 h-4 text-cyan-400" />}
            tooltip="El año del vehículo afecta significativamente su valor de mercado"
            field="year"
            value={formData.year}
            category={currentCategory}
            isValid={yearValidation.isValid}
            validationMessage={yearValidation.validationMessage}
            tips={[
              "🎯 Año más reciente = mayor valor",
              "📅 Considera el modelo específico del año",
              "⚡ Cambios de generación afectan el precio",
            ]}
          >
            <input
              type="text"
              value={formData.year || ""}
              onChange={handleYearChange}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 ${
                yearValidation.isValid === true
                  ? "border-green-500 focus:ring-green-500/20"
                  : yearValidation.isValid === false
                  ? "border-red-500 focus:ring-red-500/20"
                  : "focus:ring-cyan-500/20"
              } bg-gray-800 border-gray-700 text-white placeholder-gray-500`}
              placeholder="2020"
              maxLength={4}
              inputMode="numeric"
            />
          </InputField>

          <InputField
            label="Color"
            required
            error={errors.color}
            icon={
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-blue-500" />
            }
            tooltip="Los colores neutros (blanco, gris, negro) suelen tener mejor demanda"
            field="color"
            value={formData.color}
            category={currentCategory}
            isValid={colorValidation.isValid}
            validationMessage={colorValidation.validationMessage}
            tips={[
              "🤍 Blanco y gris tienen mayor demanda",
              "💎 Colores metálicos conservan mejor valor",
              "🌈 Colores llamativos pueden ser más difíciles de vender",
            ]}
          >
            <select
              value={formData.color || ""}
              onChange={(e) => handleInputChange("color", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 appearance-none cursor-pointer ${
                colorValidation.isValid === true
                  ? "border-green-500 focus:ring-green-500/20"
                  : colorValidation.isValid === false
                  ? "border-red-500 focus:ring-red-500/20"
                  : "focus:ring-cyan-500/20"
              } bg-gray-800 border-gray-700 text-white`}
            >
              <option value="" className="bg-gray-800">
                Selecciona un color
              </option>
              {(categoryData?.colors || []).map((color) => (
                <option key={color} value={color} className="bg-gray-800">
                  {color}
                </option>
              ))}
            </select>
          </InputField>

          {/* Cilindraje */}
          <InputField
            label={
              currentCategory === VehicleCategory.MOTORCYCLE
                ? "Cilindraje"
                : "Cilindraje del Motor"
            }
            error={errors.displacement}
            icon={<Gauge className="w-4 h-4 text-green-400" />}
            tooltip={
              currentCategory === VehicleCategory.MOTORCYCLE
                ? "125cc-150cc son los más populares en Venezuela"
                : "El cilindraje afecta el consumo y potencia"
            }
            field="displacement"
            value={formData.displacement}
            category={currentCategory}
            isValid={displacementValidation.isValid}
            validationMessage={displacementValidation.validationMessage}
            tips={
              currentCategory === VehicleCategory.MOTORCYCLE
                ? [
                    "🏍️ 125cc-150cc son más económicas",
                    "⚡ Mayor cilindraje = más potencia y consumo",
                    "🛣️ Para ciudad, menor cilindraje es mejor",
                  ]
                : [
                    "🚗 1.6L es el equilibrio ideal",
                    "⛽ Mayor cilindraje = más consumo",
                    "🏔️ Para montaña, considera más cilindraje",
                  ]
            }
          >
            <select
              value={formData.displacement || ""}
              onChange={(e) =>
                handleInputChange("displacement", e.target.value)
              }
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 appearance-none cursor-pointer ${
                displacementValidation.isValid === true
                  ? "border-green-500 focus:ring-green-500/20"
                  : displacementValidation.isValid === false
                  ? "border-red-500 focus:ring-red-500/20"
                  : "focus:ring-green-500/20"
              } bg-gray-800 border-gray-700 text-white`}
            >
              <option value="" className="bg-gray-800">
                Selecciona cilindraje
              </option>
              {generateDisplacementOptions().map((displacement) => (
                <option
                  key={displacement}
                  value={displacement}
                  className="bg-gray-800"
                >
                  {displacement}
                </option>
              ))}
            </select>
          </InputField>

          <InputField
            label="Motor"
            error={errors.engine}
            icon={<Wrench className="w-4 h-4 text-gray-400" />}
            tooltip="Incluye detalles como V6, Turbo, DOHC para mayor atractivo"
            field="engine"
            value={formData.engine}
            category={currentCategory}
            maxLength={100}
            isValid={engineValidation.isValid}
            validationMessage={engineValidation.validationMessage}
            tips={[
              "🔧 Incluye tecnologías especiales (Turbo, DOHC)",
              "⚡ Motores especiales aumentan el valor",
              "📝 Sé específico pero conciso",
            ]}
          >
            <input
              type="text"
              value={formData.engine || ""}
              onChange={(e) => handleInputChange("engine", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 ${
                engineValidation.isValid === true
                  ? "border-green-500 focus:ring-green-500/20"
                  : engineValidation.isValid === false
                  ? "border-red-500 focus:ring-red-500/20"
                  : "focus:ring-cyan-500/20"
              } bg-gray-800 border-gray-700 text-white placeholder-gray-500`}
              placeholder="Ej: V6, Turbo, DOHC, Inyección Directa"
              maxLength={100}
            />
          </InputField>

          <InputField
            label="Transmisión"
            required
            error={errors.transmission}
            icon={<Settings className="w-4 h-4 text-blue-400" />}
            tooltip="La transmisión manual suele ser más económica de mantener"
            field="transmission"
            value={formData.transmission}
            category={currentCategory}
            isValid={transmissionValidation.isValid}
            validationMessage={transmissionValidation.validationMessage}
            tips={[
              "🔧 Manual = menor costo de mantenimiento",
              "🚗 Automática = mayor comodidad",
              "⚡ CVT = mejor eficiencia de combustible",
            ]}
          >
            <select
              value={formData.transmission || ""}
              onChange={(e) =>
                handleInputChange("transmission", e.target.value)
              }
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 appearance-none cursor-pointer ${
                transmissionValidation.isValid === true
                  ? "border-green-500 focus:ring-green-500/20"
                  : transmissionValidation.isValid === false
                  ? "border-red-500 focus:ring-red-500/20"
                  : "focus:ring-blue-500/20"
              } bg-gray-800 border-gray-700 text-white`}
            >
              <option value="" className="bg-gray-800">
                Selecciona transmisión
              </option>
              {Object.values(TransmissionType).map((transmission) => (
                <option
                  key={transmission}
                  value={transmission}
                  className="bg-gray-800"
                >
                  {TRANSMISSION_TYPES_LABELS[transmission]}
                </option>
              ))}
            </select>
          </InputField>

          <InputField
            label="Tipo de Combustible"
            required
            error={errors.fuelType}
            icon={<Fuel className="w-4 h-4 text-orange-400" />}
            tooltip="La gasolina es más común, pero el diesel puede ser más económico"
            field="fuelType"
            value={formData.fuelType}
            category={currentCategory}
            isValid={fuelTypeValidation.isValid}
            validationMessage={fuelTypeValidation.validationMessage}
            tips={[
              "⛽ Gasolina = más estaciones de servicio",
              "🚛 Diesel = mayor eficiencia en distancias largas",
              "🔋 Eléctrico/Híbrido = futuro sostenible",
            ]}
          >
            <select
              value={formData.fuelType || ""}
              onChange={(e) => handleInputChange("fuelType", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 appearance-none cursor-pointer ${
                fuelTypeValidation.isValid === true
                  ? "border-green-500 focus:ring-green-500/20"
                  : fuelTypeValidation.isValid === false
                  ? "border-red-500 focus:ring-red-500/20"
                  : "focus:ring-orange-500/20"
              } bg-gray-800 border-gray-700 text-white`}
            >
              <option value="" className="bg-gray-800">
                Selecciona combustible
              </option>
              {Object.values(FuelType).map((fuel) => (
                <option key={fuel} value={fuel} className="bg-gray-800">
                  {FUEL_TYPES_LABELS[fuel]}
                </option>
              ))}
            </select>
          </InputField>

          {/* Tracción - Para vehículos con motor */}
          {currentCategory !== VehicleCategory.MOTORCYCLE && (
            <InputField
              label="Tracción"
              error={errors.driveType}
              icon={<Cog className="w-4 h-4 text-indigo-400" />}
              tooltip="4x4 es ideal para terrenos difíciles, FWD para ciudad"
              field="driveType"
              value={formData.driveType}
              category={currentCategory}
              isValid={driveTypeValidation.isValid}
              validationMessage={driveTypeValidation.validationMessage}
              tips={[
                "🏙️ FWD = ideal para ciudad",
                "🏔️ AWD/4x4 = terrenos difíciles",
                "⚡ RWD = mejor para deportivos",
              ]}
            >
              <select
                value={formData.driveType || ""}
                onChange={(e) => handleInputChange("driveType", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 appearance-none cursor-pointer ${
                  driveTypeValidation.isValid === true
                    ? "border-green-500 focus:ring-green-500/20"
                    : driveTypeValidation.isValid === false
                    ? "border-red-500 focus:ring-red-500/20"
                    : "focus:ring-indigo-500/20"
                } bg-gray-800 border-gray-700 text-white`}
              >
                <option value="" className="bg-gray-800">
                  Selecciona tracción
                </option>
                {Object.values(DriveType).map((drive) => (
                  <option key={drive} value={drive} className="bg-gray-800">
                    {DRIVE_TYPE_LABELS[drive]}
                  </option>
                ))}
              </select>
            </InputField>
          )}

          {/* Campos condicionales mejorados */}
          {currentCategory &&
            [
              VehicleCategory.CAR,
              VehicleCategory.SUV,
              VehicleCategory.VAN,
              VehicleCategory.BUS,
            ].includes(currentCategory) && (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Puertas"
                  required
                  error={errors.doors}
                  tooltip="Más puertas = mayor comodidad familiar"
                  field="doors"
                  value={formData.doors}
                  category={currentCategory}
                  isValid={doorsValidation.isValid}
                  validationMessage={doorsValidation.validationMessage}
                  tips={[
                    "🚪 2 puertas = deportivo",
                    "👨‍👩‍👧‍👦 4-5 puertas = familiar",
                    "🚐 Más puertas = mayor accesibilidad",
                  ]}
                >
                  <input
                    type="number"
                    value={formData.doors || ""}
                    onChange={handleDoorsChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 ${
                      doorsValidation.isValid === true
                        ? "border-green-500 focus:ring-green-500/20"
                        : doorsValidation.isValid === false
                        ? "border-red-500 focus:ring-red-500/20"
                        : "focus:ring-cyan-500/20"
                    } bg-gray-800 border-gray-700 text-white placeholder-gray-500`}
                    placeholder="4"
                    min="2"
                    max="5"
                  />
                </InputField>
                <InputField
                  label="Asientos"
                  required
                  error={errors.seats}
                  tooltip="Considera el uso: familiar, comercial, transporte"
                  field="seats"
                  value={formData.seats}
                  category={currentCategory}
                  isValid={seatsValidation.isValid}
                  validationMessage={seatsValidation.validationMessage}
                  tips={[
                    "👥 5-7 asientos = familia promedio",
                    "🚐 8+ asientos = transporte",
                    "💺 Más asientos = mayor versatilidad",
                  ]}
                >
                  <input
                    type="number"
                    value={formData.seats || ""}
                    onChange={handleSeatsChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 ${
                      seatsValidation.isValid === true
                        ? "border-green-500 focus:ring-green-500/20"
                        : seatsValidation.isValid === false
                        ? "border-red-500 focus:ring-red-500/20"
                        : "focus:ring-cyan-500/20"
                    } bg-gray-800 border-gray-700 text-white placeholder-gray-500`}
                    placeholder="5"
                    min="2"
                    max={
                      currentCategory === VehicleCategory.BUS
                        ? "50"
                        : currentCategory === VehicleCategory.VAN
                        ? "15"
                        : currentCategory === VehicleCategory.SUV
                        ? "8"
                        : "9"
                    }
                  />
                </InputField>
              </div>
            )}

          {currentCategory === VehicleCategory.TRUCK && (
            <InputField
              label="Capacidad de Carga (kg)"
              error={errors.loadCapacity}
              icon={<Wrench className="w-4 h-4 text-yellow-400" />}
              tooltip="Especifica la capacidad real para atraer compradores comerciales"
              field="loadCapacity"
              value={formData.loadCapacity}
              category={currentCategory}
              isValid={loadCapacityValidation.isValid}
              validationMessage={loadCapacityValidation.validationMessage}
              tips={[
                "📦 Mayor capacidad = mayor valor comercial",
                "⚖️ Capacidad real vs. teórica",
                "🚛 Considera el uso específico del comprador",
              ]}
            >
              <input
                type="number"
                value={formData.loadCapacity || ""}
                onChange={(e) =>
                  handleInputChange(
                    "loadCapacity",
                    parseFloat(e.target.value) || undefined
                  )
                }
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 ${
                  loadCapacityValidation.isValid === true
                    ? "border-green-500 focus:ring-green-500/20"
                    : loadCapacityValidation.isValid === false
                    ? "border-red-500 focus:ring-red-500/20"
                    : "focus:ring-yellow-500/20"
                } bg-gray-800 border-gray-700 text-white placeholder-gray-500`}
                placeholder="1000"
                min="0"
              />
            </InputField>
          )}
        </div>

        {/* Resumen de completitud */}
        <div className="mt-6 p-4 rounded-xl bg-gray-800 border border-gray-700">
          <h3 className="text-sm font-semibold mb-2 text-gray-300">
            Estado del Formulario
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {(() => {
                const requiredFields = [
                  "year",
                  "color",
                  "transmission",
                  "fuelType",
                ];
                const conditionalFields = [];

                if (
                  currentCategory &&
                  [
                    VehicleCategory.CAR,
                    VehicleCategory.SUV,
                    VehicleCategory.VAN,
                    VehicleCategory.BUS,
                  ].includes(currentCategory)
                ) {
                  conditionalFields.push("doors", "seats");
                }

                const allRequiredFields = [
                  ...requiredFields,
                  ...conditionalFields,
                ];
                const completedFields = allRequiredFields.filter((field) => {
                  const value = formData[field as keyof VehicleDataBackend];
                  return value !== undefined && value !== "" && value !== null;
                });

                const progress =
                  (completedFields.length / allRequiredFields.length) * 100;

                return progress === 100
                  ? "🎉 ¡Formulario completo!"
                  : `📝 ${Math.round(progress)}% completado`;
              })()}
            </span>
            {(() => {
              const requiredFields = [
                "year",
                "color",
                "transmission",
                "fuelType",
              ];
              const conditionalFields = [];

              if (
                currentCategory &&
                [
                  VehicleCategory.CAR,
                  VehicleCategory.SUV,
                  VehicleCategory.VAN,
                  VehicleCategory.BUS,
                ].includes(currentCategory)
              ) {
                conditionalFields.push("doors", "seats");
              }

              const allRequiredFields = [
                ...requiredFields,
                ...conditionalFields,
              ];
              const completedFields = allRequiredFields.filter((field) => {
                const value = formData[field as keyof VehicleDataBackend];
                return value !== undefined && value !== "" && value !== null;
              });

              const progress =
                (completedFields.length / allRequiredFields.length) * 100;

              return (
                progress === 100 && (
                  <span className="text-xs text-green-600 font-medium">
                    ✅ Listo para continuar
                  </span>
                )
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3_Specs;
