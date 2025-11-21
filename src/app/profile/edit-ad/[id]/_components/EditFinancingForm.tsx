// src/app/profile/edit-ad/[id]/_components/EditFinancingForm.tsx
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
  Info,
  Sparkles,
  ArrowUpRight,
  CheckCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

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
import { Badge } from "@/components/ui/badge";
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-4xl mx-auto border-0 shadow-2xl overflow-hidden card-glass">
        {/* Efectos de brillo superior */}
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50"></div>
        
        {/* Patrón de puntos premium */}
        <div className="absolute top-0 left-0 w-full h-32 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, var(--primary) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="space-y-1 pb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 shimmer-effect">
                    <Calculator className="w-7 h-7 text-primary" />
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-primary/20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.div>
                </motion.div>
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-bold font-heading text-gradient-primary">
                    Editar Financiación
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-muted-foreground mt-1">
                    Ajusta la tasa de interés y el plazo para ver la cuota mensual estimada
                  </CardDescription>
                </div>
              </motion.div>
              
              {/* Badge de información premium */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20"
              >
                <Info className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Esta calculadora proporciona una estimación basada en los valores ingresados. Las condiciones finales pueden variar según la entidad financiera.
                </p>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-8 pt-2">
              {/* Tasa de Interés */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <FormLabel className="text-base font-semibold font-heading flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-primary/10">
                            <Percent className="w-4 h-4 text-primary" />
                          </div>
                          Tasa de Interés Anual
                        </FormLabel>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
                        >
                          <span className="text-2xl font-bold font-heading text-gradient-primary">
                            {field.value.toFixed(1)}%
                          </span>
                        </motion.div>
                      </div>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="relative">
                            <Slider
                              min={0}
                              max={30}
                              step={0.1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="py-6"
                              style={{
                                '--slider-track-bg': 'var(--muted)',
                                '--slider-range-bg': 'var(--gradient-primary)',
                                '--slider-thumb-bg': 'var(--primary)',
                                '--slider-thumb-border': 'var(--background)',
                              } as React.CSSProperties}
                            />
                            <motion.div
                              className="absolute top-0 h-full w-1 bg-primary/20 rounded-full pointer-events-none"
                              style={{ left: `${(field.value / 30) * 100}%` }}
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            ></motion.div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0%</span>
                            <span>15%</span>
                            <span>30%</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription className="text-muted-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Tasa de interés anual promedio del mercado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Plazo del Préstamo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <FormField
                  control={form.control}
                  name="loanTerm"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <FormLabel className="text-base font-semibold font-heading flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-accent/10">
                            <Calendar className="w-4 h-4 text-accent" />
                          </div>
                          Plazo del Préstamo
                        </FormLabel>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20"
                        >
                          <span className="text-2xl font-bold font-heading text-gradient-accent">
                            {field.value}
                          </span>
                          <span className="text-sm font-medium text-accent">
                            {field.value === 1 ? "mes" : "meses"}
                          </span>
                        </motion.div>
                      </div>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="relative">
                            <Slider
                              min={1}
                              max={84}
                              step={1}
                              value={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="py-6"
                              style={{
                                '--slider-track-bg': 'var(--muted)',
                                '--slider-range-bg': 'var(--gradient-accent)',
                                '--slider-thumb-bg': 'var(--accent)',
                                '--slider-thumb-border': 'var(--background)',
                              } as React.CSSProperties}
                            />
                            <motion.div
                              className="absolute top-0 h-full w-1 bg-accent/20 rounded-full pointer-events-none"
                              style={{ left: `${((field.value - 1) / 83) * 100}%` }}
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            ></motion.div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>1 mes</span>
                            <span>42 meses</span>
                            <span>84 meses</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription className="text-muted-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        Duración del financiamiento en meses (hasta 7 años)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Resumen de Financiación */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-4 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent p-6 relative overflow-hidden"
              >
                {/* Efecto de brillo de fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50"></div>
                
                <div className="relative flex items-center gap-2 mb-6">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="p-2 rounded-lg bg-primary/10"
                  >
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-bold font-heading text-gradient-primary">
                    Resumen de Financiación
                  </h3>
                  <Badge className="ml-auto badge-premium">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Calculado
                  </Badge>
                </div>

                <div className="grid gap-4 relative">
                  {/* Precio del vehículo */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-wrap justify-between items-center gap-2 p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Precio del vehículo
                      </span>
                    </div>
                    <span className="text-lg font-bold font-heading">
                      {formatPrice(vehicle.price)}
                    </span>
                  </motion.div>

                  {/* Entrada (10%) */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-wrap justify-between items-center gap-2 p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-success/10">
                        <DollarSign className="w-4 h-4 text-success" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Entrada (10%)
                      </span>
                    </div>
                    <span className="text-lg font-bold text-success">
                      -{formatPrice(vehicle.price * 0.1)}
                    </span>
                  </motion.div>

                  {/* Monto a financiar */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-wrap justify-between items-center gap-2 p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Calculator className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        Monto a financiar
                      </span>
                    </div>
                    <span className="text-lg font-bold font-heading">
                      {formatPrice(vehicle.price * 0.9)}
                    </span>
                  </motion.div>

                  {/* Cuota mensual - Elemento destacado */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap justify-between items-center gap-2 p-5 rounded-2xl bg-gradient-to-r from-primary to-accent shadow-lg relative overflow-hidden"
                  >
                    {/* Efecto de brillo animado */}
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                    
                    <div className="relative flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-white/20 backdrop-blur-sm">
                        <Calendar className="w-6 h-6 text-white" />
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
                    <div className="relative flex items-center gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        {monthlyPayment ? formatPrice(monthlyPayment) : "N/A"}
                      </span>
                      <ArrowUpRight className="w-5 h-5 text-white/70" />
                    </div>
                  </motion.div>

                  {/* Total a pagar */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-wrap justify-between items-center gap-2 p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50"
                  >
                    <span className="text-sm font-medium text-muted-foreground">
                      Total a pagar
                    </span>
                    <span className="text-lg font-bold font-heading">
                      {totalPayment ? formatPrice(totalPayment) : "N/A"}
                    </span>
                  </motion.div>

                  {/* Intereses totales */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-wrap justify-between items-center gap-2 p-4 rounded-xl bg-destructive/5 border border-destructive/20"
                  >
                    <span className="text-sm font-medium text-destructive">
                      Intereses totales
                    </span>
                    <span className="text-lg font-bold text-destructive">
                      {totalInterest ? `+${formatPrice(totalInterest)}` : "N/A"}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </CardContent>

            <CardFooter className="bg-muted/20 border-t border-border/50 mt-6 p-6">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/profile")}
                    disabled={isSubmitting}
                    className="w-full h-12 border-border/50 hover:bg-muted/50"
                  >
                    Cancelar
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 btn-primary"
                  >
                    {isSubmitting && (
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </motion.div>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}