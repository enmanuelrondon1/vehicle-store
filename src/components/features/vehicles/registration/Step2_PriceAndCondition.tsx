//src/components/features/vehicles/registration/Step2_PriceAndCondition.tsx
// Step2_PriceAndCondition.tsx - VERSIÓN PROFESIONAL MEJORADA
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  DollarSign,
  Gauge,
  Shield,
  Handshake,
  Loader2,
  Info,
  Eye,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  VehicleCondition,
  WarrantyType,
  Currency,
  VEHICLE_CONDITIONS_LABELS,
  WARRANTY_LABELS,
} from "@/types/shared";
import type { VehicleDataBackend } from "@/types/types";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface FormErrors {
  [key: string]: string | undefined;
}

type FormFieldValue =
  | string
  | number
  | undefined
  | boolean
  | string[]
  | { interestRate?: number; loanTerm?: number };

interface StepProps {
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: FormFieldValue) => void;
  handleSwitchChange: (field: keyof VehicleDataBackend, checked: boolean) => void;
}

// ============================================
// CONFIGURACIÓN DE VALIDACIÓN
// ============================================
const VALIDATION_CONFIG = {
  price: {
    min: 100,
    max: 1000000,
    tips: [
      "Investiga precios similares en el mercado",
      "Un precio justo atrae más compradores",
      "Considera la depreciación por año y kilometraje",
    ],
  },
  mileage: {
    min: 0,
    max: 999999,
    tips: [
      "Kilometraje bajo aumenta el valor del vehículo",
      "El promedio anual es 15,000-20,000 km",
      "Sé honesto con el kilometraje real",
    ],
  },
  offersFinancing: {
    tips: [
      "Al activar esta opción, se mostrará una calculadora de financiamiento en tu anuncio",
      "Ayuda a los compradores a entender las opciones de pago y puede aumentar el interés",
    ],
  },
  condition: {
    tips: [
      "Sé honesto y preciso al describir la condición",
      "Usa las fotos para mostrar detalles del estado del vehículo",
      "Menciona cualquier reparación reciente o imperfección en la descripción",
    ],
  },
  warranty: {
    tips: [
      "Ofrecer una garantía, aunque sea de concesionario, genera más confianza",
      "Ten a mano la documentación que respalde la garantía",
      "Sé transparente sobre la cobertura y las exclusiones de la garantía",
    ],
  },
};

// ============================================
// COMPONENTE: Vista Previa
// ============================================
const PreviewCard: React.FC<{
  formData: Partial<VehicleDataBackend>;
  exchangeRate: number | null;
}> = ({ formData, exchangeRate }) => {
  const priceInVes = useMemo(() => {
    if (formData.price && exchangeRate && formData.currency === Currency.USD) {
      return (formData.price * exchangeRate).toLocaleString("es-VE", {
        style: "currency",
        currency: "VES",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
    return null;
  }, [formData.price, exchangeRate, formData.currency]);

  return (
    <div className="p-5 rounded-xl border-2 border-dashed border-border bg-gradient-to-br from-card via-card to-muted/20 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Eye className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          Vista Previa del Anuncio
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-sm text-muted-foreground">Precio</span>
          <div className="text-right">
            <span className="font-bold text-lg text-primary">
              {formData.price
                ? `$${formData.price.toLocaleString()} USD`
                : "No especificado"}
            </span>
            {formData.isNegotiable && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Negociable
              </Badge>
            )}
          </div>
        </div>

        {priceInVes && (
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Equivalente</span>
            <span className="font-medium text-sm text-foreground">{priceInVes}</span>
          </div>
        )}

        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-sm text-muted-foreground">Kilometraje</span>
          <span className="font-medium text-sm text-foreground">
            {formData.mileage
              ? `${formData.mileage.toLocaleString()} km`
              : "No especificado"}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-sm text-muted-foreground">Condición</span>
          <span className="font-medium text-sm text-foreground">
            {formData.condition
              ? VEHICLE_CONDITIONS_LABELS[formData.condition as VehicleCondition]
              : "No especificada"}
          </span>
        </div>

        {formData.warranty && (
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-muted-foreground">Garantía</span>
            <Badge variant="outline" className="font-medium">
              {WARRANTY_LABELS[formData.warranty as WarrantyType]}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const Step2_PriceAndCondition: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
  handleSwitchChange,
}) => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [showFinancingTips, setShowFinancingTips] = useState(false);

  // ========== Hooks de Validación ==========
  const priceValidation = useFieldValidation(formData.price, errors.price);
  const mileageValidation = useFieldValidation(formData.mileage, errors.mileage);
  const conditionValidation = useFieldValidation(formData.condition, errors.condition);
  const warrantyValidation = useFieldValidation(formData.warranty, errors.warranty);

  // ========== Clases de Input Mejoradas ==========
  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground " +
    "placeholder:text-muted-foreground/60 " +
    "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 " +
    "transition-all duration-200 ease-out hover:border-border/80";

  const inputClassSm =
    "w-full px-3 py-3 rounded-lg border-2 border-border bg-background text-sm " +
    "placeholder:text-muted-foreground/60 " +
    "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
    "transition-all duration-200";

  // ========== Cálculo de Progreso ==========
  const formProgress = useMemo(() => {
    const fields = ["price", "mileage", "condition", "warranty"];
    const completedFields = fields.filter((field) => {
      const value = formData[field as keyof typeof formData];
      return value !== undefined && value !== "" && value !== null;
    }).length;

    return (completedFields / fields.length) * 100;
  }, [formData]);

  // ========== Inicialización de Moneda ==========
  useEffect(() => {
    if (!formData.currency) {
      handleInputChange("currency", Currency.USD);
    }
  }, [formData.currency, handleInputChange]);

  // ========== Obtener Tasa de Cambio ==========
  useEffect(() => {
    const fetchRate = async () => {
      setIsLoadingRate(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/exchange-rate`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.success && data.rate) {
          setExchangeRate(data.rate);
        }
      } catch (error) {
        console.error("Error al obtener la tasa de cambio:", error);
        setExchangeRate(126.28);
      } finally {
        setIsLoadingRate(false);
      }
    };

    fetchRate();
  }, []);

  // ========== Cálculo de Precio en VES ==========
  const priceInVes = useMemo(() => {
    if (formData.price && exchangeRate && formData.currency === Currency.USD) {
      return (formData.price * exchangeRate).toLocaleString("es-VE", {
        style: "currency",
        currency: "VES",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
    return null;
  }, [formData.price, exchangeRate, formData.currency]);

  // ========== Manejadores de Cambio ==========
  const handleMileageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 8);

      if (numericValue === "") {
        handleInputChange("mileage", undefined);
      } else {
        const parsedValue = parseInt(numericValue, 10);
        if (parsedValue <= 999999) {
          handleInputChange("mileage", parsedValue);
        }
      }
    },
    [handleInputChange]
  );

  const formatMileage = (value: number | undefined): string => {
    if (!value) return "";
    return value.toLocaleString("es-VE");
  };

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const numericValue = rawValue.replace(/[^0-9]/g, "");

      if (numericValue === "") {
        handleInputChange("price", undefined);
      } else {
        const parsedValue = parseInt(numericValue, 10);
        if (!isNaN(parsedValue)) {
          handleInputChange("price", parsedValue);
        }
      }
    },
    [handleInputChange]
  );

  const formatPrice = (value: number | undefined): string => {
    return value !== undefined ? value.toLocaleString("es-VE") : "";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
      {/* ========== ENCABEZADO MEJORADO ========== */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10">
            <DollarSign className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
              Precio y Condición
            </h2>
            <p className="text-base text-muted-foreground mt-0.5">
              Define el precio y estado del vehículo
            </p>
          </div>
        </div>

        {/* ========== BARRA DE PROGRESO ========== */}
        <div className="w-full max-w-md mx-auto pt-2">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-sm font-medium text-muted-foreground">Progreso</span>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {Math.round(formProgress)}%
            </span>
          </div>
          <Progress value={formProgress} className="h-2.5 bg-muted" />
        </div>
      </div>

      {/* ========== FORMULARIO ========== */}
      <div className="space-y-7">
        {/* PRECIO */}
        <div className="space-y-3">
          <InputField
            label="Precio"
            required
            success={priceValidation.isValid}
            error={errors.price}
            icon={<DollarSign className="w-4 h-4 text-primary" />}
            tooltip="El precio debe estar en dólares estadounidenses. Se mostrará la conversión automática a bolívares"
            tips={VALIDATION_CONFIG.price.tips}
          >
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-base font-semibold text-muted-foreground">$</span>
              </div>
              <input
                type="text"
                value={formatPrice(formData.price)}
                onChange={handlePriceChange}
                className={`${inputClass} pl-9 ${priceValidation.getBorderClassName()}`}
                placeholder="25,000"
                inputMode="numeric"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-sm text-muted-foreground">USD</span>
              </div>
            </div>
          </InputField>

          {/* Tasa de Cambio */}
          {isLoadingRate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Obteniendo tasa del día...</span>
            </div>
          )}

          {priceInVes && !isLoadingRate && (
            <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-muted/30 to-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Equivalente aproximado</span>
                </div>
                <span className="text-lg font-bold text-primary">{priceInVes}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Los compradores verán ambas monedas en el anuncio
              </p>
            </div>
          )}
        </div>

        {/* PRECIO NEGOCIABLE */}
        <div className="p-4 rounded-xl border-2 border-border bg-card hover:bg-muted/20 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer group flex-1">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Handshake className={`w-5 h-5 transition-colors ${
                  formData.isNegotiable ? "text-primary" : "text-muted-foreground"
                }`} />
              </div>
              <div className="flex-1">
                <span className="text-base font-semibold text-foreground block">
                  ¿Precio Negociable?
                </span>
                <span className="text-sm text-muted-foreground">
                  Permite a los compradores hacer ofertas
                </span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Marcar como negociable puede atraer más compradores interesados</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <Switch
              checked={formData.isNegotiable || false}
              onCheckedChange={(checked) => handleSwitchChange("isNegotiable", checked)}
            />
          </div>
        </div>

        {/* FINANCIACIÓN */}
        <div className="space-y-3">
          <div className="p-4 rounded-xl border-2 border-border bg-card hover:bg-muted/20 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group flex-1">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <DollarSign className={`w-5 h-5 transition-colors ${
                    formData.offersFinancing ? "text-primary" : "text-muted-foreground"
                  }`} />
                </div>
                <div className="flex-1">
                  <span className="text-base font-semibold text-foreground block">
                    ¿Ofrece Financiación?
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Muestra una calculadora de cuotas en el anuncio
                  </span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Activa esta opción si ofreces facilidades de pago</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <Switch
                checked={formData.offersFinancing || false}
                onCheckedChange={(checked) => handleSwitchChange("offersFinancing", checked)}
              />
            </div>
          </div>

          {/* Tips de Financiación */}
          {formData.offersFinancing && (
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Consejos sobre Financiación
              </h4>
              <ul className="space-y-1.5">
                {VALIDATION_CONFIG.offersFinancing.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 font-bold">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Detalles de Financiación */}
          {formData.offersFinancing && (
            <div className="p-5 rounded-xl border-2 border-border bg-muted/30 space-y-5">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Detalles de la Financiación
              </h3>

              <InputField
                label="Tasa de Interés Anual (%)"
                error={errors["financingDetails.interestRate"]}
                required
              >
                <input
                  type="number"
                  value={formData.financingDetails?.interestRate || ""}
                  onChange={(e) =>
                    handleInputChange("financingDetails", {
                      ...formData.financingDetails,
                      interestRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Ej: 18"
                  className={inputClassSm}
                  step="0.1"
                  min="0"
                  max="100"
                />
              </InputField>
              <InputField
                label="Plazo Máximo del Préstamo (meses)"
                error={errors["financingDetails.loanTerm"]}
                required
              >
                <input
                  type="number"
                  value={formData.financingDetails?.loanTerm || ""}
                  onChange={(e) =>
                    handleInputChange("financingDetails", {
                      ...formData.financingDetails,
                      loanTerm: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  placeholder="Ej: 36"
                  className={inputClassSm}
                  min="1"
                  max="120"
                />
              </InputField>
            </div>
          )}
        </div>

        {/* KILOMETRAJE */}
        <InputField
          label="Kilometraje"
          required
          success={mileageValidation.isValid}
          error={errors.mileage}
          icon={<Gauge className="w-4 h-4 text-primary" />}
          tooltip="Introduce el kilometraje actual del vehículo. Se formatará automáticamente"
          tips={VALIDATION_CONFIG.mileage.tips}
        >
          <div className="relative">
            <input
              type="text"
              value={formatMileage(formData.mileage)}
              onChange={handleMileageChange}
              className={`${inputClass} pr-12 ${mileageValidation.getBorderClassName()}`}
              placeholder="85,000"
              inputMode="numeric"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <span className="text-sm text-muted-foreground">km</span>
            </div>
          </div>
        </InputField>

        {/* CONDICIÓN */}
        <InputField
          label="Condición"
          required
          success={conditionValidation.isValid}
          error={errors.condition}
          icon={<Shield className="w-4 h-4 text-primary" />}
          tooltip="La condición del vehículo afecta significativamente su valor de mercado"
          tips={VALIDATION_CONFIG.condition.tips}
        >
          <SelectField
            value={formData.condition || ""}
            onChange={(value) => handleInputChange("condition", value)}
            options={[VehicleCondition.EXCELLENT, VehicleCondition.GOOD].map((c) => ({
              value: c,
              label: VEHICLE_CONDITIONS_LABELS[c],
            }))}
            placeholder="Selecciona la condición"
            error={errors.condition}
            className={`${inputClass} ${conditionValidation.getBorderClassName()}`}
          />
        </InputField>

        {/* GARANTÍA */}
        <InputField
          label="Garantía"
          error={errors.warranty}
          success={warrantyValidation.isValid}
          icon={<Shield className="w-4 h-4 text-primary" />}
          tooltip="Informa si el vehículo tiene alguna garantía vigente"
          tips={VALIDATION_CONFIG.warranty.tips}
        >
          <SelectField
            value={formData.warranty || ""}
            onChange={(value) => handleInputChange("warranty", value)}
            options={Object.values(WarrantyType).map((w) => ({
              value: w,
              label: WARRANTY_LABELS[w],
            }))}
            placeholder="Selecciona tipo de garantía"
            error={errors.warranty}
            className={`${inputClass} ${warrantyValidation.getBorderClassName()}`}
          />
        </InputField>

        {/* ========== VISTA PREVIA ========== */}
        <PreviewCard formData={formData} exchangeRate={exchangeRate} />

        {/* ========== RESUMEN DE COMPLETITUD ========== */}
        <div
          className={`p-5 rounded-xl border-2 shadow-sm transition-all duration-300 ${
            formProgress >= 100
              ? "border-green-500/40 bg-green-50/50 dark:bg-green-950/20"
              : "border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div 
                className={`p-2 rounded-lg ${
                  formProgress >= 100 ? "bg-green-500/20" : "bg-amber-500/20"
                }`}
              >
                {formProgress >= 100 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div>
                <p className="font-semibold text-foreground text-base">
                  {formProgress >= 100
                    ? "¡Información de precio completa!"
                    : "Faltan algunos campos"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {formProgress >= 100
                    ? "Puedes continuar al siguiente paso"
                    : `${Math.round(formProgress)}% completado`}
                </p>
              </div>
            </div>
            <Badge
              variant={formProgress >= 100 ? "default" : "secondary"}
              className="text-sm font-bold px-3 py-1"
            >
              {Math.round(formProgress)}%
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_PriceAndCondition;