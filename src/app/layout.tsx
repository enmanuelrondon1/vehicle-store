import type { Metadata, Viewport } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { DarkModeProvider } from "@/context/DarkModeContext";
import ClientLayout from "@/components/shared/layout/ClientLayout";
import { Toaster } from "@/components/ui/sonner";

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
          <ClientLayout>
            {children}
            <Toaster
              toastOptions={{
                classNames: {
                  toast:
                    "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-950 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-gray-950 dark:group-[.toaster]:text-gray-50 dark:group-[.toaster]:border-gray-800",
                  title: "font-semibold",
                  description:
                    "group-[.toast]:text-gray-500 dark:group-[.toast]:text-gray-400 group-[.success-toast]:!text-white group-[.info-toast]:!text-white group-[.error-toast]:!text-white",
                  actionButton:
                    "group-[.toast]:bg-gray-900 group-[.toast]:text-gray-50 dark:group-[.toast]:bg-gray-50 dark:group-[.toast]:text-gray-900",
                  cancelButton:
                    "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500 dark:group-[.toast]:bg-gray-800 dark:group-[.toast]:text-gray-400",
                  icon: "w-6 h-6",
                  success: "success-toast !bg-green-600 !text-white",
                  info: "info-toast !bg-blue-600 !text-white",
                  error: "error-toast !bg-red-600 !text-white",
                },
              }}
            />
            <Toaster richColors theme="system" />
          </ClientLayout>
        </DarkModeProvider>
      </body>
    </html>
  );
}