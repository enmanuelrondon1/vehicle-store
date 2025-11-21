// src/components/features/admin/states/AdminPanelAccessDenied.tsx
// VERSIÓN CON DISEÑO PREMIUM

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
  RefreshCw, 
  Mail,
  ArrowRight,
  Shield,
  User,
  LogIn
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export const AdminPanelAccessDenied = () => {
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
              <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-destructive to-destructive/80 ring-4 ring-destructive/10">
                <ShieldOff className="w-7 h-7 text-destructive-foreground" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-2xl bg-destructive/20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
            </motion.div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient-destructive">
                Acceso Denegado
              </h1>
              <p className="text-base text-muted-foreground mt-1">
                No tienes los permisos necesarios para esta sección
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========== TARJETA PRINCIPAL MEJORADA ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-xl border-0 overflow-hidden card-glass">
            {/* Efectos de brillo superior */}
            <div className="h-2 bg-gradient-to-r from-destructive to-destructive/80"></div>
            <div className="h-1 bg-gradient-to-r from-destructive to-destructive/80 animate-pulse opacity-50"></div>
            
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative mx-auto"
              >
                <div className="p-4 rounded-full bg-destructive/10 mb-4">
                  <XCircle className="w-16 h-16 text-destructive" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-destructive/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
              </motion.div>
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
                Tu cuenta actual no tiene privilegios de administrador para acceder al Panel de Administración. Esta área está restringida para garantizar la seguridad y la integridad de la plataforma.
              </p>

              {/* ========== SECCIÓN DE CONSEJOS MEJORADA ========== */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-5 rounded-2xl border-2 border-destructive/20 bg-destructive/5"
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="p-2 rounded-lg bg-destructive/10 mt-0.5"
                  >
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-base font-heading mb-3">
                      ¿Qué puedes hacer?
                    </h3>
                    <ul className="text-sm space-y-3 text-muted-foreground">
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="flex items-start gap-3"
                      >
                        <div className="p-1 rounded-full bg-destructive/10 mt-0.5">
                          <Mail className="w-3 h-3 text-destructive" />
                        </div>
                        <span>
                          Contacta al administrador principal si crees que esto es un error.
                        </span>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="flex items-start gap-3"
                      >
                        <div className="p-1 rounded-full bg-destructive/10 mt-0.5">
                          <User className="w-3 h-3 text-destructive" />
                        </div>
                        <span>
                          Verifica si has iniciado sesión con la cuenta correcta.
                        </span>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                        className="flex items-start gap-3"
                      >
                        <div className="p-1 rounded-full bg-destructive/10 mt-0.5">
                          <Home className="w-3 h-3 text-destructive" />
                        </div>
                        <span>
                          Regresa a la página principal para continuar navegando.
                        </span>
                      </motion.li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* ========== BOTONES DE ACCIÓN MEJORADOS ========== */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 sm:flex-initial"
                >
                  <Button asChild className="w-full sm:w-auto btn-primary">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Ir a la Página Principal
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 sm:flex-initial"
                >
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ========== TARJETA DE SEGURIDAD ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="shadow-lg border-0 overflow-hidden card-glass">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 rounded-xl bg-primary/10"
                >
                  <Shield className="w-6 h-6 text-primary" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold font-heading">Protección de datos</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tu seguridad es nuestra prioridad. Esta restricción ayuda a proteger la información sensible de la plataforma.
                  </p>
                </div>
                <Badge variant="outline" className="badge-premium">
                  Seguro
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ========== INDICADOR DE SOPORTE ========== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            ¿Necesitas ayuda? 
            <Button variant="link" className="p-0 h-auto font-semibold">
              Contacta al soporte
            </Button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};