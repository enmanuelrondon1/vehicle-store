// src/components/shared/layout/ClientLayout.tsx (SIMPLE Y DEFINITIVO)
"use client";
import React from "react";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { LanguageProvider } from "@/context/LanguajeContext";
import { SessionProvider } from "next-auth/react";
import { GlobalNotificationHandler } from "../notifications/GlobalNotificationHandler";
import { Navbar } from "../Navbar";
import Footer from "./Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DarkModeProvider>
        <SessionProvider>
          <LanguageProvider>
            <GlobalNotificationHandler />
            <Navbar />
            {/* Este spacer ahora funciona perfectamente porque el navbar tiene h-16 */}
            <div className="h-16 w-full"></div>
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </SessionProvider>
      </DarkModeProvider>
    </div>
  );
}