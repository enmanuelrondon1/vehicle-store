"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react";

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

interface AuthFormProps {
  onLoginSuccess?: () => void; // Callback para cuando el login sea exitoso
}

const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
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

  // Validación de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación de contraseña
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "El nombre es requerido";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirma tu contraseña";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en los inputs
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Manejar registro con mejor manejo de errores
  const handleRegister = async (): Promise<boolean> => {
    try {
      console.log("Enviando datos de registro:", {
        name: formData.name,
        email: formData.email,
        password: "***",
      });

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log(
        "Respuesta del servidor:",
        response.status,
        response.statusText
      );

      // Verificar si la respuesta es JSON válido
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Respuesta no es JSON:", contentType);
        const textResponse = await response.text();
        console.error("Contenido de la respuesta:", textResponse);
        setErrors({
          general: "Error del servidor. Revisa la consola para más detalles.",
        });
        return false;
      }

      const data = await response.json();
      console.log("Datos recibidos:", data);

      if (!response.ok) {
        setErrors({ general: data.message || "Error al registrar usuario" });
        return false;
      }

      setMessage("Registro exitoso. Ahora puedes iniciar sesión.");
      return true;
    } catch (error) {
      console.error("Error en handleRegister:", error);

      // Manejar diferentes tipos de errores
      if (error instanceof SyntaxError) {
        setErrors({ general: "Error de formato en la respuesta del servidor" });
      } else if (error instanceof TypeError) {
        setErrors({
          general: "Error de conexión. Verifica tu conexión a internet.",
        });
      } else {
        setErrors({ general: "Error inesperado. Intenta nuevamente." });
      }
      return false;
    }
  };

  // Función handleLogin corregida
  const handleLogin = async (): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        redirect: false, // Mantener en false para manejar manualmente
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        // Manejar diferentes tipos de errores
        if (result.error === "CredentialsSignin") {
          setErrors({ general: "Email o contraseña incorrectos" });
        } else {
          setErrors({ general: "Error al iniciar sesión" });
        }
        return false;
      }

      if (result?.ok) {
        setMessage("Inicio de sesión exitoso. Redirigiendo...");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error en handleLogin:", error);
      setErrors({ general: "Error de conexión. Intenta nuevamente." });
      return false;
    }
  };

  // Función handleSubmit corregida
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await handleLogin();
        if (success) {
          // Llamar al callback si existe (para cerrar modal)
          if (onLoginSuccess) {
            onLoginSuccess();
          }
          // Esperar un momento para que se actualice la sesión
          setTimeout(() => {
            router.push("/");
            router.refresh(); // Forzar refresh para actualizar la sesión
          }, 500);
        }
      } else {
        const registerSuccess = await handleRegister();
        if (registerSuccess) {
          // Limpiar el formulario y cambiar a modo login
          setFormData({
            email: formData.email, // Mantener el email para facilitar el login
            password: "",
            confirmPassword: "",
            name: "",
          });
          setIsLogin(true); // Cambiar a modo login
        }
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      setErrors({ general: "Error inesperado. Intenta nuevamente." });
    } finally {
      setIsLoading(false);
    }
  };

  // Cambiar entre login y registro
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
    setErrors({});
    setMessage(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {isLogin
            ? "Ingresa tus credenciales para continuar"
            : "Completa los datos para crear tu cuenta"}
        </p>
      </div>

      {/* Mensajes de estado */}
      {message && (
        <div
          className={`p-3 mb-4 text-center rounded-lg ${
            message.includes("exitoso")
              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
              : "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
          }`}
        >
          {message}
        </div>
      )}

      {/* Error general */}
      {errors.general && (
        <div className="p-3 mb-4 text-center rounded-lg bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo de nombre (solo para registro) */}
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Nombre completo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                errors.name
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Ingresa tu nombre completo"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </p>
            )}
          </div>
        )}

        {/* Campo de email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Mail className="inline w-4 h-4 mr-1" />
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
              errors.email
                ? "border-red-500 dark:border-red-400"
                : "border-gray-300 dark:border-gray-600"
            }`}
            placeholder="tu@email.com"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Campo de contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Lock className="inline w-4 h-4 mr-1" />
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                errors.password
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.password}
            </p>
          )}
        </div>

        {/* Campo de confirmar contraseña (solo para registro) */}
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Lock className="inline w-4 h-4 mr-1" />
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.confirmPassword
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        )}

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isLogin ? "Iniciando sesión..." : "Creando cuenta..."}
            </>
          ) : isLogin ? (
            "Iniciar Sesión"
          ) : (
            "Crear Cuenta"
          )}
        </button>
      </form>

      {/* Toggle entre login y registro */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
          <button
            onClick={toggleMode}
            className="ml-1 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            disabled={isLoading}
          >
            {isLogin ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
