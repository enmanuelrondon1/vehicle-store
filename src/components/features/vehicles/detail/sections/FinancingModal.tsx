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
        {/* ✅ BOTÓN DE DISPARO MEJORADO */}
        <Button
          className="w-full group relative overflow-hidden shadow-lg"
          style={{ background: 'var(--gradient-accent)' }}
          size="lg"
        >
          <span className="relative z-10 flex items-center justify-center gap-2 font-semibold" style={{ color: 'var(--accent-foreground)' }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Calculator className="w-5 h-5" />
            </motion.div>
            <span className="hidden sm:inline">Calcular Crédito Directo</span>
            <span className="sm:hidden">Calcular Crédito</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
          {/* Efecto de brillo en hover */}
          <span className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
        </Button>
      </DialogTrigger>

      {/* ✅ CONTENIDO DEL MODAL MEJORADO */}
      <DialogContent className="max-w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto card-premium p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full"
        >
          {/* ✅ CABECERA DEL MODAL MEJORADA */}
          <DialogHeader className="space-y-3 p-4 sm:p-6 pb-4 card-glass border-b">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
              <div className="flex items-start sm:items-center gap-3 flex-col sm:flex-row">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0" 
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-foreground">Calculadora de Crédito</div>
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    <Badge 
                      className="text-xs font-bold px-2 py-1"
                      style={{ 
                        background: 'var(--gradient-primary)',
                        color: 'var(--primary-foreground)'
                      }}
                    >
                      Directo con Vendedor
                    </Badge>
                    <span className="text-xs text-muted-foreground">Sin intermediarios</span>
                  </div>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-muted-foreground">
              Simula tu plan de pago y descubre las ventajas de financiar directamente.
            </DialogDescription>
          </DialogHeader>

          {/* ✅ BANNER DE CONFIANZA MEJORADO */}
          <div className="px-4 sm:px-6 py-3 card-glass border-b">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
              <Shield className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--success)' }} />
              <p className="text-xs sm:text-sm font-medium text-foreground flex-1">
                Simulación 100% segura y sin compromiso
              </p>
              <Badge 
                className="text-xs font-semibold px-2 py-1 flex items-center gap-1"
                style={{ 
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff'
                }}
              >
                <TrendingUp className="w-3 h-3" />
                Ahorro garantizado
              </Badge>
            </div>
          </div>

          {/* ✅ CONTENIDO DE LA CALCULADORA */}
          <div className="p-4 sm:p-6">
            <FinancingCalculator
              vehiclePrice={vehiclePrice}
              financingDetails={financingDetails}
              compact={true}
            />
          </div>

          {/* ✅ PIE DE MODAL MEJORADO */}
          <div className="p-4 sm:p-6 card-glass border-t">
            <div className="flex items-center justify-between gap-3 flex-col sm:flex-row">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                <Percent className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                <span className="text-foreground font-medium">
                  Tasa: {financingDetails.interestRate}%
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="text-foreground font-medium">
                  Plazo: hasta {financingDetails.loanTerm} meses
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => {
                  // Cerrar el diálogo programáticamente
                  const closeButton = document.querySelector('[data-radix-dialog-close]') as HTMLElement;
                  if (closeButton) closeButton.click();
                }}
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