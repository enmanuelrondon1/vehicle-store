// src/components/features/vehicles/registration/Step3_Specs.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Settings,
  Fuel,
  Wrench,
  Calendar,
  Gauge,
  Cog,
  AlertCircle,
} from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import { COMMON_COLORS } from "@/constants/form-constants";

// IMPORTAR TIPOS DESDE TU SISTEMA CENTRALIZADO
import type { VehicleDataBackend, FormErrors } from "@/types/types";

import {
  VehicleCategory,
  DriveType,
  TransmissionType,
  FuelType,
  DRIVE_TYPE_LABELS,
  TRANSMISSION_TYPES_LABELS,
  FUEL_TYPES_LABELS,
} from "@/types/types";

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

// Componente de barra de progreso
const ProgressBar: React.FC<{ progress: number }> = ({
  progress,
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span
          className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          Progreso del formulario
        </span>
        <span
          className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          {Math.round(progress)}%
        </span>
      </div>
      <div
        className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
      >
        <div
          className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
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
  const { isDarkMode } = useDarkMode();

  const inputClass = `w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 ${
    isDarkMode
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
      : "bg-white border-gray-200 text-gray-900"
  }`;

  // ✅ SOLUCION: Llamar SIEMPRE los hooks, sin condiciones
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

  // ✅ SOLUCION: useCallback siempre se llaman, sin condiciones
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

  const { progressPercentage, isComplete } = useMemo(() => {
    const requiredFields = ["year", "color", "transmission", "fuelType"];
    const conditionalFields: string[] = [];

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

    const allRequiredFields = [...requiredFields, ...conditionalFields];
    const completedFields = allRequiredFields.filter((field) => {
      const value = formData[field as keyof VehicleDataBackend];
      return value !== undefined && value !== "" && value !== null;
    }).length;

    const progress =
      allRequiredFields.length > 0
        ? (completedFields / allRequiredFields.length) * 100
        : 0;
    return { progressPercentage: progress, isComplete: progress === 100 };
  }, [formData, currentCategory]);

  // Si no hay categoría, mostrar un mensaje de error o estado vacío.
  if (!currentCategory) {
    return (
      <div
        className={`p-6 rounded-xl border-2 border-dashed ${isDarkMode ? "border-gray-700 text-gray-500" : "border-gray-300 text-gray-500"}`}
      >
        <AlertCircle className="w-6 h-6 mx-auto mb-2" />
        <p className="text-center">
          Por favor, regresa al paso 1 y selecciona una categoría para
          continuar.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`max-w-2xl mx-auto ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
    >
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div
            className={`p-3 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-700" : "bg-gradient-to-br from-cyan-500 to-blue-600"}`}
          >
            <Settings
              className={`w-6 h-6 ${isDarkMode ? "text-gray-200" : "text-white"}`}
            />
          </div>
          <div>
            <h2
              className={`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
            >
              Especificaciones Técnicas
            </h2>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Detalles técnicos del vehículo
            </p>
          </div>
        </div>

        <ProgressBar progress={progressPercentage} />

        <div className="space-y-6">
          {/* Año - Campo muy importante */}
          <InputField
            label="Año"
            required
            error={errors.year}
            icon={<Calendar className="w-4 h-4 text-cyan-400" />}
            tooltip="El año del vehículo afecta significativamente su valor de mercado"
            success={yearValidation.isValid === true}
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
              className={`${inputClass} ${
                yearValidation.isValid === true
                  ? "border-green-500 focus:ring-green-500/20"
                  : yearValidation.isValid === false
                    ? "border-red-500 focus:ring-red-500/20"
                    : "focus:ring-cyan-500/20"
              }`}
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
            success={colorValidation.isValid === true}
            tips={[
              "🤍 Blanco y gris tienen mayor demanda",
              "💎 Colores metálicos conservan mejor valor",
              "🌈 Colores llamativos pueden ser más difíciles de vender",
            ]}
          >
            <SelectField
              value={formData.color || ""}
              onChange={(value) => handleInputChange("color", value)}
              placeholder="Selecciona un color"
              options={COMMON_COLORS.map((c) => ({ value: c, label: c }))}
              className={`${inputClass} ${
                colorValidation.isValid === true
                  ? "border-green-500 focus:ring-green-500/20"
                  : colorValidation.isValid === false
                    ? "border-red-500 focus:ring-red-500/20"
                    : "focus:ring-cyan-500/20"
              }`}
            />
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
            success={displacementValidation.isValid === true}
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
            <SelectField
              value={formData.displacement || ""}
              onChange={(value) => handleInputChange("displacement", value)}
              placeholder="Selecciona cilindraje"
              options={generateDisplacementOptions().map((d) => ({
                value: d,
                label: d,
              }))}
              className={`${inputClass} ${
                displacementValidation.isValid === true
                  ? "border-green-500 focus:ring-green-500/20"
                  : displacementValidation.isValid === false
                    ? "border-red-500 focus:ring-red-500/20"
                    : "focus:ring-green-500/20"
              }`}
            />
          </InputField>

          <InputField
            label="Motor"
            error={errors.engine}
            icon={<Wrench className="w-4 h-4 text-gray-400" />}
            tooltip="Incluye detalles como V6, Turbo, DOHC para mayor atractivo"
            success={engineValidation.isValid === true}
            counter={{ current: formData.engine?.length || 0, max: 100 }}
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
              className={`${inputClass} ${
                engineValidation.isValid === true
                  ? "border-green-500 focus:ring-green-500/20"
                  : engineValidation.isValid === false
                    ? "border-red-500 focus:ring-red-500/20"
                    : "focus:ring-cyan-500/20"
              }`}
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
            success={transmissionValidation.isValid === true}
            tips={[
              "🔧 Manual = menor costo de mantenimiento",
              "🚗 Automática = mayor comodidad",
              "⚡ CVT = mejor eficiencia de combustible",
            ]}
          >
            <SelectField
              value={formData.transmission || ""}
              onChange={(value) => handleInputChange("transmission", value)}
              placeholder="Selecciona transmisión"
              options={Object.entries(TRANSMISSION_TYPES_LABELS).map<{ value: string; label: string }>(
                ([value, label]) => ({ value, label })
              )}
              className={`${inputClass} ${
                transmissionValidation.isValid === true
                  ? "border-green-500 focus:ring-green-500/20"
                  : transmissionValidation.isValid === false
                    ? "border-red-500 focus:ring-red-500/20"
                    : "focus:ring-blue-500/20"
              }`}
            />
          </InputField>

          <InputField
            label="Tipo de Combustible"
            required
            error={errors.fuelType}
            icon={<Fuel className="w-4 h-4 text-orange-400" />}
            tooltip="La gasolina es más común, pero el diesel puede ser más económico"
            success={fuelTypeValidation.isValid === true}
            tips={[
              "⛽ Gasolina = más estaciones de servicio",
              "🚛 Diesel = mayor eficiencia en distancias largas",
              "🔋 Eléctrico/Híbrido = futuro sostenible",
            ]}
          >
            <SelectField
              value={formData.fuelType || ""}
              onChange={(value) => handleInputChange("fuelType", value)}
              placeholder="Selecciona combustible"
              options={Object.entries(FUEL_TYPES_LABELS).map<{ value: string; label: string }>(
                ([value, label]) => ({ value, label })
              )}
              className={`${inputClass} ${
                fuelTypeValidation.isValid === true
                  ? "border-green-500 focus:ring-green-500/20"
                  : fuelTypeValidation.isValid === false
                    ? "border-red-500 focus:ring-red-500/20"
                    : "focus:ring-orange-500/20"
              }`}
            />
          </InputField>

          {/* Tracción - Para vehículos con motor */}
          {currentCategory !== VehicleCategory.MOTORCYCLE && (
            <InputField
              label="Tracción"
              error={errors.driveType}
              icon={<Cog className="w-4 h-4 text-indigo-400" />}
              tooltip="4x4 es ideal para terrenos difíciles, FWD para ciudad"
              success={driveTypeValidation.isValid === true}
              tips={[
                "🏙️ FWD = ideal para ciudad",
                "🏔️ AWD/4x4 = terrenos difíciles",
                "⚡ RWD = mejor para deportivos",
              ]}
            >
              <SelectField
                value={formData.driveType || ""}
                onChange={(value) => handleInputChange("driveType", value)}
                placeholder="Selecciona tracción"
                options={Object.entries(DRIVE_TYPE_LABELS).map<{ value: string; label: string }>(
                  ([value, label]) => ({ value, label })
                )}
                className={`${inputClass} ${
                  driveTypeValidation.isValid === true
                    ? "border-green-500 focus:ring-green-500/20"
                    : driveTypeValidation.isValid === false
                      ? "border-red-500 focus:ring-red-500/20"
                      : "focus:ring-indigo-500/20"
                }`}
              />
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
                  success={doorsValidation.isValid === true}
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
                    className={`${inputClass} ${
                      doorsValidation.isValid === true
                        ? "border-green-500 focus:ring-green-500/20"
                        : doorsValidation.isValid === false
                          ? "border-red-500 focus:ring-red-500/20"
                          : "focus:ring-cyan-500/20"
                    }`}
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
                  success={seatsValidation.isValid === true}
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
                    className={`${inputClass} ${
                      seatsValidation.isValid === true
                        ? "border-green-500 focus:ring-green-500/20"
                        : seatsValidation.isValid === false
                          ? "border-red-500 focus:ring-red-500/20"
                          : "focus:ring-cyan-500/20"
                    }`}
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
              success={loadCapacityValidation.isValid === true}
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
                className={`${inputClass} ${
                  loadCapacityValidation.isValid === true
                    ? "border-green-500 focus:ring-green-500/20"
                    : loadCapacityValidation.isValid === false
                      ? "border-red-500 focus:ring-red-500/20"
                      : "focus:ring-yellow-500/20"
                }`}
                placeholder="1000"
                min="0"
              />
            </InputField>
          )}
        </div>

        {/* Resumen de completitud */}
        <div
          className={`mt-6 p-4 rounded-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-200"}`}
        >
          <h3
            className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Estado del Formulario
          </h3>
          <div className="flex items-center justify-between">
            <span
              className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              {isComplete
                ? "🎉 ¡Formulario completo!"
                : `📝 ${Math.round(progressPercentage)}% completado`}
            </span>
            {isComplete && (
              <span className="text-xs text-green-600 font-medium">
                ✅ Listo para continuar
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3_Specs;
