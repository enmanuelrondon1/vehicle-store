// src/components/features/vehicles/registration/Step3_Specs.tsx
// VERSIÓN PROFESIONAL MEJORADA
"use client";
import React, { useMemo, useCallback } from "react";
import {
  Settings,
  Fuel,
  Wrench,
  Calendar,
  Gauge,
  Cog,
  AlertCircle,
  CheckCircle2,
  Info,
  Eye,
} from "lucide-react";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import { COMMON_COLORS } from "@/constants/form-constants";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

// ============================================
// CONFIGURACIÓN DE VALIDACIÓN
// ============================================
const VALIDATION_CONFIG = {
  year: {
    tips: [
      "🎯 Año más reciente = mayor valor en el mercado",
      "📅 Considera el modelo específico del año",
      "⚡ Los cambios de generación afectan significativamente el precio",
    ],
  },
  color: {
    tips: [
      "🤍 Blanco, gris y negro tienen mayor demanda",
      "💎 Colores metálicos conservan mejor su valor",
      "🌈 Colores llamativos pueden reducir el mercado potencial",
    ],
  },
  displacement: {
    car: [
      "🚗 1.6L ofrece el mejor equilibrio potencia/consumo",
      "⛽ Mayor cilindraje = mayor consumo de combustible",
      "🏔️ Para zonas montañosas, considera más cilindraje",
    ],
    motorcycle: [
      "🏍️ 125cc-150cc son las más económicas en consumo",
      "⚡ Mayor cilindraje = más potencia pero más consumo",
      "🛣️ Para uso urbano, menor cilindraje es más práctico",
    ],
  },
  engine: {
    tips: [
      "⚡ Motores V6/V8 aumentan el valor del vehículo",
      "🔧 Incluye tecnologías especiales (Turbo, DOHC, Inyección)",
      "📝 Sé específico pero conciso en la descripción",
    ],
  },
  transmission: {
    tips: [
      "🔧 Manual = menor costo de mantenimiento",
      "🚗 Automática = mayor comodidad en tráfico",
      "⚡ CVT = mejor eficiencia de combustible",
    ],
  },
  fuelType: {
    tips: [
      "⛽ Gasolina = mayor disponibilidad de estaciones",
      "🚛 Diesel = mayor eficiencia en distancias largas",
      "🔋 Eléctrico/Híbrido = menor costo operativo a largo plazo",
    ],
  },
  driveType: {
    tips: [
      "🏙️ FWD (Tracción delantera) = ideal para ciudad",
      "🏔️ AWD/4x4 = mejor para terrenos difíciles",
      "⚡ RWD (Tracción trasera) = mejor para deportivos",
    ],
  },
  doors: {
    tips: [
      "🚪 2 puertas = estilo deportivo",
      "👨‍👩‍👧‍👦 4-5 puertas = uso familiar",
      "🚐 Más puertas = mayor accesibilidad",
    ],
  },
  seats: {
    tips: [
      "👥 5-7 asientos = familia promedio",
      "🚐 8+ asientos = transporte de pasajeros",
      "💺 Más asientos = mayor versatilidad",
    ],
  },
  loadCapacity: {
    tips: [
      "📦 Mayor capacidad = mayor valor para uso comercial",
      "⚖️ Especifica la capacidad real, no la teórica",
      "🚛 Considera el uso específico del comprador",
    ],
  },
};

// ============================================
// COMPONENTE: Vista Previa de Especificaciones
// ============================================
const SpecsPreviewCard: React.FC<{
  formData: Partial<VehicleDataBackend>;
  currentCategory: VehicleCategory;
}> = ({ formData, currentCategory }) => {
  return (
    <div className="p-5 rounded-xl border-2 border-dashed border-border bg-gradient-to-br from-card via-card to-muted/20 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Eye className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          Vista Previa de Especificaciones
        </h3>
      </div>

      <div className="space-y-3">
        {formData.year && (
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Año</span>
            <span className="font-medium text-sm text-foreground">{formData.year}</span>
          </div>
        )}

        {formData.color && (
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Color</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-foreground">{formData.color}</span>
            </div>
          </div>
        )}

        {formData.displacement && (
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Cilindraje</span>
            <span className="font-medium text-sm text-foreground">{formData.displacement}</span>
          </div>
        )}

        {formData.transmission && (
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Transmisión</span>
            <Badge variant="outline" className="font-medium">
              {TRANSMISSION_TYPES_LABELS[formData.transmission]}
            </Badge>
          </div>
        )}

        {formData.fuelType && (
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Combustible</span>
            <Badge variant="outline" className="font-medium">
              {FUEL_TYPES_LABELS[formData.fuelType]}
            </Badge>
          </div>
        )}

        {formData.driveType && currentCategory !== VehicleCategory.MOTORCYCLE && (
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Tracción</span>
            <span className="font-medium text-sm text-foreground">
              {DRIVE_TYPE_LABELS[formData.driveType]}
            </span>
          </div>
        )}

        {formData.doors && (
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Puertas</span>
            <span className="font-medium text-sm text-foreground">{formData.doors}</span>
          </div>
        )}

        {formData.seats && (
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-muted-foreground">Asientos</span>
            <span className="font-medium text-sm text-foreground">{formData.seats}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const Step3_Specs: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const currentCategory = formData.category as VehicleCategory | undefined;

  // ========== Clases de Input Mejoradas ==========
  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground " +
    "placeholder:text-muted-foreground/60 " +
    "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 " +
    "transition-all duration-200 ease-out hover:border-border/80";

  // ========== Hooks de Validación ==========
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

  // ========== Manejadores de Input Numérico ==========
  const createNumericInputHandler = useCallback(
    (
      field: keyof VehicleDataBackend,
      options: { maxLength?: number; isFloat?: boolean } = {}
    ) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let numericValue: string | number = value.replace(
          options.isFloat ? /[^0-9.]/g : /[^0-9]/g,
          ""
        );

        if (options.maxLength && numericValue.length > options.maxLength) {
          numericValue = numericValue.slice(0, options.maxLength);
        }

        if (numericValue === "") {
          handleInputChange(field, undefined);
        } else {
          const parsedValue = options.isFloat
            ? parseFloat(numericValue as string)
            : parseInt(numericValue as string, 10);
          handleInputChange(field, isNaN(parsedValue) ? undefined : parsedValue);
        }
      };
    },
    [handleInputChange]
  );

  const handleYearChange = createNumericInputHandler("year", { maxLength: 4 });
  const handleDoorsChange = createNumericInputHandler("doors");
  const handleSeatsChange = createNumericInputHandler("seats");
  const handleLoadCapacityChange = createNumericInputHandler("loadCapacity", {
    isFloat: true,
  });

  // ========== Generar Opciones de Cilindraje ==========
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

  // ========== Cálculo de Progreso ==========
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

  // ========== Validación de Categoría ==========
  if (!currentCategory) {
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
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
      {/* ========== ENCABEZADO MEJORADO ========== */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10">
            <Settings className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
              Especificaciones Técnicas
            </h2>
            <p className="text-base text-muted-foreground mt-0.5">
              Detalles técnicos del vehículo
            </p>
          </div>
        </div>

        {/* ========== BARRA DE PROGRESO ========== */}
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
        {/* AÑO */}
        <InputField
          label="Año"
          required
          error={errors.year}
          icon={<Calendar className="w-4 h-4 text-primary" />}
          tooltip="El año del vehículo afecta significativamente su valor de mercado"
          success={yearValidation.isValid}
          tips={VALIDATION_CONFIG.year.tips}
        >
          <input
            type="text"
            value={formData.year || ""}
            onChange={handleYearChange}
            className={`${inputClass} ${yearValidation.getBorderClassName()}`}
            placeholder="2020"
            maxLength={4}
            inputMode="numeric"
          />
        </InputField>

        {/* COLOR */}
        <InputField
          label="Color"
          required
          error={errors.color}
          icon={
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500" />
          }
          tooltip="Los colores neutros (blanco, gris, negro) suelen tener mejor demanda"
          success={colorValidation.isValid}
          tips={VALIDATION_CONFIG.color.tips}
        >
          <SelectField
            value={formData.color || ""}
            onChange={(value) => handleInputChange("color", value)}
            placeholder="Selecciona un color"
            options={COMMON_COLORS.map((c) => ({ value: c, label: c }))}
            className={`${inputClass} ${colorValidation.getBorderClassName()}`}
          />
        </InputField>

        {/* CILINDRAJE */}
        <InputField
          label={
            currentCategory === VehicleCategory.MOTORCYCLE
              ? "Cilindraje"
              : "Cilindraje del Motor"
          }
          error={errors.displacement}
          icon={<Gauge className="w-4 h-4 text-primary" />}
          tooltip={
            currentCategory === VehicleCategory.MOTORCYCLE
              ? "125cc-150cc son los más populares en Venezuela"
              : "El cilindraje afecta el consumo y potencia"
          }
          success={displacementValidation.isValid}
          tips={
            currentCategory === VehicleCategory.MOTORCYCLE
              ? VALIDATION_CONFIG.displacement.motorcycle
              : VALIDATION_CONFIG.displacement.car
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
            className={`${inputClass} ${displacementValidation.getBorderClassName()}`}
          />
        </InputField>

        {/* MOTOR (OPCIONAL) */}
        <InputField
          label="Motor (Opcional)"
          error={errors.engine}
          icon={<Wrench className="w-4 h-4 text-primary" />}
          tooltip="Incluye detalles como V6, Turbo, DOHC para mayor atractivo"
          success={engineValidation.isValid}
          counter={{ current: formData.engine?.length || 0, max: 100 }}
          tips={VALIDATION_CONFIG.engine.tips}
        >
          <input
            type="text"
            value={formData.engine || ""}
            onChange={(e) => handleInputChange("engine", e.target.value)}
            className={`${inputClass} ${engineValidation.getBorderClassName()}`}
            placeholder="Ej: V6, Turbo, DOHC, Inyección Directa"
            maxLength={100}
          />
        </InputField>

        {/* TRANSMISIÓN */}
        <InputField
          label="Transmisión"
          required
          error={errors.transmission}
          icon={<Settings className="w-4 h-4 text-primary" />}
          tooltip="La transmisión manual suele ser más económica de mantener"
          success={transmissionValidation.isValid}
          tips={VALIDATION_CONFIG.transmission.tips}
        >
          <SelectField
            value={formData.transmission || ""}
            onChange={(value) => handleInputChange("transmission", value)}
            placeholder="Selecciona transmisión"
            options={Object.entries(TRANSMISSION_TYPES_LABELS).map<
              { value: string; label: string }
            >(([value, label]) => ({ value, label }))}
            className={`${inputClass} ${transmissionValidation.getBorderClassName()}`}
          />
        </InputField>

        {/* TIPO DE COMBUSTIBLE */}
        <InputField
          label="Tipo de Combustible"
          required
          error={errors.fuelType}
          icon={<Fuel className="w-4 h-4 text-primary" />}
          tooltip="La gasolina es más común, pero el diesel puede ser más económico"
          success={fuelTypeValidation.isValid}
          tips={VALIDATION_CONFIG.fuelType.tips}
        >
          <SelectField
            value={formData.fuelType || ""}
            onChange={(value) => handleInputChange("fuelType", value)}
            placeholder="Selecciona combustible"
            options={Object.entries(FUEL_TYPES_LABELS).map<
              { value: string; label: string }
            >(([value, label]) => ({ value, label }))}
            className={`${inputClass} ${fuelTypeValidation.getBorderClassName()}`}
          />
        </InputField>

        {/* TRACCIÓN (Solo para no-motos) */}
        {currentCategory !== VehicleCategory.MOTORCYCLE && (
          <InputField
            label="Tracción"
            error={errors.driveType}
            icon={<Cog className="w-4 h-4 text-primary" />}
            tooltip="4x4 es ideal para terrenos difíciles, FWD para ciudad"
            success={driveTypeValidation.isValid}
            tips={VALIDATION_CONFIG.driveType.tips}
          >
            <SelectField
              value={formData.driveType || ""}
              onChange={(value) => handleInputChange("driveType", value)}
              placeholder="Selecciona tracción"
              options={Object.entries(DRIVE_TYPE_LABELS).map<
                { value: string; label: string }
              >(([value, label]) => ({ value, label }))}
              className={`${inputClass} ${driveTypeValidation.getBorderClassName()}`}
            />
          </InputField>
        )}

        {/* PUERTAS Y ASIENTOS */}
        {currentCategory &&
          [
            VehicleCategory.CAR,
            VehicleCategory.SUV,
            VehicleCategory.VAN,
            VehicleCategory.BUS,
          ].includes(currentCategory) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label="Puertas"
                required
                error={errors.doors}
                tooltip="Más puertas = mayor comodidad familiar"
                success={doorsValidation.isValid}
                tips={VALIDATION_CONFIG.doors.tips}
              >
                <input
                  type="number"
                  value={formData.doors || ""}
                  onChange={handleDoorsChange}
                  className={`${inputClass} ${doorsValidation.getBorderClassName()}`}
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
                tips={VALIDATION_CONFIG.seats.tips}
              >
                <input
                  type="number"
                  value={formData.seats || ""}
                  onChange={handleSeatsChange}
                  className={`${inputClass} ${seatsValidation.getBorderClassName()}`}
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

        {/* CAPACIDAD DE CARGA (Solo para camiones) */}
        {currentCategory === VehicleCategory.TRUCK && (
          <InputField
            label="Capacidad de Carga (kg)"
            error={errors.loadCapacity}
            icon={<Wrench className="w-4 h-4 text-primary" />}
            tooltip="Especifica la capacidad real para atraer compradores comerciales"
            success={loadCapacityValidation.isValid}
            tips={VALIDATION_CONFIG.loadCapacity.tips}
          >
            <input
              type="number"
              value={formData.loadCapacity || ""}
              onChange={handleLoadCapacityChange}
              className={`${inputClass} ${loadCapacityValidation.getBorderClassName()}`}
              placeholder="1000"
              min="0"
            />
          </InputField>
        )}

        {/* ========== VISTA PREVIA ========== */}
        {currentCategory && (
          <SpecsPreviewCard
            formData={formData}
            currentCategory={currentCategory}
          />
        )}

        {/* ========== RESUMEN DE COMPLETITUD ========== */}
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
                    ? "¡Especificaciones completas!"
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

export default Step3_Specs;