//src/components/features/vehicles/detail/sections/ContactInfo.tsx
"use client";

import React from "react";
import type { VehicleDataFrontend } from "@/types/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
        /\D/g,
        ""
      )}?text=${message}`,
      "_blank"
    );
  };

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-heading">
          Información de Contacto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 border-2 border-primary/20">
            <AvatarFallback className="text-xl font-bold">
              {sellerContact.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-lg text-foreground">
              {sellerContact.name}
            </p>
            <p className="text-sm text-muted-foreground font-medium">Vendedor</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={handleCall}
            variant="outline"
            className="w-full h-auto justify-start p-3 transition-all duration-300 ease-in-out group hover:bg-blue-500/10 border-blue-500/20 hover:border-blue-500"
          >
            <Phone className="mr-4 h-5 w-5 text-blue-500 transition-transform group-hover:scale-110" />
            <div className="text-left">
              <p className="font-semibold text-sm text-foreground">Llamar</p>
              <p className="text-xs text-muted-foreground group-hover:text-blue-600">
                {sellerContact.phone}
              </p>
            </div>
          </Button>
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            className="w-full h-auto justify-start p-3 transition-all duration-300 ease-in-out group hover:bg-green-500/10 border-green-500/20 hover:border-green-500"
          >
            <MessageSquare className="mr-4 h-5 w-5 text-green-500 transition-transform group-hover:scale-110" />
            <div className="text-left">
              <p className="font-semibold text-sm text-foreground">WhatsApp</p>
              <p className="text-xs text-muted-foreground group-hover:text-green-600">
                Enviar mensaje
              </p>
            </div>
          </Button>
          <Button
            onClick={handleEmail}
            variant="outline"
            className="w-full h-auto justify-start p-3 transition-all duration-300 ease-in-out group hover:bg-gray-500/10 border-gray-500/20 hover:border-gray-500"
          >
            <Mail className="mr-4 h-5 w-5 text-muted-foreground transition-transform group-hover:scale-110" />
            <div className="text-left">
              <p className="font-semibold text-sm text-foreground">Email</p>
              <p className="text-xs text-muted-foreground truncate max-w-[150px] group-hover:text-gray-600">
                {sellerContact.email}
              </p>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const ContactInfo = React.memo(ContactInfoComponent);