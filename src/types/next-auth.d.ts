// src/types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  /**
   * Extiende la interfaz User para incluir propiedades personalizadas.
   */
  interface User {
    phone?: string | null;
    location?: string | null;
    role?: string;
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  /**
   * Extiende la interfaz Session para que la propiedad user
   * utilice la interfaz User extendida.
   */
  interface Session {
    user: User;
  }
}