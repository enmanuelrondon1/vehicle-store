// src/components/features/vehicles/registration/Step3_Specs.tsx
"use client";
import React, { useMemo, useCallback } from "react";
import {
  Settings,
  Fuel,
  Wrench,
  Gauge,
  Cog,
  AlertCircle,
  Eye,
  Info,
  ChevronDown,
  PenLine,
} from "lucide-react";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import CompletionSummary from "@/components/shared/forms/CompletionSummary";
import { COMMON_COLORS } from "@/constants/form-constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import type { VehicleDataBackend, FormErrors } from "@/types/types";
import {
  VehicleCategory,
  DRIVE_TYPE_LABELS,
  TRANSMISSION_TYPES_LABELS,
  FUEL_TYPES_LABELS,
  TransmissionType,
  FuelType,
} from "@/types/types";

// ===========================================
// TIPOS
// ===========================================
type FormFieldValue = string | number | undefined;

interface StepProps {
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: FormFieldValue) => void;
}

// ===========================================
// CONSTANTES
// ===========================================
const INPUT_CLASS =
  "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground " +
  "placeholder:text-muted-foreground/60 " +
  "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 " +
  "transition-all duration-200 ease-out hover:border-border/80";

const INPUT_CLASS_OTHER =
  "w-full px-4 py-3 rounded-xl border-2 border-primary/40 bg-primary/5 text-foreground " +
  "placeholder:text-muted-foreground/60 " +
  "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
  "transition-all duration-200 ease-out text-sm";

const CATEGORIES_WITH_DOORS = [
  VehicleCategory.CAR,
  VehicleCategory.SUV,
  VehicleCategory.VAN,
  VehicleCategory.BUS,
];

const MAX_SEATS: Partial<Record<VehicleCategory, number>> = {
  [VehicleCategory.BUS]: 50,
  [VehicleCategory.VAN]: 15,
  [VehicleCategory.SUV]: 8,
};

// ✅ Colores con "Otro" al final
const COLORS_WITH_OTHER = [...COMMON_COLORS, "Otro"];

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
      "🔵 Gas/GNV = muy económico en Venezuela",
      "🚛 Diesel = mayor eficiencia en distancias largas",
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
};

interface PreviewRow {
  key: keyof VehicleDataBackend;
  label: string;
  badge: boolean;
  mono?: boolean;
  skipMoto?: boolean;
  labelMap?: Record<string, string>;
  otherKey?: keyof VehicleDataBackend; // campo alternativo si valor = "Otro" / "other"
}

const PREVIEW_ROWS: PreviewRow[] = [
  { key: "color", label: "Color", badge: false, otherKey: "colorOther" },
  { key: "vin", label: "VIN", badge: false, mono: true },
  {
    key: "displacement",
    label: "Cilindraje",
    badge: false,
    otherKey: "displacementOther",
  },
  {
    key: "transmission",
    label: "Transmisión",
    badge: true,
    labelMap: TRANSMISSION_TYPES_LABELS,
    otherKey: "transmissionOther",
  },
  {
    key: "fuelType",
    label: "Combustible",
    badge: true,
    labelMap: FUEL_TYPES_LABELS,
    otherKey: "fuelTypeOther",
  },
  {
    key: "driveType",
    label: "Tracción",
    badge: false,
    labelMap: DRIVE_TYPE_LABELS,
    skipMoto: true,
  },
  { key: "doors", label: "Puertas", badge: false },
  { key: "seats", label: "Asientos", badge: false },
];

// ===========================================
// SUB-COMPONENTE: Campo "Otro" condicional
// Aparece con animación cuando se selecciona "Otro"
// ===========================================
const OtherField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  maxLength?: number;
}> = ({ value, onChange, placeholder, error, maxLength = 50 }) => (
  <div className="mt-2 animate-fade-in">
    <div className="flex items-center gap-2 mb-1.5">
      <PenLine className="w-3.5 h-3.5 text-primary" />
      <span className="text-xs text-primary font-medium">Especifica cuál:</span>
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${INPUT_CLASS_OTHER} ${error ? "border-destructive" : ""}`}
      placeholder={placeholder}
      maxLength={maxLength}
      autoFocus
    />
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

// ===========================================
// SUB-COMPONENTE: Vista Previa
// ===========================================
const SpecsPreviewCard: React.FC<{
  formData: Partial<VehicleDataBackend>;
  currentCategory: VehicleCategory;
}> = React.memo(({ formData, currentCategory }) => {
  const rows = PREVIEW_ROWS.filter(({ key, skipMoto }) => {
    if (skipMoto && currentCategory === VehicleCategory.MOTORCYCLE)
      return false;
    return !!formData[key as keyof VehicleDataBackend];
  });

  if (rows.length === 0) return null;

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
          {rows.map(({ key, label, badge, mono, labelMap, otherKey }, i) => {
            const raw = formData[key as keyof VehicleDataBackend] as string;
            // Si el valor es "Otro"/"other", mostrar el campo personalizado
            const isOther = raw === "Otro" || raw === "other";
            const otherValue = otherKey
              ? (formData[otherKey] as string)
              : undefined;
            const displayValue =
              isOther && otherValue
                ? otherValue
                : labelMap
                  ? ((labelMap as Record<string, string>)[raw] ?? raw)
                  : raw;

            if (!displayValue) return null;

            return (
              <div
                key={key}
                className={`flex justify-between items-center py-2 ${i < rows.length - 1 ? "border-b border-border/50" : ""}`}
              >
                <span className="text-sm text-muted-foreground">{label}</span>
                {badge ? (
                  <Badge variant="outline" className="font-medium">
                    {displayValue}
                  </Badge>
                ) : (
                  <span
                    className={`font-medium text-sm text-foreground ${mono ? "font-mono tracking-wider" : ""}`}
                  >
                    {displayValue}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});
SpecsPreviewCard.displayName = "SpecsPreviewCard";

// ===========================================
// COMPONENTE PRINCIPAL
// ===========================================
const Step3_Specs: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const currentCategory = formData.category as VehicleCategory | undefined;

  const colorValidation = useFieldValidation(formData.color, errors.color);
  const colorOtherValidation = useFieldValidation(
    formData.colorOther,
    errors.colorOther,
  );
  const vinValidation = useFieldValidation(formData.vin, errors.vin);
  const displacementValidation = useFieldValidation(
    formData.displacement,
    errors.displacement,
  );
  const displacementOtherValidation = useFieldValidation(
    formData.displacementOther,
    errors.displacementOther,
  );
  const engineValidation = useFieldValidation(formData.engine, errors.engine);
  const transmissionValidation = useFieldValidation(
    formData.transmission,
    errors.transmission,
  );
  const transmissionOtherValidation = useFieldValidation(
    formData.transmissionOther,
    errors.transmissionOther,
  );
  const fuelTypeValidation = useFieldValidation(
    formData.fuelType,
    errors.fuelType,
  );
  const fuelTypeOtherValidation = useFieldValidation(
    formData.fuelTypeOther,
    errors.fuelTypeOther,
  );
  const driveTypeValidation = useFieldValidation(
    formData.driveType,
    errors.driveType,
  );
  const doorsValidation = useFieldValidation(formData.doors, errors.doors);
  const seatsValidation = useFieldValidation(formData.seats, errors.seats);
  const loadCapacityValidation = useFieldValidation(
    formData.loadCapacity,
    errors.loadCapacity,
  );

  // ✅ Cilindraje con "Otro" al final
  const displacementOptions = useMemo(() => {
    const base =
      currentCategory === VehicleCategory.MOTORCYCLE
        ? [
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
          ]
        : [
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
          ].map((d) => `${d}L`);
    return [...base, "Otro"];
  }, [currentCategory]);

  const { progressPercentage } = useMemo(() => {
    // ✅ Puertas y asientos ya no son requeridos para el progreso
    const requiredFields = ["color", "transmission", "fuelType"];
    const completed = requiredFields.filter((f) => {
      const v = formData[f as keyof VehicleDataBackend];
      return v !== undefined && v !== "" && v !== null;
    }).length;
    return { progressPercentage: (completed / requiredFields.length) * 100 };
  }, [formData]);

  const createNumericInputHandler = useCallback(
    (
      field: keyof VehicleDataBackend,
      options: { maxLength?: number; isFloat?: boolean } = {},
    ) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(
          options.isFloat ? /[^0-9.]/g : /[^0-9]/g,
          "",
        );
        const trimmed = options.maxLength
          ? numericValue.slice(0, options.maxLength)
          : numericValue;
        if (trimmed === "") return handleInputChange(field, undefined);
        const parsed = options.isFloat
          ? parseFloat(trimmed)
          : parseInt(trimmed, 10);
        handleInputChange(field, isNaN(parsed) ? undefined : parsed);
      },
    [handleInputChange],
  );

  const handleDoorsChange = createNumericInputHandler("doors");
  const handleSeatsChange = createNumericInputHandler("seats");
  const handleLoadCapacityChange = createNumericInputHandler("loadCapacity", {
    isFloat: true,
  });

  // Flags "Otro" seleccionado
  const isColorOther = formData.color === "Otro";
  const isDisplacementOther = formData.displacement === "Otro";
  const isTransmissionOther = formData.transmission === TransmissionType.OTHER;
  const isFuelTypeOther = formData.fuelType === FuelType.OTHER;

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
              Por favor, regresa al paso 1 y selecciona una categoría para
              continuar.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasDoors = CATEGORIES_WITH_DOORS.includes(currentCategory);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
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
              onValueChange={(value) => {
                handleInputChange("color", value);
                if (value !== "Otro") handleInputChange("colorOther", "");
              }}
              placeholder="Selecciona un color"
              options={COLORS_WITH_OTHER.map((c) => ({ value: c, label: c }))}
              className={`${INPUT_CLASS} ${colorValidation.getBorderClassName()}`}
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
            {isColorOther && (
              <OtherField
                value={formData.colorOther || ""}
                onChange={(v) => handleInputChange("colorOther", v)}
                placeholder="Ej: Dorado, Vino Tinto Perlado, Azul Marino..."
                error={errors.colorOther}
                maxLength={30}
              />
            )}
          </InputField>

          <InputField
            label={
              currentCategory === VehicleCategory.MOTORCYCLE
                ? "Cilindraje"
                : "Cilindraje del Motor"
            }
            error={errors.displacement}
            success={displacementValidation.isValid}
            icon={<Gauge className="w-4 h-4 text-primary" />}
            tooltip={
              currentCategory === VehicleCategory.MOTORCYCLE
                ? "125cc-150cc son los más populares en Venezuela"
                : "El cilindraje afecta el consumo y potencia"
            }
            tips={
              currentCategory === VehicleCategory.MOTORCYCLE
                ? VALIDATION_CONFIG.displacement.motorcycle
                : VALIDATION_CONFIG.displacement.car
            }
          >
            <SelectField
              value={formData.displacement || ""}
              onValueChange={(value) => {
                handleInputChange("displacement", value);
                if (value !== "Otro")
                  handleInputChange("displacementOther", "");
              }}
              placeholder="Selecciona cilindraje"
              options={displacementOptions.map((d) => ({ value: d, label: d }))}
              className={`${INPUT_CLASS} ${displacementValidation.getBorderClassName()}`}
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
            {isDisplacementOther && (
              <OtherField
                value={formData.displacementOther || ""}
                onChange={(v) => handleInputChange("displacementOther", v)}
                placeholder={
                  currentCategory === VehicleCategory.MOTORCYCLE
                    ? "Ej: 180cc, 650cc..."
                    : "Ej: 2.8L, 6.2L..."
                }
                error={errors.displacementOther}
                maxLength={20}
              />
            )}
          </InputField>
        </div>

        {/* MOTOR Y VIN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Motor (Opcional)"
            error={errors.engine}
            success={engineValidation.isValid}
            icon={<Wrench className="w-4 h-4 text-primary" />}
            tooltip="Incluye detalles como V6, Turbo, DOHC para mayor atractivo"
            counter={{ current: formData.engine?.length || 0, max: 100 }}
            tips={VALIDATION_CONFIG.engine.tips}
          >
            <input
              type="text"
              value={formData.engine || ""}
              onChange={(e) => handleInputChange("engine", e.target.value)}
              className={`${INPUT_CLASS} ${engineValidation.getBorderClassName()}`}
              placeholder="Ej: V6, Turbo, DOHC, Inyección Directa"
              maxLength={100}
            />
          </InputField>

          <InputField
            label="VIN (Opcional)"
            error={errors.vin}
            success={vinValidation.isValid}
            icon={<Info className="w-4 h-4 text-primary" />}
            tooltip="Número de Identificación Vehicular. 17 caracteres únicos."
            counter={{ current: formData.vin?.length || 0, max: 17 }}
            tips={VALIDATION_CONFIG.vin.tips}
          >
            <input
              type="text"
              value={formData.vin || ""}
              onChange={(e) =>
                handleInputChange("vin", e.target.value.toUpperCase())
              }
              className={`${INPUT_CLASS} ${vinValidation.getBorderClassName()} uppercase`}
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
            success={transmissionValidation.isValid}
            icon={<Settings className="w-4 h-4 text-primary" />}
            tooltip="La transmisión manual suele ser más económica de mantener"
            tips={VALIDATION_CONFIG.transmission.tips}
          >
            <SelectField
              value={formData.transmission || ""}
              onValueChange={(value) => {
                handleInputChange("transmission", value);
                if (value !== TransmissionType.OTHER)
                  handleInputChange("transmissionOther", "");
              }}
              placeholder="Selecciona transmisión"
              options={Object.entries(TRANSMISSION_TYPES_LABELS).map(
                ([value, label]) => ({ value, label }),
              )}
              className={`${INPUT_CLASS} ${transmissionValidation.getBorderClassName()}`}
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
            {isTransmissionOther && (
              <OtherField
                value={formData.transmissionOther || ""}
                onChange={(v) => handleInputChange("transmissionOther", v)}
                placeholder="Ej: Semi-automática, Secuencial..."
                error={errors.transmissionOther}
              />
            )}
          </InputField>

          <InputField
            label="Tipo de Combustible"
            required
            error={errors.fuelType}
            success={fuelTypeValidation.isValid}
            icon={<Fuel className="w-4 h-4 text-primary" />}
            tooltip="Gas/GNV es muy común y económico en Venezuela"
            tips={VALIDATION_CONFIG.fuelType.tips}
          >
            <SelectField
              value={formData.fuelType || ""}
              onValueChange={(value) => {
                handleInputChange("fuelType", value);
                if (value !== FuelType.OTHER)
                  handleInputChange("fuelTypeOther", "");
              }}
              placeholder="Selecciona combustible"
              options={Object.entries(FUEL_TYPES_LABELS).map(
                ([value, label]) => ({ value, label }),
              )}
              className={`${INPUT_CLASS} ${fuelTypeValidation.getBorderClassName()}`}
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
            {isFuelTypeOther && (
              <OtherField
                value={formData.fuelTypeOther || ""}
                onChange={(v) => handleInputChange("fuelTypeOther", v)}
                placeholder="Ej: Hidrógeno, Metanol..."
                error={errors.fuelTypeOther}
              />
            )}
          </InputField>
        </div>

        {/* TRACCIÓN */}
        {currentCategory !== VehicleCategory.MOTORCYCLE && (
          <InputField
            label="Tracción (Opcional)"
            error={errors.driveType}
            success={driveTypeValidation.isValid}
            icon={<Cog className="w-4 h-4 text-primary" />}
            tooltip="4x4 es ideal para terrenos difíciles, FWD para ciudad"
            tips={VALIDATION_CONFIG.driveType.tips}
          >
            <SelectField
              value={formData.driveType || ""}
              onValueChange={(value) => handleInputChange("driveType", value)}
              placeholder="Selecciona tracción"
              options={Object.entries(DRIVE_TYPE_LABELS).map(
                ([value, label]) => ({ value, label }),
              )}
              className={`${INPUT_CLASS} ${driveTypeValidation.getBorderClassName()}`}
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
          </InputField>
        )}

        {/* PUERTAS Y ASIENTOS — ✅ Ahora opcionales */}
        {hasDoors && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Puertas (Opcional)"
              error={errors.doors}
              success={doorsValidation.isValid}
              tooltip="Más puertas = mayor comodidad familiar"
              tips={VALIDATION_CONFIG.doors.tips}
            >
              <input
                type="number"
                value={formData.doors ?? ""}
                onChange={handleDoorsChange}
                className={`${INPUT_CLASS} ${doorsValidation.getBorderClassName()}`}
                placeholder="Ej: 4"
                min="1"
                max="10"
              />
            </InputField>

            <InputField
              label="Asientos (Opcional)"
              error={errors.seats}
              success={seatsValidation.isValid}
              tooltip="Considera el uso: familiar, comercial, transporte"
              tips={VALIDATION_CONFIG.seats.tips}
            >
              <input
                type="number"
                value={formData.seats ?? ""}
                onChange={handleSeatsChange}
                className={`${INPUT_CLASS} ${seatsValidation.getBorderClassName()}`}
                placeholder="Ej: 5"
                min="1"
                max={MAX_SEATS[currentCategory] ?? 9}
              />
            </InputField>
          </div>
        )}

        {/* CAPACIDAD DE CARGA */}
        {currentCategory === VehicleCategory.TRUCK && (
          <InputField
            label="Capacidad de Carga (kg)"
            error={errors.loadCapacity}
            success={loadCapacityValidation.isValid}
            icon={<Wrench className="w-4 h-4 text-primary" />}
            tooltip="Especifica la capacidad real para atraer compradores comerciales"
            tips={VALIDATION_CONFIG.loadCapacity.tips}
          >
            <input
              type="number"
              value={formData.loadCapacity || ""}
              onChange={handleLoadCapacityChange}
              className={`${INPUT_CLASS} ${loadCapacityValidation.getBorderClassName()}`}
              placeholder="1000"
              min="0"
            />
          </InputField>
        )}

        <SpecsPreviewCard
          formData={formData}
          currentCategory={currentCategory}
        />

        <CompletionSummary
          progress={progressPercentage}
          completeLabel="¡Especificaciones completas!"
        />
      </div>
    </div>
  );
};

export default Step3_Specs;
