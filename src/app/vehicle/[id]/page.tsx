// src/app/vehicle/[id]/page.tsx

"use client"
import VehicleDetail from "@/components/sections/VehicleDetail/VehicleDetail";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  // Función onBack que navega al catálogo
  const handleBack = () => {
    router.push("/catalog");
  };

  return <VehicleDetail onBack={handleBack} />;
}