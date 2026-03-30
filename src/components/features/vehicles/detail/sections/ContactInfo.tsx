// src/components/features/vehicles/detail/sections/ContactInfo.tsx
// ✅ OPTIMIZADO: eliminado framer-motion completamente.
//    Tenía 8 motion.div con initial/animate que se ejecutaban todos en el
//    primer render — este componente se carga inmediatamente (no lazy).
//    Reemplazado por animate-fade-in CSS con delay escalonado.
//    whileHover/whileTap → CSS hover:scale active:scale.

"use client";

import React from "react";
import type { VehicleDataFrontend } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Phone, MessageSquare, Mail, MapPin, CheckCircle, Shield, Star, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ContactInfoProps {
  sellerContact: VehicleDataFrontend["sellerContact"];
  vehicleName: string;
  price: number;
  location: string;
}

const formatPriceDisplay = (price: number) => {
  const formattedNumber = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return `$${formattedNumber}`;
};

const ContactInfoComponent: React.FC<ContactInfoProps> = ({
  sellerContact,
  vehicleName,
  price,
  location,
}) => {
  const handleCall = () => window.open(`tel:${sellerContact.phone}`, "_self");

  const handleEmail = () => {
    const subject = encodeURIComponent(`Interés en ${vehicleName}`);
    const body = encodeURIComponent(
      `Hola ${sellerContact.name},\n\nEstoy interesado en tu ${vehicleName} por ${formatPriceDisplay(price)}.\n\n¿Podrías darme más información?\n\nGracias.`
    );
    window.open(`mailto:${sellerContact.email}?subject=${subject}&body=${body}`, "_self");
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola ${sellerContact.name}, estoy interesado en tu ${vehicleName} por ${formatPriceDisplay(price)}. ¿Podrías darme más información?`
    );
    window.open(`https://wa.me/${sellerContact.phone.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  return (
    // ✅ animate-fade-in CSS en lugar de motion.div initial/animate
    <div className="animate-fade-in">
      <Card className="card-premium shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            {/* ✅ whileHover rotate → group-hover CSS */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center glow-effect hover:scale-110 hover:rotate-6 transition-transform duration-300"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Phone className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Contacto del Vendedor</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comunícate directamente con el vendedor
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Vendedor */}
          <div
            className="flex items-center gap-4 animate-fade-in"
            style={{ animationDelay: "80ms", animationFillMode: "both" }}
          >
            {/* ✅ whileHover scale → hover:scale CSS */}
            <Avatar
              className="w-16 h-16 border-2 hover:scale-105 transition-transform duration-200"
              style={{ borderColor: "var(--primary-20)" }}
            >
              <AvatarFallback
                className="text-xl font-bold"
                style={{ background: "var(--gradient-primary)", color: "var(--primary-foreground)" }}
              >
                {sellerContact.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-bold text-lg text-foreground">{sellerContact.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="badge-premium">Vendedor Verificado</Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Botones de contacto */}
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                onClick: handleCall,
                icon: <Phone className="h-5 w-5 text-primary" />,
                bg: "var(--card)",
                title: "Llamar ahora",
                sub: sellerContact.phone,
                delay: "160ms",
              },
              {
                onClick: handleWhatsApp,
                icon: <MessageSquare className="h-5 w-5 text-success" />,
                bg: "var(--success-10)",
                title: "Enviar WhatsApp",
                sub: "Respuesta rápida",
                delay: "240ms",
              },
              {
                onClick: handleEmail,
                icon: <Mail className="h-5 w-5 text-muted-foreground" />,
                bg: "var(--card)",
                title: "Enviar Email",
                sub: sellerContact.email,
                delay: "320ms",
              },
            ].map((btn, i) => (
              <div
                key={i}
                className="animate-fade-in"
                style={{ animationDelay: btn.delay, animationFillMode: "both" }}
              >
                <Button
                  onClick={btn.onClick}
                  variant="outline"
                  className="w-full h-auto justify-start p-4 card-hover group hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3 card-glass"
                    style={{ backgroundColor: btn.bg }}
                  >
                    {btn.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-foreground">{btn.title}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">{btn.sub}</p>
                  </div>
                </Button>
              </div>
            ))}
          </div>

          {/* Compra protegida */}
          <div
            className="p-6 rounded-xl card-glass animate-fade-in"
            style={{ animationDelay: "400ms", animationFillMode: "both" }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 hover:scale-110 hover:rotate-6 transition-transform duration-300"
                style={{ backgroundColor: "var(--primary-10)" }}
              >
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  Compra Protegida
                  <CheckCircle className="w-4 h-4 text-success" />
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Este vendedor ha sido verificado por nuestro equipo de seguridad para garantizar una transacción segura.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Tiempo de respuesta promedio: 2 horas</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div
            className="p-4 rounded-xl card-glass animate-fade-in"
            style={{ animationDelay: "480ms", animationFillMode: "both" }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "var(--accent-10)" }}
              >
                <MapPin className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Ubicación del Vendedor</h4>
                <p className="text-xs text-muted-foreground">{location || "Ciudad, País"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ContactInfo = React.memo(ContactInfoComponent);