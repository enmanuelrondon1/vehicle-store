// src/components/features/admin/AdminPanelLoading.tsx
// ✅ OPTIMIZADO: eliminado framer-motion completamente.
//    Tenía motion.div con repeat:Infinity en el spinner, whileHover en 4 tarjetas
//    y motion.div en cada fila del skeleton — todo innecesario en un estado de carga.

import React from "react";
import {
  Loader2,
  Shield,
  Zap,
  Activity,
  BarChart3,
  Users,
  Car,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const AdminPanelLoading = () => {
  const loadingSteps = [
    { id: 1, label: "Verificando permisos", icon: Shield },
    { id: 2, label: "Cargando vehículos", icon: Car },
    { id: 3, label: "Analizando datos", icon: BarChart3 },
    { id: 4, label: "Preparando interfaz", icon: Settings },
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) =>
        prev < loadingSteps.length - 1 ? prev + 1 : prev
      );
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 pt-4 pb-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">

        {/* ENCABEZADO */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative group">
              <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-accent ring-4 ring-primary/10 shimmer-effect transition-transform duration-300 group-hover:scale-110">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              {/* ✅ animate-ping CSS en lugar de motion.div repeat:Infinity */}
              <span className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping opacity-75" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient-primary">
                Panel de Administración
              </h1>
              <p className="text-base text-muted-foreground mt-1">
                Cargando datos del sistema...
              </p>
            </div>
          </div>
        </div>

        {/* TARJETA DE CARGA */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: "80ms", animationFillMode: "both" }}
        >
          <Card className="shadow-xl border-0 overflow-hidden card-glass">
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50" />

            <CardHeader className="text-center pb-4">
              <div className="flex flex-col items-center space-y-4">
                {/* ✅ Spinner CSS puro — sin motion.div */}
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <div
                    className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"
                    style={{ animationDuration: "1.5s" }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold font-heading text-gradient-primary">
                    Inicializando panel
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Por favor, espera un momento mientras cargamos la información
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Barra de progreso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progreso general</span>
                    <span className="font-medium">
                      {Math.round(((currentStep + 1) / loadingSteps.length) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={((currentStep + 1) / loadingSteps.length) * 100}
                    className="h-2"
                  />
                </div>

                {/* Pasos de carga — animate-fade-in CSS con delay */}
                <div className="space-y-3">
                  {loadingSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index <= currentStep;
                    const isCurrent = index === currentStep;
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 animate-fade-in ${
                          isActive
                            ? "bg-primary/5 border-primary/20"
                            : "bg-muted/20 border-border/50"
                        }`}
                        style={{
                          animationDelay: `${index * 80}ms`,
                          animationFillMode: "both",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isActive ? "bg-primary/10" : "bg-muted/50"}`}>
                            <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                          </span>
                        </div>
                        {isCurrent && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                        {isActive && !isCurrent && (
                          <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center">
                            <svg className="w-2 h-2 text-success-foreground" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TARJETAS DE ESTADÍSTICAS SKELETON */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: "160ms", animationFillMode: "both" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Car, color: "primary" },
              { icon: Users, color: "accent" },
              { icon: Activity, color: "success" },
              { icon: BarChart3, color: "destructive" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="animate-fade-in hover:-translate-y-1 transition-transform duration-200"
                  style={{
                    animationDelay: `${200 + index * 60}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <Card className="shadow-lg border-0 overflow-hidden card-glass h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                          <div className="h-6 bg-muted rounded w-12 animate-pulse" />
                        </div>
                        <div className={`p-2.5 rounded-lg bg-${item.color}/10 shimmer-effect`}>
                          <Icon className={`w-5 h-5 text-${item.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* SKELETON PRINCIPAL */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: "320ms", animationFillMode: "both" }}
        >
          <Card className="shadow-xl border-0 overflow-hidden card-glass">
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50" />
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="h-10 bg-muted/50 rounded-lg animate-pulse flex-1" />
                  <div className="flex gap-2">
                    <div className="h-10 w-20 bg-muted/50 rounded-lg animate-pulse" />
                    <div className="h-10 w-20 bg-muted/50 rounded-lg animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 p-4 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors duration-300"
                    >
                      <div className="w-5 h-5 bg-muted/50 rounded animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse" />
                        <div className="h-3 bg-muted/50 rounded w-1/2 animate-pulse" />
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-muted/50 rounded-lg animate-pulse" />
                        <div className="w-8 h-8 bg-muted/50 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center gap-2 mt-6">
                  <div className="h-8 w-8 bg-muted/50 rounded-lg animate-pulse" />
                  <div className="h-8 w-8 bg-muted/50 rounded-lg animate-pulse" />
                  <div className="h-8 w-8 bg-muted/50 rounded-lg animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* INDICADOR */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span>Sistema operativo al 100%</span>
            <Badge variant="outline" className="ml-2 badge-premium">
              Premium
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};