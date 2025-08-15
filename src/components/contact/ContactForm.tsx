// src/components/contact/ContactForm.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDarkMode } from "@/context/DarkModeContext";
import {
  User,
  Mail,
  MessageSquare,
  Send,
  Loader2,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  general?: string;
}

const ContactForm: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido.";
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido.";
    }
    if (!formData.subject.trim()) newErrors.subject = "El asunto es requerido.";
    if (!formData.message.trim())
      newErrors.message = "El mensaje es requerido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Ocurrió un error al enviar el mensaje."
        );
      }

      setSuccessMessage(
        "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido.";
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Contáctanos
          </h1>
          <p
            className={`mt-4 max-w-2xl mx-auto text-xl ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            ¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte.
          </p>
        </div>

        <div
          className={`rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Formulario */}
            <div className="p-8 sm:p-12">
              <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="sr-only">
                    Nombre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User
                        className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Tu Nombre"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail
                        className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="sr-only">
                    Asunto
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MessageSquare
                        className={`h-5 w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      />
                    </div>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Asunto del mensaje"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`pl-10 ${errors.subject ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.subject && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="sr-only">
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Escribe tu mensaje aquí..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={errors.message ? "border-red-500" : ""}
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                  <div className="p-4 text-center rounded-md bg-green-100 text-green-800">
                    {successMessage}
                  </div>
                )}
                {errors.general && (
                  <div className="p-4 text-center rounded-md bg-red-100 text-red-800">
                    {errors.general}
                  </div>
                )}
              </form>
            </div>

            {/* Información de contacto */}
            <div
              className={`p-8 sm:p-12 ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}
            >
              <h2 className="text-2xl font-bold mb-6">Información Directa</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full ${isDarkMode ? "bg-blue-900/50" : "bg-blue-100"}`}
                  >
                    <MapPin className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Nuestra Oficina</h3>
                    <p
                      className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Av. Principal, Edificio Tech, Piso 5<br />
                      Caracas, Venezuela
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full ${isDarkMode ? "bg-green-900/50" : "bg-green-100"}`}
                  >
                    <Phone className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Teléfono</h3>
                    <p
                      className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      +58 (212) 555-0101
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full ${isDarkMode ? "bg-purple-900/50" : "bg-purple-100"}`}
                  >
                    <Mail className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p
                      className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      tech@1group.media
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div
                    className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full ${isDarkMode ? "bg-yellow-900/50" : "bg-yellow-100"}`}
                  >
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      Horario de Atención
                    </h3>
                    <p
                      className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Lunes a Viernes: 9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
