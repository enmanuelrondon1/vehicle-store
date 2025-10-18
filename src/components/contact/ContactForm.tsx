// src/components/contact/ContactForm.tsx
"use client";

import React, { useState, ChangeEvent, FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  Variants,
} from "framer-motion";
import {
  User,
  Mail,
  MessageSquare,
  Send,
  Loader2,
  Phone,
  Clock,
  Building,
} from "lucide-react";

// --- Interfaces ---
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  general?: string;
}

// --- Animation Variants ---
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
      type: "spring",
      stiffness: 100,
    },
  },
};

// --- Floating Label Input Component ---
interface FloatingLabelInputProps {
  id: string;
  name: keyof FormData;
  placeholder: string;
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  disabled: boolean;
  error?: string;
  icon: ReactNode;
  isTextarea?: boolean;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled,
  error,
  icon,
  isTextarea = false,
}) => {
  const InputComponent = isTextarea ? Textarea : Input;
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        {icon}
      </div>
      <InputComponent
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder=" " // Required for the floating label effect
        className={`pl-12 pt-6 peer bg-transparent ${error ? "border-destructive" : ""}`}
        rows={isTextarea ? 5 : undefined}
      />
      <label
        htmlFor={id}
        className="absolute text-muted-foreground duration-300 transform -translate-y-4 scale-75 top-4 z-0 left-12 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {placeholder}
      </label>
      <AnimatePresence>
        {error && (
          <m.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 text-sm text-destructive"
          >
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Contact Form Component ---
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido.";
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido.";
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido.";
    }
    if (!formData.subject.trim()) newErrors.subject = "El asunto es requerido.";
    if (!formData.message.trim())
      newErrors.message = "El mensaje es requerido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Ocurrió un error al enviar el mensaje."
        );
      setSuccessMessage(
        "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido.";
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Building className="h-7 w-7 text-primary" />,
      title: "Nuestra Oficina",
      lines: ["Av. Principal, Edificio Tech, Piso 5", "Caracas, Venezuela"],
    },
    {
      icon: <Phone className="h-7 w-7 text-primary" />,
      title: "Teléfono",
      lines: ["+58 (212) 555-0101"],
    },
    {
      icon: <Mail className="h-7 w-7 text-primary" />,
      title: "Email",
      lines: ["tech@1group.media"],
    },
    {
      icon: <Clock className="h-7 w-7 text-primary" />,
      title: "Horario",
      lines: ["Lunes a Viernes: 9:00 AM - 5:00 PM"],
    },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden glass-effect"
        >
          {/* --- Form Section --- */}
          <m.div variants={itemVariants} className="p-8 sm:p-12">
            <h2 className="text-4xl font-bold mb-2 text-foreground animate-float">
              Envíanos un Mensaje
            </h2>
            <p className="text-muted-foreground mb-8">
              Estamos listos para escucharte.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FloatingLabelInput
                id="name"
                name="name"
                placeholder="Tu Nombre"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                error={errors.name}
                icon={<User className="h-5 w-5 text-primary/80" />}
              />
              <FloatingLabelInput
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                error={errors.email}
                icon={<Mail className="h-5 w-5 text-primary/80" />}
              />
              <FloatingLabelInput
                id="subject"
                name="subject"
                placeholder="Asunto del mensaje"
                value={formData.subject}
                onChange={handleChange}
                disabled={isLoading}
                error={errors.subject}
                icon={<MessageSquare className="h-5 w-5 text-primary/80" />}
              />
              <FloatingLabelInput
                id="message"
                name="message"
                placeholder="Escribe tu mensaje aquí..."
                value={formData.message}
                onChange={handleChange}
                disabled={isLoading}
                error={errors.message}
                icon={<div />} // Empty div for alignment
                isTextarea
              />

              <div>
                <Button
                  type="submit"
                  className="w-full shine-button text-lg py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  {isLoading ? "Enviando..." : "Enviar Mensaje"}
                </Button>
              </div>

              <AnimatePresence>
                {successMessage && (
                  <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 text-center rounded-md bg-green-500/20 text-green-300 border border-green-500/30"
                  >
                    {successMessage}
                  </m.div>
                )}
                {errors.general && (
                  <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 text-center rounded-md bg-destructive/20 text-red-300 border border-destructive/30"
                  >
                    {errors.general}
                  </m.div>
                )}
              </AnimatePresence>
            </form>
          </m.div>

          {/* --- Contact Info Section --- */}
          <m.div
            variants={itemVariants}
            className="p-8 sm:p-12 grid-pattern-bg relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-8 text-foreground">
                Información Directa
              </h2>
              <div className="space-y-8">
                {contactInfo.map((item, index) => (
                  <m.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start space-x-6"
                  >
                    <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <div className="text-muted-foreground text-lg">
                        {item.lines.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          </m.div>
        </m.div>
      </div>
    </LazyMotion>
  );
};

export default ContactForm;