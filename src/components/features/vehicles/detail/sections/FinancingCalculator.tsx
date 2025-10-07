//src/components/features/vehicles/detail/sections/FinancingCalculator.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, DollarSign, Percent, Calendar, TrendingUp } from "lucide-react";

interface FinancingCalculatorProps {
  vehiclePrice: number;
  financingDetails: {
    interestRate: number;
    loanTerm: number;
  };
  isDarkMode: boolean;
  compact?: boolean; // Nueva prop para versión compacta
}

export function FinancingCalculator({
  vehiclePrice,
  financingDetails,
  isDarkMode,
  compact = false, // Por defecto false para no romper otros usos
}: FinancingCalculatorProps) {
  const [downPayment, setDownPayment] = useState(
    Math.round(vehiclePrice * 0.1)
  );
  const [interestRate, setInterestRate] = useState(
    financingDetails?.interestRate || 0
  );
  const [loanTerm, setLoanTerm] = useState(financingDetails?.loanTerm || 36);

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

  const calculations = useMemo(() => {
    const principal = vehiclePrice - downPayment;
    if (principal <= 0) {
      return {
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        amountToFinance: 0,
      };
    }

    const monthlyRate = interestRate / 100 / 12;
    let monthlyPayment: number;

    if (monthlyRate === 0) {
      monthlyPayment = principal / loanTerm;
    } else {
      const power = Math.pow(1 + monthlyRate, loanTerm);
      monthlyPayment = (principal * monthlyRate * power) / (power - 1);
    }

    const totalPayment = monthlyPayment * loanTerm;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      amountToFinance: principal,
    };
  }, [vehiclePrice, downPayment, interestRate, loanTerm]);

  const downPaymentPercentage = ((downPayment / vehiclePrice) * 100).toFixed(0);

  return (
    <Card className={`${isDarkMode ? "bg-slate-800 border-gray-700" : "bg-white border-gray-200"} ${compact ? 'shadow-none border-0' : 'shadow-lg'} transition-all`}>
      <CardHeader className={compact ? "pb-2 pt-0" : "pb-4"}>
        <CardTitle className={`flex items-center gap-3 ${isDarkMode ? "text-white" : "text-gray-900"} ${compact ? 'text-lg' : 'text-xl'}`}>
          {!compact && (
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950">
              <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          )}
          <span className="font-bold">{compact ? 'Configura tu financiación' : 'Calculadora de Financiación'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? "space-y-4" : "space-y-6"}>
        {/* Entrada */}
        <div className={compact ? "space-y-2" : "space-y-3"}>
          <div className="flex justify-between items-center">
            <Label htmlFor="down-payment" className={`${compact ? 'text-xs' : 'text-sm'} font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
              <DollarSign className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-green-600 dark:text-green-400`} />
              Entrada
            </Label>
            <div className="text-right">
              <span className={`font-bold ${compact ? 'text-base' : 'text-lg'} ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {formatCurrency(downPayment)}
              </span>
              <span className={`text-xs ml-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                ({downPaymentPercentage}%)
              </span>
            </div>
          </div>
          <Slider
            id="down-payment"
            min={0}
            max={vehiclePrice}
            step={100}
            value={[downPayment]}
            onValueChange={(value) => setDownPayment(value[0])}
            className="[&_[role=slider]]:bg-green-600 [&_[role=slider]]:border-green-600 dark:[&_[role=slider]]:bg-green-500 dark:[&_[role=slider]]:border-green-500 [&_[role=slider]]:shadow-lg [&_.relative]:bg-gray-300 dark:[&_.relative]:bg-gray-600 [&_.relative]:h-2"
          />
          {!compact && (
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>$0</span>
              <span>{formatCurrency(vehiclePrice / 2)}</span>
              <span>{formatCurrency(vehiclePrice)}</span>
            </div>
          )}
        </div>

        {/* Tasa de Interés */}
        <div className={compact ? "space-y-2" : "space-y-3"}>
          <div className="flex justify-between items-center">
            <Label htmlFor="interest-rate" className={`${compact ? 'text-xs' : 'text-sm'} font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
              <Percent className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-orange-600 dark:text-orange-400`} />
             Tasa de Interés (ganancia del vendedor)
            </Label>
            <span className={`font-bold ${compact ? 'text-base' : 'text-lg'} ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {interestRate.toFixed(1)}%
            </span>
          </div>
          <Slider
            id="interest-rate"
            min={0}
            max={30}
            step={0.1}
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            className="[&_[role=slider]]:bg-orange-600 [&_[role=slider]]:border-orange-600 dark:[&_[role=slider]]:bg-orange-500 dark:[&_[role=slider]]:border-orange-500 [&_[role=slider]]:shadow-lg [&_.relative]:bg-gray-300 dark:[&_.relative]:bg-gray-600 [&_.relative]:h-2"
          />
          {!compact && (
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>0%</span>
              <span>15%</span>
              <span>30%</span>
            </div>
          )}
        </div>

        {/* Plazo del Préstamo */}
        <div className={compact ? "space-y-2" : "space-y-3"}>
          <div className="flex justify-between items-center">
            <Label htmlFor="loan-term" className={`${compact ? 'text-xs' : 'text-sm'} font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center gap-2`}>
              <Calendar className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-blue-600 dark:text-blue-400`} />
              Plazo del Préstamo
            </Label>
            <span className={`font-bold ${compact ? 'text-base' : 'text-lg'} ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {loanTerm} {loanTerm === 1 ? 'mes' : 'meses'}
            </span>
          </div>
          <Slider
            id="loan-term"
            min={1}
            max={84}
            step={1}
            value={[loanTerm]}
            onValueChange={(value) => setLoanTerm(value[0])}
            className="[&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-blue-600 dark:[&_[role=slider]]:bg-blue-500 dark:[&_[role=slider]]:border-blue-500 [&_[role=slider]]:shadow-lg [&_.relative]:bg-gray-300 dark:[&_.relative]:bg-gray-600 [&_.relative]:h-2"
          />
          {!compact && (
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>1 mes</span>
              <span>42 meses</span>
              <span>84 meses</span>
            </div>
          )}
        </div>

        {/* Separador */}
        <div className={`border-t-2 ${isDarkMode ? "border-gray-700" : "border-gray-200"} ${compact ? 'my-3' : 'my-6'}`}></div>

        {/* Resumen de Cálculos */}
        <div className={compact ? "space-y-2" : "space-y-3"}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
            <h3 className={`${compact ? 'text-xs' : 'text-sm'} font-bold ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
              Resumen de Financiación
            </h3>
          </div>

          {/* Monto a Financiar */}
          <div className={`flex justify-between items-center ${compact ? 'p-2' : 'p-3'} rounded-lg ${isDarkMode ? "bg-slate-700/50" : "bg-gray-50"}`}>
            <span className={`${compact ? 'text-xs' : 'text-sm'} ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Monto a financiar
            </span>
            <span className={`${compact ? 'text-sm' : 'text-base'} font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {formatCurrency(calculations.amountToFinance)}
            </span>
          </div>

          {/* Cuota Mensual - DESTACADA */}
          <div className={`${compact ? 'p-3' : 'p-5'} rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl`}>
            <div className="text-center">
              <p className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-white/90 mb-1`}>
                Cuota Mensual Estimada
              </p>
              <p className={`${compact ? 'text-2xl' : 'text-4xl'} font-bold text-white mb-1`}>
                {formatCurrency(calculations.monthlyPayment)}
              </p>
              <p className="text-xs text-white/70">
                {loanTerm} pagos mensuales
              </p>
            </div>
          </div>

          {/* Total a Pagar */}
          <div className={`flex justify-between items-center ${compact ? 'p-2' : 'p-3'} rounded-lg ${isDarkMode ? "bg-slate-700/50" : "bg-gray-50"}`}>
            <span className={`${compact ? 'text-xs' : 'text-sm'} ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Total a pagar
            </span>
            <span className={`${compact ? 'text-sm' : 'text-base'} font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {formatCurrency(calculations.totalPayment)}
            </span>
          </div>

          {/* Intereses Totales */}
          <div className={`flex justify-between items-center ${compact ? 'p-2' : 'p-3'} rounded-lg ${isDarkMode ? "bg-amber-950/30 border border-amber-900" : "bg-amber-50 border border-amber-200"}`}>
            <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium ${isDarkMode ? "text-amber-400" : "text-amber-700"}`}>
              Intereses totales
            </span>
            <span className={`${compact ? 'text-sm' : 'text-base'} font-bold ${isDarkMode ? "text-amber-300" : "text-amber-800"}`}>
              +{formatCurrency(calculations.totalInterest)}
            </span>
          </div>
        </div>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-4">
          *Plan de pago directo con el vendedor. Sujeto a aprobación.
        </p>
      </CardContent>
    </Card>
  );
}