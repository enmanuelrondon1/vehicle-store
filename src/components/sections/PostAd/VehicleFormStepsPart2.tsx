"use client";
import React from "react";
import Image from "next/image";
import {
  User,
  FileText,
  Upload,
  MapPin,
  X,
  Image as ImageIcon,
  Shield,
} from "lucide-react";
import { VehicleDataBackend } from "@/types/types";
import { useDarkMode } from "@/context/DarkModeContext";

interface FormErrors {
  [key: string]: string;
}

interface VehicleFormStepsPart2Props {
  currentStep: number;
  formData: Partial<VehicleDataBackend>;
  errors: FormErrors;
  handleInputChange: (field: string, value: string | number | boolean) => void;
  handleFeatureToggle: (feature: string) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  isLoading: boolean;
  phoneCodes: string[];
}

const AVAILABLE_FEATURES = [
  "Aire Acondicionado",
  "Frenos ABS",
  "Airbags",
  "Bluetooth",
  "Cámara de Reversa",
  "Faros LED",
  "Techo Solar",
  "Sensores de Estacionamiento",
  "Asientos de Cuero",
  "GPS/Navegación",
  "Control de Crucero",
  "Llantas de Aleación",
  "Vidrios Polarizados",
  "Alarma",
  "Sistema de Sonido Premium",
  "Arranque por Botón",
  "Luces Automáticas",
  "Espejos Eléctricos",
  "Dirección Hidráulica",
  "Transmisión Automática",
];

const InputField: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, required, error, icon, children }) => {
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

const VehicleFormStepsPart2: React.FC<VehicleFormStepsPart2Props> = ({
  currentStep,
  formData,
  errors,
  handleInputChange,
  handleFeatureToggle,
  handleImageUpload,
  handleRemoveImage,
  isLoading,
  phoneCodes,
}) => {
  const { isDarkMode } = useDarkMode();

  const renderStep = () => {
    switch (currentStep) {
      case 4:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`p-3 rounded-xl shadow-lg ${
                    isDarkMode
                      ? "bg-gray-700"
                      : "bg-gradient-to-br from-indigo-500 to-indigo-600"
                  }`}
                >
                  <User
                    className={`w-6 h-6 ${isDarkMode ? "text-gray-200" : "text-white"}`}
                  />
                </div>
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Información de Contacto
                  </h2>
                  <p
                    className={`text-gray-600 text-sm ${
                      isDarkMode ? "text-gray-400" : ""
                    }`}
                  >
                    Datos para que los compradores te contacten
                  </p>
                </div>
              </div>
              <div
                className={`w-full rounded-full h-2 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className={`h-2 rounded-full w-4/5 transition-all duration-500 ${
                    isDarkMode
                      ? "bg-gray-500"
                      : "bg-gradient-to-r from-indigo-500 to-indigo-600"
                  }`}
                />
              </div>
            </div>
            <div className="space-y-6">
              <InputField
                label="Nombre Completo"
                required
                error={errors["sellerContact.name"]}
                icon={<User className="w-4 h-4 text-indigo-600" />}
              >
                <input
                  type="text"
                  value={formData.sellerContact?.name || ""}
                  onChange={(e) =>
                    handleInputChange("sellerContact.name", e.target.value)
                  }
                  onBlur={() =>
                    !formData.sellerContact?.name &&
                    handleInputChange("sellerContact.name", "")
                  }
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                      : "bg-white border-gray-200 text-gray-900 focus:border-indigo-500 hover:border-gray-300"
                  } ${
                    errors["sellerContact.name"]
                      ? "border-red-300 focus:border-red-500"
                      : ""
                  }`}
                  placeholder="Ej: Juan Carlos Pérez"
                  aria-required="true"
                  aria-describedby={
                    errors["sellerContact.name"] ? "name-error" : undefined
                  }
                />
              </InputField>
              <InputField
                label="Correo Electrónico"
                required
                error={errors["sellerContact.email"]}
                icon={<span className="text-indigo-600">📧</span>}
              >
                <input
                  type="email"
                  value={formData.sellerContact?.email || ""}
                  onChange={(e) =>
                    handleInputChange("sellerContact.email", e.target.value)
                  }
                  onBlur={() =>
                    !formData.sellerContact?.email &&
                    handleInputChange("sellerContact.email", "")
                  }
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                      : "bg-white border-gray-200 text-gray-900 focus:border-indigo-500 hover:border-gray-300"
                  } ${
                    errors["sellerContact.email"]
                      ? "border-red-300 focus:border-red-500"
                      : ""
                  }`}
                  placeholder="Ej: juan.perez@email.com"
                  aria-required="true"
                  aria-describedby={
                    errors["sellerContact.email"] ? "email-error" : undefined
                  }
                />
              </InputField>
              <InputField
                label="Teléfono"
                required
                error={errors["sellerContact.phone"]}
                icon={<span className="text-indigo-600">📱</span>}
              >
                <div className="flex space-x-2">
                  <select
                    value={formData.sellerContact?.phone?.split(" ")[0] || phoneCodes[0]}
                    onChange={(e) => {
                      const currentPhone = formData.sellerContact?.phone || "";
                      const numberPart = currentPhone.split(" ").slice(1).join(" ") || "";
                      const validNumber = numberPart.length <= 7 ? numberPart : numberPart.slice(0, 7);
                      handleInputChange("sellerContact.phone", `${e.target.value} ${validNumber}`);
                    }}
                    className={`w-1/4 px-3 py-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                        : "bg-white border-gray-200 text-gray-900 focus:border-indigo-500 hover:border-gray-300"
                    }`}
                  >
                    {phoneCodes.map((code) => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    pattern="[0-9]*"
                    maxLength={7}
                    value={formData.sellerContact?.phone?.split(" ").slice(1).join(" ") || ""}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(/\D/g, "");
                      if (inputValue.length <= 7) {
                        const code = formData.sellerContact?.phone?.split(" ")[0] || phoneCodes[0];
                        handleInputChange("sellerContact.phone", `${code} ${inputValue}`);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                        e.preventDefault();
                      }
                    }}
                    onBlur={() =>
                      !formData.sellerContact?.phone &&
                      handleInputChange("sellerContact.phone", `${phoneCodes[0]} `)
                    }
                    className={`w-3/4 px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                        : "bg-white border-gray-200 text-gray-900 focus:border-indigo-500 hover:border-gray-300"
                    } ${
                      errors["sellerContact.phone"]
                        ? "border-red-300 focus:border-red-500"
                        : ""
                    }`}
                    placeholder="1234567"
                    aria-required="true"
                    aria-describedby={
                      errors["sellerContact.phone"] ? "phone-error" : undefined
                    }
                  />
                </div>
              </InputField>
              <InputField
                label="Ubicación"
                required
                error={errors.location}
                icon={<MapPin className="w-4 h-4 text-indigo-600" />}
              >
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  onBlur={() =>
                    !formData.location && handleInputChange("location", "")
                  }
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                      : "bg-white border-gray-200 text-gray-900 focus:border-indigo-500 hover:border-gray-300"
                  } ${
                    errors.location
                      ? "border-red-300 focus:border-red-500"
                      : ""
                  }`}
                  placeholder="Ej: Caracas, Venezuela"
                  aria-required="true"
                  aria-describedby={
                    errors.location ? "location-error" : undefined
                  }
                />
              </InputField>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`p-3 rounded-xl shadow-lg ${
                    isDarkMode
                      ? "bg-gray-700"
                      : "bg-gradient-to-br from-teal-500 to-teal-600"
                  }`}
                >
                  <FileText
                    className={`w-6 h-6 ${isDarkMode ? "text-gray-200" : "text-white"}`}
                  />
                </div>
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Características y Descripción
                  </h2>
                  <p
                    className={`text-gray-600 text-sm ${
                      isDarkMode ? "text-gray-400" : ""
                    }`}
                  >
                    Detalles adicionales y fotos del vehículo
                  </p>
                </div>
              </div>
              <div
                className={`w-full rounded-full h-2 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className={`h-2 rounded-full w-full transition-all duration-500 ${
                    isDarkMode
                      ? "bg-gray-500"
                      : "bg-gradient-to-r from-teal-500 to-teal-600"
                  }`}
                />
              </div>
            </div>
            <div className="space-y-8">
              <InputField
                label="Características del Vehículo"
                icon={<Shield className="w-4 h-4 text-teal-600" />}
              >
                <div
                  className={`grid grid-cols-2 gap-3 mt-3 ${
                    isDarkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {AVAILABLE_FEATURES.map((feature) => (
                    <label
                      key={feature}
                      className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${
                        isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.features?.includes(feature) || false}
                        onChange={() => handleFeatureToggle(feature)}
                        className={`w-4 h-4 border-gray-300 rounded focus:ring-2 ${
                          isDarkMode
                            ? "text-teal-400 border-gray-600 focus:ring-teal-400"
                            : "text-teal-600 focus:ring-teal-500"
                        }`}
                        aria-label={`Activar ${feature}`}
                      />
                      <span className="text-sm flex-1">{feature}</span>
                    </label>
                  ))}
                </div>
              </InputField>
              <InputField
                label="Descripción del Vehículo"
                error={errors.description}
                icon={<FileText className="w-4 h-4 text-teal-600" />}
              >
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all duration-200 resize-none ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 focus:border-gray-400"
                      : "bg-white border-gray-200 text-gray-900 focus:border-teal-500 hover:border-gray-300"
                  }`}
                  placeholder="Describe tu vehículo: estado general, historial de mantenimiento, características especiales, razón de venta, etc."
                  maxLength={2000}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                />
                <div
                  className={`text-right text-sm mt-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {(formData.description || "").length}/2000 caracteres
                </div>
              </InputField>
              <InputField
                label="Fotos del Vehículo"
                icon={<ImageIcon className="w-4 h-4 text-teal-600" />}
              >
                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-teal-400 transition-colors ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-800"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/png,image/jpeg"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isLoading}
                      aria-label="Subir fotos del vehículo"
                    />
                    <label
                      htmlFor="images"
                      className="cursor-pointer flex flex-col items-center space-y-3"
                    >
                      <div
                        className={`p-3 rounded-full ${
                          isDarkMode ? "bg-teal-800" : "bg-teal-100"
                        }`}
                      >
                        <Upload
                          className={`w-6 h-6 ${
                            isDarkMode ? "text-teal-200" : "text-teal-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            isDarkMode ? "text-teal-200" : "text-teal-600"
                          }`}
                        >
                          Seleccionar Fotos
                        </p>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          PNG, JPG hasta 5MB cada una
                        </p>
                      </div>
                    </label>
                  </div>
                  {formData.images && formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={
                              typeof image === "string"
                                ? image
                                : URL.createObjectURL(image)
                            }
                            alt={`Imagen ${index + 1} del vehículo`}
                            width={200}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className={`absolute -top-2 -right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                              isDarkMode
                                ? "bg-red-700 text-white hover:bg-red-800"
                                : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                            aria-label={`Eliminar imagen ${index + 1}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    📸 Tip: Incluye fotos del exterior, interior, motor y
                    detalles importantes
                  </p>
                </div>
              </InputField>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return renderStep();
};

export default VehicleFormStepsPart2;