// src/components/features/vehicles/registration/success-screen.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle, Sparkles, Car, Star, Shield,
  Eye, Plus, Zap, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SuccessScreenProps {
  onCreateNew: () => void;
  onViewAds: () => void;
}

// ===========================================
// CONSTANTES
// ✅ SuccessStats: 3 divs idénticos → array + loop
// ✅ NextSteps: 3 <li> idénticos → array + loop
// ===========================================
const STATS = [
  { icon: TrendingUp, color: "primary", value: "90%", label: "Ventas en 30 días" },
  { icon: Eye,        color: "accent",  value: "5K+", label: "Visitas diarias" },
  { icon: Zap,        color: "success", value: "24h", label: "Aprobación" },
];

const NEXT_STEPS = [
  { title: "Revisión",    desc: "Nuestro equipo revisará tu anuncio en menos de 24 horas" },
  { title: "Publicación", desc: "Una vez aprobado, tu anuncio será visible para miles de compradores" },
  { title: "Contacto",    desc: "Recibirás notificaciones cuando los compradores se interesen" },
];

// ===========================================
// SUB-COMPONENTE: Animación de Éxito
// ===========================================
const SuccessAnimation: React.FC<{ animationCompleted: boolean }> = React.memo(({ animationCompleted }) => (
  <div className="relative">
    <div className={cn(
      "w-32 h-32 mx-auto rounded-xl overflow-hidden transition-all duration-700",
      animationCompleted ? "opacity-0 scale-75" : "opacity-100 scale-100"
    )}>
      <video
        className="w-32 h-32 mx-auto rounded-lg object-cover"
        autoPlay muted loop playsInline controls={false} preload="auto"
      >
        <source
          src="https://res.cloudinary.com/dcdawwvx2/video/upload/v1762559218/generated_video_1_udkh0n.mp4"
          type="video/mp4"
        />
        Tu navegador no soporta videos.
      </video>
    </div>
    <div className={cn(
      "absolute inset-0 flex items-center justify-center transition-all duration-700",
      animationCompleted ? "opacity-100 scale-100" : "opacity-0 scale-75"
    )}>
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-success to-success/60 flex items-center justify-center shadow-lg">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>
    </div>
  </div>
));
SuccessAnimation.displayName = "SuccessAnimation";

// ===========================================
// SUB-COMPONENTE: Estadísticas
// ✅ ANTES: 3 bloques div idénticos. AHORA: array + loop.
// ===========================================
const SuccessStats: React.FC<{ animationCompleted: boolean }> = React.memo(({ animationCompleted }) => (
  <div className={cn(
    "grid grid-cols-3 gap-4 transition-all duration-700 delay-200",
    animationCompleted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
  )}>
    {STATS.map(({ icon: Icon, color, value, label }) => (
      <div key={label} className="text-center">
        <div className={`w-12 h-12 rounded-full bg-${color}/10 flex items-center justify-center mx-auto mb-2`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    ))}
  </div>
));
SuccessStats.displayName = "SuccessStats";

// ===========================================
// SUB-COMPONENTE: Mensaje de Éxito
// ===========================================
const SuccessMessage: React.FC<{ animationCompleted: boolean }> = React.memo(({ animationCompleted }) => (
  <div className={cn(
    "space-y-4 text-center transition-all duration-700",
    animationCompleted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
  )}>
    <div className="flex items-center justify-center gap-2">
      <h3 className="text-2xl font-bold text-foreground">¡Anuncio Registrado!</h3>
      <Sparkles className="w-6 h-6 text-yellow-500" />
    </div>
    <p className="text-muted-foreground max-w-md mx-auto">
      Tu anuncio está pendiente de aprobación. Te notificaremos cuando esté publicado.
    </p>
    <div className="flex items-center justify-center gap-2 pt-2">
      <Badge variant="secondary" className="text-xs">
        <Shield className="w-3 h-3 mr-1" />Verificado
      </Badge>
      <Badge variant="secondary" className="text-xs">
        <Star className="w-3 h-3 mr-1" />Premium
      </Badge>
    </div>
  </div>
));
SuccessMessage.displayName = "SuccessMessage";

// ===========================================
// SUB-COMPONENTE: Siguientes Pasos
// ✅ ANTES: 3 <li> idénticos. AHORA: array + loop.
// ===========================================
const NextSteps: React.FC<{ animationCompleted: boolean }> = React.memo(({ animationCompleted }) => (
  <div className={cn(
    "space-y-6 transition-all duration-700 delay-300",
    animationCompleted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
  )}>
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
            {NEXT_STEPS.map(({ title, desc }, i) => (
              <li key={title} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-primary font-bold text-xs">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>
));
NextSteps.displayName = "NextSteps";

// ===========================================
// SUB-COMPONENTE: Botones de Acción
// ===========================================
const ActionButtons: React.FC<{
  animationCompleted: boolean;
  onCreateNew: () => void;
  onViewAds: () => void;
}> = React.memo(({ animationCompleted, onCreateNew, onViewAds }) => (
  <div className={cn(
    "flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500",
    animationCompleted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
  )}>
    <Button onClick={onCreateNew} className="btn-primary w-full gap-2 transition-all hover:-translate-y-0.5" size="lg">
      <Plus className="w-4 h-4" />
      Crear Nuevo Anuncio
    </Button>
    <Button variant="outline" onClick={onViewAds} className="btn-accent w-full gap-2 transition-all hover:-translate-y-0.5" size="lg">
      <Eye className="w-4 h-4" />
      Ver Anuncios
    </Button>
  </div>
));
ActionButtons.displayName = "ActionButtons";

// ===========================================
// COMPONENTE PRINCIPAL
// ✅ SuccessHeader eliminado — estaba definido pero nunca se usaba en el JSX
// ✅ SuccessStats: 3 divs idénticos → STATS array + loop
// ✅ NextSteps: 3 <li> idénticos → NEXT_STEPS array + loop
// ✅ ArrowRight eliminado de imports — no se usaba
// ===========================================
export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onCreateNew, onViewAds }) => {
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const contentTimer   = setTimeout(() => setShowContent(true),        100);
    const animationTimer = setTimeout(() => setAnimationCompleted(true), 2000);
    return () => { clearTimeout(contentTimer); clearTimeout(animationTimer); };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-20rem)] p-4">
      <Card className={cn(
        "w-full max-w-md shadow-2xl border-border/50 overflow-hidden transition-all duration-700 transform",
        showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        <CardContent className="p-8 text-center space-y-8">
          <SuccessAnimation animationCompleted={animationCompleted} />
          <SuccessStats     animationCompleted={animationCompleted} />
          <SuccessMessage   animationCompleted={animationCompleted} />
          <NextSteps        animationCompleted={animationCompleted} />
          <ActionButtons    animationCompleted={animationCompleted} onCreateNew={onCreateNew} onViewAds={onViewAds} />
        </CardContent>
      </Card>
    </div>
  );
};