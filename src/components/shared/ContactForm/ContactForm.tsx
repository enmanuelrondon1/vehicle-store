// src/components/ui/ContactForm.tsx
"use client";

import React, { useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguajeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Send } from "lucide-react";

interface ContactFormProps {
  sellerEmail: string;
  vehicleBrand: string;
  vehicleModel: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ sellerEmail, vehicleBrand, vehicleModel }) => {
  const { language,  } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Validación básica
      if (!formData.name || !formData.email || !formData.message) {
        setError(
          language === "es"
            ? "Por favor completa todos los campos."
            : "Please fill out all fields."
        );
        return;
      }

      // Simulación de envío (en una app real, aquí harías una llamada a una API)
      console.log("Formulario enviado:", {
        to: sellerEmail,
        from: formData.email,
        name: formData.name,
        message: formData.message,
        subject: `Consulta sobre ${vehicleBrand} ${vehicleModel}`,
      });

      setIsSubmitted(true);
      setError(null);
      setFormData({ name: "", email: "", message: "" });
    },
    [formData, sellerEmail, vehicleBrand, vehicleModel, language]
  );

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {language === "es" ? "Enviar mensaje al vendedor" : "Send a message to the seller"}
      </h3>

      {isSubmitted ? (
        <Alert className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
          <AlertTitle className="text-green-800 dark:text-green-100">
            {language === "es" ? "¡Mensaje enviado!" : "Message sent!"}
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-200">
            {language === "es"
              ? "El vendedor te contactará pronto."
              : "The seller will contact you soon."}
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700">
              <AlertTitle className="text-red-800 dark:text-red-100">
                {language === "es" ? "Error" : "Error"}
              </AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
              {language === "es" ? "Nombre" : "Name"}
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={language === "es" ? "Tu nombre" : "Your name"}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              {language === "es" ? "Correo electrónico" : "Email"}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={language === "es" ? "Tu correo" : "Your email"}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
              {language === "es" ? "Mensaje" : "Message"}
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={
                language === "es"
                  ? `Hola, estoy interesado en el ${vehicleBrand} ${vehicleModel}...`
                  : `Hello, I'm interested in the ${vehicleBrand} ${vehicleModel}...`
              }
              rows={4}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-semibold"
          >
            <Send className="w-5 h-5 mr-2" />
            {language === "es" ? "Enviar mensaje" : "Send message"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;