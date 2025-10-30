//src/components/features/vehicles/compare/CompareTable.tsx
"use client";

import { Vehicle } from "@/types/types";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  VEHICLE_CONDITIONS_LABELS,
  FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS,
} from "@/types/shared";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Phone, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { siteConfig } from "@/config/site";

interface CompareTableProps {
  vehicles: (Vehicle & { averageRating?: number; ratingCount?: number })[];
  highlightDifferences: boolean;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const formatMileage = (mileage: number) =>
  `${new Intl.NumberFormat("es-ES").format(mileage)} km`;

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CompareTable: React.FC<CompareTableProps> = ({
  vehicles,
  highlightDifferences,
}) => {
  const { data: session } = useSession();
  const [favoritedVehicles, setFavoritedVehicles] = useState<Set<string>>(
    new Set()
  );
  const [isLoadingFavorite, setIsLoadingFavorite] = useState<
    Map<string, boolean>
  >(new Map());
  const [userRatings, setUserRatings] = useState<Map<string, number | null>>(
    new Map()
  );
  const [hoverRatings, setHoverRatings] = useState<Map<string, number | null>>(
    new Map()
  );
  const [vehicleRatings, setVehicleRatings] = useState<
    Map<string, { average: number; count: number }>
  >(new Map());
  const [isSubmittingRating, setIsSubmittingRating] = useState<
    Map<string, boolean>
  >(new Map());

  // ✅ Cargar favoritos del usuario
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

  // ✅ Cargar ratings de cada vehículo
  useEffect(() => {
    const fetchUserRatings = async () => {
      if (!session) return;

      for (const vehicle of vehicles) {
        try {
          const response = await fetch(
            `/api/vehicles/${vehicle._id}/user-rating`
          );
          const data = await response.json();

          if (response.ok && data.userRating !== null) {
            setUserRatings((prev) =>
              new Map(prev).set(vehicle._id, data.userRating)
            );
          }
        } catch (error) {
          console.error(
            `Error fetching rating for vehicle ${vehicle._id}:`,
            error
          );
        }
      }
    };

    fetchUserRatings();
  }, [session, vehicles]);

  // ✅ Inicializar ratings de los vehículos desde los props
  useEffect(() => {
    const initialRatings = new Map();
    vehicles.forEach((vehicle) => {
      initialRatings.set(vehicle._id, {
        average: vehicle.averageRating ?? 0,
        count: vehicle.ratingCount ?? 0,
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

  const handleWhatsApp = (vehicle: Vehicle) => {
    const message = encodeURIComponent(
      `Hola ${vehicle.sellerContact.name}, estoy interesado en tu ${
        vehicle.brand
      } ${vehicle.model} por ${formatPrice(
        vehicle.price
      )}. ¿Podrías darme más información?`
    );
    window.open(
      `https://wa.me/${vehicle.sellerContact.phone.replace(
        /\D/g,
        ""
      )}?text=${message}`,
      "_blank"
    );
  };

  const handleFavoriteToggle = async (
    e: React.MouseEvent,
    vehicleId: string
  ) => {
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

  const featuresConfig = [
    {
      label: "Condición",
      value: (v: Vehicle) => (
        <Badge
          variant={v.condition === "new" ? "default" : "secondary"}
          className="text-xs"
        >
          {VEHICLE_CONDITIONS_LABELS[v.condition]}
        </Badge>
      ),
    },
    {
      label: "Kilometraje",
      value: (v: Vehicle) => (
        <span className="font-medium text-sm">{formatMileage(v.mileage)}</span>
      ),
    },
    {
      label: "Combustible",
      value: (v: Vehicle) => (
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm">{FUEL_TYPES_LABELS[v.fuelType]}</span>
        </div>
      ),
    },
    {
      label: "Transmisión",
      value: (v: Vehicle) => (
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm">
            {TRANSMISSION_TYPES_LABELS[v.transmission]}
          </span>
        </div>
      ),
    },
    {
      label: "Ubicación",
      value: (v: Vehicle) => <span className="text-xs">{v.location}</span>,
    },
    {
      label: "Características",
      value: (v: Vehicle) => (
        <div className="flex flex-wrap gap-1 justify-center max-h-24 overflow-y-auto">
          {v.features.slice(0, 4).map((feature) => (
            <Badge key={feature} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
          {v.features.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{v.features.length - 4} más
            </Badge>
          )}
        </div>
      ),
    },
    {
      label: "Valoración",
      value: (v: Vehicle) => {
        const userRating = userRatings.get(v._id);
        const hoverRating = hoverRatings.get(v._id);
        const vehicleRating = vehicleRatings.get(v._id);
        const displayRating =
          hoverRating ?? userRating ?? vehicleRating?.average ?? 0;
        const ratingCount = vehicleRating?.count ?? 0;

        return (
          <div
            className="flex flex-col items-center justify-center gap-1"
            onMouseLeave={() => handleHoverRating(v._id, null)}
          >
            <div className="flex items-center justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-4 w-4 transition-colors",
                    session && !isSubmittingRating.get(v._id)
                      ? "cursor-pointer"
                      : "cursor-default",
                    star <= displayRating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  )}
                  onMouseEnter={() =>
                    session && handleHoverRating(v._id, star)
                  }
                  onClick={() =>
                    session && handleSetRating(v._id, star)
                  }
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
        );
      },
    },
    {
      label: "Acciones",
      value: (v: Vehicle) => (
        <div className="flex flex-col gap-2">
          <Button asChild size="sm" variant="outline" className="w-full">
            <Link href={siteConfig.paths.vehicleDetail(v._id)}>
              <Eye className="mr-2 h-3 w-3" />
              Ver detalles
            </Link>
          </Button>
          <Button
            size="sm"
            className="w-full"
            onClick={() => handleWhatsApp(v)}
          >
            <Phone className="mr-2 h-3 w-3" />
            Contactar
          </Button>
        </div>
      ),
    },
  ];

  const vehicleColumnWidth =
    vehicles.length > 0 ? `${(100 - 25) / vehicles.length}%` : "auto";

  const getFeatureValue = (vehicle: Vehicle, featureLabel: string) => {
    switch (featureLabel) {
      case "Condición":
        return VEHICLE_CONDITIONS_LABELS[vehicle.condition];
      case "Kilometraje":
        return formatMileage(vehicle.mileage);
      case "Combustible":
        return FUEL_TYPES_LABELS[vehicle.fuelType];
      case "Transmisión":
        return TRANSMISSION_TYPES_LABELS[vehicle.transmission];
      case "Ubicación":
        return vehicle.location;
      case "Características":
        return vehicle.features.slice(0, 4).join(", ");
      case "Valoración": {
        const rating = vehicleRatings.get(vehicle._id);
        return rating?.average ?? 0;
      }
      default:
        return "";
    }
  };

  const featuresToShow = featuresConfig.filter((feature) => {
    if (
      !highlightDifferences ||
      vehicles.length < 2 ||
      feature.label === "Acciones"
    ) {
      return true;
    }
    const firstValue = getFeatureValue(vehicles[0], feature.label);
    return vehicles.some(
      (vehicle) => getFeatureValue(vehicle, feature.label) !== firstValue
    );
  });

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={tableVariants}
    >
      <div className="min-w-[600px] md:min-w-full">
        <Table className="min-w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="sticky left-0 z-10 font-semibold bg-card w-1/4 align-top border-r text-sm md:text-base">
                Característica
              </TableHead>
              {vehicles.map((vehicle) => (
                <TableHead
                  key={vehicle._id}
                  className="text-center p-0 border-r"
                  style={{ width: vehicleColumnWidth }}
                >
                  <motion.div variants={itemVariants} className="h-full">
                    <Card className="overflow-hidden h-full flex flex-col border-0 shadow-none">
                      <CardContent className="p-2 md:p-4 flex flex-col flex-grow">
                        <div className="w-full aspect-video relative mb-2 md:mb-4 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={vehicle.images[0] || "/placeholder.svg"}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            fill
                            className="object-cover transition-transform hover:scale-105 duration-300"
                          />
                        </div>
                        <div className="flex flex-col justify-end flex-grow space-y-1 md:space-y-2">
                          <h3 className="font-bold text-sm md:text-lg font-heading">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {vehicle.year}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-primary text-sm md:text-lg">
                              {formatPrice(vehicle.price)}
                            </p>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) =>
                                handleFavoriteToggle(e, vehicle._id)
                              }
                              disabled={isLoadingFavorite.get(vehicle._id)}
                            >
                              <Heart
                                className={cn(
                                  "h-4 w-4 md:h-5 md:w-5 transition-colors",
                                  favoritedVehicles.has(vehicle._id)
                                    ? "text-red-500 fill-red-500"
                                    : "text-muted-foreground"
                                )}
                              />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {featuresToShow.map((feature, index) => (
              <TableRow
                key={feature.label}
                className={index % 2 === 0 ? "bg-muted/10" : ""}
              >
                <TableCell className="sticky left-0 z-10 font-semibold bg-card w-1/4 align-top border-r text-sm md:text-base">
                  {feature.label}
                </TableCell>
                {vehicles.map((vehicle) => (
                  <TableCell
                    key={vehicle._id}
                    className="text-center align-top p-2 md:p-4 border-r"
                    style={{ width: vehicleColumnWidth }}
                  >
                    <motion.div variants={itemVariants}>
                      {feature.value(vehicle)}
                    </motion.div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default CompareTable;