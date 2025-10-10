// src/lib/authOptions.ts
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { toTitleCase } from "./utils";

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
            console.log("Usuario no encontrado:", credentials.email);
            throw new Error("Credenciales inválidas");
          }

          console.log("Usuario encontrado, verificando contraseña...");
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordCorrect) {
            console.log("Contraseña incorrecta para el usuario:", credentials.email);
            throw new Error("Credenciales inválidas");
          }

          console.log("¡Autorización exitosa para:", user.email, "con rol:", user.role, "!");
          return {
            id: user._id.toString(),
            email: user.email,
            name: toTitleCase(user.name),
            role: user.role,
          };
        } catch (error) {
          console.error("Error en la autorización:", error);
          // No relanzar el error con detalles internos
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
      }
      return token;
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