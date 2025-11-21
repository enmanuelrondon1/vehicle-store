// src/components/features/vehicles/detail/sections/ContactInfo.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import type { VehicleDataFrontend } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Phone, MessageSquare, Mail, MapPin, CheckCircle, Shield, Star, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ContactInfoProps {
  sellerContact: VehicleDataFrontend["sellerContact"];
  vehicleName: string;
  price: number;
  location: string;
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
  location,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="card-premium shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 rounded-full flex items-center justify-center glow-effect"
              style={{ background: 'var(--gradient-primary)' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Contacto del Vendedor
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comunícate directamente con el vendedor
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Información del vendedor */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar className="w-16 h-16 border-2" style={{ borderColor: 'var(--primary-20)' }}>
                <AvatarFallback className="text-xl font-bold" style={{ background: 'var(--gradient-primary)', color: 'var(--primary-foreground)' }}>
                  {sellerContact.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex-1">
              <p className="font-bold text-lg text-foreground">
                {sellerContact.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="badge-premium">
                  Vendedor Verificado
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            </div>
          </motion.div>

          <Separator />

          <div className="grid grid-cols-1 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                onClick={handleCall}
                variant="outline"
                className="w-full h-auto justify-start p-4 card-hover group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 card-glass">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-foreground">Llamar ahora</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {sellerContact.phone}
                  </p>
                </div>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                onClick={handleWhatsApp}
                variant="outline"
                className="w-full h-auto justify-start p-4 card-hover group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'var(--success-10)' }}>
                  <MessageSquare className="h-5 w-5 text-success" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-foreground">Enviar WhatsApp</p>
                  <p className="text-xs text-muted-foreground">
                    Respuesta rápida
                  </p>
                </div>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                onClick={handleEmail}
                variant="outline"
                className="w-full h-auto justify-start p-4 card-hover group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 card-glass">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-foreground">Enviar Email</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {sellerContact.email}
                  </p>
                </div>
              </Button>
            </motion.div>
          </div>

          {/* Sección de confianza */}
          <motion.div
            className="p-6 rounded-xl card-glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-start gap-4">
              <motion.div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--primary-10)' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Shield className="w-5 h-5 text-primary" />
              </motion.div>
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
          </motion.div>

          {/* Ubicación */}
          <motion.div
            className="p-4 rounded-xl card-glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-10)' }}>
                <MapPin className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">
                  Ubicación del Vendedor
                </h4>
                <p className="text-xs text-muted-foreground">
                  {location || "Ciudad, País"}
                </p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const ContactInfo = React.memo(ContactInfoComponent);