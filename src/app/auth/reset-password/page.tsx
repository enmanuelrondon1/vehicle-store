// src/app/auth/reset-password/page.tsx
// VERSIÓN CON DISEÑO UNIFICADO Y FUNCIÓN DE MOSTRAR/OCULTAR CONTRASEÑA

"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, KeyRound, Eye, EyeOff } from "lucide-react";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setError("Token no válido o expirado.");
      toast.error("Token no válido o expirado.");
    }
  }, [token]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) {
      setError("Token no válido o expirado.");
      toast.error("Token no válido o expirado.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Algo salió mal.");
      }

      setMessage(data.message);
      toast.success(data.message);
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground py-8 px-4">
        <Card className="w-full max-w-md shadow-sm border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Lock className="w-5 h-5 text-destructive" />
              </div>
              <CardTitle className="text-xl font-heading">
                Error de Restablecimiento
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl border-2 border-destructive/20 bg-destructive/5">
              <div className="flex items-start gap-3">
                <KeyRound className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-2">
                    No se pudo restablecer la contraseña
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
        {/* ========== ENCABEZADO ========== */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
                Restablecer Contraseña
              </h2>
              <p className="text-base text-muted-foreground mt-0.5">
                Ingresa tu nueva contraseña para continuar
              </p>
            </div>
          </div>
        </div>

        {/* ========== FORMULARIO ========== */}
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg font-heading text-center">
              Crea tu Nueva Contraseña
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres"
                            {...field}
                            disabled={isLoading}
                            className="w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repite la nueva contraseña"
                            {...field}
                            disabled={isLoading}
                            className="w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-transparent border-t-white animate-spin rounded-full" />
                      <span className="ml-2">Restableciendo...</span>
                    </>
                  ) : (
                    "Restablecer Contraseña"
                  )}
                </Button>
              </form>
            </Form>

            {message && (
              <div className="mt-4 p-4 rounded-xl border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground mb-2">
                      ¡Contraseña restablecida con éxito!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tu contraseña ha sido actualizada correctamente.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}