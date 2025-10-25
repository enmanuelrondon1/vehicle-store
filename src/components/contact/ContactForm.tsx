// src/components/contact/ContactForm.tsx
"use client";

import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  Variants,
} from "framer-motion";
import {
  Send,
  Loader2,
  Phone,
  Clock,
  Building,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

// --- Zod Schema for Validation ---
const contactFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  email: z.string().min(1, "El email es requerido.").email("El formato del email no es válido."),
  subject: z.string().min(1, "El asunto es requerido."),
  message: z.string().min(1, "El mensaje es requerido.").max(500, "El mensaje no puede exceder los 500 caracteres."),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// --- Animation Variants (unchanged) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const, // FIX: Added 'as const' to solve type error
      stiffness: 100,
    },
  },
};

// --- Main Contact Form Component ---
const ContactForm: React.FC = () => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const { formState: { isSubmitting, errors } } = form;

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Ocurrió un error al enviar el mensaje.");
      }
      toast.success("¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.");
      form.reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido.";
      toast.error(errorMessage);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto p-4 md:p-8 font-sans">
        {/* --- Contact Info Section (unchanged) --- */}
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="md:col-span-1 space-y-8"
        >
          <m.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-foreground">
              Ponte en contacto
            </h2>
            <p className="text-muted-foreground mt-2">
              ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
            </p>
          </m.div>

          <m.div variants={itemVariants} className="space-y-4">
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">Teléfono</h3>
                <p className="text-muted-foreground">(123) 456-7890</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">Email</h3>
                <p className="text-muted-foreground">support@automarket.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Building className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">Oficina</h3>
                <p className="text-muted-foreground">
                  123 Auto St, Car City, 45678
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">
                  Horario de atención
                </h3>
                <p className="text-muted-foreground">
                  Lunes - Viernes: 9am - 6pm
                </p>
              </div>
            </div>
          </m.div>
        </m.div>

        {/* --- Form Section (Refactored with react-hook-form) --- */}
        <Form {...form}>
          <m.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={form.handleSubmit(onSubmit)}
            className="md:col-span-2 bg-card p-8 rounded-2xl shadow-lg space-y-6 border"
            noValidate
          >
            <AnimatePresence>
              {errors.root?.serverError && (
                <m.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg text-center"
                >
                  {errors.root.serverError.message}
                </m.div>
              )}
            </AnimatePresence>

            <m.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="Tu nombre completo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </m.div>

            <m.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={isSubmitting}
                        placeholder="tu@email.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </m.div>

            <m.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asunto</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isSubmitting}
                        placeholder="¿En qué podemos ayudarte?"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </m.div>

            <m.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensaje</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isSubmitting}
                        placeholder="Escribe tu mensaje aquí..."
                        className="min-h-[120px]"
                        maxLength={500}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </m.div>

            <m.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-lg py-6"
                size="lg"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
              </Button>
            </m.div>
          </m.form>
        </Form>
      </div>
    </LazyMotion>
  );
};

export default ContactForm;