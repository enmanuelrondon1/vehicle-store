//src/components/features/vehicles/registration/Step2_PriceAndCondition.tsx
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
}

const VALIDATION_CONFIG = {
  price: {
    min: 100,
    max: 1000000,
    tips: [
      "💡 Investiga precios similares en el mercado",
      "🎯 Un precio justo atrae más compradores",
      "📈 Considera la depreciación por año y kilometraje",
    ],
  },
  mileage: {
    min: 0,
    max: 999999,
    tips: [
      "🚗 Kilometraje bajo aumenta el valor",
      "📊 El promedio anual es 15,000-20,000 km",
      "✅ Sé honesto con el kilometraje real",
    ],
  },
  offersFinancing: {
    tips: [
      "💡 Al activar esta opción, se mostrará una calculadora de financiamiento en la página de tu vehículo.",
      "📈 Ayuda a los compradores a entender las opciones de pago y puede aumentar el interés.",
    ],
  },
};

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-foreground/80">
        Progreso del formulario
      </span>
      <span className="text-sm text-muted-foreground">
        {Math.round(progress)}%
      </span>
    </div>
    <div className="w-full h-2 rounded-full bg-secondary">
      <div
        className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

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
    <div className="mt-6 p-4 rounded-xl border-2 border-dashed transition-all duration-300 border-border bg-card/50">
      <h3 className="flex items-center text-sm font-semibold mb-3 text-foreground/90">
        <Eye className="w-4 h-4 mr-2" />
        Vista Previa del Anuncio
      </h3>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Precio:</span>
          <span className="font-semibold text-green-600">
            {formData.price
              ? `$${formData.price.toLocaleString()} USD`
              : "No especificado"}
            {formData.isNegotiable && " (Negociable)"}
          </span>
        </div>
        {priceInVes && (
          <div className="flex justify-between">
            <span>Equivalente:</span>
            <span className="font-medium">{priceInVes}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Kilometraje:</span>
          <span>
            {formData.mileage
              ? `${formData.mileage.toLocaleString()} km`
              : "No especificado"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Condición:</span>
          <span>
            {formData.condition
              ? VEHICLE_CONDITIONS_LABELS[
                  formData.condition as VehicleCondition
                ]
              : "No especificada"}
          </span>
        </div>

        {formData.warranty && (
          <div className="flex justify-between">
            <span>Garantía:</span>
            <span>{WARRANTY_LABELS[formData.warranty as WarrantyType]}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Step2_PriceAndCondition: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [showFinancingTips, setShowFinancingTips] = useState(false);

  const priceValidation = useFieldValidation(formData.price, errors.price);
  const mileageValidation = useFieldValidation(
    formData.mileage,
    errors.mileage
  );
  const conditionValidation = useFieldValidation(
    formData.condition,
    errors.condition
  );
  const warrantyValidation = useFieldValidation(
    formData.warranty,
    errors.warranty
  );

  const formProgress = useMemo(() => {
    const fields = ["price", "mileage", "condition"];
    const completedFields = fields.filter((field) => {
      const value = formData[field as keyof typeof formData];
      return value !== undefined && value !== "" && value !== null;
    }).length;

    return (completedFields / fields.length) * 100;
  }, [formData]);

  useEffect(() => {
    if (!formData.currency) {
      handleInputChange("currency", Currency.USD);
    }
  }, [formData.currency, handleInputChange]);

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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-green-500 to-green-600">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Precio y Condición
            </h2>
            <p className="text-sm text-muted-foreground">
              Define el precio y estado del vehículo
            </p>
          </div>
        </div>
      </div>

      <ProgressBar progress={formProgress} />

      <div className="space-y-6">
        <InputField
          label="Precio (USD)"
          required
          success={priceValidation.isValid}
          error={errors.price}
          icon={<DollarSign className="w-4 h-4 text-green-600" />}
          tooltip="El precio debe estar en dólares estadounidenses. Se mostrará la conversión automática a bolívares."
          tips={VALIDATION_CONFIG.price.tips}
        >
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-sm font-medium text-muted-foreground">
                $
              </span>
            </div>
            <input
              type="text"
              value={formatPrice(formData.price)}
              onChange={handlePriceChange}
              className={`w-full rounded-xl border-2 bg-background px-4 py-3 pl-8 text-foreground transition-all duration-200 focus:outline-none focus:ring-4 ${priceValidation.getBorderClassName()}`}
              placeholder="25,000"
              inputMode="numeric"
            />
          </div>

          {isLoadingRate && (
            <p className="mt-2 flex items-center text-xs text-muted-foreground">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Obteniendo tasa del día...
            </p>
          )}
          {priceInVes && !isLoadingRate && (
            <div className="mt-2 rounded-lg border bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground">
                Equivalente aproximado:{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {priceInVes}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                💡 Los compradores verán ambas monedas
              </p>
            </div>
          )}
        </InputField>

        <div className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-secondary/50">
          <label className="group flex cursor-pointer items-center space-x-2">
            <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
              ¿Precio Negociable?
            </span>
            <Handshake
              className={`h-4 w-4 transition-colors group-hover:scale-110 ${
                formData.isNegotiable
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  Marcar como negociable puede atraer más compradores
                  interesados
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Switch
            checked={formData.isNegotiable || false}
            onCheckedChange={(checked) =>
              handleInputChange("isNegotiable", checked)
            }
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowFinancingTips(!showFinancingTips)}
              className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary transition-colors hover:bg-primary/20"
            >
              Tips
            </button>
          </div>

          <div className="-mt-2 flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-secondary/50">
            <label className="group flex cursor-pointer items-center space-x-2">
              <span className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                ¿Ofrece Financiación?
              </span>
              <Handshake
                className={`h-4 w-4 transition-colors group-hover:scale-110 ${
                  formData.offersFinancing
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 cursor-help text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Activa esta opción si ofreces facilidades de pago. Se
                      mostrará una calculadora en tu anuncio.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <Switch
              checked={formData.offersFinancing || false}
              onCheckedChange={(checked) =>
                handleInputChange("offersFinancing", checked)
              }
            />
          </div>

          {showFinancingTips && (
            <div className="space-y-1 rounded-lg border border-primary/20 bg-primary/10 p-3">
              {VALIDATION_CONFIG.offersFinancing.tips.map((tip, index) => (
                <p key={index} className="text-xs text-primary/90">
                  {tip}
                </p>
              ))}
            </div>
          )}
        </div>

        {formData.offersFinancing && (
          <div className="mt-4 space-y-4 rounded-lg border bg-secondary/20 p-4">
            <h3 className="text-md font-semibold text-foreground">
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
                className="w-full rounded-md border bg-background p-2"
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
                className="w-full rounded-md border bg-background p-2"
              />
            </InputField>
          </div>
        )}

        <InputField
          label="Kilometraje"
          required
          success={mileageValidation.isValid}
          error={errors.mileage}
          icon={<Gauge className="w-4 h-4 text-blue-600" />}
          tooltip="Introduce el kilometraje actual del vehículo. Se formatará automáticamente."
          tips={VALIDATION_CONFIG.mileage.tips}
        >
          <div className="relative">
            <input
              type="text"
              value={formatMileage(formData.mileage)}
              onChange={handleMileageChange}
              className={`w-full rounded-xl border-2 bg-background px-4 py-3 pr-12 text-foreground transition-all duration-200 focus:outline-none focus:ring-4 ${mileageValidation.getBorderClassName()}`}
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
          icon={<Shield className="w-4 h-4 text-orange-600" />}
          tooltip="La condición del vehículo afecta significativamente su valor de mercado"
        >
          <SelectField
            value={formData.condition || ""}
            onChange={(value) => handleInputChange("condition", value)}
            options={[VehicleCondition.EXCELLENT, VehicleCondition.GOOD].map(
              (c) => ({
                value: c,
                label: VEHICLE_CONDITIONS_LABELS[c],
              })
            )}
            placeholder="Selecciona la condición"
            error={errors.condition}
            className={`w-full rounded-xl border-2 bg-background px-4 py-3 text-foreground transition-all duration-200 focus:outline-none focus:ring-4 ${conditionValidation.getBorderClassName()}`}
          />
        </InputField>

        <InputField
          label="Garantía"
          error={errors.warranty}
          success={warrantyValidation.isValid}
          icon={<Shield className="w-4 h-4 text-purple-600" />}
          tooltip="La garantía puede ser un factor decisivo para muchos compradores"
        >
          <SelectField
            value={formData.warranty || ""}
            onChange={(value) => handleInputChange("warranty", value)}
            options={[
              WarrantyType.NO_WARRANTY,
              WarrantyType.SELLER_WARRANTY,
            ].map((w) => ({
              value: w,
              label: WARRANTY_LABELS[w],
            }))}
            placeholder="Selecciona tipo de garantía"
            error={errors.warranty}
            className={`w-full rounded-xl border-2 bg-background px-4 py-3 text-foreground transition-all duration-200 focus:outline-none focus:ring-4 ${warrantyValidation.getBorderClassName()}`}
          />
        </InputField>

        <PreviewCard formData={formData} exchangeRate={exchangeRate} />

        <div className="mt-6 rounded-xl border bg-secondary/50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            Estado del Formulario
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formProgress === 100
                ? "🎉 ¡Formulario completo!"
                : `📝 ${Math.round(formProgress)}% completado`}
            </span>
            {formProgress === 100 && (
              <span className="text-xs font-medium text-green-600">
                ✅ Listo para continuar
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2_PriceAndCondition;