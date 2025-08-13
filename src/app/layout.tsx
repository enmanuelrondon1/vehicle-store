import type { Metadata, Viewport } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { DarkModeProvider } from "@/context/DarkModeContext";
import ClientLayout from "@/components/shared/layout/ClientLayout";

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
  },
};

export const viewport: Viewport = {
  themeColor: "#1E3A8A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 pt-16`}
      >
        <DarkModeProvider>
          <ClientLayout>{children}</ClientLayout>
        </DarkModeProvider>
      </body>
    </html>
  );
}