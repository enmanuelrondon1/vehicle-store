//src/components/features/vehicles/compare/CompareView.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCompareVehicles } from "@/hooks/useCompareVehicles";
import LoadingSkeleton from "@/components/shared/feedback/LoadingSkeleton";
import ErrorMessage from "@/components/shared/feedback/ErrorMessage";
import CompareTable from "@/components/features/vehicles/compare/CompareTable";
import CompareMobileView from "@/components/features/vehicles/compare/CompareMobileView";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GitCompare, Filter, Download, Share2, Heart, Car, Shield, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CompareView() {
  const router = useRouter();
  const { vehicles, loading, error } = useCompareVehicles();
  const { data: session } = useSession();
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Estados para favoritos
  const [favoritedVehicles, setFavoritedVehicles] = useState<Set<string>>(new Set());
  const [isLoadingFavorite, setIsLoadingFavorite] = useState<Map<string, boolean>>(new Map());
  
  // Estados para valoraciones
  const [userRatings, setUserRatings] = useState<Map<string, number | null>>(new Map());
  const [hoverRatings, setHoverRatings] = useState<Map<string, number | null>>(new Map());
  const [vehicleRatings, setVehicleRatings] = useState<Map<string, { average: number; count: number }>>(new Map());
  const [isSubmittingRating, setIsSubmittingRating] = useState<Map<string, boolean>>(new Map());

  // Cargar favoritos del usuario
  useEffect(() => {
    const fetchFavorites = async () => {
      if (session) {
        try {
          const response = await fetch("/api/user/favorites");
          if (response.ok) {
            const data = await response.json();
            setFavoritedVehicles(new Set(data.favorites));
          }
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      }
    };
    fetchFavorites();
  }, [session]);

  // Cargar ratings de cada vehículo
  useEffect(() => {
    const fetchUserRatings = async () => {
      if (!session) return;

      for (const vehicle of vehicles) {
        try {
          const response = await fetch(`/api/vehicles/${vehicle._id}/user-rating`);
          const data = await response.json();

          if (response.ok && data.userRating !== null) {
            setUserRatings((prev) => new Map(prev).set(vehicle._id, data.userRating));
          }
        } catch (error) {
          console.error(`Error fetching rating for vehicle ${vehicle._id}:`, error);
        }
      }
    };

    fetchUserRatings();
  }, [session, vehicles]);

  // Inicializar ratings de los vehículos
  useEffect(() => {
    const initialRatings = new Map();
    vehicles.forEach((vehicle) => {
      // Usamos una verificación para asegurar que las propiedades existan
      initialRatings.set(vehicle._id, {
        average: (vehicle as any).averageRating ?? 0,
        count: (vehicle as any).ratingCount ?? 0,
      });
    });
    setVehicleRatings(initialRatings);
  }, [vehicles]);

  const handleSetRating = async (vehicleId: string, rating: number) => {
    if (isSubmittingRating.get(vehicleId)) return;

    if (!session) {
      toast.info("Debes iniciar sesión para valorar un vehículo.");
      signIn();
      return;
    }

    setIsSubmittingRating((prev) => new Map(prev).set(vehicleId, true));

    const originalRating = userRatings.get(vehicleId);
    setUserRatings((prev) => new Map(prev).set(vehicleId, rating));

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("¡Gracias por tu valoración!");
        
        // Actualizar los datos del vehículo
        setVehicleRatings((prev) =>
          new Map(prev).set(vehicleId, {
            average: data.averageRating,
            count: data.ratingCount,
          })
        );
      } else {
        throw new Error(data.error || "No se pudo guardar la valoración.");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al guardar la valoración.");
      
      // Revertir el cambio
      if (originalRating !== undefined) {
        setUserRatings((prev) => new Map(prev).set(vehicleId, originalRating));
      } else {
        setUserRatings((prev) => {
          const newRatings = new Map(prev);
          newRatings.delete(vehicleId);
          return newRatings;
        });
      }
    } finally {
      setIsSubmittingRating((prev) => new Map(prev).set(vehicleId, false));
    }
  };

  const handleHoverRating = (vehicleId: string, rating: number | null) => {
    if (!isSubmittingRating.get(vehicleId)) {
      setHoverRatings((prev) => new Map(prev).set(vehicleId, rating));
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent, vehicleId: string) => {
    e.stopPropagation();
    e.preventDefault();

    if (!session) {
      signIn();
      return;
    }

    setIsLoadingFavorite((prev) => new Map(prev).set(vehicleId, true));

    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId }),
      });

      if (response.ok) {
        const data = await response.json();
        const isNowFavorited = data.action === "added";

        setFavoritedVehicles((prev) => {
          const newFavorites = new Set(prev);
          if (isNowFavorited) {
            newFavorites.add(vehicleId);
          } else {
            newFavorites.delete(vehicleId);
          }
          return newFavorites;
        });

        toast.success(
          isNowFavorited ? "Añadido a favoritos" : "Eliminado de favoritos"
        );
      } else {
        toast.error("No se pudo actualizar favoritos.");
      }
    } catch (error) {
      toast.error("Error al actualizar favoritos.");
    } finally {
      setIsLoadingFavorite((prev) => new Map(prev).set(vehicleId, false));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-4xl p-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-8 pb-16 px-4 mt-16 md:mt-16">
        <div className="max-w-7xl mx-auto">
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-8 flex flex-col items-center justify-center">
              <ErrorMessage
                error={error}
                handleRetry={() => router.refresh()}
                isLoading={false}
                retryCount={0}
              />
              <Button onClick={() => router.back()} className="mt-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-4 pb-8 px-4 mt-16 md:mt-16 antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header premium mejorado */}
        <Card className="shadow-lg border-0 overflow-hidden card-glass">
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 shimmer-effect">
                  <GitCompare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-heading text-gradient-primary">
                    Comparación de Vehículos
                  </CardTitle>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Car className="h-4 w-4" />
                    {vehicles.length} vehículo{vehicles.length !== 1 ? "s" : ""} seleccionado{vehicles.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  size="sm"
                  className="hidden md:flex"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartir
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Panel de control mejorado */}
        {vehicles.length > 0 && (
          <Card className="shadow-sm border-0">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all" className="text-xs">Todas las características</TabsTrigger>
                    <TabsTrigger value="differences" className="text-xs">Solo diferencias</TabsTrigger>
                    <TabsTrigger value="important" className="text-xs">Más importantes</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="highlight-differences"
                      checked={highlightDifferences}
                      onCheckedChange={setHighlightDifferences}
                    />
                    <Label htmlFor="highlight-differences" className="text-sm font-medium">
                      Resaltar diferencias
                    </Label>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resumen de vehículos seleccionados */}
        {vehicles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {vehicles.map((vehicle, index) => {
              const userRating = userRatings.get(vehicle._id);
              const hoverRating = hoverRatings.get(vehicle._id);
              const vehicleRating = vehicleRatings.get(vehicle._id);
              const displayRating = hoverRating ?? userRating ?? vehicleRating?.average ?? 0;
              const ratingCount = vehicleRating?.count ?? 0;
              
              return (
                <Card key={vehicle._id || index} className="shadow-sm card-hover overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary to-accent"></div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs">
                        Opción {index + 1}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={(e) => handleFavoriteToggle(e, vehicle._id)}
                        disabled={isLoadingFavorite.get(vehicle._id)}
                      >
                        <Heart 
                          className={cn(
                            "h-4 w-4 transition-colors",
                            favoritedVehicles.has(vehicle._id)
                              ? "text-red-500 fill-red-500"
                              : "text-muted-foreground"
                          )} 
                        />
                      </Button>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{vehicle.year}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-primary">${vehicle.price?.toLocaleString()}</span>
                    </div>
                    
                    {/* Sistema de valoración */}
                    <div 
                      className="flex flex-col items-center justify-center gap-1 pb-2 border-b border-border mb-2"
                      onMouseLeave={() => handleHoverRating(vehicle._id, null)}
                    >
                      <div className="flex items-center justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-4 w-4 transition-colors cursor-pointer",
                              star <= displayRating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            )}
                            onMouseEnter={() => handleHoverRating(vehicle._id, star)}
                            onClick={() => handleSetRating(vehicle._id, star)}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {displayRating > 0 ? displayRating.toFixed(1) : "Sin valorar"}{" "}
                        {ratingCount > 0 && `(${ratingCount})`}
                      </span>
                      {userRating !== null && userRating !== undefined && (
                        <span className="text-[10px] text-primary">
                          Tu valoración: {userRating}★
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        {/* Tabla de comparación o mensaje de vacío */}
        {vehicles.length > 0 ? (
          <Card className="shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {isMobile ? (
                  <CompareMobileView
                    vehicles={vehicles}
                    highlightDifferences={highlightDifferences}
                    favoritedVehicles={favoritedVehicles}
                    isLoadingFavorite={isLoadingFavorite}
                    onFavoriteToggle={handleFavoriteToggle}
                    userRatings={userRatings}
                    hoverRatings={hoverRatings}
                    vehicleRatings={vehicleRatings}
                    isSubmittingRating={isSubmittingRating}
                    onSetRating={handleSetRating}
                    onHoverRating={handleHoverRating}
                  />
                ) : (
                  <CompareTable
                    vehicles={vehicles}
                    highlightDifferences={highlightDifferences}
                    favoritedVehicles={favoritedVehicles}
                    isLoadingFavorite={isLoadingFavorite}
                    onFavoriteToggle={handleFavoriteToggle}
                    userRatings={userRatings}
                    hoverRatings={hoverRatings}
                    vehicleRatings={vehicleRatings}
                    isSubmittingRating={isSubmittingRating}
                    onSetRating={handleSetRating}
                    onHoverRating={handleHoverRating}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 px-6"
          >
            <Card className="max-w-md mx-auto shadow-sm">
              <CardContent className="p-8 space-y-4">
                <div className="inline-flex items-center justify-center rounded-full bg-muted p-3">
                  <GitCompare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold">
                  No hay vehículos para comparar
                </h2>
                <p className="text-muted-foreground">
                  Parece que no has seleccionado ningún vehículo. Vuelve a la lista
                  y elige los que quieras comparar.
                </p>
                <Button onClick={() => router.push("/vehicleList")} className="mt-4 btn-primary">
                  Explorar vehículos
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sección de recomendaciones */}
        {vehicles.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Nuestra recomendación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4">
                <p className="text-sm mb-3">
                  Basado en tu comparación, te recomendamos el <span className="font-semibold">{vehicles[0]?.brand} {vehicles[0]?.model}</span> por ofrecer el mejor equilibrio entre precio, características y valor de reventa.
                </p>
                <div className="flex gap-2">
                  <Button className="btn-primary">
                    Ver detalles
                  </Button>
                  <Button variant="outline">
                    Agendar prueba de manejo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}