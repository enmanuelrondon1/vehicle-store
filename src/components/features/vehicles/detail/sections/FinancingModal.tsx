// src/components/features/vehicles/detail/sections/FinancingModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Shield, Percent, ArrowRight } from "lucide-react";
import { FinancingCalculator } from "./FinancingCalculator";
import { motion } from "framer-motion";

interface FinancingModalProps {
  vehiclePrice: number;
  financingDetails: {
    interestRate: number;
    loanTerm: number;
  };
}

export function FinancingModal({
  vehiclePrice,
  financingDetails,
}: FinancingModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* ✅ BOTÓN DE DISPARO REDISEÑADO MÁS ATRACTIVO */}
        <Button
          className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          size="lg"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Calculator className="w-5 h-5" />
            </motion.div>
            Calcular Crédito Directo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
          {/* Efecto de brillo en hover */}
          <span className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
        </Button>
      </DialogTrigger>

      {/* ✅ CONTENIDO DEL MODAL CON ANIMACIÓN DE FRAMER MOTION */}
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-background border-border p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* ✅ CABECERA DEL MODAL MEJORADA CON GRADIENTE */}
          <DialogHeader className="space-y-3 p-6 pb-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border">
            <DialogTitle className="text-2xl font-bold flex items-center justify-between text-foreground">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <div>
                  Calculadora de Crédito
                  <div className="text-sm font-normal text-muted-foreground flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      Directo con Vendedor
                    </Badge>
                    <span className="text-xs">Sin intermediarios</span>
                  </div>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground pl-[60px]">
              Simula tu plan de pago y descubre las ventajas de financiar directamente.
            </DialogDescription>
          </DialogHeader>

          {/* ✅ BANNER DE CONFIANZA */}
          <div className="px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-b border-border">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-600" />
              <p className="text-sm font-medium text-foreground">
                Simulación 100% segura y sin compromiso.
              </p>
              <Badge variant="outline" className="ml-auto text-xs border-emerald-600/30 text-emerald-700 dark:text-emerald-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                Ahorro garantizado
              </Badge>
            </div>
          </div>

          {/* ✅ CONTENIDO DE LA CALCULADORA */}
          <div className="p-6">
            <FinancingCalculator
              vehiclePrice={vehiclePrice}
              financingDetails={financingDetails}
              compact={true}
            />
          </div>

          {/* ✅ PIE DE MODAL CON LLAMADA A LA ACCIÓN */}
          <div className="p-6 bg-muted/30 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Percent className="w-4 h-4" />
                <span>Tasa de interés: {financingDetails.interestRate}%</span>
                <span>•</span>
                <span>Plazo: hasta {financingDetails.loanTerm} meses</span>
              </div>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                size="sm"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}