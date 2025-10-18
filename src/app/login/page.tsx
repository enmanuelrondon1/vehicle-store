// src/app/login/page.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Login from "@/components/features/auth/Login"; // Cambiado de LoginForm a Login

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      const redirectUrl = decodeURIComponent(callbackUrl);
      const isValidRedirect = redirectUrl.startsWith('/') && !redirectUrl.startsWith('//');
      const finalRedirect = isValidRedirect ? redirectUrl : "/";
      router.replace(finalRedirect);
    }
  }, [status, session, router, searchParams]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Ya estás autenticado. Redirigiendo...
          </p>
        </div>
      </div>
    );
  }

  // Renderiza el nuevo componente Login
  return <Login />;
}

function LoginPageSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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