// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

const protectedPaths = ['/postAd', '/profile', '/dashboard', '/adminPanel', '/api/admin', '/api/protected'];
const adminPaths = ['/adminPanel', '/api/admin'];
const migrationPaths = ["/api/migrate-status", "/api/migrate-views"];

export default withAuth(
  // La función `middleware` se ejecuta solo si `authorized` devuelve `true`.
  // Aquí puedes realizar acciones adicionales como añadir headers.
  function middleware(req: NextRequestWithAuth) {
    console.log("✅ Acceso autorizado para:", req.nextUrl.pathname, "Usuario:", req.nextauth.token?.email);

    // Establecer headers de seguridad y anti-caché
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    // X-XSS-Protection está obsoleto. Se recomienda usar Content-Security-Policy.
    // response.headers.set('Content-Security-Policy', "default-src 'self'");

    return response;
  },
  {
    callbacks: {
      // Este callback es el lugar central para la lógica de autorización.
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Permitir siempre el acceso a las rutas de migración
        if (migrationPaths.includes(pathname)) {
          return true;
        }

        const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

        // Si no es una ruta protegida, permitir acceso.
        if (!isProtectedPath) {
          return true;
        }

        // A partir de aquí, todas las rutas son protegidas.
        // Si no hay token, el acceso es denegado.
        if (!token) {
          console.log("❌ Acceso denegado - No hay token para ruta protegida:", pathname);
          return false;
        }

        // Si es una ruta de admin y el usuario no tiene el rol 'admin', denegar.
        const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
        if (isAdminPath && token.role !== 'admin') {
            console.log("❌ Acceso denegado - No es administrador:", pathname);
            return false;
        }
        
        // Si llegó hasta aquí, es una ruta protegida, el usuario tiene token
        // y, si es ruta de admin, tiene el rol correcto.
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
    '/adminPanel/:path*',
    '/api/admin/:path*',
    '/api/protected/:path*'
  ]
};