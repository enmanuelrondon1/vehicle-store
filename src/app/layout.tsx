import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "../context/LanguajeContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import Footer from "../components/sections/Footer/Footer";

export const metadata: Metadata = {
  title: "VehicleStore",
  description: "Venta de autos, motos, camiones y maquinaria pesada",
  keywords: [
    "autos",
    "motos",
    "camiones",
    "maquinaria pesada",
    "venta de vehículos",
    "VehicleStore",
  ],
  openGraph: {
    title: "VehicleStore",
    description:
      "Encuentra los mejores autos, motos, camiones y maquinaria pesada en venta",
    url: "https://vehiclestore.com", // Reemplaza con tu URL real
    images: [
      {
        url: "https://res.cloudinary.com/dcdawwvx2/image/upload/v1748639235/car-svgrepo-com_xysrtp.svg",
        width: 1200,
        height: 630,
        alt: "VehicleStore - Venta de vehículos",
      },
    ],
  },
  icons: {
    icon: "/car-svgrepo-com.svg", // Ruta relativa al archivo en public/
    // Opcional: Añade soporte para múltiples tamaños
    // shortcut: "/sport-car.png", // 16x16
    // apple: "/sport-car.png", // Para dispositivos Apple
  },
  themeColor: "#1E3A8A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body
          className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 pt-16 `}
        >
          <LanguageProvider>
            <DarkModeProvider>
              <FavoritesProvider>
                <Navbar />
                {children}
                <Footer />
              </FavoritesProvider>
            </DarkModeProvider>
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}