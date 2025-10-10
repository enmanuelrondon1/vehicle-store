// src/lib/authOptions.ts
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { toTitleCase } from "./utils";
import { ObjectId } from "mongodb";
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
          const client = await clientPromise;
          const db = client.db("vehicle_store");
          const users = db.collection("users");
          const user = await users.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("Credenciales inválidas");
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordCorrect) {
            throw new Error("Credenciales inválidas");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: toTitleCase(user.name),
            role: user.role,
          };
        } catch (error) {
          console.error("Error en la autorización:", error);
          throw new Error("Error de autenticación");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        return token;
      }
      if (!token.id) {
        throw new Error("Token inválido: ID de usuario ausente.");
      }
      try {
        const client = await clientPromise;
        const db = client.db("vehicle_store");
        const userExists = await db.collection("users").findOne({ _id: new ObjectId(token.id as string) });

        if (!userExists) {
          console.log(`❌ Invalidando sesión: El usuario con ID ${token.id} ya no existe.`);
          throw new Error("El usuario ha sido eliminado.");
        }
        token.role = userExists.role;
        return token;
      } catch (error) {
        console.error("Error durante la validación del JWT, invalidando sesión:", (error as Error).message);
        throw new Error("La validación de la sesión ha fallado.");
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// --- HOC for Admin Route Protection ---

type StaticHandler = (req: NextRequest) => Promise<NextResponse> | NextResponse;
type DynamicHandler<P> = (req: NextRequest, context: { params: P }) => Promise<NextResponse> | NextResponse;

export function withAdminAuth(handler: StaticHandler): StaticHandler;
export function withAdminAuth<P>(handler: DynamicHandler<P>): DynamicHandler<P>;
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function withAdminAuth(handler: Function) {
  return async (req: NextRequest, context?: { params: unknown }) => {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: "Acceso no autorizado" },
        { status: 403 }
      );
    }

    if (context) {
      return handler(req, context);
    }

    return handler(req);
  };
}