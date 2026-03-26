// src/components/shared/layout/ClientLayout.tsx
"use client";
import React from "react";
import dynamic from "next/dynamic";
import { LanguageProvider } from "@/context/LanguajeContext";
import { SessionProvider, useSession } from "next-auth/react";
import { Navbar } from "../Navbar";
import Footer from "./Footer";

// ✅ OPTIMIZACIÓN: GlobalNotificationHandler se carga de forma lazy (no SSR)
// Razón: incluye Pusher (~90KB) + Web Audio API — innecesario en el bundle inicial
// Resultado: el bundle principal se reduce y el TTI mejora en todas las rutas
const GlobalNotificationHandler = dynamic(
  () =>
    import("../notifications/GlobalNotificationHandler").then(
      (mod) => mod.GlobalNotificationHandler
    ),
  { ssr: false }
);

// Componente interno que accede a la sesión y monta GNH solo si es admin
// Esto evita que Pusher se suscriba/conecte para usuarios no admin
function NotificationGate() {
  const { data: session, status } = useSession();

  // No montar nada mientras la sesión carga o si no es admin
  if (status === "loading" || session?.user?.role !== "admin") {
    return null;
  }

  return <GlobalNotificationHandler />;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SessionProvider>
        <LanguageProvider>
          {/*
            ✅ ANTES: <GlobalNotificationHandler /> — se montaba para TODOS los usuarios
               en TODAS las rutas, cargando Pusher siempre.

            ✅ AHORA: <NotificationGate /> — solo monta el handler si el usuario
               está autenticado como admin. Para el resto de usuarios (visitantes,
               usuarios normales) Pusher no se carga ni se conecta.
          */}
          <NotificationGate />
          <Navbar />
          <div className="h-16 w-full"></div>
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </SessionProvider>
    </div>
  );
}