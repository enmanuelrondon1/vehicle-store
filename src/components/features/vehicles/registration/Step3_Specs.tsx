//src/components/features/vehicles/registration/Step3_Specs.tsx
import React, { useMemo, useCallback } from "react";
import {
  Settings,
  Fuel,
  Wrench,
  Calendar,
  Gauge,
  Cog,
  AlertCircle,
} from "lucide-react";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import { COMMON_COLORS } from "@/constants/form-constants";
import { Progress } from "@/components/ui/progress";
import { useFieldValidation } from "@/hooks/useFieldValidation";

// IMPORTAR TIPOS DESDE TU SISTEMA CENTRALIZADO
import type { VehicleDataBackend, FormErrors } from "@/types/types";

import {
  VehicleCategory,

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

const Step3_Specs: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const currentCategory = formData.category as VehicleCategory | undefined;

  const yearValidation = useFieldValidation(formData.year, errors.year);
  const colorValidation = useFieldValidation(formData.color, errors.color);
  const displacementValidation = useFieldValidation(
    formData.displacement,
    errors.displacement
  );
  const engineValidation = useFieldValidation(formData.engine, errors.engine);
  const transmissionValidation = useFieldValidation(
    formData.transmission,
    errors.transmission
  );
  const fuelTypeValidation = useFieldValidation(
    formData.fuelType,
    errors.fuelType
  );
  const driveTypeValidation = useFieldValidation(
    formData.driveType,
    errors.driveType
  );
  const doorsValidation = useFieldValidation(formData.doors, errors.doors);
  const seatsValidation = useFieldValidation(formData.seats, errors.seats);
  const loadCapacityValidation = useFieldValidation(
    formData.loadCapacity,
    errors.loadCapacity
  );

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

  const generateDisplacementOptions = () => {
    const displacements = [
      "1.0", "1.2", "1.3", "1.4", "1.5", "1.6", "1.8", "2.0", "2.2",
      "2.4", "2.5", "2.7", "3.0", "3.5", "4.0", "4.6", "5.0",
    ];

    if (currentCategory === VehicleCategory.MOTORCYCLE) {
      return [
        "110cc", "125cc", "150cc", "200cc", "250cc", "300cc", "400cc",
        "500cc", "600cc", "750cc", "1000cc",
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

  if (!currentCategory) {
    return (
      <div
        className="p-6 rounded-xl border-2 border-dashed border-border text-muted-foreground"
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
    <div className="max-w-2xl mx-auto text-foreground">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div
            className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600"
          >
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Especificaciones Técnicas
            </h2>
            <p className="text-sm text-muted-foreground">
              Detalles técnicos del vehículo
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Progreso del formulario
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} />
        </div>

        <div className="space-y-6">
          <InputField
            label="Año"
            required
            error={errors.year}
            icon={<Calendar className="w-4 h-4 text-cyan-400" />}
            tooltip="El año del vehículo afecta significativamente su valor de mercado"
            success={yearValidation.isValid}
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
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 bg-background text-foreground placeholder-muted-foreground ${yearValidation.getBorderClassName()}`}
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
            success={colorValidation.isValid}
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
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 bg-background text-foreground ${colorValidation.getBorderClassName()}`}
            />
          </InputField>

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
            success={displacementValidation.isValid}
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
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 bg-background text-foreground ${displacementValidation.getBorderClassName()}`}
            />
          </InputField>

          <InputField
            label="Motor"
            error={errors.engine}
            icon={<Wrench className="w-4 h-4 text-gray-400" />}
            tooltip="Incluye detalles como V6, Turbo, DOHC para mayor atractivo"
            success={engineValidation.isValid}
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
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 bg-background text-foreground placeholder-muted-foreground ${engineValidation.getBorderClassName()}`}
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
            success={transmissionValidation.isValid}
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
              options={Object.entries(TRANSMISSION_TYPES_LABELS).map<
                { value: string; label: string }
              >(([value, label]) => ({ value, label }))}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 bg-background text-foreground ${transmissionValidation.getBorderClassName()}`}
            />
          </InputField>

          <InputField
            label="Tipo de Combustible"
            required
            error={errors.fuelType}
            icon={<Fuel className="w-4 h-4 text-orange-400" />}
            tooltip="La gasolina es más común, pero el diesel puede ser más económico"
            success={fuelTypeValidation.isValid}
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
              options={Object.entries(FUEL_TYPES_LABELS).map<
                { value: string; label: string }
              >(([value, label]) => ({ value, label }))}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 bg-background text-foreground ${fuelTypeValidation.getBorderClassName()}`}
            />
          </InputField>

          {currentCategory !== VehicleCategory.MOTORCYCLE && (
            <InputField
              label="Tracción"
              error={errors.driveType}
              icon={<Cog className="w-4 h-4 text-indigo-400" />}
              tooltip="4x4 es ideal para terrenos difíciles, FWD para ciudad"
              success={driveTypeValidation.isValid}
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
                options={Object.entries(DRIVE_TYPE_LABELS).map<
                  { value: string; label: string }
                >(([value, label]) => ({ value, label }))}
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 bg-background text-foreground ${driveTypeValidation.getBorderClassName()}`}
              />
            </InputField>
          )}

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
                  success={doorsValidation.isValid}
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
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 bg-background text-foreground placeholder-muted-foreground ${doorsValidation.getBorderClassName()}`}
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
                  success={seatsValidation.isValid}
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
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 bg-background text-foreground placeholder-muted-foreground ${seatsValidation.getBorderClassName()}`}
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
              success={loadCapacityValidation.isValid}
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
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-4 transition-all duration-200 bg-background text-foreground placeholder-muted-foreground ${loadCapacityValidation.getBorderClassName()}`}
                placeholder="1000"
                min="0"
              />
            </InputField>
          )}
        </div>

        <div
          className="mt-6 p-4 rounded-xl border bg-blue-50 border-blue-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <h3
            className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
          >
            Estado del Formulario
          </h3>
          <div className="flex items-center justify-between">
            <span
              className="text-xs text-gray-600 dark:text-gray-400"
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