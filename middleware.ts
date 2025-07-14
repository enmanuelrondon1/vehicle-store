// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = (req as any).nextauth?.token;

    // Excluir rutas de migración
    if (pathname === "/api/migrate-status" || pathname === "/api/migrate-views") {
      return NextResponse.next();
    }

    console.log("🔒 Middleware ejecutándose para:", pathname);
    console.log("🔑 Token presente:", !!token);
    console.log("👤 Usuario:", token?.email || "No autenticado");
    console.log("🔑 Token completo:", token);

    if (
      (pathname.startsWith("/AdminPanel") || pathname.startsWith("/api/admin")) &&
      token?.role !== "admin"
    ) {
      console.log("❌ Acceso denegado - No es administrador:", pathname);
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    response.headers.set('X-Accel-Expires', '0');
    response.headers.set('X-Protected-Route', 'true');
    response.headers.set('Vary', 'Cookie, Authorization');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    console.log("✅ Acceso permitido con headers anti-caché y seguridad aplicados");
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Excluir rutas de migración
        if (pathname === "/api/migrate-status" || pathname === "/api/migrate-views") {
          return true;
        }

        const protectedPaths = ['/postAd', '/profile', '/dashboard', '/AdminPanel', '/api/admin'];
        const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

        console.log("🛡️ Verificando autorización:", {
          pathname,
          isProtectedPath,
          hasToken: !!token,
          userEmail: token?.email,
          userRole: token?.role,
          userAgent: req.headers.get('user-agent')?.substring(0, 50) + '...'
        });

        if (isProtectedPath && !token) {
          console.log("❌ Acceso denegado - No hay token para ruta protegida:", pathname);
          return false;
        }

        if (
          (pathname.startsWith("/AdminPanel") || pathname.startsWith("/api/admin")) &&
          token?.role !== "admin"
        ) {
          console.log("❌ Acceso denegado - No es administrador:", pathname);
          return false;
        }

        if (isProtectedPath && token) {
          console.log("✅ Acceso permitido - Usuario autenticado:", token.email);
          return true;
        }

        console.log("🔓 Ruta no protegida, acceso permitido:", pathname);
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    '/postAd/:path*',
    '/profile/:path*',
    '/dashboard/:path*',
    '/AdminPanel/:path*',
    '/api/admin/:path*',
    '/api/protected/:path*'
  ]
};