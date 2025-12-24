// src/app/reels/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { VehicleReels } from "@/components/features/vehicles/reels/VehicleReels";

export default function ReelsPage() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return <VehicleReels onClose={handleClose} />;
}