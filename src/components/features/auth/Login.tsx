//src/components/features/auth/Login.tsx
"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, User, Eye, EyeOff, Sparkles, LogIn } from "lucide-react";
import Link from "next/link";

// --- SVG Icons ---
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M21.35,11.1H12.18V13.83H18.67C18.3,17.22 15.77,19.5 12.18,19.5C8.8,19.5 6,16.7 6,13.32C6,9.94 8.8,7.14 12.18,7.14C13.96,7.14 15.38,7.78 16.48,8.84L18.3,7.02C16.56,5.34 14.46,4.18 12.18,4.18C7.03,4.18 3,8.36 3,13.32C3,18.28 7.03,22.46 12.18,22.46C17.05,22.46 21.55,18.88 21.55,13.56C21.55,12.71 21.45,11.88 21.35,11.1Z"
    />
  </svg>
);

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.83,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
    />
  </svg>
);

// --- Interfaces ---
interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  general?: string;
}

// --- Main Login Component ---
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido.";
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "El nombre es requerido.";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRegister = async (): Promise<boolean> => {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      const message = (data && data.message) || "Error al registrar usuario.";
      setErrors({ general: message });
      return false;
    }
    setMessage("Registro exitoso. Ahora puedes iniciar sesión.");
    return true;
  };

  const handleLogin = async (): Promise<boolean> => {
    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });
    if (result?.error) {
      setErrors({ general: "Email o contraseña incorrectos." });
      return false;
    }
    if (result?.ok) {
      setMessage("Inicio de sesión exitoso. Redirigiendo...");
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = isLogin ? await handleLogin() : await handleRegister();
      if (success) {
        if (isLogin) {
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 500);
        } else {
          setFormData({
            email: formData.email,
            password: "",
            confirmPassword: "",
            name: "",
          });
          setIsLogin(true);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error inesperado. Intenta nuevamente.";
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: '/' });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "", confirmPassword: "", name: "" });
    setErrors({});
    setMessage(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="relative flex flex-col m-6 space-y-8 bg-card shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        {/* Left side */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold text-card-foreground">
            {isLogin ? "Bienvenido de Nuevo" : "Crea tu Cuenta"}
          </span>
          <span className="font-light text-muted-foreground mb-8">
            {isLogin
              ? "Accede para gestionar tus vehículos."
              : "Únete a la comunidad de entusiastas."}
          </span>

          {message && (
            <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
              {message}
            </div>
          )}
          {errors.general && (
            <div className="p-3 mb-4 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="py-4 space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full border ${errors.name ? 'border-destructive' : 'border-input'} rounded-md py-2.5 pl-10 pr-4 text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring`}
                    placeholder="Nombre completo"
                  />
                  {errors.name && <p className="mt-1.5 text-sm text-destructive">{errors.name}</p>}
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full border ${errors.email ? 'border-destructive' : 'border-input'} rounded-md py-2.5 pl-10 pr-4 text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring`}
                  placeholder="tu@email.com"
                />
                {errors.email && <p className="mt-1.5 text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full border ${errors.password ? 'border-destructive' : 'border-input'} rounded-md py-2.5 pl-10 pr-10 text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring`}
                  placeholder="Contraseña"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
                <div className="flex items-center justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>
              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword || ""}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className={`w-full border ${errors.confirmPassword ? 'border-destructive' : 'border-input'} rounded-md py-2.5 pl-10 pr-10 text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring`}
                    placeholder="Confirmar contraseña"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                  {errors.confirmPassword && <p className="mt-1.5 text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
              )}
            </div>
            <div className="group rounded-lg mb-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full p-2.5 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground transition-all duration-300 transform group-hover:scale-105 shadow-lg group-hover:shadow-xl rounded-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />
                )}
                <span>
                  {isLoading
                    ? isLogin
                      ? "Iniciando sesión..."
                      : "Creando cuenta..."
                    : isLogin
                    ? "Iniciar Sesión"
                    : "Crear Cuenta"}
                </span>
              </Button>
            </div>
          </form>
 
 
           <div className="text-center text-muted-foreground">
             {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
            <Button onClick={toggleMode} disabled={isLoading} variant="link" className="font-semibold text-primary">
               {isLogin ? "Regístrate" : "Inicia sesión"}
             </Button>
           </div>
           <div className="flex items-center justify-center my-6">
             <div className="border-t border-border flex-grow"></div>
             <div className="px-3 text-muted-foreground">o</div>
             <div className="border-t border-border flex-grow"></div>
           </div>
            <div className="flex justify-center gap-4">
             <button onClick={() => handleSocialLogin('google')} disabled={isLoading} className="flex items-center justify-center w-full py-2.5 border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50">
               <GoogleIcon />
               <span className="ml-2">Google</span>
             </button>
             <button onClick={() => handleSocialLogin('github')} disabled={isLoading} className="flex items-center justify-center w-full py-2.5 border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50">
               <GithubIcon />
               <span className="ml-2">Github</span>
             </button>
           </div>
         </div>
         {/* Right side */}
        <div className="relative hidden md:block">
          <Image
            src="https://res.cloudinary.com/dcdawwvx2/image/upload/v1760757753/Captura_desde_2025-10-17_23-21-43_et4r6a.png"
            alt="img"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
            width={400}
            height={600}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Login;