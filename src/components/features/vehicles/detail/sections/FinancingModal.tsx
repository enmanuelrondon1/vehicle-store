// src/components/features/vehicles/detail/sections/FinancingModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { FinancingCalculator } from "./FinancingCalculator";

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
        <Button
          variant="outline"
          className="w-full bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calcular Crédito Directo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-background border-border">
        <DialogHeader className="space-y-3 pb-4 border-b border-border">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Calculadora de Crédito Directo
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Plan de pago directo con el vendedor.
          </DialogDescription>
        </DialogHeader>
        <FinancingCalculator
          vehiclePrice={vehiclePrice}
          financingDetails={financingDetails}
          compact={true}
        />
      </DialogContent>
    </Dialog>
  );
}