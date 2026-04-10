"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import FavoritesList from "@/components/features/vehicles/common/FavoritesList";
import { Vehicle } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileFavoritesList() {
  const { data: session } = useSession();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchFavorites = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resFavs = await fetch("/api/user/favorites");
        if (!resFavs.ok) throw new Error("Error al obtener favoritos");
        const { favorites: ids } = await resFavs.json();

        if (!ids || ids.length === 0) {
          setVehicles([]);
          return;
        }

        const resVehicles = await fetch("/api/vehicles/by-ids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });

        if (!resVehicles.ok) throw new Error("Error al cargar los vehículos");

        // ✅ El endpoint devuelve { success, vehicles }, no el array directo
        const { vehicles } = await resVehicles.json();
        setVehicles(vehicles ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [session?.user?.id]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-sm text-destructive py-8">{error}</p>
    );
  }

  return <FavoritesList initialVehicles={vehicles} />;
}