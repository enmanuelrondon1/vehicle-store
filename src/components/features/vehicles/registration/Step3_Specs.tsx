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
  Zap,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import { COMMON_COLORS } from "@/constants/form-constants";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  color: {
    tips: [
      "🤍 Blanco, gris y negro tienen mayor demanda",
      "💎 Colores metálicos conservan mejor su valor",
      "🌈 Colores llamativos pueden reducir el mercado potencial",
    ],
  },
  vin: {
    tips: [
      "🔍 El VIN es como el DNI de un vehículo",
      "📜 Permite verificar el historial de accidentes, robos y mantenimientos",
      "🔒 Proporcionarlo aumenta la confianza del comprador",
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
// SUB-COMPONENTE: Encabezado y Progreso
// ============================================
const FormHeader: React.FC<{ progress: number }> = React.memo(({ progress }) => (
  <div className="text-center space-y-6">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl"></div>
      <div className="relative flex items-center justify-center gap-4 p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 border border-border/50 shadow-glass">
        <div className="p-4 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10">
          <Settings className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="text-left">
          <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
            Especificaciones Técnicas
          </h2>
          <p className="text-base text-muted-foreground mt-1">
            Detalles técnicos del vehículo
          </p>
        </div>
      </div>
    </div>
    
    <div className="w-full max-w-md mx-auto pt-2">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-sm font-medium text-muted-foreground">Progreso</span>
        <span className="text-sm font-bold text-foreground tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>
      <Progress value={progress} variant="glow" className="h-3 bg-muted" />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">Completando información</span>
        <span className="text-xs text-muted-foreground">Paso 3 de 5</span>
      </div>
    </div>
  </div>
));
FormHeader.displayName = "FormHeader";

// ============================================
// SUB-COMPONENTE: Vista Previa de Especificaciones
// ============================================
const SpecsPreviewCard: React.FC<{
  formData: Partial<VehicleDataBackend>;
  currentCategory: VehicleCategory;
}> = React.memo(({ formData, currentCategory }) => {
  return (
    <Card className="card-glass border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Eye className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Vista Previa de Especificaciones
            </h3>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {formData.color && (
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Color</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>
                <span className="font-medium text-sm text-foreground">
                  {formData.color}
                </span>
              </div>
            </div>
          )}

          {formData.vin && (
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">VIN</span>
              <span className="font-medium text-sm text-foreground font-mono tracking-wider">
                {formData.vin}
              </span>
            </div>
          )}

          {formData.displacement && (
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Cilindraje</span>
              <span className="font-medium text-sm text-foreground">
                {formData.displacement}
              </span>
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
              <span className="font-medium text-sm text-foreground">
                {formData.doors}
              </span>
            </div>
          )}

          {formData.seats && (
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Asientos</span>
              <span className="font-medium text-sm text-foreground">
                {formData.seats}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
SpecsPreviewCard.displayName = "SpecsPreviewCard";

// ============================================
// SUB-COMPONENTE: Resumen de Completitud
// ============================================
const CompletionSummary: React.FC<{ progress: number }> = React.memo(({ progress }) => {
  const isComplete = progress >= 100;
  const borderColor = isComplete ? "border-success/40" : "border-amber-500/40";
  const bgColor = isComplete ? "bg-success/5 dark:bg-success/5" : "bg-amber-500/5 dark:bg-amber-950/20";
  const iconBgColor = isComplete ? "bg-success/20" : "bg-amber-500/20";
  const textColor = isComplete ? "text-success" : "text-amber-600 dark:text-amber-400";

  return (
    <div className={`p-5 rounded-xl border-2 shadow-sm transition-all duration-300 ${borderColor} ${bgColor} card-hover`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconBgColor}`}>
            {isComplete ? (
              <CheckCircle2 className={`w-5 h-5 ${textColor}`} />
            ) : (
              <AlertCircle className={`w-5 h-5 ${textColor}`} />
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground text-base">
              {isComplete ? "¡Especificaciones completas!" : "Faltan algunos campos"}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isComplete ? "Puedes continuar al siguiente paso" : `${Math.round(progress)}% completado`}
            </p>
          </div>
        </div>
        <Badge variant={isComplete ? "default" : "secondary"} className="text-sm font-bold px-3 py-1">
          {Math.round(progress)}%
        </Badge>
      </div>
      
      {!isComplete && (
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
});
CompletionSummary.displayName = "CompletionSummary";

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
  const colorValidation = useFieldValidation(formData.color, errors.color);
  const vinValidation = useFieldValidation(formData.vin, errors.vin);
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
    const requiredFields = ["color", "transmission", "fuelType"];
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
        <Card className="card-glass border-border/50">
          <CardContent className="p-8 text-center">
            <div className="p-3 rounded-full bg-muted/50 w-fit mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Categoría no seleccionada
            </h3>
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
      <FormHeader progress={progressPercentage} />

      <div className="space-y-7">
        {/* COLOR Y CILINDRAJE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Color"
            required
            error={errors.color}
            success={colorValidation.isValid}
            icon={
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500" />
            }
            tooltip="Los colores neutros (blanco, gris, negro) suelen tener mejor demanda"
            tips={VALIDATION_CONFIG.color.tips}
          >
            <SelectField
              value={formData.color || ""}
              onValueChange={(value) => handleInputChange("color", value)}
              placeholder="Selecciona un color"
              options={COMMON_COLORS.map((c) => ({ value: c, label: c }))}
              className={`${inputClass} ${colorValidation.getBorderClassName()}`}
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
          </InputField>

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
              onValueChange={(value) => handleInputChange("displacement", value)}
              placeholder="Selecciona cilindraje"
              options={generateDisplacementOptions().map((d) => ({
                value: d,
                label: d,
              }))}
              className={`${inputClass} ${displacementValidation.getBorderClassName()}`}
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
          </InputField>
        </div>

        {/* MOTOR Y VIN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <InputField
            label="VIN (Opcional)"
            error={errors.vin}
            icon={<Info className="w-4 h-4 text-primary" />}
            tooltip="Número de Identificación Vehicular. 17 caracteres únicos."
            success={vinValidation.isValid}
            counter={{ current: formData.vin?.length || 0, max: 17 }}
            tips={VALIDATION_CONFIG.vin.tips}
          >
            <input
              type="text"
              value={formData.vin || ""}
              onChange={(e) =>
                handleInputChange("vin", e.target.value.toUpperCase())
              }
              className={`${inputClass} ${vinValidation.getBorderClassName()} uppercase`}
              placeholder="Ej: 1G4AND4F6DF1XXXXX"
              maxLength={17}
            />
          </InputField>
        </div>

        {/* TRANSMISIÓN Y COMBUSTIBLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              onValueChange={(value) => handleInputChange("transmission", value)}
              placeholder="Selecciona transmisión"
              options={Object.entries(TRANSMISSION_TYPES_LABELS).map(
                ([value, label]) => ({ value, label })
              )}
              className={`${inputClass} ${transmissionValidation.getBorderClassName()}`}
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
          </InputField>

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
              onValueChange={(value) => handleInputChange("fuelType", value)}
              placeholder="Selecciona combustible"
              options={Object.entries(FUEL_TYPES_LABELS).map(
                ([value, label]) => ({ value, label })
              )}
              className={`${inputClass} ${fuelTypeValidation.getBorderClassName()}`}
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
          </InputField>
        </div>

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
              onValueChange={(value) => handleInputChange("driveType", value)}
              placeholder="Selecciona tracción"
              options={Object.entries(DRIVE_TYPE_LABELS).map(
                ([value, label]) => ({ value, label })
              )}
              className={`${inputClass} ${driveTypeValidation.getBorderClassName()}`}
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* VISTA PREVIA */}
        <SpecsPreviewCard
          formData={formData}
          currentCategory={currentCategory}
        />
        
        {/* RESUMEN DE COMPLETITUD */}
        <CompletionSummary progress={progressPercentage} />
      </div>
    </div>
  );
};

export default Step3_Specs;