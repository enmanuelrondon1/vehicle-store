"use client";
import React from "react";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { LanguageProvider } from "@/context/LanguajeContext";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "./shared/Navbar";
import Footer from "./sections/Footer/Footer";


export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DarkModeProvider>
      <SessionProvider>
        <LanguageProvider>
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
      </SessionProvider>
    </DarkModeProvider>
  );
}