"use client";
import React from "react";
import {
  DollarSign,
  Settings,
  Fuel,
  Wrench,
  Gauge,
  Shield,
  Info,
} from "lucide-react";
import {
  VehicleCategory,
  VehicleCondition,
  TransmissionType,
  FuelType,
  WarrantyType,
  VEHICLE_CONDITIONS_LABELS,
  TRANSMISSION_TYPES_LABELS,
  FUEL_TYPES_LABELS,
} from "@/types/shared";
import { VehicleDataBackend } from "@/types/types";
import BasicInfoStep from "./BasicInfoStep";
import { useDarkMode } from "@/context/DarkModeContext";

interface FormErrors {
  [key: string]: string;
}

interface VehicleFormStepsPart1Props {
  currentStep: number;
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: FormFieldValue) => void; // Cambiar aquí
  isLoading: boolean;
}
type FormFieldValue = string | number | undefined;

const CONDITION_LABELS = VEHICLE_CONDITIONS_LABELS;
const TRANSMISSION_LABELS = TRANSMISSION_TYPES_LABELS;
const FUEL_LABELS = FUEL_TYPES_LABELS;

const WARRANTY_LABELS: Record<WarrantyType, string> = {
  [WarrantyType.NO_WARRANTY]: "Sin Garantía",
  [WarrantyType.DEALER_WARRANTY]: "Garantía del Concesionario",
  [WarrantyType.MANUFACTURER_WARRANTY]: "Garantía del Fabricante",
  [WarrantyType.EXTENDED_WARRANTY]: "Garantía Extendida",
};

const CATEGORY_DATA = {
  [VehicleCategory.CAR]: {
    subcategories: ["Sedán", "Hatchback", "Coupé", "Convertible", "Familiar"],
    brands: [
      "Toyota",
      "Chevrolet",
      "Ford",
      "Mazda",
      "Hyundai",
      "Volkswagen",
      "Nissan",
      "Honda",
    ],
    colors: [
      "Blanco",
      "Negro",
      "Plata",
      "Gris",
      "Azul",
      "Rojo",
      "Verde",
      "Amarillo",
      "Naranja",
      "Marrón",
    ],
  },
  [VehicleCategory.SUV]: {
    subcategories: ["Compacto", "Mediano", "Grande", "Crossover", "Pickup"],
    brands: [
      "Toyota",
      "Ford",
      "Chevrolet",
      "Jeep",
      "Mazda",
      "Hyundai",
      "Kia",
      "Mitsubishi",
    ],
    colors: ["Blanco", "Negro", "Plata", "Gris", "Azul", "Rojo", "Verde"],
  },
  [VehicleCategory.TRUCK]: {
    subcategories: ["Liviano", "Mediano", "Pesado", "Volteo", "Plataforma"],
    brands: [
      "Ford",
      "Chevrolet",
      "Isuzu",
      "Hino",
      "Mercedes-Benz",
      "Volvo",
      "Freightliner",
    ],
    colors: ["Blanco", "Negro", "Azul", "Rojo", "Amarillo", "Naranja"],
  },
  [VehicleCategory.MOTORCYCLE]: {
    subcategories: ["Deportiva", "Scooter", "Trail", "Cruiser", "Naked"],
    brands: ["Honda", "Yamaha", "Suzuki", "Kawasaki", "Bajaj", "TVS", "KTM"],
    colors: ["Negro", "Rojo", "Azul", "Blanco", "Amarillo", "Verde", "Naranja"],
  },
  [VehicleCategory.BUS]: {
    subcategories: [
      "Urbano",
      "Interurbano",
      "Escolar",
      "Turístico",
      "Ejecutivo",
    ],
    brands: ["Mercedes-Benz", "Volvo", "Scania", "Iveco", "Hino", "Yutong"],
    colors: ["Blanco", "Azul", "Amarillo", "Verde", "Rojo"],
  },
  [VehicleCategory.VAN]: {
    subcategories: ["Pasajeros", "Carga", "Mixta", "Ejecutiva"],
    brands: ["Ford", "Chevrolet", "Hyundai", "Kia", "Renault", "Peugeot"],
    colors: ["Blanco", "Negro", "Plata", "Gris", "Azul"],
  },
};

const InputField: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  infoText?: string;
}> = ({ label, required, error, icon, children, infoText }) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div
      className={`space-y-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
      role="group"
      aria-labelledby={`${label}-label`}
    >
      <label
        id={`${label}-label`}
        className={`flex items-center text-sm font-semibold ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {infoText && (
        <p
          className={`text-sm flex items-center ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <Info className="w-4 h-4 mr-1 text-blue-500" />
          {infoText}
        </p>
      )}
      {error && (
        <p
          className={`text-sm flex items-center ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

const VehicleFormStepsPart1: React.FC<VehicleFormStepsPart1Props> = ({
  currentStep,
  formData,
  errors,
  handleInputChange,
  isLoading,
}) => {
  const { isDarkMode } = useDarkMode();

  const safeFormData = {
    category: formData.category || "",
    subcategory: formData.subcategory || "",
    brand: formData.brand || "",
    model: formData.model || "",
    year: formData.year || new Date().getFullYear(),
    vin: formData.vin || "",
    ...formData,
  };

  const categoryData = safeFormData.category
    ? CATEGORY_DATA[safeFormData.category as VehicleCategory]
    : null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={safeFormData}
            errors={errors}
            handleInputChange={handleInputChange}
            subcategories={
              categoryData
                ? { [safeFormData.category!]: categoryData.subcategories }
                : {}
            }
            brands={
              categoryData
                ? { [safeFormData.category!]: categoryData.brands }
                : {}
            }
            isLoading={isLoading}
          />
        );

      case 2:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`p-3 rounded-xl shadow-lg ${
                    isDarkMode
                      ? "bg-gray-700"
                      : "bg-gradient-to-br from-green-500 to-green-600"
                  }`}
                >
                  <DollarSign
                    className={`w-6 h-6 ${isDarkMode ? "text-gray-200" : "text-white"}`}
                  />
                </div>
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Precio y Condición
                  </h2>
                  <p
                    className={`text-gray-600 text-sm ${
                      isDarkMode ? "text-gray-400" : ""
                    }`}
                  >
                    Define el precio y estado del vehículo
                  </p>
                </div>
              </div>
              <div
                className={`w-full rounded-full h-2 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className={`h-2 rounded-full w-2/5 transition-all duration-500 ${
                    isDarkMode
                      ? "bg-gray-500"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                />
              </div>
            </div>
            <div className="space-y-6">
              <InputField
                label="Precio"
                required
                error={errors.price}
                icon={<DollarSign className="w-4 h-4 text-green-600" />}
              >
                <input
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  onBlur={() =>
                    !formData.price && handleInputChange("price", 0)
                  }
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                      : "bg-white border-gray-200 text-gray-900 focus:border-green-500 hover:border-gray-300"
                  } ${errors.price ? "border-red-300 focus:border-red-500" : ""}`}
                  placeholder="Ej: 25000"
                  aria-required="true"
                  aria-describedby={errors.price ? "price-error" : undefined}
                />
              </InputField>
              <InputField
                label="Kilometraje"
                required
                error={errors.mileage}
                icon={<Gauge className="w-4 h-4 text-blue-600" />}
              >
                <input
                  type="number"
                  value={formData.mileage || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "mileage",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  onBlur={() =>
                    !formData.mileage && handleInputChange("mileage", 0)
                  }
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                      : "bg-white border-gray-200 text-gray-900 focus:border-blue-500 hover:border-gray-300"
                  } ${errors.mileage ? "border-red-300 focus:border-red-500" : ""}`}
                  placeholder="Ej: 85000"
                  aria-required="true"
                  aria-describedby={
                    errors.mileage ? "mileage-error" : undefined
                  }
                />
              </InputField>
              <InputField
                label="Condición"
                required
                error={errors.condition}
                icon={<Shield className="w-4 h-4 text-orange-600" />}
              >
                <select
                  value={formData.condition || ""}
                  onChange={(e) =>
                    handleInputChange("condition", e.target.value)
                  }
                  onBlur={() =>
                    !formData.condition && handleInputChange("condition", "")
                  }
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 appearance-none ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                      : "bg-white border-gray-200 text-gray-900 focus:border-orange-500 hover:border-gray-300"
                  } ${errors.condition ? "border-red-300 focus:border-red-500" : ""}`}
                  aria-required="true"
                  aria-describedby={
                    errors.condition ? "condition-error" : undefined
                  }
                >
                  <option value="">Selecciona la condición</option>
                  {Object.values(VehicleCondition).map((condition) => (
                    <option key={condition} value={condition}>
                      {CONDITION_LABELS[condition]}
                    </option>
                  ))}
                </select>
              </InputField>
              <InputField
                label="Garantía"
                error={errors.warranty}
                icon={<Shield className="w-4 h-4 text-purple-600" />}
              >
                <select
                  value={formData.warranty || ""}
                  onChange={(e) =>
                    handleInputChange("warranty", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 appearance-none ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                      : "bg-white border-gray-200 text-gray-900 focus:border-purple-500 hover:border-gray-300"
                  }`}
                  aria-describedby={
                    errors.warranty ? "warranty-error" : undefined
                  }
                >
                  <option value="">Selecciona tipo de garantía</option>
                  {Object.values(WarrantyType).map((warranty) => (
                    <option key={warranty} value={warranty}>
                      {WARRANTY_LABELS[warranty]}
                    </option>
                  ))}
                </select>
              </InputField>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`p-3 rounded-xl shadow-lg ${
                    isDarkMode
                      ? "bg-gray-700"
                      : "bg-gradient-to-br from-purple-500 to-purple-600"
                  }`}
                >
                  <Settings
                    className={`w-6 h-6 ${isDarkMode ? "text-gray-200" : "text-white"}`}
                  />
                </div>
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Especificaciones Técnicas
                  </h2>
                  <p
                    className={`text-gray-600 text-sm ${
                      isDarkMode ? "text-gray-400" : ""
                    }`}
                  >
                    Detalles técnicos del vehículo
                  </p>
                </div>
              </div>
              <div
                className={`w-full rounded-full h-2 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className={`h-2 rounded-full w-3/5 transition-all duration-500 ${
                    isDarkMode
                      ? "bg-gray-500"
                      : "bg-gradient-to-r from-purple-500 to-purple-600"
                  }`}
                />
              </div>
            </div>
            <div className="space-y-6">
              <InputField
                label="Color"
                required
                error={errors.color}
                icon={
                  <div
                    className={`w-4 h-4 rounded-full ${
                      isDarkMode ? "bg-gray-500" : "bg-gradient-to-r from-red-500 to-blue-500"
                    }`}
                  />
                }
              >
                <select
                  value={formData.color || ""}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  onBlur={() =>
                    !formData.color && handleInputChange("color", "")
                  }
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 appearance-none ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                      : "bg-white border-gray-200 text-gray-900 focus:border-purple-500 hover:border-gray-300"
                  } ${errors.color ? "border-red-300 focus:border-red-500" : ""}`}
                  aria-required="true"
                  aria-describedby={errors.color ? "color-error" : undefined}
                >
                  <option value="">Selecciona un color</option>
                  {(categoryData?.colors || []).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </InputField>
              <InputField
                label="Motor"
                error={errors.engine}
                icon={<Wrench className="w-4 h-4 text-gray-600" />}
              >
                <input
                  type="text"
                  value={formData.engine || ""}
                  onChange={(e) => handleInputChange("engine", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                      : "bg-white border-gray-200 text-gray-900 focus:border-purple-500 hover:border-gray-300"
                  }`}
                  placeholder="Ej: 2.0L, V6, 1.8L Turbo"
                  aria-describedby={errors.engine ? "engine-error" : undefined}
                />
              </InputField>
              <InputField
                label="Transmisión"
                required
                error={errors.transmission}
                icon={<Settings className="w-4 h-4 text-blue-600" />}
              >
                <select
                  value={formData.transmission || ""}
                  onChange={(e) =>
                    handleInputChange("transmission", e.target.value)
                  }
                  onBlur={() =>
                    !formData.transmission &&
                    handleInputChange("transmission", "")
                  }
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 appearance-none ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                      : "bg-white border-gray-200 text-gray-900 focus:border-blue-500 hover:border-gray-300"
                  } ${errors.transmission ? "border-red-300 focus:border-red-500" : ""}`}
                  aria-required="true"
                  aria-describedby={
                    errors.transmission ? "transmission-error" : undefined
                  }
                >
                  <option value="">Selecciona transmisión</option>
                  {Object.values(TransmissionType).map((transmission) => (
                    <option key={transmission} value={transmission}>
                      {TRANSMISSION_LABELS[transmission]}
                    </option>
                  ))}
                </select>
              </InputField>
              <InputField
                label="Tipo de Combustible"
                required
                error={errors.fuelType}
                icon={<Fuel className="w-4 h-4 text-orange-600" />}
              >
                <select
                  value={formData.fuelType || ""}
                  onChange={(e) =>
                    handleInputChange("fuelType", e.target.value)
                  }
                  onBlur={() =>
                    !formData.fuelType && handleInputChange("fuelType", "")
                  }
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 appearance-none ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                      : "bg-white border-gray-200 text-gray-900 focus:border-orange-500 hover:border-gray-300"
                  } ${errors.fuelType ? "border-red-300 focus:border-red-500" : ""}`}
                  aria-required="true"
                  aria-describedby={
                    errors.fuelType ? "fuelType-error" : undefined
                  }
                >
                  <option value="">Selecciona combustible</option>
                  {Object.values(FuelType).map((fuel) => (
                    <option key={fuel} value={fuel}>
                      {FUEL_LABELS[fuel]}
                    </option>
                  ))}
                </select>
              </InputField>
              <InputField
                label="Número VIN (Opcional)"
                error={errors.vin}
                icon={<Wrench className="w-4 h-4 text-gray-600" />}
                infoText="Proporciona el número VIN para agilizar la verificación de tu vehículo y publicar tu anuncio en tiempo récord."
              >
                <input
                  type="text"
                  value={formData.vin || ""}
                  onChange={(e) =>
                    handleInputChange("vin", e.target.value.toUpperCase())
                  }
                  maxLength={17}
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                      : "bg-white border-gray-200 text-gray-900 focus:border-purple-500 hover:border-gray-300"
                  } ${errors.vin ? "border-red-300 focus:border-red-500" : ""}`}
                  placeholder="Ej: 1HGCM82633A004352"
                  aria-describedby={errors.vin ? "vin-error" : undefined}
                />
              </InputField>
              {formData.category &&
                [
                  VehicleCategory.CAR,
                  VehicleCategory.SUV,
                  VehicleCategory.VAN,
                  VehicleCategory.BUS,
                ].includes(formData.category) && (
                  <div
                    className={`grid grid-cols-2 gap-4 ${
                      isDarkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    <InputField label="Puertas" required error={errors.doors}>
                      <input
                        type="number"
                        value={formData.doors || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "doors",
                            parseInt(e.target.value) || 0
                          )
                        }
                        onBlur={() =>
                          !formData.doors && handleInputChange("doors", 0)
                        }
                        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                            : "bg-white border-gray-200 text-gray-900 focus:border-purple-500 hover:border-gray-300"
                        } ${errors.doors ? "border-red-300 focus:border-red-500" : ""}`}
                        placeholder="Ej: 4"
                        min="2"
                        max="8"
                        aria-required="true"
                        aria-describedby={
                          errors.doors ? "doors-error" : undefined
                        }
                      />
                    </InputField>
                    <InputField label="Asientos" required error={errors.seats}>
                      <input
                        type="number"
                        value={formData.seats || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "seats",
                            parseInt(e.target.value) || 0
                          )
                        }
                        onBlur={() =>
                          !formData.seats && handleInputChange("seats", 0)
                        }
                        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                            : "bg-white border-gray-200 text-gray-900 focus:border-purple-500 hover:border-gray-300"
                        } ${errors.seats ? "border-red-300 focus:border-red-500" : ""}`}
                        placeholder="Ej: 5"
                        min="1"
                        max="50"
                        aria-required="true"
                        aria-describedby={
                          errors.seats ? "seats-error" : undefined
                        }
                      />
                    </InputField>
                  </div>
                )}
              {formData.category === VehicleCategory.TRUCK && (
                <InputField
                  label="Capacidad de Carga (kg)"
                  error={errors.loadCapacity}
                >
                  <input
                    type="number"
                    value={formData.loadCapacity || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "loadCapacity",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                        : "bg-white border-gray-200 text-gray-900 focus:border-purple-500 hover:border-gray-300"
                    }`}
                    placeholder="Ej: 1000"
                    aria-describedby={
                      errors.loadCapacity ? "loadCapacity-error" : undefined
                    }
                  />
                </InputField>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`py-8 px-4 ${
        isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-gray-800"
      }`}
      role="region"
    >
      {renderStep()}
    </div>
  );
};

export default VehicleFormStepsPart1;