// src/components/features/vehicles/detail/sections/ContactInfo.tsx
"use client";

import React from "react";
import type { VehicleDataFrontend } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Phone, MessageSquare, Mail, MapPin, CheckCircle, Shield, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ContactInfoProps {
  sellerContact: VehicleDataFrontend["sellerContact"];
  vehicleName: string;
  price: number;
}

// ✅ FUNCIÓN LOCAL para formatear el precio con el símbolo de dólar al inicio
const formatPriceDisplay = (price: number) => {
  const formattedNumber = new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  
  return `$${formattedNumber}`;
};

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
      },\n\nEstoy interesado en tu ${vehicleName} por ${formatPriceDisplay(
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
      }, estoy interesado en tu ${vehicleName} por ${formatPriceDisplay(
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
    <Card 
      className="overflow-hidden shadow-lg border-border/50 sticky top-24"
      data-aos="fade-up"
      data-aos-duration="700"
      data-aos-delay="600"
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-xl">
            Contacto del Vendedor
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Información del vendedor */}
        <div 
          className="flex items-center gap-4"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="100"
        >
          <Avatar className="w-16 h-16 border-2 border-primary/20">
            <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
              {sellerContact.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-bold text-lg text-foreground">
              {sellerContact.name}
            </p>
            <p className="text-sm text-muted-foreground">Vendedor</p>
          </div>
        </div>

        <Separator />

        {/* Botones de contacto */}
        <div className="grid grid-cols-1 gap-3">
          <div
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="200"
          >
            <Button
              onClick={handleCall}
              variant="outline"
              className="w-full h-auto justify-start p-4 transition-all duration-300 group hover:bg-blue-500/10 border-blue-500/20 hover:border-blue-500 hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-foreground">Llamar ahora</p>
                <p className="text-xs text-muted-foreground group-hover:text-blue-600 truncate max-w-[180px]">
                  {sellerContact.phone}
                </p>
              </div>
            </Button>
          </div>
          
          <div
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="300"
          >
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="w-full h-auto justify-start p-4 transition-all duration-300 group hover:bg-green-500/10 border-green-500/20 hover:border-green-500 hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-foreground">Enviar WhatsApp</p>
                <p className="text-xs text-muted-foreground group-hover:text-green-600">
                  Respuesta rápida
                </p>
              </div>
            </Button>
          </div>
          
          <div
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="400"
          >
            <Button
              onClick={handleEmail}
              variant="outline"
              className="w-full h-auto justify-start p-4 transition-all duration-300 group hover:bg-gray-500/10 border-gray-500/20 hover:border-gray-500 hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
                <Mail className="h-5 w-5 text-gray-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-foreground">Enviar Email</p>
                <p className="text-xs text-muted-foreground group-hover:text-gray-600 truncate max-w-[180px]">
                  {sellerContact.email}
                </p>
              </div>
            </Button>
          </div>
        </div>

        {/* Sección de confianza - ✅ MODIFICADA para no depender de 'type' o 'memberSince' */}
        <div 
          className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-delay="500"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                Vendedor Verificado
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Este vendedor ha sido verificado por nuestro equipo de seguridad para garantizar una transacción segura.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ContactInfo = React.memo(ContactInfoComponent);