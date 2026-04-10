//src/app/my-favorites/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import FavoritesList from "@/components/features/vehicles/common/FavoritesList";

export default async function MyFavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/my-favorites");
  }

  // ✅ Sin fetch a MongoDB en servidor — FavoritesList carga sus propios datos al montar
  // Esto permite que Next.js cachee el shell y mejora Lighthouse significativamente
  return <FavoritesList initialVehicles={[]} />;
}