// Versión PROFESIONAL Refactorizada de Step1_BasicInfo.tsx
"use client";
import React, { useMemo } from "react";
import {
  Car,
  CheckCircle2,
  AlertCircle,
  Search,
  Calendar,
  Tag,
  Layers,
  Award,
  Sparkles,
} from "lucide-react";
import { VehicleCategory, VEHICLE_CATEGORIES_LABELS } from "@/types/shared";
import { VehicleDataBackend } from "@/types/types";
import { CATEGORY_DATA } from "@/constants/form-constants";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// ===========================================
// TIPOS Y CONSTANTES
// ===========================================
interface FormErrors {
  [key: string]: string | undefined;
}

type FormFieldValue = string | number | VehicleCategory | undefined;

interface StepProps {
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: FormFieldValue) => void;
  isLoading?: boolean;
}

const INPUT_CLASS =
  "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground " +
  "placeholder:text-muted-foreground/60 " +
  "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 " +
  "transition-all duration-200 ease-out " +
  "hover:border-border/80";

// ===========================================
// SUB-COMPONENTE: Encabezado y Progreso
// ===========================================
const FormHeader: React.FC<{ progress: number }> = React.memo(({ progress }) => (
  <div className="text-center space-y-4">
    <div className="flex items-center justify-center gap-3">
      <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10">
        <Car className="w-7 h-7 text-primary-foreground" />
      </div>
      <div className="text-left">
        <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
          Información Básica
        </h2>
        <p className="text-base text-muted-foreground mt-0.5">
          Completa los datos principales de tu vehículo
        </p>
      </div>
    </div>
    <div className="w-full max-w-md mx-auto pt-2">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-sm font-medium text-muted-foreground">Progreso</span>
        <span className="text-sm font-bold text-foreground tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>
      <Progress value={progress} className="h-2.5 bg-muted" />
    </div>
  </div>
));
FormHeader.displayName = "FormHeader";

// ===========================================
// SUB-COMPONENTE: Campos del Formulario
// ===========================================
interface FormFieldsProps extends StepProps {
  categoryOptions: { value: string; label: string }[];
  brandOptions: { value: string; label: string }[];
  modelOptions: { value: string; label: string }[];
  yearOptions: { value: string; label: string }[];
}

const BasicInfoFormFields: React.FC<FormFieldsProps> = React.memo(
  ({ formData, errors, handleInputChange, categoryOptions, brandOptions, modelOptions, yearOptions }) => {
    const categoryValidation = useFieldValidation(formData.category, errors.category);
    const brandValidation = useFieldValidation(formData.brand, errors.brand);
    const brandOtherValidation = useFieldValidation(formData.brandOther, errors.brandOther);
    const modelValidation = useFieldValidation(formData.model, errors.model);
    const modelOtherValidation = useFieldValidation(formData.modelOther, errors.modelOther);
    const versionValidation = useFieldValidation(formData.version, errors.version);
    const yearValidation = useFieldValidation(formData.year, errors.year);

    return (
      <div className="space-y-7">
        <InputField
          label="Categoría del Vehículo"
          required
          error={errors.category}
          success={categoryValidation.isValid}
          icon={<Layers className="w-4 h-4 text-primary" />}
        >
          <SelectField
            value={formData.category || ""}
            onValueChange={(value) => {
              handleInputChange("category", value as VehicleCategory);
              handleInputChange("brand", "");
              handleInputChange("model", "");
            }}
            placeholder="Selecciona el tipo de vehículo"
            options={categoryOptions}
            className={`${INPUT_CLASS} ${categoryValidation.getBorderClassName()}`}
            error={errors.category}
          />
        </InputField>

        <InputField
          label="Marca"
          required
          error={errors.brand}
          success={brandValidation.isValid}
          icon={<Award className="w-4 h-4 text-primary" />}
        >
          <SelectField
            value={formData.brand || ""}
            onValueChange={(value) => {
              handleInputChange("brand", value);
              handleInputChange("model", "");
            }}
            disabled={!formData.category}
            placeholder={!formData.category ? "Primero selecciona una categoría" : "Selecciona la marca"}
            options={brandOptions}
            className={`${INPUT_CLASS} ${brandValidation.getBorderClassName()}`}
            error={errors.brand}
          />
        </InputField>

        {formData.brand === "Otra" && (
          <InputField
            label="Especificar Marca"
            required
            error={errors.brandOther}
            success={brandOtherValidation.isValid}
            icon={<Award className="w-4 h-4 text-primary" />}
            counter={{ current: formData.brandOther?.length || 0, max: 50 }}
          >
            <input
              type="text"
              value={formData.brandOther || ""}
              onChange={(e) => handleInputChange("brandOther", e.target.value)}
              maxLength={50}
              className={`${INPUT_CLASS} ${brandOtherValidation.getBorderClassName()}`}
              placeholder="Ej: Empire Keeway, Skygo, Lifan"
            />
          </InputField>
        )}

        <InputField
          label="Modelo"
          required
          error={errors.model}
          success={modelValidation.isValid}
          icon={<Search className="w-4 h-4 text-primary" />}
        >
          <SelectField
            value={formData.model || ""}
            onValueChange={(value) => handleInputChange("model", value)}
            disabled={!formData.brand}
            placeholder={!formData.brand ? "Primero selecciona una marca" : "Selecciona el modelo"}
            options={modelOptions}
            className={`${INPUT_CLASS} ${modelValidation.getBorderClassName()}`}
            error={errors.model}
          />
        </InputField>

        {formData.model === "Otro" && (
          <InputField
            label="Especificar Modelo"
            required
            error={errors.modelOther}
            success={modelOtherValidation.isValid}
            icon={<Search className="w-4 h-4 text-primary" />}
            counter={{ current: formData.modelOther?.length || 0, max: 50 }}
          >
            <input
              type="text"
              value={formData.modelOther || ""}
              onChange={(e) => handleInputChange("modelOther", e.target.value)}
              maxLength={50}
              className={`${INPUT_CLASS} ${modelOtherValidation.getBorderClassName()}`}
              placeholder="Ej: Corolla Cross, F-250, etc."
            />
          </InputField>
        )}

        <InputField
          label="Versión / Edición"
          error={errors.version}
          success={versionValidation.isValid}
          icon={<Tag className="w-4 h-4 text-primary" />}
          tooltip="Añade detalles específicos del modelo. Ej: XEI, Limited, 4x4, etc."
          counter={{ current: formData.version?.length || 0, max: 100 }}
        >
          <input
            type="text"
            value={formData.version || ""}
            onChange={(e) => handleInputChange("version", e.target.value)}
            maxLength={100}
            className={`${INPUT_CLASS} ${versionValidation.getBorderClassName()}`}
            placeholder="Ej: XEI, Limited, Sport, 4x4"
            autoComplete="off"
            disabled={!formData.model}
          />
        </InputField>

        <InputField
          label="Año"
          required
          error={errors.year}
          success={yearValidation.isValid}
          icon={<Calendar className="w-4 h-4 text-primary" />}
        >
          <SelectField
            value={formData.year?.toString() || ""}
            onValueChange={(value) => handleInputChange("year", parseInt(value) || 0)}
            placeholder="Selecciona el año"
            options={yearOptions}
            className={`${INPUT_CLASS} ${yearValidation.getBorderClassName()}`}
            error={errors.year}
          />
        </InputField>
      </div>
    );
  }
);
BasicInfoFormFields.displayName = "BasicInfoFormFields";

// ===========================================
// SUB-COMPONENTE: Sugerencias Inteligentes
// ===========================================
const SmartSuggestions: React.FC<{ category?: VehicleCategory }> = React.memo(({ category }) => {
  const suggestions = useMemo(() => {
    if (!category) return [];
    switch (category) {
      case VehicleCategory.CAR:
        return ["Los sedanes son ideales para familias", "Los hatchback son perfectos para la ciudad"];
      case VehicleCategory.MOTORCYCLE:
        return ["Las motos de trabajo son muy demandadas", "Verifica que tenga SOAT vigente"];
      case VehicleCategory.SUV:
        return ["Los SUV mantienen mejor su valor", "Perfectos para terrenos difíciles"];
      default:
        return [];
    }
  }, [category]);

  if (suggestions.length === 0) return null;

  return (
    <div className="p-5 rounded-xl border border-border bg-gradient-to-br from-primary/5 via-transparent to-accent/5 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">
          Consejos para tu {VEHICLE_CATEGORIES_LABELS[category!] || "vehículo"}
        </h4>
      </div>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-primary mt-0.5 font-bold">•</span>
            <span className="leading-relaxed">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});
SmartSuggestions.displayName = "SmartSuggestions";

// ===========================================
// SUB-COMPONENTE: Resumen de Completitud
// ===========================================
const CompletionSummary: React.FC<{ progress: number }> = React.memo(({ progress }) => {
  const isComplete = progress >= 100;
  const borderColor = isComplete ? "border-green-500/40" : "border-amber-500/40";
  const bgColor = isComplete ? "bg-green-50/50 dark:bg-green-950/20" : "bg-amber-50/50 dark:bg-amber-950/20";
  const iconBgColor = isComplete ? "bg-green-500/20" : "bg-amber-500/20";

  return (
    <div className={`p-5 rounded-xl border-2 shadow-sm transition-all duration-300 ${borderColor} ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconBgColor}`}>
            {isComplete ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground text-base">
              {isComplete ? "¡Información básica completa!" : "Faltan algunos campos"}
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
    </div>
  );
});
CompletionSummary.displayName = "CompletionSummary";

// ===========================================
// COMPONENTE PRINCIPAL (AHORA MÁS PEQUEÑO)
// ===========================================
const Step1_BasicInfo: React.FC<StepProps> = ({ formData, errors, handleInputChange }) => {
  
  const progressPercentage = useMemo(() => {
    const requiredFields = ["category", "brand", "model", "year"];
    const completed = requiredFields.filter((field) => {
      const value = formData[field as keyof typeof formData];
      return (!!value || value === 0) && !errors[field];
    }).length;
    return (completed / requiredFields.length) * 100;
  }, [formData, errors]);

  const categoryOptions = useMemo(() => Object.values(VehicleCategory).map((cat) => ({
    value: cat,
    label: VEHICLE_CATEGORIES_LABELS[cat],
  })), []);

  const currentCategory = formData.category as VehicleCategory | undefined;

  const brandOptions = useMemo(() => {
    if (!currentCategory || !CATEGORY_DATA[currentCategory]) return [];
    return Object.keys(CATEGORY_DATA[currentCategory].brands).map((brand) => ({
      value: brand,
      label: brand,
    }));
  }, [currentCategory]);

  const modelOptions = useMemo(() => {
    if (!currentCategory || !formData.brand || !CATEGORY_DATA[currentCategory]?.brands[formData.brand]) return [];
    return CATEGORY_DATA[currentCategory].brands[formData.brand].map((model) => ({
      value: model,
      label: model,
    }));
  }, [currentCategory, formData.brand]);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1899 }, (_, i) => {
      const year = currentYear + 1 - i;
      return { value: year.toString(), label: year.toString() };
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
      <FormHeader progress={progressPercentage} />

      <div className="space-y-7">
        <BasicInfoFormFields
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
          categoryOptions={categoryOptions}
          brandOptions={brandOptions}
          modelOptions={modelOptions}
          yearOptions={yearOptions}
        />
        
        <SmartSuggestions category={currentCategory} />
        
        <CompletionSummary progress={progressPercentage} />
      </div>
    </div>
  );
};

export default Step1_BasicInfo;