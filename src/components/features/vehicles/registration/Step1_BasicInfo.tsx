// Versión PROFESIONAL MEJORADA de Step1_BasicInfo.tsx
//src/components/features/vehicles/registration/Step1_BasicInfo.tsx
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
  Info,
  ChevronDown,
} from "lucide-react";
import { VehicleCategory, VEHICLE_CATEGORIES_LABELS } from "@/types/shared";
import { VehicleDataBackend } from "@/types/types";
import { CATEGORY_DATA } from "@/constants/form-constants";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

// ============================================
// CONFIGURACIÓN DE VALIDACIÓN Y CONSEJOS
// ============================================
const VALIDATION_CONFIG = {
  category: {
    tips: [
      "La categoría correcta ayuda a los compradores a encontrar tu vehículo más fácilmente",
      "Los SUV y pickups suelen mantener mejor su valor de reventa",
      "Las categorías más populares en tu región pueden generar más interés",
    ],
  },
  brand: {
    tips: [
      "Las marcas reconocidas generalmente tienen mejor demanda en el mercado",
      "Si tu marca no está en la lista, selecciona 'Otra' y especifícala",
      "Algunas marcas tienen mejor reputación de confiabilidad y durabilidad",
    ],
  },
  model: {
    tips: [
      "Sé específico con el modelo para atraer a compradores interesados",
      "Los modelos más recientes suelen tener mejor valor de reventa",
      "Incluir detalles adicionales como '4x4' o 'híbrido' puede aumentar el interés",
    ],
  },
  year: {
    tips: [
      "Los vehículos de 3-5 años suelen tener el mejor equilibrio entre precio y confiabilidad",
      "Los modelos más nuevos pueden justificar un precio más alto",
      "Considera incluir el año exacto del modelo, no solo el año de fabricación",
    ],
  },
  version: {
    tips: [
      "Incluir la versión correcta puede aumentar significativamente el valor del vehículo",
      "Versiones como 'Limited', 'Sport' o 'XEI' tienen características específicas",
      "Si no estás seguro, revisa la documentación del vehículo o la póliza de seguro",
    ],
  },
};

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
  <div className="text-center space-y-6">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl blur-xl"></div>
      <div className="relative flex items-center justify-center gap-4 p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 border border-border/50 shadow-glass">
        <div className="p-4 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10">
          <Car className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="text-left">
          <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
            Información Básica
          </h2>
          <p className="text-base text-muted-foreground mt-1">
            Completa los datos principales de tu vehículo
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
      <Progress value={progress} className="h-3 bg-muted" />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">Completando información</span>
        <span className="text-xs text-muted-foreground">Paso 1 de 5</span>
      </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Categoría del Vehículo"
            required
            error={errors.category}
            success={categoryValidation.isValid}
            icon={<Layers className="w-4 h-4 text-primary" />}
            tooltip="Selecciona el tipo de vehículo que deseas publicar"
            tips={VALIDATION_CONFIG.category.tips}
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
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
          </InputField>

          <InputField
            label="Marca"
            required
            error={errors.brand}
            success={brandValidation.isValid}
            icon={<Award className="w-4 h-4 text-primary" />}
            tooltip="Selecciona la marca del fabricante"
            tips={VALIDATION_CONFIG.brand.tips}
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
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
          </InputField>
        </div>

        {formData.brand === "Otra" && (
          <InputField
            label="Especificar Marca"
            required
            error={errors.brandOther}
            success={brandOtherValidation.isValid}
            icon={<Award className="w-4 h-4 text-primary" />}
            counter={{ current: formData.brandOther?.length || 0, max: 50 }}
            tooltip="Ingresa el nombre de la marca si no está en la lista"
            tips={[
              "Incluye el nombre completo de la marca para mayor claridad",
              "Verifica la ortografía correcta para facilitar la búsqueda",
              "Si es una marca poco conocida, considera añadir información adicional en la descripción"
            ]}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Modelo"
            required
            error={errors.model}
            success={modelValidation.isValid}
            icon={<Search className="w-4 h-4 text-primary" />}
            tooltip="Selecciona el modelo específico del vehículo"
            tips={VALIDATION_CONFIG.model.tips}
          >
            <SelectField
              value={formData.model || ""}
              onValueChange={(value) => handleInputChange("model", value)}
              disabled={!formData.brand}
              placeholder={!formData.brand ? "Primero selecciona una marca" : "Selecciona el modelo"}
              options={modelOptions}
              className={`${INPUT_CLASS} ${modelValidation.getBorderClassName()}`}
              error={errors.model}
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
          </InputField>

          <InputField
            label="Año"
            required
            error={errors.year}
            success={yearValidation.isValid}
            icon={<Calendar className="w-4 h-4 text-primary" />}
            tooltip="Selecciona el año de fabricación del vehículo"
            tips={VALIDATION_CONFIG.year.tips}
          >
            <SelectField
              value={formData.year?.toString() || ""}
              onValueChange={(value) => handleInputChange("year", parseInt(value) || 0)}
              placeholder="Selecciona el año"
              options={yearOptions}
              className={`${INPUT_CLASS} ${yearValidation.getBorderClassName()}`}
              error={errors.year}
              icon={<ChevronDown className="w-4 h-4 text-muted-foreground" />}
            />
          </InputField>
        </div>

        {formData.model === "Otro" && (
          <InputField
            label="Especificar Modelo"
            required
            error={errors.modelOther}
            success={modelOtherValidation.isValid}
            icon={<Search className="w-4 h-4 text-primary" />}
            counter={{ current: formData.modelOther?.length || 0, max: 50 }}
            tooltip="Ingresa el nombre del modelo si no está en la lista"
            tips={[
              "Incluye detalles específicos como '4x4', 'híbrido' o 'eléctrico'",
              "Añade información sobre el tipo de carrocería si es relevante",
              "Si es una edición especial, menciónalo aquí"
            ]}
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
          tips={VALIDATION_CONFIG.version.tips}
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
        return [
          { title: "Para familias", desc: "Los sedanes son ideales para viajes largos y mayor comodidad" },
          { title: "Para la ciudad", desc: "Los hatchback son perfectos para estacionamiento y maniobrabilidad" }
        ];
      case VehicleCategory.MOTORCYCLE:
        return [
          { title: "Alta demanda", desc: "Las motos de trabajo son muy demandadas en el mercado actual" },
          { title: "Documentación", desc: "Verifica que tenga SOAT vigente y documentación en regla" }
        ];
      case VehicleCategory.SUV:
        return [
          { title: "Valor de reventa", desc: "Los SUV mantienen mejor su valor en el mercado de segunda mano" },
          { title: "Versatilidad", desc: "Perfectos para terrenos difíciles y condiciones climáticas adversas" }
        ];
      case VehicleCategory.TRUCK:
        return [
          { title: "Capacidad de carga", desc: "Ideal para trabajo y transporte de objetos pesados" },
          { title: "Durabilidad", desc: "Mantenimiento regular es clave para prolongar su vida útil" }
        ];
      case VehicleCategory.VAN:
        return [
          { title: "Espacio", desc: "Perfecto para familias numerosas o transporte de pasajeros" },
          { title: "Negocio", desc: "Excelente opción para servicios de transporte o delivery" }
        ];
      case VehicleCategory.BUS:
        return [
            { title: "Transporte de pasajeros", desc: "Ideal para rutas urbanas o viajes largos" },
            { title: "Regulaciones", desc: "Asegúrate de cumplir con todas las normativas de transporte público" }
        ];
      default:
        return [];
    }
  }, [category]);

  if (suggestions.length === 0) return null;

  return (
    <Card className="card-glass border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              Consejos para tu {VEHICLE_CATEGORIES_LABELS[category!] || "vehículo"}
            </h4>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <Info className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{suggestion.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{suggestion.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
SmartSuggestions.displayName = "SmartSuggestions";

// ===========================================
// SUB-COMPONENTE: Resumen de Completitud
// ===========================================
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

// ===========================================
// COMPONENTE PRINCIPAL
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
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
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