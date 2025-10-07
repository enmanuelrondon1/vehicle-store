//src/components/features/vehicles/detail/sections/ContactInfo.tsx
"use client";

import React from "react";
import type { VehicleDataFrontend } from "@/types/types";
import { useDarkMode } from "@/context/DarkModeContext";
import { formatPrice } from "@/lib/utils";

interface ContactInfoProps {
  sellerContact: VehicleDataFrontend["sellerContact"];
  vehicleName: string;
  price: number;
}

const ContactInfoComponent: React.FC<ContactInfoProps> = ({
  sellerContact,
  vehicleName,
  price,
}) => {
  const { isDarkMode } = useDarkMode();

  const handleCall = () => {
    window.open(`tel:${sellerContact.phone}`, "_self");
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Interés en ${vehicleName}`);
    const body = encodeURIComponent(
      `Hola ${
        sellerContact.name
      },\n\nEstoy interesado en tu ${vehicleName} por ${formatPrice(
        price
      )}.\n\n¿Podrías darme más información?\n\nGracias.`
    );
    window.open(
      `mailto:${sellerContact.email}?subject=${subject}&body=${body}`,
      "_self"
    );
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola ${
        sellerContact.name
      }, estoy interesado en tu ${vehicleName} por ${formatPrice(
        price
      )}. ¿Podrías darme más información?`
    );
    window.open(
      `https://wa.me/${sellerContact.phone.replace(/\D/g, "")}?text=${message}`,
      "_blank"
    );
  };

  return (
    <div
      className={`p-6 rounded-xl border ${
        isDarkMode
          ? "bg-gray-800/50 border-gray-700"
          : "bg-white/50 border-gray-200"
      } backdrop-blur-sm`}
    >
      <h3
        className={`text-xl font-bold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Información de Contacto
      </h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            } flex items-center justify-center`}
          >
            <span
              className={`text-lg font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {sellerContact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p
              className={`font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {sellerContact.name}
            </p>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Vendedor
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button onClick={handleCall} className="flex items-center gap-3 p-3 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"><div className="text-left"><p className="font-semibold">Llamar</p><p className="text-sm opacity-90">{sellerContact.phone}</p></div></button>
          <button onClick={handleWhatsApp} className="flex items-center gap-3 p-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"><div className="text-left"><p className="font-semibold">WhatsApp</p><p className="text-sm opacity-90">Enviar mensaje</p></div></button>
          <button onClick={handleEmail} className="flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"><div className="text-left"><p className="font-semibold">Email</p><p className="text-sm opacity-90">{sellerContact.email}</p></div></button>
        </div>
      </div>
    </div>
  );
};

export const ContactInfo = React.memo(ContactInfoComponent);