// src/app/login/page.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import  LoginForm from "@/components/features/auth/LoginForm";

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir
    if (status === "authenticated" && session?.user) {
      console.log("✅ Usuario ya autenticado, redirigiendo...");
      
      // Obtener la URL de callback o usar la página principal como fallback
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      
      // Decodificar la URL si está codificada
      const redirectUrl = decodeURIComponent(callbackUrl);
      
      // Validar que la URL de redirección sea segura (misma domain)
      const isValidRedirect = redirectUrl.startsWith('/') && !redirectUrl.startsWith('//');
      
      const finalRedirect = isValidRedirect ? redirectUrl : "/";
      
      console.log("🔄 Redirigiendo a:", finalRedirect);
      
      // Usar replace para evitar que el usuario pueda volver atrás a login
      router.replace(finalRedirect);
    }
  }, [status, session, router, searchParams]);

  // Mostrar loading mientras se verifica la sesión
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si ya está autenticado, mostrar mensaje temporal mientras redirige
  if (status === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Ya estás autenticado. Redirigiendo...
          </p>
        </div>
      </div>
    );
  }

  // Solo mostrar el formulario si no está autenticado
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <LoginForm />
    </div>
  );
}

// Loading fallback para Suspense
function LoginPageSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}