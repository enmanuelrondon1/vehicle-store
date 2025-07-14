// src/lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

// Extiende los tipos de NextAuth para incluir 'role' en User y Session
declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
  }
  interface Session {
    user: {
      id?: string;
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
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