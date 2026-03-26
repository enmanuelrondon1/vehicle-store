// src/components/features/vehicles/registration/Step2_PriceAndCondition.tsx
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
  Zap,
  Sparkles,
  ChevronDown,
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import CompletionSummaryShared from "@/components/shared/forms/CompletionSummary";
import MarketPriceReference from "./MarketPriceReference";

// ===========================================
// TIPOS
// ===========================================
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
  handleSwitchChange: (
    field: keyof VehicleDataBackend,
    checked: boolean,
  ) => void;
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

const INPUT_CLASS_SM =
  "w-full px-3 py-3 rounded-lg border-2 border-border bg-background text-sm " +
  "placeholder:text-muted-foreground/60 " +
  "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
  "transition-all duration-200";

const VALIDATION_CONFIG = {
  price: {
    tips: [
      "Investiga precios similares en el mercado",
      "Un precio justo atrae más compradores",
      "Considera la depreciación por año y kilometraje",
    ],
  },
  mileage: {
    tips: [
      "Kilometraje bajo aumenta el valor del vehículo",
      "El promedio anual es 15,000-20,000 km",
      "Sé honesto con el kilometraje real",
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
  financing: {
    tips: [
      "Al activar esta opción, se mostrará una calculadora de financiamiento en tu anuncio",
      "Ayuda a los compradores a entender las opciones de pago y puede aumentar el interés",
    ],
  },
};

// ✅ ANTES: dos Cards idénticas en estructura. AHORA: array de configuración.
const TOGGLE_OPTIONS = [
  {
    field: "isNegotiable" as keyof VehicleDataBackend,
    icon: Handshake,
    color: "primary",
    title: "¿Precio Negociable?",
    subtitle: "Permite a los compradores hacer ofertas",
    tooltip: "Marcar como negociable puede atraer más compradores interesados",
  },
  {
    field: "offersFinancing" as keyof VehicleDataBackend,
    icon: DollarSign,
    color: "accent",
    title: "¿Ofrece Financiación?",
    subtitle: "Muestra una calculadora de cuotas",
    tooltip: "Activa esta opción si ofreces facilidades de pago",
  },
];

// ===========================================
// SUB-COMPONENTE: Vista Previa
// ===========================================
const PreviewCard: React.FC<{
  formData: Partial<VehicleDataBackend>;
  exchangeRate: number | null;
}> = React.memo(({ formData, exchangeRate }) => {
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
    <Card className="card-glass border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-accent/20">
              <Eye className="w-4 h-4 text-accent" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Vista Previa del Anuncio
            </h3>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {[
            {
              label: "Precio",
              value: formData.price
                ? `$${formData.price.toLocaleString()} USD`
                : "No especificado",
              extra: formData.isNegotiable ? (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Negociable
                </Badge>
              ) : null,
              bold: true,
            },
            ...(priceInVes
              ? [{ label: "Equivalente", value: priceInVes }]
              : []),
            {
              label: "Kilometraje",
              value: formData.mileage
                ? `${formData.mileage.toLocaleString()} km`
                : "No especificado",
            },
            {
              label: "Condición",
              value: formData.condition
                ? VEHICLE_CONDITIONS_LABELS[
                    formData.condition as VehicleCondition
                  ]
                : "No especificada",
            },
          ].map(({ label, value, extra, bold }, i, arr) => (
            <div
              key={label}
              className={`flex justify-between items-center py-2 ${i < arr.length - 1 ? "border-b border-border/50" : ""}`}
            >
              <span className="text-sm text-muted-foreground">{label}</span>
              <div className="flex items-center">
                <span
                  className={`${bold ? "font-bold text-lg text-primary" : "font-medium text-sm text-foreground"}`}
                >
                  {value}
                </span>
                {extra}
              </div>
            </div>
          ))}
          {formData.warranty && (
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Garantía</span>
              <Badge variant="outline" className="font-medium">
                {WARRANTY_LABELS[formData.warranty as WarrantyType]}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
PreviewCard.displayName = "PreviewCard";

// ===========================================
// COMPONENTE PRINCIPAL
// ✅ FormHeader eliminado (ya existe en VehicleRegistrationForm)
// ✅ PriceCard eliminado (wrapper sin valor, campos inline)
// ✅ OptionsCard eliminado, reemplazado por loop sobre TOGGLE_OPTIONS
// ✅ FinancingDetails fusionado (dos bloques offersFinancing → uno)
// ✅ INPUT_CLASS deduplicado (estaba definido dos veces)
// ===========================================
const Step2_PriceAndCondition: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
  handleSwitchChange,
}) => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  const priceValidation = useFieldValidation(formData.price, errors.price);
  const mileageValidation = useFieldValidation(
    formData.mileage,
    errors.mileage,
  );
  const conditionValidation = useFieldValidation(
    formData.condition,
    errors.condition,
  );
  const warrantyValidation = useFieldValidation(
    formData.warranty,
    errors.warranty,
  );

  const formProgress = useMemo(() => {
    const fields = ["price", "mileage", "condition", "warranty"];
    const completed = fields.filter((field) => {
      const value = formData[field as keyof typeof formData];
      return value !== undefined && value !== "" && value !== null;
    }).length;
    return (completed / fields.length) * 100;
  }, [formData]);

  // Inicializar moneda
  useEffect(() => {
    if (!formData.currency) handleInputChange("currency", Currency.USD);
  }, [formData.currency, handleInputChange]);

  // Obtener tasa de cambio
  useEffect(() => {
    const fetchRate = async () => {
      setIsLoadingRate(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/exchange-rate`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.success && data.rate) setExchangeRate(data.rate);
      } catch {
        setExchangeRate(126.28);
      } finally {
        setIsLoadingRate(false);
      }
    };
    fetchRate();
  }, []);

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

  const handleMileageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
      if (numericValue === "") return handleInputChange("mileage", undefined);
      const parsed = parseInt(numericValue, 10);
      if (parsed <= 999999) handleInputChange("mileage", parsed);
    },
    [handleInputChange],
  );

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = e.target.value.replace(/[^0-9]/g, "");
      if (numericValue === "") return handleInputChange("price", undefined);
      const parsed = parseInt(numericValue, 10);
      if (!isNaN(parsed)) handleInputChange("price", parsed);
    },
    [handleInputChange],
  );

  const formatPrice = (v: number | undefined) =>
    v !== undefined ? v.toLocaleString("es-VE") : "";
  const formatMileage = (v: number | undefined) =>
    v ? v.toLocaleString("es-VE") : "";

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="space-y-7">
        {/* PRECIO */}
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
              <span className="text-base font-semibold text-muted-foreground">
                $
              </span>
            </div>
            <input
              type="text"
              value={formatPrice(formData.price)}
              onChange={handlePriceChange}
              className={`${INPUT_CLASS} pl-9 ${priceValidation.getBorderClassName()}`}
              placeholder="25,000"
              inputMode="numeric"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <span className="text-sm text-muted-foreground">USD</span>
            </div>
          </div>
        </InputField>

        {/* TASA DE CAMBIO */}
        {isLoadingRate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-1 py-3 rounded-lg bg-muted/30">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Obteniendo tasa del día...</span>
          </div>
        )}
        {priceInVes && !isLoadingRate && (
          <Card className="card-glass border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Equivalente aproximado
                  </span>
                </div>
                <span className="text-lg font-bold text-muted-foreground">
                  {priceInVes}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Los compradores verán ambas monedas en el anuncio
              </p>
            </CardContent>
          </Card>
        )}

        {/* ✅ FIX #17: Referencia de mercado */}
        <MarketPriceReference
          brand={
            formData.brand === "Otra" ? formData.brandOther : formData.brand
          }
          model={
            formData.model === "Otro" ? formData.modelOther : formData.model
          }
          year={formData.year}
          currentPrice={formData.price}
        />

        {/* ✅ TOGGLES: loop sobre TOGGLE_OPTIONS en lugar de dos Cards idénticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOGGLE_OPTIONS.map(
            ({ field, icon: Icon, color, title, subtitle, tooltip }) => {
              const isActive = !!formData[field];
              return (
                <Card
                  key={field}
                  className="card-glass border-border/50 overflow-hidden"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer group flex-1">
                        <div
                          className={`p-2 rounded-lg bg-${color}/10 group-hover:bg-${color}/20 transition-colors`}
                        >
                          <Icon
                            className={`w-5 h-5 transition-colors ${isActive ? `text-${color}` : "text-muted-foreground"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <span className="text-base font-semibold text-foreground block">
                            {title}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {subtitle}
                          </span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) =>
                          handleSwitchChange(field, checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            },
          )}
        </div>

        {/* ✅ FINANCIACIÓN: dos bloques offersFinancing fusionados en uno */}
        {formData.offersFinancing && (
          <div className="space-y-4">
            <Card className="card-glass border-border/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 border-b border-border/30">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    Consejos sobre Financiación
                  </h4>
                </div>
                <div className="p-4">
                  <ul className="space-y-1.5">
                    {VALIDATION_CONFIG.financing.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-accent mt-0.5 font-bold">•</span>
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="card-glass border-border/50 overflow-hidden">
              <CardContent className="p-5 space-y-5">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Detalles de la Financiación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Tasa de Interés Anual (%)"
                    required
                    error={errors["financingDetails.interestRate"]}
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
                      className={INPUT_CLASS_SM}
                      step="0.1"
                      min="0"
                      max="100"
                    />
                  </InputField>
                  <InputField
                    label="Plazo Máximo (meses)"
                    required
                    error={errors["financingDetails.loanTerm"]}
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
                      className={INPUT_CLASS_SM}
                      min="1"
                      max="120"
                    />
                  </InputField>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* KILOMETRAJE Y CONDICIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className={`${INPUT_CLASS} pr-12 ${mileageValidation.getBorderClassName()}`}
                placeholder="85,000"
                inputMode="numeric"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-sm text-muted-foreground">km</span>
              </div>
            </div>
          </InputField>

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
              onValueChange={(value) => handleInputChange("condition", value)}
              options={Object.values(VehicleCondition).map((c) => ({
                value: c,
                label: VEHICLE_CONDITIONS_LABELS[c],
              }))}
              placeholder="Selecciona la condición"
              error={errors.condition}
              className={`${INPUT_CLASS} ${conditionValidation.getBorderClassName()}`}
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
          </InputField>
        </div>

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
            onValueChange={(value) => handleInputChange("warranty", value)}
            options={Object.values(WarrantyType).map((w) => ({
              value: w,
              label: WARRANTY_LABELS[w],
            }))}
            placeholder="Selecciona tipo de garantía"
            error={errors.warranty}
            className={`${INPUT_CLASS} ${warrantyValidation.getBorderClassName()}`}
            icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
          />
        </InputField>

        <PreviewCard formData={formData} exchangeRate={exchangeRate} />
        <CompletionSummaryShared
          progress={formProgress}
          completeLabel="¡Información de precio completa!"
        />
      </div>
    </div>
  );
};

export default Step2_PriceAndCondition;
