// src/components/features/vehicles/registration/Step1_BasicInfo.tsx
"use client";
import React, { useMemo } from "react";
import {
  Car,
  Check,
  AlertCircle,
  Search,
  Calendar,
  Tag,
  Layers,
  Award,
} from "lucide-react";
import { VehicleCategory, VEHICLE_CATEGORIES_LABELS } from "@/types/shared";
import { VehicleDataBackend } from "@/types/types";
import { CATEGORY_DATA } from "@/constants/form-constants";
import { useFieldValidation } from "@/hooks/useFieldValidation";
import { InputField } from "@/components/shared/forms/InputField";
import { SelectField } from "@/components/shared/forms/SelectField";
import { Progress } from "@/components/ui/progress";

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

// Componente de sugerencias inteligentes (Estilizado)
const SmartSuggestions: React.FC<{
  category?: VehicleCategory;
  brand?: string;
}> = ({ category }) => {
  const getSuggestions = () => {
    if (!category) return [];

    const suggestions = [];

    if (category === VehicleCategory.CAR) {
      suggestions.push("Los sedanes son ideales para familias");
      suggestions.push("Los hatchback son perfectos para la ciudad");
    } else if (category === VehicleCategory.MOTORCYCLE) {
      suggestions.push("Las motos de trabajo son muy demandadas");
      suggestions.push("Verifica que tenga SOAT vigente");
    } else if (category === VehicleCategory.SUV) {
      suggestions.push("Los SUV mantienen mejor su valor");
      suggestions.push("Perfectos para terrenos difíciles");
    }

    return suggestions;
  };

  const suggestions = getSuggestions();

  if (suggestions.length === 0 || !category) return null;

  return (
    // ESTILO ACTUALIZADO: Usa colores de tema en lugar de colores hardcodeados.
    <div className="mt-4 p-4 rounded-xl border bg-card shadow-sm">
      <h4 className="text-sm font-semibold mb-2 text-foreground flex items-center">
        <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
        💡 Consejos para tu {VEHICLE_CATEGORIES_LABELS[category] || "vehículo"}:
      </h4>
      <ul className="text-xs space-y-1 text-muted-foreground">
        {suggestions.map((suggestion, index) => (
          <li key={index}>• {suggestion}</li>
        ))}
      </ul>
    </div>
  );
};

const Step1_BasicInfo: React.FC<StepProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  // Hooks de validación para cada campo
  const categoryValidation = useFieldValidation(
    formData.category,
    errors.category
  );
  const brandValidation = useFieldValidation(formData.brand, errors.brand);
  const brandOtherValidation = useFieldValidation(
    formData.brandOther,
    errors.brandOther
  );
  const modelValidation = useFieldValidation(formData.model, errors.model);
  const modelOtherValidation = useFieldValidation(
    formData.modelOther,
    errors.modelOther
  );
  const versionValidation = useFieldValidation(
    formData.version,
    errors.version
  );
  const yearValidation = useFieldValidation(formData.year, errors.year);

  // ESTILO ACTUALIZADO: Clase base más robusta y con estilos de tema.
  const inputClass =
    "w-full px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";

  // Memoización para el progreso
  const { completedRequiredFields, progressPercentage } = useMemo(() => {
    const requiredFields = ["category", "brand", "model", "year"];
    const completed = requiredFields.filter((field) => {
      const value = formData[field as keyof typeof formData];
      return (!!value || value === 0) && !errors[field];
    }).length;
    const progress = (completed / requiredFields.length) * 100;
    return { completedRequiredFields: completed, progressPercentage: progress };
  }, [formData, errors]);

  const categoryOptions = Object.values(VehicleCategory).map((cat) => ({
    value: cat,
    label: VEHICLE_CATEGORIES_LABELS[cat],
  }));

  const currentCategory = formData.category as VehicleCategory | undefined;

  const brandOptions = useMemo(() => {
    if (!currentCategory || !CATEGORY_DATA[currentCategory]) return [];
    return Object.keys(CATEGORY_DATA[currentCategory].brands).map((brand) => ({
      value: brand,
      label: brand,
    }));
  }, [currentCategory]);

  const modelOptions = useMemo(() => {
    if (
      !currentCategory ||
      !formData.brand ||
      !CATEGORY_DATA[currentCategory]?.brands[formData.brand]
    )
      return [];
    return CATEGORY_DATA[currentCategory].brands[formData.brand].map(
      (model) => ({
        value: model,
        label: model,
      })
    );
  }, [currentCategory, formData.brand]);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1899 }, (_, i) => {
    const year = currentYear + 1 - i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    // ESTILO ACTUALIZADO: Añadida animación de entrada.
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          {/* ESTILO ACTUALIZADO: Icono con colores de tema. */}
          <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-primary to-accent">
            <Car className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            {/* ESTILO ACTUALIZADO: Título con fuente de encabezado. */}
            <h2 className="text-2xl font-heading font-bold text-foreground">
              Información Básica
            </h2>
            <p className="text-sm text-muted-foreground">
              Completa los datos principales de tu vehículo
            </p>
          </div>
        </div>
        <Progress value={progressPercentage} className="w-full" />
      </div>

      <div className="space-y-6">
        <InputField
          label="Categoría del Vehículo"
          required
          error={errors.category}
          success={categoryValidation.isValid}
          // ESTILO ACTUALIZADO: Icono con color primario.
          icon={<Layers className="w-4 h-4 text-primary" />}
          tooltip="Selecciona el tipo que mejor describe tu vehículo"
          tips={[
            "🚗 Los carros y camionetas (SUV) son los más buscados.",
            "🏍️ Las motos de baja cilindrada tienen alta demanda para trabajo.",
            "🚚 Si es un camión, asegúrate de detallar su capacidad en los siguientes pasos.",
          ]}
        >
          <SelectField
            value={formData.category || ""}
            onChange={(value) => {
              handleInputChange("category", value as VehicleCategory);
              handleInputChange("brand", "");
              handleInputChange("model", "");
            }}
            placeholder="Selecciona el tipo de vehículo"
            options={categoryOptions}
            className={`${inputClass} ${categoryValidation.getBorderClassName()}`}
            error={errors.category}
          />
        </InputField>

        <InputField
          label="Marca"
          required
          error={errors.brand}
          success={brandValidation.isValid}
          icon={<Award className="w-4 h-4 text-primary" />}
          tooltip="La marca del fabricante del vehículo"
          tips={[
            "👍 Marcas como Toyota, Honda y Ford son muy populares y confiables.",
            "🏍️ Para motos, Empire Keeway, Bera y Yamaha son líderes en el mercado.",
            "❓ Si no encuentras tu marca, selecciona 'Otra' y escríbela manualmente.",
          ]}
        >
          <SelectField
            value={formData.brand || ""}
            onChange={(value) => {
              handleInputChange("brand", value);
              handleInputChange("model", ""); // Reset model when brand changes
            }}
            disabled={!formData.category}
            placeholder={
              !formData.category
                ? "Primero selecciona una categoría"
                : "Selecciona la marca"
            }
            options={brandOptions}
            className={`${inputClass} ${brandValidation.getBorderClassName()}`}
            error={errors.brand}
          />
        </InputField>

        {/* Campo condicional para especificar otra marca */}
        {formData.brand === "Otra" && (
          <InputField
            label="Especificar Marca"
            required
            error={errors.brandOther}
            success={brandOtherValidation.isValid}
            icon={<Award className="w-4 h-4 text-primary" />}
            tooltip="Escribe el nombre exacto de la marca"
            counter={{ current: formData.brandOther?.length || 0, max: 50 }}
            tips={[
              "💡 El nombre de la marca debe tener al menos 5 caracteres.",
            ]}
          >
            <input
              type="text"
              value={formData.brandOther || ""}
              onChange={(e) => handleInputChange("brandOther", e.target.value)}
              maxLength={50}
              className={`${inputClass} ${brandOtherValidation.getBorderClassName()}`}
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
          tooltip="El modelo específico del vehículo"
          tips={[
            "✨ Sé lo más específico posible (Ej: Corolla XEI, no solo Corolla).",
            "💡 Si tu modelo no aparece, asegúrate de haber seleccionado la marca correcta.",
          ]}
        >
          <SelectField
            value={formData.model || ""}
            onChange={(value) => handleInputChange("model", value)}
            disabled={!formData.brand}
            placeholder={
              !formData.brand
                ? "Primero selecciona una marca"
                : "Selecciona el modelo"
            }
            options={modelOptions}
            className={`${inputClass} ${modelValidation.getBorderClassName()}`}
            error={errors.model}
          />
        </InputField>

        {/* Campo condicional para especificar otro modelo */}
        {formData.model === "Otro" && (
          <InputField
            label="Especificar Modelo"
            required
            error={errors.modelOther}
            success={modelOtherValidation.isValid}
            icon={<Search className="w-4 h-4 text-primary" />}
            tooltip="Escribe el nombre exacto del modelo"
            counter={{ current: formData.modelOther?.length || 0, max: 50 }}
            tips={["💡 El nombre del modelo debe tener al menos 5 caracteres."]}
          >
            <input
              type="text"
              value={formData.modelOther || ""}
              onChange={(e) => handleInputChange("modelOther", e.target.value)}
              maxLength={50}
              className={`${inputClass} ${modelOtherValidation.getBorderClassName()}`}
              placeholder="Ej: Corolla Cross, F-250, etc."
            />
          </InputField>
        )}

        <InputField
          label="Versión / Edición (Opcional)"
          error={errors.version}
          success={versionValidation.isValid}
          icon={<Tag className="w-4 h-4 text-primary" />}
          tooltip="Añade detalles específicos del modelo. Ej: XEI, Limited, 4x4, etc."
          tips={[
            "💡 Si decides llenar este campo, debe tener entre 5 y 100 caracteres.",
          ]}
          counter={{ current: formData.version?.length || 0, max: 100 }}
        >
          <input
            type="text"
            value={formData.version || ""}
            onChange={(e) => handleInputChange("version", e.target.value)}
            maxLength={100}
            className={`${inputClass} ${versionValidation.getBorderClassName()}`}
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
          tooltip="Año de fabricación del vehículo"
          tips={[
            "📈 El año del modelo es uno de los factores más importantes en el precio.",
            "🆕 Los vehículos más nuevos suelen tener mayor valor de reventa.",
            "❗ Asegúrate de que el año coincida con los papeles del vehículo.",
          ]}
        >
          <SelectField
            value={formData.year?.toString() || ""}
            onChange={(value) =>
              handleInputChange("year", parseInt(value) || 0)
            }
            placeholder="Selecciona el año"
            options={yearOptions}
            className={`${inputClass} ${yearValidation.getBorderClassName()}`}
            error={errors.year}
          />
        </InputField>

        {/* Sugerencias inteligentes */}
        <SmartSuggestions category={currentCategory} brand={formData.brand} />

        {/* Resumen de completitud (Estilizado) */}
        <div
          className={`mt-6 p-4 rounded-xl border bg-card shadow-sm ${
            completedRequiredFields >= 4
              ? "border-green-600/50"
              : "border-destructive/50"
          }`}
        >
          <div className="flex items-center space-x-2">
            {completedRequiredFields >= 4 ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive" />
            )}
            <span className={`font-medium text-foreground`}>
              {completedRequiredFields >= 4
                ? "¡Información básica completa!"
                : `Completa ${
                    4 - completedRequiredFields
                  } campos más para continuar`}
            </span>
          </div>
          <div className="text-xs mt-2 text-muted-foreground">
            Progreso: {completedRequiredFields}/4 campos requeridos
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_BasicInfo;
