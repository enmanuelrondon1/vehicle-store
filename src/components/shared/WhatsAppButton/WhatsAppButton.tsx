// src/components/ui/WhatsAppButton.tsx
"use client";

import React from "react";
import { useLanguage } from "@/context/LanguajeContext";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber: string;
  vehicleBrand: string;
  vehicleModel: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  vehicleBrand,
  vehicleModel,
}) => {
  const { language } = useLanguage();

  // Formatear el número de teléfono para WhatsApp (eliminar espacios y caracteres no numéricos)
  const formattedPhone = phoneNumber.replace(/\D/g, "");

  // Crear el mensaje predefinido
  const message = encodeURIComponent(
    language === "es"
      ? `Hola, estoy interesado en el ${vehicleBrand} ${vehicleModel}. ¿Puedes darme más información?`
      : `Hello, I'm interested in the ${vehicleBrand} ${vehicleModel}. Can you provide more information?`
  );

  // Crear el enlace de WhatsApp
  const whatsappLink = `https://wa.me/${formattedPhone}?text=${message}`;

  return (
    <Button
      asChild
      className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors font-semibold"
    >
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="w-5 h-5 mr-2" />
        {language === "es" ? "Contactar por WhatsApp" : "Contact via WhatsApp"}
      </a>
    </Button>
  );
};

export default WhatsAppButton;
