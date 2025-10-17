// src/app/hooks/useAuth.ts
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { siteConfig } from "@/config/site"; // 1. Importar siteConfig

export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && !!session?.user;
  const isUnauthenticated = status === 'unauthenticated';

  // Función para redirigir al login
  const redirectToLogin = useCallback((callbackUrl: string = '/') => {
    console.log('🔄 Redirigiendo a login desde:', callbackUrl);
    const encodedCallback = encodeURIComponent(callbackUrl);
    router.replace(`/login?callbackUrl=${encodedCallback}`);
  }, [router]);

  // Función para validar manualmente la sesión
  const validateSession = useCallback(async () => {
    console.log('🔍 Validando sesión manualmente...');
    setIsValidating(true);

    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error('Session validation failed');
      }

      const sessionData = await response.json();
      console.log('📋 Resultado de validación:', sessionData);

      if (!sessionData?.user) {
        console.log('❌ Sesión no válida, redirigiendo a login');
        redirectToLogin(window.location.pathname);
        return false;
      }

      console.log('✅ Sesión válida');
      return true;
    } catch (error) {
      console.error('❌ Error validando sesión:', error);
      redirectToLogin(window.location.pathname);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [redirectToLogin]);

  // Validación continua cuando la página se vuelve visible, recibe foco, o se usa el botón "atrás"
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const validateAuth = () => {
      // CAMBIO: Construir el array de rutas protegidas desde siteConfig
      const protectedClientRoutes = [
        siteConfig.paths.publishAd,
        siteConfig.paths.adminPanel,
        siteConfig.paths.uploadPaymentProof,
      ];
      
      const isProtectedRoute = protectedClientRoutes.some(route => 
        window.location.pathname.startsWith(route)
      );

      if (isUnauthenticated && isProtectedRoute) {
        console.log('🔄 Revalidando autenticación para ruta protegida...');
        setIsValidating(true);
        validateSession();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        validateAuth();
      }
    };

    const handleFocus = () => {
      validateAuth();
    };

    const handlePopState = () => {
      // Validar especialmente cuando se usa el botón atrás
      validateAuth();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isUnauthenticated, validateSession]);

  // const checkAuth = useCallback(() => {
  //   if (status === "unauthenticated") {
  //     // 2. Usar la ruta desde siteConfig como redirección por defecto
  //     router.push(`/login?callbackUrl=${encodeURIComponent(siteConfig.paths.publishAd)}`);
  //   }
  // }, [status, router]);

  const requireAuth = useCallback(
    // 3. Usar la ruta desde siteConfig como valor por defecto
    (callback?: () => void, redirectTo: string = siteConfig.paths.publishAd) => {
      if (status === "authenticated") {
        callback?.();
      } else if (status === "unauthenticated") {
        router.push(`/login?callbackUrl=${encodeURIComponent(redirectTo)}`);
      }
    },
    [status, router]
  );

  return {
    session,
    status,
    isLoading: isLoading || isValidating,
    isAuthenticated,
    isUnauthenticated,
    isValidating,
    user: session?.user || null,
    requireAuth,
    redirectToLogin,
    validateSession,
  };
};