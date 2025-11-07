// src/components/features/vehicles/registration/success-screen.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";

// ✅ IMPORTA TU ARCHIVO DE ANIMACIÓN LOTTIE
// Asegúrate de que la ruta sea correcta desde la carpeta 'public'
// import logoAnimation from "/animations/logo-success.json"

interface SuccessScreenProps {
  onCreateNew: () => void;
  onViewAds: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  onCreateNew,
  onViewAds,
}) => {
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Pequeño retraso para que la animación Lottie se inicie suavemente
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-20rem)] p-4">
      <Card
        className={cn(
          "w-full max-w-md shadow-2xl border-border/50 overflow-hidden",
          "transition-all duration-700 transform",
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        data-aos="zoom-in"
        data-aos-duration="800"
      >
        <CardContent className="p-8 text-center space-y-6">
          {/* ✅ ANIMACIÓN DEL LOGOTIPO */}
          <div className="w-32 h-32 mx-auto">
            <video
              className="w-32 h-32 mx-auto rounded-lg"
              autoPlay
              muted
              onEnded={() => setAnimationCompleted(true)}
              playsInline // Importante para móviles
            >
              <source src="/animations/logo-success.mp4" type="video/mp4" />
              Tu navegador no soporta videos.
            </video>
          </div>

          {/* ✅ ICONO DE CHECK QUE APARECE DESPUÉS DE LA ANIMACIÓN */}
          <div
            className={cn(
              "transition-all duration-700 transform",
              animationCompleted
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-75 translate-y-4"
            )}
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* ✅ TEXTO QUE APARECE CON UNA TRANSICIÓN SUAVE */}
          <div
            className={cn(
              "space-y-2 transition-all duration-700 delay-300 transform",
              animationCompleted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <h2 className="text-3xl font-bold font-heading text-foreground flex items-center justify-center gap-2">
              ¡Registro Exitoso!
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </h2>
            <p className="text-muted-foreground">
              Tu anuncio está pendiente de aprobación. Te notificaremos cuando
              esté publicado.
            </p>
          </div>

          {/* ✅ BOTONES CON EFECTO HOVER MEJORADO */}
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-3 pt-4 transition-all duration-700 delay-500",
              animationCompleted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <Button
              onClick={onCreateNew}
              className="w-full gap-2 transition-all duration-300 hover:scale-105"
              size="lg"
            >
              Crear Nuevo Anuncio
            </Button>
            <Button
              variant="outline"
              onClick={onViewAds}
              className="w-full transition-all duration-300 hover:scale-105"
              size="lg"
            >
              Ver Anuncios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
