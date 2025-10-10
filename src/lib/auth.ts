// src/lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Extiende los tipos de NextAuth para incluir 'role' en User y Session
declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
    _id?: string;
  }
  interface Session {
    user: {
      id?: string;
      _id?: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos");
        }

        try {
          console.log("Intentando conectar a MongoDB...");
          const client = await clientPromise;
          const db = client.db("vehicle_store");
          const users = db.collection("users");

          console.log("Buscando usuario:", credentials.email);
          const user = await users.findOne({ email: credentials.email });

          if (!user) {
            console.log("Usuario no encontrado");
            throw new Error("Usuario no encontrado");
          }

          console.log("Usuario encontrado, verificando contraseña...");
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.log("Contraseña inválida");
            throw new Error("Contraseña incorrecta");
          }

          console.log("Login exitoso para:", user.email);
          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token._id = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user._id = token._id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback - url:", url, "baseUrl:", baseUrl);
      
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      return baseUrl;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// --- INICIO DE LA SOLUCIÓN DEFINITIVA Y PRAGMÁTICA ---

// Definimos los tipos de handler de forma explícita
type StaticHandler = (req: NextRequest) => Promise<NextResponse> | NextResponse;
type DynamicHandler<P> = (req: NextRequest, context: { params: P }) => Promise<NextResponse> | NextResponse;

// Sobrecarga para rutas estáticas. Esto es lo que "ven" los consumidores de la función.
export function withAdminAuth(handler: StaticHandler): StaticHandler;

// Sobrecarga para rutas dinámicas. Esto también es visible para los consumidores.
export function withAdminAuth<P>(handler: DynamicHandler<P>): DynamicHandler<P>;

// Implementación REAL. Su firma no es visible desde fuera.
// Usamos `Function` y deshabilitamos la regla de lint para esta línea específica,
// ya que es un problema de tipado de HOC muy complejo y las sobrecargas ya nos dan seguridad.
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function withAdminAuth(handler: Function) {
  // La función que devolvemos debe ser capaz de aceptar ambos tipos de argumentos
  return async (req: NextRequest, context?: { params: unknown }) => {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: "Acceso no autorizado" },
        { status: 403 }
      );
    }

    // Si el contexto existe (es una ruta dinámica), llamamos al handler con ambos argumentos.
    if (context) {
      return handler(req, context);
    }

    // Si no hay contexto (ruta estática), llamamos al handler solo con la request.
    return handler(req);
  };
}