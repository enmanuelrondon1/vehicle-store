// src/app/profile/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Perfil - AutoMarket",
  description: "Gestiona tu información personal, tus vehículos publicados y más.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}