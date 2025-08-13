"use client";
import React from "react";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { LanguageProvider } from "@/context/LanguajeContext";
import { SessionProvider } from "next-auth/react";
import { GlobalNotificationHandler } from "../notifications/GlobalNotificationHandler";
import { Navbar } from "../Navbar";
import Footer from "./Footer";



export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DarkModeProvider>
      <SessionProvider>
        <LanguageProvider>
          <GlobalNotificationHandler />
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
      </SessionProvider>
    </DarkModeProvider>
  );
}