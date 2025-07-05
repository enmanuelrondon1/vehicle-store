"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode, useCallback } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  fallback = <LoadingSpinner />, 
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Envolver handleRedirect en useCallback para evitar recreaciones innecesarias
  const handleRedirect = useCallback(() => {
    if (!isRedirecting) {
      setIsRedirecting(true);
      const currentPath = window.location.pathname;
      const callbackUrl = encodeURIComponent(currentPath);
      
      // Usar replace para evitar que el usuario pueda volver atrás
      router.replace(`${redirectTo}?callbackUrl=${callbackUrl}`);
    }
  }, [isRedirecting, router, redirectTo]);

  useEffect(() => {
    // Deshabilitar caché del navegador para esta página
    if (typeof window !== 'undefined') {
      // Prevenir caché con headers
      const preventCache = () => {
        if ('serviceWorker' in navigator) {
          // Si hay service worker, forzar actualización
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
              registration.update();
            });
          });
        }
      };
      
      preventCache();

      // Manejar evento de visibilidad de la página
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          // Cuando la página se vuelve visible, revalidar autenticación
          if (status === 'unauthenticated') {
            handleRedirect();
          }
        }
      };

      // Manejar evento de focus (cuando el usuario vuelve a la pestaña)
      const handleFocus = () => {
        if (status === 'unauthenticated') {
          handleRedirect();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleFocus);

      // Cleanup
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [status, handleRedirect]); // Agregar handleRedirect como dependencia

  // Manejar el botón "atrás" del navegador con pushState
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Forzar un pushState inicial para prevenir el "atrás" inicial
      window.history.pushState(null, '', window.location.href);

      const handlePopState = (event: PopStateEvent) => {
        if (status === 'unauthenticated') {
          event.preventDefault();
          handleRedirect();
        } else {
          // Forzar otro pushState para bloquear el "atrás"
          window.history.pushState(null, '', window.location.href);
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [status, handleRedirect]); // Agregar handleRedirect como dependencia

  useEffect(() => {
    if (status === 'loading') {
      // Aún cargando la sesión
      return;
    }

    if (status === 'unauthenticated') {
      // No autenticado, redirigir
      handleRedirect();
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // Usuario autenticado, permitir acceso
      setIsAuthorized(true);
      setIsRedirecting(false);
    }
  }, [status, session, handleRedirect]); // Agregar handleRedirect como dependencia

  // Mientras está cargando o redirigiendo
  if (status === 'loading' || isRedirecting || !isAuthorized) {
    return <>{fallback}</>;
  }

  // Usuario autenticado, mostrar contenido
  return <>{children}</>;
};

// Componente de loading por defecto
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
      <div className="text-gray-600 dark:text-gray-300">
        <p className="text-lg font-medium">Verificando acceso...</p>
        <p className="text-sm opacity-75">Por favor espera un momento</p>
      </div>
    </div>
  </div>
);

export default ProtectedRoute;