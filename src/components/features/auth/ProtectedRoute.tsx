// src/components/features/auth/ProtectedRoute.tsx
// ✅ OPTIMIZADO: consolidados los 3 useEffect en 2 (lógica + listeners de navegación).
//    El update() de service worker se diferió con requestIdleCallback para no
//    ejecutarse en el hilo principal durante el montaje inicial.
//    Eliminado el useEffect extra de visibilitychange+focus que duplicaba
//    la lógica de redirección ya cubierta por el efecto de sesión.

"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode, useCallback } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({
  children,
  fallback = <LoadingSpinner />,
  redirectTo = '/login',
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleRedirect = useCallback(() => {
    if (!isRedirecting) {
      setIsRedirecting(true);
      const currentPath = window.location.pathname;
      const callbackUrl = encodeURIComponent(currentPath);
      router.replace(`${redirectTo}?callbackUrl=${callbackUrl}`);
    }
  }, [isRedirecting, router, redirectTo]);

  const isUnauthorized = useCallback(() => {
    return (
      status === 'unauthenticated' ||
      (requireAdmin && session?.user?.role !== 'admin')
    );
  }, [status, session, requireAdmin]);

  // ✅ Efecto principal: manejo de autorización + service worker diferido.
  //    El SW update se ejecuta en tiempo libre (requestIdleCallback) para no
  //    bloquear el hilo durante el montaje del componente.
  useEffect(() => {
    // SW update diferido — no bloquea el hilo principal en mount
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const cb = () => {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((r) => r.update());
        });
      };
      if ('requestIdleCallback' in window) {
        (window as Window & typeof globalThis).requestIdleCallback(cb);
      } else {
        setTimeout(cb, 2000);
      }
    }

    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      handleRedirect();
      return;
    }

    if (status === 'authenticated' && session?.user) {
      if (requireAdmin && session.user.role !== 'admin') {
        handleRedirect();
        return;
      }
      setIsAuthorized(true);
      setIsRedirecting(false);
    }
  }, [status, session, handleRedirect, requireAdmin]);

  // ✅ Listeners de navegación: visibilitychange + focus + popstate en un solo efecto.
  //    Antes eran 2 useEffect separados con la misma lógica duplicada.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.history.pushState(null, '', window.location.href);

    const checkAndRedirect = () => {
      if (isUnauthorized()) handleRedirect();
    };

    const handlePopState = (event: PopStateEvent) => {
      if (isUnauthorized()) {
        event.preventDefault();
        handleRedirect();
      } else {
        window.history.pushState(null, '', window.location.href);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkAndRedirect();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', checkAndRedirect);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkAndRedirect);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isUnauthorized, handleRedirect]);

  if (status === 'loading' || isRedirecting || !isAuthorized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <div
          className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto"
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        ></div>
      </div>
      <div className="text-gray-600 dark:text-gray-300">
        <p className="text-lg font-medium">Verificando acceso...</p>
        <p className="text-sm opacity-75">Por favor espera un momento</p>
      </div>
    </div>
  </div>
);

export default ProtectedRoute;