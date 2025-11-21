// src/components/features/admin/states/AdminPanelLoading.tsx

import React from "react";
import { Loader2, Shield, Zap, Activity, BarChart3, Users, Car, Settings } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export const AdminPanelLoading = () => {
  const loadingSteps = [
    { id: 1, label: "Verificando permisos", icon: Shield, status: "loading" },
    { id: 2, label: "Cargando vehículos", icon: Car, status: "pending" },
    { id: 3, label: "Analizando datos", icon: BarChart3, status: "pending" },
    { id: 4, label: "Preparando interfaz", icon: Settings, status: "pending" },
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 pt-4 pb-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
        {/* ========== ENCABEZADO MEJORADO ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-accent ring-4 ring-primary/10 shimmer-effect">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-2xl bg-primary/20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
            </motion.div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient-primary">
                Panel de Administración
              </h1>
              <p className="text-base text-muted-foreground mt-1">
                Cargando datos del sistema...
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========== TARJETA DE CARGA MEJORADA ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-xl border-0 overflow-hidden card-glass">
            {/* Efectos de brillo superior */}
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50"></div>
            
            <CardHeader className="text-center pb-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"
                    style={{ animationDuration: '1.5s' }}
                  ></motion.div>
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
                {/* Barra de progreso animada */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progreso general</span>
                    <span className="font-medium">{Math.round(((currentStep + 1) / loadingSteps.length) * 100)}%</span>
                  </div>
                  <Progress 
                    value={((currentStep + 1) / loadingSteps.length) * 100} 
                    className="h-2"
                  />
                </div>
                
                {/* Estados de carga mejorados */}
                <div className="space-y-3">
                  {loadingSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index <= currentStep;
                    const isCurrent = index === currentStep;
                    
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                          isActive 
                            ? "bg-primary/5 border-primary/20" 
                            : "bg-muted/20 border-border/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isActive 
                              ? "bg-primary/10" 
                              : "bg-muted/50"
                          }`}>
                            <Icon className={`w-4 h-4 ${
                              isActive 
                                ? "text-primary" 
                                : "text-muted-foreground"
                            }`} />
                          </div>
                          <span className={`text-sm font-medium ${
                            isActive 
                              ? "text-foreground" 
                              : "text-muted-foreground"
                          }`}>
                            {step.label}
                          </span>
                        </div>
                        {isCurrent && (
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        )}
                        {isActive && !isCurrent && (
                          <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center">
                            <svg className="w-2 h-2 text-success-foreground" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ========== TARJETAS DE ESTADÍSTICAS ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Car, label: "Vehículos", color: "primary" },
              { icon: Users, label: "Usuarios", color: "accent" },
              { icon: Activity, label: "Actividad", color: "success" },
              { icon: BarChart3, label: "Análisis", color: "destructive" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="shadow-lg border-0 overflow-hidden card-glass h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                          <div className="h-6 bg-muted rounded w-12 animate-pulse"></div>
                        </div>
                        <motion.div
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                          className={`p-2.5 rounded-lg bg-${item.color}/10 shimmer-effect`}
                        >
                          <Icon className={`w-5 h-5 text-${item.color}`} />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ========== TARJETA DE CONTENIDO PRINCIPAL ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="shadow-xl border-0 overflow-hidden card-glass">
            {/* Efectos de brillo superior */}
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50"></div>
            
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Esqueleto de filtros mejorado */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <div className="h-10 bg-muted/50 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 w-20 bg-muted/50 rounded-lg animate-pulse"></div>
                    <div className="h-10 w-20 bg-muted/50 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                
                {/* Esqueleto de tabla mejorado */}
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                      className="flex items-center space-x-4 p-4 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors duration-300"
                    >
                      <div className="w-5 h-5 bg-muted/50 rounded animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-muted/50 rounded w-1/2 animate-pulse"></div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-muted/50 rounded-lg animate-pulse"></div>
                        <div className="w-8 h-8 bg-muted/50 rounded-lg animate-pulse"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Esqueleto de paginación */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  <div className="h-8 w-8 bg-muted/50 rounded-lg animate-pulse"></div>
                  <div className="h-8 w-8 bg-muted/50 rounded-lg animate-pulse"></div>
                  <div className="h-8 w-8 bg-muted/50 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ========== INDICADOR DE ACTIVIDAD ========== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span>Sistema operativo al 100%</span>
            <Badge variant="outline" className="ml-2 badge-premium">
              Premium
            </Badge>
          </div>
        </motion.div>
      </div>
    </div>
  );
};