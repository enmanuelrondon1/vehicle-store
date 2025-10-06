//src/components/features/vehicles/detail/sections/FinancingCalculator.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator } from "lucide-react";

interface FinancingCalculatorProps {
  vehiclePrice: number;
  financingDetails: {
    interestRate: number;
    loanTerm: number;
  };
  isDarkMode: boolean;
}

export function FinancingCalculator({
  vehiclePrice,
  financingDetails,
  isDarkMode,
}: FinancingCalculatorProps) {
  const [downPayment, setDownPayment] = useState(
    Math.round(vehiclePrice * 0.1)
  );
  const [interestRate, setInterestRate] = useState(
    financingDetails?.interestRate || 0
  );
  const [loanTerm, setLoanTerm] = useState(financingDetails?.loanTerm || 12);

  useEffect(() => {
    if (financingDetails) {
      setInterestRate(financingDetails.interestRate);
      setLoanTerm(financingDetails.loanTerm);
    }
  }, [financingDetails]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const monthlyPayment = useMemo(() => {
    const principal = vehiclePrice - downPayment;
    if (principal <= 0) return 0;

    const monthlyRate = interestRate / 100 / 12;
    if (monthlyRate === 0) return principal / loanTerm;

    const power = Math.pow(1 + monthlyRate, loanTerm);
    return (principal * monthlyRate * power) / (power - 1);
  }, [vehiclePrice, downPayment, interestRate, loanTerm]);

  return (
    <Card className={`${isDarkMode ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm" : "bg-white/50"} transition-all`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
          <Calculator className="w-6 h-6" />
          Calculadora de Financiación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="down-payment" className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Entrada</Label>
            <span className={`font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>{formatCurrency(downPayment)}</span>
          </div>
          <Slider
            id="down-payment"
            min={0}
            max={vehiclePrice}
            step={100}
            value={[downPayment]}
            onValueChange={(value) => setDownPayment(value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="interest-rate" className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Tasa de Interés Anual</Label>
            <span className={`font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>{interestRate.toFixed(2)}%</span>
          </div>
          <Slider
            id="interest-rate"
            min={0}
            max={25}
            step={0.1}
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="loan-term" className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Plazo del Préstamo (Meses)</Label>
            <span className={`font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>{loanTerm}</span>
          </div>
          <Slider
            id="loan-term"
            min={12}
            max={84}
            step={1}
            value={[loanTerm]}
            onValueChange={(value) => setLoanTerm(value[0])}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

        <div className="text-center">
          <p className={`text-lg mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Cuota Mensual Estimada</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {formatCurrency(monthlyPayment)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}