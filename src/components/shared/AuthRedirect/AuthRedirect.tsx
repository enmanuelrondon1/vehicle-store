// src/components/shared/AuthRedirect/AuthRedirect.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

interface AuthRedirectProps {
  /** Si está autenticado, redirigir a esta URL */
  redirectIfAuthenticated?: string;
  /** Si NO está autenticado, redirigir a esta URL */
  redirectIfUnauthenticated?: string;
  /** Mostrar loading mientras se verifica */
  showLoading?: boolean;
  /** Componente a mostrar mientras carga */
  loadingComponent?: React.ReactNode;
  /** Componente hijo a renderizar si no se cumple la condición de redirección */
  children?: React.ReactNode;
}

function AuthRedirectContent({
  redirectIfAuthenticated,
  redirectIfUnauthenticated,
  showLoading = true,
  loadingComponent,
  children,
}: AuthRedirectProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "loading") return; // Esperar hasta que se cargue la sesión

    const isAuthenticated = status === "authenticated" && !!session?.user;

    if (isAuthenticated && redirectIfAuthenticated) {
      console.log("✅ Usuario autenticado, redirigiendo a:", redirectIfAuthenticated);
      // Agregar callback URL si existe
      const callbackUrl = searchParams.get("callbackUrl");
      const finalRedirect = callbackUrl ? decodeURIComponent(callbackUrl) : redirectIfAuthenticated;
      router.replace(finalRedirect);
      return;
    }

    if (!isAuthenticated && redirectIfUnauthenticated) {
      console.log("❌ Usuario no autenticado, redirigiendo a:", redirectIfUnauthenticated);
      // Agregar la URL actual como callback
      const currentUrl = window.location.pathname;
      const redirectUrl = `${redirectIfUnauthenticated}?callbackUrl=${encodeURIComponent(currentUrl)}`;
      router.replace(redirectUrl);
      return;
    }
  }, [status, session, redirectIfAuthenticated, redirectIfUnauthenticated, router, searchParams]);

  // Mostrar loading mientras se verifica la sesión
  if (status === "loading" && showLoading) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      )
    );
  }

  // Si hay redirección pendiente, mostrar mensaje temporal
  const isAuthenticated = status === "authenticated" && !!session?.user;
  
  if (isAuthenticated && redirectIfAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Redirigiendo...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && redirectIfUnauthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Redirigiendo al login...
          </p>
        </div>
      </div>
    );
  }

  // Si no hay redirección, mostrar el contenido hijo
  return <>{children}</>;
}

// Loading fallback para Suspense
function AuthRedirectSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default function AuthRedirect(props: AuthRedirectProps) {
  return (
    <Suspense fallback={<AuthRedirectSkeleton />}>
      <AuthRedirectContent {...props} />
    </Suspense>
  );
}