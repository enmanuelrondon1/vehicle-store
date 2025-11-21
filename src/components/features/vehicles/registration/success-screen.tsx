// src/components/features/vehicles/registration/success-screen.tsx
"use client";

import React from "react";
import { useState, useEffect } from "react";
import { CheckCircle, Sparkles, Car, Star, Shield, ArrowRight, Eye, Plus, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SuccessScreenProps {
  onCreateNew: () => void;
  onViewAds: () => void;
}

// ============================================
// SUB-COMPONENTE: Encabezado de Éxito
// ============================================
const SuccessHeader: React.FC<{ showContent: boolean }> = React.memo(({ showContent }) => (
  <div className="text-center space-y-6">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-success/10 to-primary/10 rounded-3xl blur-xl"></div>
      <div className="relative flex items-center justify-center gap-4 p-6 rounded-3xl bg-gradient-to-br from-success/5 via-transparent to-primary/5 border border-border/50 shadow-glass">
        <div className="p-4 rounded-2xl shadow-lg bg-gradient-to-br from-success to-success/80 ring-4 ring-success/10 animate-pulse">
          <CheckCircle className="w-8 h-8 text-success-foreground" />
        </div>
        <div className="text-left">
          <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
            ¡Registro Exitoso!
          </h2>
          <p className="text-base text-muted-foreground mt-1">
            Tu anuncio está pendiente de aprobación
          </p>
        </div>
      </div>
    </div>
  </div>
));
SuccessHeader.displayName = "SuccessHeader";

// ============================================
// SUB-COMPONENTE: Animación de Éxito
// ============================================
// ============================================
// SUB-COMPONENTE: Animación de Éxito (VIDEO ACTIVADO)
// ============================================
const SuccessAnimation: React.FC<{ animationCompleted: boolean }> = React.memo(({ animationCompleted }) => (
  <div className="relative">
    {/* Video del logotipo - ACTIVADO CORRECTAMENTE */}
    <div className={cn(
      "w-32 h-32 mx-auto rounded-xl overflow-hidden transition-all duration-700",
      animationCompleted ? "opacity-0 scale-75" : "opacity-100 scale-100"
    )}>
      <video
        className="w-32 h-32 mx-auto rounded-lg object-cover"
        autoPlay
        muted
        loop
        playsInline
        controls={false} // Ocultar controles para mejor diseño
        preload="auto" // Precargar el video
      >
        <source
          src="https://res.cloudinary.com/dcdawwvx2/video/upload/v1762559218/generated_video_1_udkh0n.mp4"
          type="video/mp4"
        />
        Tu navegador no soporta videos.
      </video>
    </div>

    {/* Icono de éxito que aparece después de la animación */}
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center transition-all duration-700",
        animationCompleted ? "opacity-100 scale-100" : "opacity-0 scale-75"
      )}
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-success to-success/60 flex items-center justify-center shadow-lg">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>
    </div>
  </div>
));
SuccessAnimation.displayName = "SuccessAnimation";

// ============================================
// SUB-COMPONENTE: Estadísticas de Éxito
// ============================================
const SuccessStats: React.FC<{ animationCompleted: boolean }> = React.memo(({ animationCompleted }) => (
  <div
    className={cn(
      "grid grid-cols-3 gap-4 transition-all duration-700 delay-200",
      animationCompleted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}
  >
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
        <TrendingUp className="w-6 h-6 text-primary" />
      </div>
      <p className="text-2xl font-bold text-foreground">90%</p>
      <p className="text-xs text-muted-foreground">Ventas en 30 días</p>
    </div>
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
        <Eye className="w-6 h-6 text-accent" />
      </div>
      <p className="text-2xl font-bold text-foreground">5K+</p>
      <p className="text-xs text-muted-foreground">Visitas diarias</p>
    </div>
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
        <Zap className="w-6 h-6 text-success" />
      </div>
      <p className="text-2xl font-bold text-foreground">24h</p>
      <p className="text-xs text-muted-foreground">Aprobación</p>
    </div>
  </div>
));
SuccessStats.displayName = "SuccessStats";

// ============================================
// SUB-COMPONENTE: Mensaje de Éxito
// ============================================
const SuccessMessage: React.FC<{ animationCompleted: boolean }> = React.memo(({ animationCompleted }) => (
  <div
    className={cn(
      "space-y-4 text-center transition-all duration-700",
      animationCompleted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}
  >
    <div className="flex items-center justify-center gap-2">
      <h3 className="text-2xl font-bold text-foreground">
        ¡Anuncio Registrado!
      </h3>
      <Sparkles className="w-6 h-6 text-yellow-500" />
    </div>
    
    <p className="text-muted-foreground max-w-md mx-auto">
      Tu anuncio está pendiente de aprobación. Te notificaremos cuando esté publicado.
    </p>
    
    <div className="flex items-center justify-center gap-2 pt-2">
      <Badge variant="secondary" className="text-xs">
        <Shield className="w-3 h-3 mr-1" />
        Verificado
      </Badge>
      <Badge variant="secondary" className="text-xs">
        <Star className="w-3 h-3 mr-1" />
        Premium
      </Badge>
    </div>
  </div>
));
SuccessMessage.displayName = "SuccessMessage";

// ============================================
// SUB-COMPONENTE: Siguientes Pasos
// ============================================
const NextSteps: React.FC<{ animationCompleted: boolean }> = React.memo(({ animationCompleted }) => (
  <div
    className={cn(
      "space-y-6 transition-all duration-700 delay-300",
      animationCompleted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}
  >
    <Card className="card-glass border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border/30">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            ¿Qué sucede ahora?
          </h4>
        </div>
        <div className="p-5">
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-primary font-bold text-xs">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Revisión</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nuestro equipo revisará tu anuncio en menos de 24 horas
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-primary font-bold text-xs">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Publicación</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Una vez aprobado, tu anuncio será visible para miles de compradores
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-primary font-bold text-xs">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Contacto</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Recibirás notificaciones cuando los compradores se interesen
                </p>
              </div>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
));
NextSteps.displayName = "NextSteps";

// ============================================
// SUB-COMPONENTE: Botones de Acción
// ============================================
const ActionButtons: React.FC<{ 
  animationCompleted: boolean;
  onCreateNew: () => void;
  onViewAds: () => void;
}> = React.memo(({ animationCompleted, onCreateNew, onViewAds }) => (
  <div
    className={cn(
      "flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500",
      animationCompleted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}
  >
    <Button
      onClick={onCreateNew}
      className="btn-primary w-full gap-2 transition-all hover:-translate-y-0.5"
      size="lg"
    >
      <Plus className="w-4 h-4" />
      Crear Nuevo Anuncio
    </Button>
    <Button
      variant="outline"
      onClick={onViewAds}
      className="btn-accent w-full gap-2 transition-all hover:-translate-y-0.5"
      size="lg"
    >
      <Eye className="w-4 h-4" />
      Ver Anuncios
    </Button>
  </div>
));
ActionButtons.displayName = "ActionButtons";

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  onCreateNew,
  onViewAds,
}) => {
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Controla la aparición del contenido y la animación de entrada
  useEffect(() => {
    const contentTimer = setTimeout(() => setShowContent(true), 100);

    // Como el video está en bucle, el evento `onEnd` nunca se dispara.
    // Usamos un temporizador para mostrar el resto del contenido después
    // de que el video haya completado su primer ciclo (aprox.).
    const animationTimer = setTimeout(() => {
      setAnimationCompleted(true);
    }, 2000); // Duración de la animación del video en ms

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(animationTimer);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-20rem)] p-4">
      <Card
        className={cn(
          "w-full max-w-md shadow-2xl border-border/50 overflow-hidden",
          "transition-all duration-700 transform",
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <CardContent className="p-8 text-center space-y-8">
          {/* Animación de éxito */}
          <SuccessAnimation animationCompleted={animationCompleted} />
          
          {/* Estadísticas de éxito */}
          <SuccessStats animationCompleted={animationCompleted} />
          
          {/* Mensaje de éxito */}
          <SuccessMessage animationCompleted={animationCompleted} />
          
          {/* Siguientes pasos */}
          <NextSteps animationCompleted={animationCompleted} />
          
          {/* Botones de acción */}
          <ActionButtons
            animationCompleted={animationCompleted}
            onCreateNew={onCreateNew}
            onViewAds={onViewAds}
          />
        </CardContent>
      </Card>
    </div>
  );
};