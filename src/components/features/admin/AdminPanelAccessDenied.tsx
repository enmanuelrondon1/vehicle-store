// src/components/features/admin/AdminPanelAccessDenied.tsx
// ✅ OPTIMIZADO: eliminado framer-motion completamente.
//    Este componente se carga ANTES del dynamic() — estaba bloqueando el bundle.

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  XCircle,
  Home,
  ShieldOff,
  AlertTriangle,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  User,
  LogIn,
} from "lucide-react";
import Link from "next/link";

export const AdminPanelAccessDenied = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 pt-4 pb-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">

        {/* ENCABEZADO */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative group">
              <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-destructive to-destructive/80 ring-4 ring-destructive/10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <ShieldOff className="w-7 h-7 text-destructive-foreground" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive/30 rounded-full animate-ping" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient-destructive">
                Acceso Denegado
              </h1>
              <p className="text-base text-muted-foreground mt-1">
                No tienes los permisos necesarios para esta sección
              </p>
            </div>
          </div>
        </div>

        {/* TARJETA PRINCIPAL */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: "80ms", animationFillMode: "both" }}
        >
          <Card className="shadow-xl border-0 overflow-hidden card-glass">
            <div className="h-2 bg-gradient-to-r from-destructive to-destructive/80" />
            <div className="h-1 bg-gradient-to-r from-destructive to-destructive/80 animate-pulse opacity-50" />

            <CardHeader className="text-center pb-4">
              <div className="relative mx-auto inline-block">
                <div className="p-4 rounded-full bg-destructive/10 mb-4">
                  <XCircle className="w-16 h-16 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl font-heading">
                Permisos Insuficientes
              </CardTitle>
              <Badge variant="destructive" className="mt-2">
                <Lock className="w-3 h-3 mr-1" />
                Acceso Restringido
              </Badge>
            </CardHeader>

            <CardContent className="pt-0 text-center space-y-6">
              <p className="text-muted-foreground">
                Tu cuenta actual no tiene privilegios de administrador para
                acceder al Panel de Administración. Esta área está restringida
                para garantizar la seguridad y la integridad de la plataforma.
              </p>

              {/* CONSEJOS */}
              <div
                className="p-5 rounded-2xl border-2 border-destructive/20 bg-destructive/5 animate-fade-in"
                style={{ animationDelay: "160ms", animationFillMode: "both" }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10 mt-0.5 hover:rotate-10 hover:scale-110 transition-transform duration-300">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base font-heading mb-3">
                      ¿Qué puedes hacer?
                    </h3>
                    <ul className="text-sm space-y-3 text-muted-foreground">
                      {[
                        { icon: Mail, text: "Contacta al administrador principal si crees que esto es un error." },
                        { icon: User, text: "Verifica si has iniciado sesión con la cuenta correcta." },
                        { icon: Home, text: "Regresa a la página principal para continuar navegando." },
                      ].map(({ icon: Icon, text }, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 animate-fade-in"
                          style={{ animationDelay: `${240 + i * 60}ms`, animationFillMode: "both" }}
                        >
                          <div className="p-1 rounded-full bg-destructive/10 mt-0.5">
                            <Icon className="w-3 h-3 text-destructive" />
                          </div>
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* BOTONES */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  className="w-full sm:w-auto btn-primary hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                >
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Ir a la Página Principal
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
                >
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TARJETA DE SEGURIDAD */}
        <div
          className="animate-fade-in"
          style={{ animationDelay: "320ms", animationFillMode: "both" }}
        >
          <Card className="shadow-lg border-0 overflow-hidden card-glass">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 hover:rotate-10 hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold font-heading">
                    Protección de datos
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tu seguridad es nuestra prioridad. Esta restricción ayuda a
                    proteger la información sensible de la plataforma.
                  </p>
                </div>
                <Badge variant="outline" className="badge-premium">
                  Seguro
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SOPORTE */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            ¿Necesitas ayuda?{" "}
            <Button variant="link" className="p-0 h-auto font-semibold">
              Contacta al soporte
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};