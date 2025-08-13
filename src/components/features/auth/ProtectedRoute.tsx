"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode, useCallback } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requireAdmin?: boolean; // Nuevo prop para requerir rol de admin
}

const ProtectedRoute = ({ 
  children, 
  fallback = <LoadingSpinner />, 
  redirectTo = '/login',
  requireAdmin = false // Por defecto, no requiere admin
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const preventCache = () => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
              registration.update();
            });
          });
        }
      };
      preventCache();

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          if (status === 'unauthenticated' || (requireAdmin && session?.user.role !== 'admin')) {
            handleRedirect();
          }
        }
      };

      const handleFocus = () => {
        if (status === 'unauthenticated' || (requireAdmin && session?.user.role !== 'admin')) {
          handleRedirect();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleFocus);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [status, session, handleRedirect, requireAdmin]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', window.location.href);

      const handlePopState = (event: PopStateEvent) => {
        if (status === 'unauthenticated' || (requireAdmin && session?.user.role !== 'admin')) {
          event.preventDefault();
          handleRedirect();
        } else {
          window.history.pushState(null, '', window.location.href);
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [status, session, handleRedirect, requireAdmin]);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

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