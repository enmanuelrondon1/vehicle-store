"use client";
import React, { useState, useCallback, useEffect } from "react";
import { VehicleDataBackend } from "@/types/types";
import { Loader2, Car, CheckCircle, AlertCircle } from "lucide-react";
import imageCompression from "browser-image-compression";
import VehicleFormSteps from "@/components/sections/PostAd/VehicleFormSteps";
import Head from "next/head";
import ProtectedRoute from "@/components/sections/ProtectedRoute/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BsBank } from "react-icons/bs";
import { useDarkMode } from "@/context/DarkModeContext";
import { useRouter } from "next/navigation";

interface FormErrors {
  [key: string]: string;
}

interface Bank {
  name: string;
  url: string;
}

const banks: Bank[] = [
  { name: "Banesco", url: "https://www.banesco.com" },
  { name: "Banco de Venezuela", url: "https://www.bancodevenezuela.com" },
  { name: "Banco Mercantil", url: "https://www.mercantilbanco.com" },
  { name: "Banco Provincial", url: "https://www.provincial.com" },
  { name: "Bancaribe", url: "https://www.bancaribe.com.ve" },
  { name: "Banco Exterior", url: "https://www.bancoexterior.com" },
  {
    name: "Banco Occidental de Descuento (BOD)",
    url: "https://www.bod.com.ve",
  },
  { name: "Banco del Tesoro", url: "https://www.bt.gob.ve" },
  { name: "BFC Banco Fondo Común", url: "https://www.bfc.com.ve" },
  { name: "Bancamiga", url: "https://www.bancamiga.com" },
];

const VehicleRegistrationForm: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<VehicleDataBackend>>({
    features: [],
    images: [],
    sellerContact: { name: "", email: "", phone: "" },
    year: new Date().getFullYear(),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string>("");

  const router = useRouter();

  const phoneCodes = ["0412", "0424", "0414", "0426", "0416"];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("vehicleFormData");
      if (saved) {
        try {
          setFormData(JSON.parse(saved));
        } catch (error) {
          console.error("Error loading saved data:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && submissionStatus !== "success") {
      setSaveStatus("saving");
      localStorage.setItem("vehicleFormData", JSON.stringify(formData));

      const timer = setTimeout(() => {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [formData, submissionStatus]);

  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: FormErrors = {};
      if (step === 1) {
        if (!formData.category) newErrors.category = "Selecciona una categoría";
        if (!formData.brand) newErrors.brand = "Ingresa la marca";
        if (!formData.model) newErrors.model = "Ingresa el modelo";
        if (
          !formData.year ||
          formData.year < 1900 ||
          formData.year > new Date().getFullYear() + 1
        )
          newErrors.year = "Ingresa un año válido (1900 - próximo año)";
        if (!formData.subcategory)
          newErrors.subcategory = "Selecciona una subcategoría";
      } else if (step === 2) {
        if (!formData.price || formData.price <= 0)
          newErrors.price = "Ingresa un precio válido";
        if (formData.mileage === undefined || formData.mileage < 0)
          newErrors.mileage = "Ingresa el kilometraje";
        if (!formData.condition)
          newErrors.condition = "Selecciona la condición";
      } else if (step === 3) {
        if (!formData.color) newErrors.color = "Selecciona un color";
        if (!formData.transmission)
          newErrors.transmission = "Selecciona la transmisión";
        if (!formData.fuelType)
          newErrors.fuelType = "Selecciona el tipo de combustible";
        if (formData.doors !== undefined && formData.doors < 1)
          newErrors.doors = "El número de puertas debe ser al menos 1";
        if (formData.seats !== undefined && formData.seats < 1)
          newErrors.seats = "El número de asientos debe ser al menos 1";
      } else if (step === 4) {
        if (!formData.sellerContact?.name)
          newErrors["sellerContact.name"] = "Ingresa tu nombre";
        if (
          !formData.sellerContact?.email ||
          !formData.sellerContact.email.includes("@")
        )
          newErrors["sellerContact.email"] =
            "Ingresa un email válido (debe incluir @)";
        if (
          !formData.sellerContact?.phone ||
          !/^(0412|0424|0414|0426|0416)\s?\d{7}$/.test(
            formData.sellerContact.phone
          )
        )
          newErrors["sellerContact.phone"] =
            "Ingresa un teléfono válido (ej: 0412 1234567)";
        if (!formData.location) newErrors.location = "Ingresa la ubicación";
      } else if (step === 5) {
        if (formData.features?.length === 0)
          newErrors.features = "Selecciona al menos una característica";
      } else if (step === 6) {
        if (!selectedBank)
          newErrors.selectedBank = "Debes seleccionar un banco";
        if (!paymentProof)
          newErrors.paymentProof = "Debes subir un comprobante de pago";
        if (!referenceNumber)
          newErrors.referenceNumber =
            "Ingresa el número de referencia del pago";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData, selectedBank, paymentProof, referenceNumber]
  );

 const handleInputChange = useCallback(
  (field: string, value: unknown) => {
    setFormData((prev) => {
      if (field === "sellerContact") {
        // Asegurar que value es un objeto válido
        const contactValue = typeof value === "object" && value !== null ? value : {};
        return {
          ...prev,
          sellerContact: {
            name: prev.sellerContact?.name || "",
            email: prev.sellerContact?.email || "",
            phone: prev.sellerContact?.phone || "",
            ...contactValue,
          },
        };
      }
      
      if (field.startsWith("sellerContact.")) {
        const contactField = field.split(".")[1];
        return {
          ...prev,
          sellerContact: {
            name: prev.sellerContact?.name || "",
            email: prev.sellerContact?.email || "",
            phone: prev.sellerContact?.phone || "",
            [contactField]: value,
          },
        };
      }
      
      return { ...prev, [field]: value };
    });

    // Limpiar errores
    if (errors[field] || (field.startsWith("sellerContact.") && errors[field])) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        if (field.startsWith("sellerContact.")) {
          delete newErrors[field];
        }
        return newErrors;
      });
    }
  },
  [errors]
);

  const handleFeatureToggle = useCallback((feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...(prev.features || []), feature],
    }));
  }, []);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        const maxSize = 5 * 1024 * 1024;
        const validFiles = await Promise.all(
          files.map(async (file) => {
            if (file.size > maxSize || !file.type.startsWith("image/")) {
              alert(
                `${file.name} no es válido. Solo imágenes (PNG/JPG) hasta 5MB.`
              );
              return null;
            }
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 800,
              useWebWorker: true,
            };
            try {
              const compressedFile = await imageCompression(file, options);
              return compressedFile;
            } catch (error) {
              console.error("Error al comprimir:", error);
              alert(`Error al comprimir ${file.name}.`);
              return null;
            }
          })
        ).then((results) => results.filter((file) => file !== null) as File[]);

        if (validFiles.length === 0) return;

        setIsLoading(true);
        try {
          const uploadPromises = validFiles.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "vehicle-upload");

            const res = await fetch(
              `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
              { method: "POST", body: formData }
            );

            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            return data.secure_url;
          });

          const imageUrls = await Promise.all(uploadPromises);
          setFormData((prev) => ({
            ...prev,
            images: prev.images
              ? [...prev.images, ...imageUrls]
              : [...imageUrls],
          }));
        } catch (error) {
          console.error("Error al subir imágenes:", error);
          alert("Error al subir imágenes. Revisa la consola.");
        } finally {
          setIsLoading(false);
        }
      }
    },
    []
  );

  const handleRemoveImage = useCallback((index: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta imagen?")) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images!.filter((_, i) => i !== index),
      }));
    }
  }, []);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(6)) return;

    setIsSubmitting(true);
    try {
      const dataToSend = {
        ...formData,
        features: formData.features || [],
        images: formData.images || [],
        availability: "PENDING",
        warranty: formData.warranty || "NO_WARRANTY",
        postedDate: new Date().toISOString(),
        selectedBank: selectedBank?.name,
        referenceNumber,
      };

      const vehicleRes = await fetch("/api/post-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!vehicleRes.ok)
        throw new Error(
          `Error ${vehicleRes.status}: ${await vehicleRes.text()}`
        );
      const vehicleData = await vehicleRes.json();

      if (!vehicleData.success || !vehicleData.data) {
        setSubmissionStatus("error");
        setErrors(
          vehicleData.validationErrors || {
            general:
              vehicleData.error || vehicleData.message || "Error desconocido",
          }
        );
        return;
      }

      const paymentFormData = new FormData();
      paymentFormData.append("vehicleId", vehicleData.data._id);
      paymentFormData.append("file", paymentProof!);

      const uploadRes = await fetch("/api/upload-payment-proof", {
        method: "POST",
        body: paymentFormData,
      });

      if (!uploadRes.ok)
        throw new Error(
          `Error al subir el comprobante: ${await uploadRes.text()}`
        );

      const uploadData = await uploadRes.json();
      if (!uploadData.success)
        throw new Error(uploadData.error || "Error al subir el comprobante");

      setSubmissionStatus("success");
      setFormData((prev) => ({
        ...prev,
        _id: vehicleData.data._id,
        paymentProof: uploadData.url || uploadData.secure_url,
      }));
      setCurrentStep(7);
      localStorage.removeItem("vehicleFormData");
    } catch (error) {
      setSubmissionStatus("error");
      console.error("Error en submit:", error);
      setErrors({
        general: error instanceof Error ? error.message : "Error de red",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateStep, selectedBank, referenceNumber, paymentProof]);

  const manualSave = useCallback(() => {
    localStorage.setItem("vehicleFormData", JSON.stringify(formData));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }, [formData]);

  return (
    <ProtectedRoute>
      <Head>
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="robots" content="noindex, nofollow" />
        <title>Publicar Anuncio - Vehicle Store</title>
      </Head>
      <div
        className={`min-h-screen py-8 px-4 ${
          isDarkMode
            ? "bg-gray-900 text-gray-100"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <Card
            className={
              isDarkMode
                ? "bg-gray-800 text-gray-100 border-gray-700"
                : "bg-white border-gray-200"
            }
          >
            <CardHeader className="text-center">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-4 ${
                  isDarkMode
                    ? "bg-gray-700"
                    : "bg-gradient-to-r from-blue-500 to-purple-600"
                }`}
              >
                <Car className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold">
                Registrar Vehículo
              </CardTitle>
              <p
                className={`text-md ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Completa este formulario profesional para publicar tu vehículo y
                conectar con compradores potenciales
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6 hidden md:block">
                <div className="flex justify-between items-center mb-4">
                  {[
                    { label: "Información Básica", icon: "🚗" },
                    { label: "Precio y Condición", icon: "💰" },
                    { label: "Especificaciones", icon: "⚙️" },
                    { label: "Contacto", icon: "👤" },
                    { label: "Características", icon: "⭐" },
                    { label: "Confirmación de Pago", icon: "💳" },
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center relative flex-1"
                    >
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 ${
                          index + 1 < currentStep
                            ? isDarkMode
                              ? "bg-gray-700 text-white"
                              : "bg-blue-500 text-white"
                            : index + 1 === currentStep
                            ? isDarkMode
                              ? "bg-gray-600 text-white ring-2 ring-gray-800"
                              : "bg-blue-600 text-white ring-2 ring-blue-100"
                            : isDarkMode
                            ? "bg-gray-800 text-gray-500"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {index + 1 < currentStep ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <p
                        className={`mt-2 text-xs ${
                          index + 1 <= currentStep
                            ? isDarkMode
                              ? "text-gray-300"
                              : "text-blue-600"
                            : isDarkMode
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                      {index < 5 && (
                        <div
                          className={`absolute top-6 left-1/2 w-full h-1 -z-10 ${
                            index + 1 < currentStep
                              ? isDarkMode
                                ? "bg-gray-700"
                                : "bg-blue-500"
                              : isDarkMode
                              ? "bg-gray-800"
                              : "bg-gray-200"
                          }`}
                          style={{
                            marginLeft: "24px",
                            width: "calc(100% - 48px)",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:hidden mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p
                    className={`text-sm font-bold ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Paso {currentStep} de 6
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {Math.round(((currentStep - 1) / 5) * 100)}% completado
                  </p>
                </div>
                <Progress
                  value={((currentStep - 1) / 5) * 100}
                  className={isDarkMode ? "bg-gray-700" : "bg-gray-200"}
                  color={isDarkMode ? "gray" : "blue"}
                />
              </div>

              {submissionStatus === "error" && (
                <div
                  className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 ${
                    isDarkMode
                      ? "bg-red-700 text-white"
                      : "bg-red-500 text-white"
                  }`}
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>
                    {errors.general ||
                      "Error al registrar el vehículo. Por favor, intenta de nuevo."}
                  </span>
                </div>
              )}
              {currentStep === 6 ? (
                <div>
                  <h2
                    className={`text-2xl font-bold text-center mb-4 ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Confirmación de Pago
                  </h2>
                  <p
                    className={`text-center mb-6 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Selecciona un banco, realiza el pago, ingresa el número de
                    referencia y sube el comprobante para finalizar el registro.
                  </p>
                  <div className="grid gap-4 mb-6">
                    {banks.map((bank) => (
                      <Button
                        key={bank.name}
                        variant={
                          selectedBank?.name === bank.name
                            ? "default"
                            : "outline"
                        }
                        onClick={() => {
                          setSelectedBank(bank);
                          window.open(
                            bank.url,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                        className="w-full justify-between"
                      >
                        <span>{bank.name}</span>
                        <BsBank className="w-5 h-5 text-blue-500" />
                      </Button>
                    ))}
                    {errors.selectedBank && (
                      <p
                        className={`text-sm mt-1 ${
                          isDarkMode ? "text-red-400" : "text-red-500"
                        }`}
                      >
                        {errors.selectedBank}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      className={`block mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Número de Referencia
                    </label>
                    <input
                      type="text"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="Ingresa el número de referencia del pago"
                      className={`w-full p-2 border rounded-md ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {errors.referenceNumber && (
                      <p
                        className={`text-sm mt-1 ${
                          isDarkMode ? "text-red-400" : "text-red-500"
                        }`}
                      >
                        {errors.referenceNumber}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      className={`block mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Comprobante de Pago
                    </label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,application/pdf"
                      onChange={(e) =>
                        setPaymentProof(e.target.files?.[0] || null)
                      }
                      className={`w-full p-2 border rounded-md ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300"
                      } file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
                    />
                    {errors.paymentProof && (
                      <p
                        className={`text-sm mt-1 ${
                          isDarkMode ? "text-red-400" : "text-red-500"
                        }`}
                      >
                        {errors.paymentProof}
                      </p>
                    )}
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      !selectedBank ||
                      !referenceNumber ||
                      !paymentProof
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                        Registrando...
                      </>
                    ) : (
                      "Finalizar Registro"
                    )}
                  </Button>
                </div>
              ) : currentStep === 5 ? (
                <div>
                  <VehicleFormSteps
                    currentStep={currentStep}
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange}
                    handleFeatureToggle={handleFeatureToggle}
                    handleImageUpload={handleImageUpload}
                    handleRemoveImage={handleRemoveImage}
                    isLoading={isLoading}
                    setFormData={setFormData}
                    setCurrentStep={setCurrentStep}
                    phoneCodes={phoneCodes}
                  />
                  <CardFooter className="flex justify-end mt-4">
                    <Button onClick={nextStep} disabled={isSubmitting}>
                      Siguiente
                    </Button>
                  </CardFooter>
                </div>
              ) : (
                <div>
                  <VehicleFormSteps
                    currentStep={currentStep}
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange}
                    handleFeatureToggle={handleFeatureToggle}
                    handleImageUpload={handleImageUpload}
                    handleRemoveImage={handleRemoveImage}
                    isLoading={isLoading}
                    setFormData={setFormData}
                    setCurrentStep={setCurrentStep}
                    phoneCodes={phoneCodes}
                  />
                  <CardFooter className="flex justify-between mt-4 gap-2">
                    {currentStep > 1 && (
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={isSubmitting}
                      >
                        Anterior
                      </Button>
                    )}
                    <Button
                      onClick={currentStep < 5 ? nextStep : manualSave}
                      disabled={isSubmitting}
                    >
                      {currentStep < 5
                        ? "Siguiente"
                        : saveStatus === "saving"
                        ? "Guardando..."
                        : saveStatus === "saved"
                        ? "Guardado"
                        : "Guardar Progreso"}
                    </Button>
                  </CardFooter>
                </div>
              )}
              {currentStep === 7 && (
                <div className="flex items-center justify-center min-h-[calc(100vh-20rem)]">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                    <h2
                      className={`text-2xl font-bold mt-4 ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      ¡Registro Exitoso!
                    </h2>
                    <p
                      className={`text-lg mt-2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Tu anuncio está pendiente de aprobación. Te notificaremos
                      cuando esté publicado.
                    </p>
                    <div className="mt-6 space-x-4">
                      <Button
                        className="mt-4"
                        onClick={() => setCurrentStep(1)}
                      >
                        Crear Nuevo Anuncio
                      </Button>
                      <Button
                        className="mt-4"
                        onClick={() => router.push("/vehicleList")}
                      >
                        Ver Anuncios
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="mt-12 text-center">
            <div
              className={`inline-flex items-center px-6 py-3 rounded-full border shadow-md ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-gray-300"
                  : "bg-white/60 border-white/20 text-gray-600"
              }`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
              <p className="text-sm">🔒 Tus datos están seguros y protegidos</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default VehicleRegistrationForm;