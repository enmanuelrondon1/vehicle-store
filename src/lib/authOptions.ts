// src/lib/authOptions.ts
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import clientPromise from "@/lib/mongodb"; // Importación unificada y correcta
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { toTitleCase } from "./utils";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger } from './logger';
import { sendWelcomeEmail, sendAdminNewUserNotification } from './mailer';

// Extiende los tipos de NextAuth para incluir 'role' en User y Session
declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
    _id?: string;
    phone?: string;
    location?: string;
    createdAt?: Date;
  }
  interface Session {
    user: {
      id?: string;
      _id?: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
      location?: string | null;
      createdAt?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    name?: string | null;
    phone?: string | null;
    location?: string | null;
    createdAt?: Date;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      httpOptions: {
        timeout: 10000,
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
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
            phone: user.phone,
            location: user.location,
            createdAt: user.createdAt,
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
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') {
        return true;
      }

      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const client = await clientPromise; // CORREGIDO: Usar clientPromise
          const db = client.db('vehicle_store');
          const usersCollection = db.collection('users');
          const existingUser = await usersCollection.findOne({ email: user.email });

          if (!existingUser) {
            const newUser = {
              email: user.email,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
              provider: account.provider,
              createdAt: new Date(),
              role: 'user',
              isDeleted: false,
              phone: "", // Valor inicial vacío
              location: "", // Valor inicial vacío
            };
            const result = await usersCollection.insertOne(newUser);
            user.id = result.insertedId.toString();

            if (user.email && user.name) {
              logger.info(`Nuevo usuario OAuth detectado. Enviando correos a ${user.email}`);
              // No bloqueamos el login esperando los correos
              await sendWelcomeEmail(user.email, user.name);
              await sendAdminNewUserNotification(user.email, user.name);
            }
          } else {
            user.id = existingUser._id.toString();
            if (existingUser.isDeleted) {
              logger.warn(`Intento de inicio de sesión bloqueado para usuario eliminado: ${user.email}`);
              return false;
            }
            await usersCollection.updateOne(
              { _id: existingUser._id },
              { $set: { image: user.image, name: user.name } }
            );
          }
        } catch (error) {
          logger.error('Error en el callback de signIn:', error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
       if (user) {
         token.id = user.id;
         token.role = user.role;
         token.name = user.name;
         token.phone = user.phone;
         token.location = user.location;
         token.createdAt = user.createdAt;
       }
       if (token.id) {
         try {
           const client = await clientPromise;
           const db = client.db("vehicle_store");
           const userExists = await db.collection("users").findOne({ _id: new ObjectId(token.id as string) });
     
           if (!userExists || userExists.isDeleted) {
             if (!userExists) {
                console.warn(`⚠️ Sesión inválida: El usuario con ID ${token.id} no existe.`);
             } else {
                console.warn(`⚠️ Sesión inválida: El usuario con ID ${token.id} está eliminado.`);
             }
             return {}; // Devuelve un token vacío para invalidar la sesión
           }
     
           token.role = userExists.role;
           token.name = userExists.name;
           token.phone = userExists.phone;
           token.location = userExists.location;
           token.createdAt = userExists.createdAt;
         } catch (error) {
           console.error("Error durante la validación del JWT:", error);
           return {}; // Invalida la sesión en caso de error
         }
       }
       return token;
     },
     
     async session({ session, token }) {
       if (token.id && session.user) {
         session.user.id = token.id as string;
         session.user._id = token.id as string; // Añadimos _id para compatibilidad con MongoDB
         session.user.role = token.role as string;
         session.user.name = token.name;
         session.user.phone = token.phone;
         session.user.location = token.location;
         if (token.createdAt) {
           session.user.createdAt = (token.createdAt as Date).toISOString();
         }
         return session; // Devolvemos la sesión con los datos completos
       }
       
       // Si no hay token o usuario en la sesión, devolvemos una sesión vacía para invalidarla
       return { ...session, user: {} };
     },
  },
  pages: {
    signIn: '/login',
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