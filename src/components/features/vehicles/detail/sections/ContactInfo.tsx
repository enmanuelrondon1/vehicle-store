//src/components/features/vehicles/detail/sections/ContactInfo.tsx
"use client";

import React from "react";
import type { VehicleDataFrontend } from "@/types/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Mail } from "lucide-react";

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
      `https://wa.me/${sellerContact.phone.replace(
        /\\D/g,
        ""
      )}?text=${message}`,
      "_blank"
    );
  };

  return (
    <div className="p-6 rounded-xl border bg-card/50 border-border backdrop-blur-sm">
      <h3 className="text-xl font-bold mb-4 text-foreground">
        Información de Contacto
      </h3>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg font-bold text-foreground">
              {sellerContact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {sellerContact.name}
            </p>
            <p className="text-sm text-muted-foreground">Vendedor</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={handleCall}
            variant="secondary"
            className="w-full justify-start"
          >
            <Phone className="mr-2 h-4 w-4 text-blue-500" />
            <div className="text-left">
              <p className="font-semibold">Llamar</p>
              <p className="text-sm opacity-90">{sellerContact.phone}</p>
            </div>
          </Button>
          <Button
            onClick={handleWhatsApp}
            variant="secondary"
            className="w-full justify-start"
          >
            <MessageSquare className="mr-2 h-4 w-4 text-green-500" />
            <div className="text-left">
              <p className="font-semibold">WhatsApp</p>
              <p className="text-sm opacity-90">Enviar mensaje</p>
            </div>
          </Button>
          <Button
            onClick={handleEmail}
            variant="secondary"
            className="w-full justify-start"
          >
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <div className="text-left">
              <p className="font-semibold">Email</p>
              <p className="text-sm opacity-90">{sellerContact.email}</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ContactInfo = React.memo(ContactInfoComponent);