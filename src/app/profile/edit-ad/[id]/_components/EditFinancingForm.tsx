//src/app/profile/edit-ad/[id]/_components/EditFinancingForm.tsx
"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Loader,
  TrendingUp,
  Calendar,
  Percent,
  DollarSign,
  Calculator,
} from "lucide-react";
import { useSession } from "next-auth/react";

import { VehicleDataFrontend } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { updateFinancingDetails } from "@/lib/actions/vehicle.actions";

// Schema de validación para el formulario
const formSchema = z.object({
  interestRate: z.coerce
    .number()
    .min(0, "La tasa no puede ser negativa.")
    .max(30, "La tasa es demasiado alta."),
  loanTerm: z.coerce
    .number()
    .min(1, "El plazo debe ser de al menos 1 mes.")
    .max(84, "El plazo no puede exceder los 7 años (84 meses)."),
});

interface EditFinancingFormProps {
  vehicle: VehicleDataFrontend;
}

export function EditFinancingForm({ vehicle }: EditFinancingFormProps) {
  const router = useRouter();
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interestRate: vehicle.financingDetails?.interestRate || 10,
      loanTerm: vehicle.financingDetails?.loanTerm || 60,
    },
  });

  const { watch } = form;

  useEffect(() => {
    const subscription = watch((values) => {
      const { interestRate, loanTerm } = values;
      if (interestRate !== undefined && loanTerm !== undefined) {
        const downPayment = vehicle.price * 0.1; // Asumir entrada del 10%
        const principal = vehicle.price - downPayment; // Calcular capital a financiar

        if (principal > 0 && interestRate > 0 && loanTerm > 0) {
          const monthlyInterestRate = interestRate / 100 / 12;
          const numberOfPayments = loanTerm;
          const payment =
            principal *
            (monthlyInterestRate *
              Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
          setMonthlyPayment(payment);

          const total = payment * numberOfPayments;
          setTotalPayment(total);
          setTotalInterest(total - principal);
        } else {
          setMonthlyPayment(null);
          setTotalPayment(null);
          setTotalInterest(null);
        }
      }
    });

    // Calcular el pago inicial
    const { interestRate, loanTerm } = form.getValues();
    if (interestRate !== undefined && loanTerm !== undefined) {
      const downPayment = vehicle.price * 0.1; // Asumir entrada del 10%
      const principal = vehicle.price - downPayment; // Calcular capital a financiar

      if (principal > 0 && interestRate > 0 && loanTerm > 0) {
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm;
        const payment =
          principal *
          (monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
          (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        setMonthlyPayment(payment);

        const total = payment * numberOfPayments;
        setTotalPayment(total);
        setTotalInterest(total - principal);
      } else {
        setMonthlyPayment(null);
        setTotalPayment(null);
        setTotalInterest(null);
      }
    }

    return () => subscription.unsubscribe();
  }, [watch, vehicle.price, form]);

  async function onSubmit( values : z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await updateFinancingDetails({
        vehicleId: vehicle._id!,
        ...values,
      });

      if (result.success) {
        toast.success(
          "¡Perfecto! Los detalles de financiación se han actualizado."
        );
        router.push("/profile");
      } else {
        toast.error(result.error || "No se pudieron guardar los cambios.");
      }
    } catch {
      toast.error("Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className ="max-w-3xl border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-slate-900">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-950 dark:to-pink-950">
                <Calculator className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Editar Financiación
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Ajusta la tasa de interés y el plazo para ver la cuota mensual
                  estimada
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 pt-2">
            {/* Tasa de Interés */}
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <FormLabel className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Percent className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      Tasa de Interés Anual
                    </FormLabel>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900 self-start sm:self-center">
                      <span className="text-xl sm:text-2xl font-bold text-orange-700 dark:text-orange-400">
                        {field.value.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <FormControl>
                    <div className="space-y-4">
                      <Slider
                        min={0}
                        max={30}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>0%</span>
                        <span>15%</span>
                        <span>30%</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-gray-600 dark:text-gray-400">
                    Tasa de interés anual promedio del mercado
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plazo del Préstamo */}
            <FormField
              control={form.control}
              name="loanTerm"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <FormLabel className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Plazo del Préstamo
                    </FormLabel>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 self-start sm:self-center">
                      <span className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-400">
                        {field.value}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">
                        {field.value === 1 ? "mes" : "meses"}
                      </span>
                    </div>
                  </div>
                  <FormControl>
                    <div className="space-y-4">
                      <Slider
                        min={1}
                        max={84}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-4 [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-blue-600 dark:[&_[role=slider]]:bg-blue-500 dark:[&_[role=slider]]:border-blue-500 [&_[role=slider]]:shadow-lg [&_.relative]:bg-gray-300 dark:[&_.relative]:bg-gray-600 [&_.relative]:h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>1 mes</span>
                        <span>42 meses</span>
                        <span>84 meses</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-gray-600 dark:text-gray-400">
                    Duración del financiamiento en meses (hasta 7 años)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resumen de Financiación */}
            <div className="space-y-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Resumen de Financiación
                </h3>
              </div>

              <div className="grid gap-4">
                {/* Precio del vehículo */}
                <div className="flex flex-wrap justify-between items-center gap-2 p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700">
                      <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Precio del vehículo
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(vehicle.price)}
                  </span>
                </div>

                {/* Entrada (10%) */}
                <div className="flex flex-wrap justify-between items-center gap-2 p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700">
                      <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Entrada (10%)
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-green-700 dark:text-green-400">
                    -{formatPrice(vehicle.price * 0.1)}
                  </span>
                </div>

                {/* Monto a financiar */}
                <div className="flex flex-wrap justify-between items-center gap-2 p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700">
                      <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Monto a financiar
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(vehicle.price * 0.9)}
                  </span>
                </div>

                {/* Cuota mensual */}
                <div className="flex flex-wrap justify-between items-center gap-2 p-5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white/90 block">
                        Cuota mensual
                      </span>
                      <span className="text-xs text-white/70">
                        {form.watch("loanTerm")} pagos mensuales
                      </span>
                    </div>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-white">
                    {monthlyPayment ? formatPrice(monthlyPayment) : "N/A"}
                  </span>
                </div>

                {/* Total a pagar */}
                <div className="flex flex-wrap justify-between items-center gap-2 p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total a pagar
                  </span>
                  <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {totalPayment ? formatPrice(totalPayment) : "N/A"}
                  </span>
                </div>

                {/* Intereses totales */}
                <div className="flex flex-wrap justify-between items-center gap-2 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    Intereses totales
                  </span>
                  <span className="text-base sm:text-lg font-bold text-amber-800 dark:text-amber-300">
                    {totalInterest ? `+${formatPrice(totalInterest)}` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-gray-700 mt-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/profile")}
                disabled={isSubmitting}
                className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
              >
                {isSubmitting && (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}