// //src/components/features/auth/LoginForm.tsx
// 'use client';

// import React, { useState, ChangeEvent, FormEvent, ReactNode } from "react";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";
// import {
//   LazyMotion,
//   domAnimation,
//   m,
//   AnimatePresence,
//   Variants,
// } from "framer-motion";
// import { Eye, EyeOff, User, Mail, Lock, Loader2, Sparkles, LogIn } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// // --- Interfaces ---
// interface FormData {
//   email: string;
//   password: string;
//   confirmPassword?: string;
//   name?: string;
// }

// interface FormErrors {
//   email?: string;
//   password?: string;
//   confirmPassword?: string;
//   name?: string;
//   general?: string;
// }

// interface AuthFormProps {
//   onLoginSuccess?: () => void;
// }

// // --- Animation Variants ---
// const containerVariants: Variants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       staggerChildren: 0.1,
//       ease: "circOut",
//       duration: 0.5,
//     },
//   },
// };

// const itemVariants: Variants = {
//   hidden: { opacity: 0, y: 15 },
//   visible: { opacity: 1, y: 0, transition: { ease: "circOut", duration: 0.4 } },
// };

// // --- Floating Label Input Component ---
// interface FloatingLabelInputProps {
//   id: string;
//   name: keyof FormData;
//   placeholder: string;
//   value: string;
//   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   type?: string;
//   disabled: boolean;
//   error?: string;
//   icon: ReactNode;
//   showPasswordToggle?: boolean;
//   onToggleShowPassword?: () => void;
//   showPassword?: boolean;
// }

// const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
//   id,
//   name,
//   placeholder,
//   value,
//   onChange,
//   type = "text",
//   disabled,
//   error,
//   icon,
//   showPasswordToggle = false,
//   onToggleShowPassword,
//   showPassword,
// }) => (
//   <div className="relative">
//     <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors duration-300">
//       {icon}
//     </div>
//     <Input
//       id={id}
//       name={name}
//       type={type}
//       value={value}
//       onChange={onChange}
//       disabled={disabled}
//       placeholder=" "
//       className={`pl-11 h-12 peer bg-transparent border-2 transition-colors duration-300 ${
//         error
//           ? "border-destructive focus:border-destructive"
//           : "border-border hover:border-primary/50 focus:border-primary"
//       }`}
//     />
//     <label
//       htmlFor={id}
//       className={`absolute text-muted-foreground duration-300 transform -translate-y-1/2 scale-75 top-1/2 left-11 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 peer-focus:top-3 peer-focus:bg-background peer-focus:px-1 pointer-events-none ${
//         value ? 'top-3 scale-75 -translate-y-1/2 bg-background px-1' : 'top-1/2'
//       }`}
//     >
//       {placeholder}
//     </label>
//     {showPasswordToggle && (
//       <button
//         type="button"
//         onClick={onToggleShowPassword}
//         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
//         disabled={disabled}
//       >
//         {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//       </button>
//     )}
//     <AnimatePresence>
//       {error && (
//         <m.p
//           initial={{ opacity: 0, y: -5 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0 }}
//           className="mt-1.5 text-sm text-destructive"
//         >
//           {error}
//         </m.p>
//       )}
//     </AnimatePresence>
//   </div>
// );

// // --- Main Auth Form Component ---
// const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [formData, setFormData] = useState<FormData>({
//     email: "",
//     password: "",
//     confirmPassword: "",
//     name: "",
//   });
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [message, setMessage] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const router = useRouter();

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};
//     if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
//       newErrors.email = "Ingresa un email válido.";
//     if (!formData.password || formData.password.length < 8)
//       newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
//     if (!isLogin) {
//       if (!formData.name) newErrors.name = "El nombre es requerido.";
//       if (formData.password !== formData.confirmPassword)
//         newErrors.confirmPassword = "Las contraseñas no coinciden.";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name as keyof FormErrors])
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//   };

//   const handleRegister = async (): Promise<boolean> => {
//     const response = await fetch("/api/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//       }),
//     });
//     const data = await response.json();
//     if (!response.ok) {
//       setErrors({ general: data.message || "Error al registrar usuario." });
//       return false;
//     }
//     setMessage("Registro exitoso. Ahora puedes iniciar sesión.");
//     return true;
//   };

//   const handleLogin = async (): Promise<boolean> => {
//     const result = await signIn("credentials", {
//       redirect: false,
//       email: formData.email,
//       password: formData.password,
//     });
//     if (result?.error) {
//       setErrors({ general: "Email o contraseña incorrectos." });
//       return false;
//     }
//     if (result?.ok) {
//       setMessage("Inicio de sesión exitoso. Redirigiendo...");
//       return true;
//     }
//     return false;
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setMessage(null);
//     setErrors({});
//     if (!validateForm()) return;

//     setIsLoading(true);
//     try {
//       const success = isLogin ? await handleLogin() : await handleRegister();
//       if (success) {
//         if (isLogin) {
//           onLoginSuccess?.();
//           setTimeout(() => {
//             router.push("/");
//             router.refresh();
//           }, 500);
//         } else {
//           setFormData({
//             email: formData.email,
//             password: "",
//             confirmPassword: "",
//             name: "",
//           });
//           setIsLogin(true);
//         }
//       }
//     } catch (error) {
//       setErrors({ general: "Error inesperado. Intenta nuevamente." });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleMode = () => {
//     setIsLogin(!isLogin);
//     setFormData({ email: "", password: "", confirmPassword: "", name: "" });
//     setErrors({});
//     setMessage(null);
//   };

//   return (
//     <LazyMotion features={domAnimation}>
//       <m.div
//         key={isLogin ? "login" : "register"}
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="w-full max-w-md p-8 space-y-6 bg-card text-card-foreground rounded-2xl border border-border shadow-lg"
//       >
//         <m.div variants={itemVariants} className="text-center">
//           <h2 className="text-3xl font-bold tracking-tight">
//             {isLogin ? "Bienvenido de Nuevo" : "Crea tu Cuenta"}
//           </h2>
//           <p className="mt-2 text-muted-foreground">
//             {isLogin
//               ? "Accede para gestionar tus vehículos."
//               : "Únete a la comunidad de entusiastas."}
//           </p>
//         </m.div>

//         <AnimatePresence mode="wait">
//           {message && (
//             <m.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="p-3 mb-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-300 dark:border-green-700"
//             >
//               {message}
//             </m.div>
//           )}
//           {errors.general && (
//             <m.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="p-3 mb-4 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg"
//             >
//               {errors.general}
//             </m.div>
//           )}
//         </AnimatePresence>

//         <m.form
//           variants={containerVariants}
//           onSubmit={handleSubmit}
//           className="space-y-4"
//         >
//           <AnimatePresence>
//             {!isLogin && (
//               <m.div
//                 key="name-field"
//                 variants={itemVariants}
//                 initial="hidden"
//                 animate="visible"
//                 exit={{ opacity: 0, y: -10 }}
//               >
//                 <FloatingLabelInput
//                   id="name"
//                   name="name"
//                   placeholder="Nombre completo"
//                   value={formData.name || ""}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                   error={errors.name}
//                   icon={<User size={20} />}
//                 />
//               </m.div>
//             )}
//           </AnimatePresence>

//           <m.div variants={itemVariants}>
//             <FloatingLabelInput
//               id="email"
//               name="email"
//               type="email"
//               placeholder="tu@email.com"
//               value={formData.email}
//               onChange={handleInputChange}
//               disabled={isLoading}
//               error={errors.email}
//               icon={<Mail size={20} />}
//             />
//           </m.div>

//           <m.div variants={itemVariants}>
//             <FloatingLabelInput
//               id="password"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Contraseña"
//               value={formData.password}
//               onChange={handleInputChange}
//               disabled={isLoading}
//               error={errors.password}
//               icon={<Lock size={20} />}
//               showPasswordToggle
//               onToggleShowPassword={() => setShowPassword(!showPassword)}
//               showPassword={showPassword}
//             />
//           </m.div>

//           <AnimatePresence>
//             {!isLogin && (
//               <m.div
//                 key="confirm-password-field"
//                 variants={itemVariants}
//                 initial="hidden"
//                 animate="visible"
//                 exit={{ opacity: 0, y: -10 }}
//               >
//                 <FloatingLabelInput
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   type={showConfirmPassword ? "text" : "password"}
//                   placeholder="Confirmar contraseña"
//                   value={formData.confirmPassword || ""}
//                   onChange={handleInputChange}
//                   disabled={isLoading}
//                   error={errors.confirmPassword}
//                   icon={<Lock size={20} />}
//                   showPasswordToggle
//                   onToggleShowPassword={() =>
//                     setShowConfirmPassword(!showConfirmPassword)
//                   }
//                   showPassword={showConfirmPassword}
//                 />
//               </m.div>
//             )}
//           </AnimatePresence>

//           <m.div variants={itemVariants} className="pt-2">
//             <Button
//               type="submit"
//               disabled={isLoading}
//               className="w-full h-12 text-base font-semibold"
//             >
//               {isLoading ? (
//                 <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//               ) : (
//                 isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />
//               )}
//               {isLoading
//                 ? isLogin
//                   ? "Iniciando sesión..."
//                   : "Creando cuenta..."
//                 : isLogin
//                 ? "Iniciar Sesión"
//                 : "Crear Cuenta"}
//             </Button>
//           </m.div>
//         </m.form>

//         <m.div variants={itemVariants} className="text-center text-sm text-muted-foreground">
//           {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
//           <button
//             onClick={toggleMode}
//             disabled={isLoading}
//             className="ml-1.5 font-semibold text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
//           >
//             {isLogin ? "Regístrate" : "Inicia sesión"}
//           </button>
//         </m.div>
//       </m.div>
//     </LazyMotion>
//   );
// };

// export default AuthForm;