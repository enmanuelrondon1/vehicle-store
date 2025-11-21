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
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { featuresConfig, formatPrice } from "./compare-config";

interface CompareTableProps {
  vehicles: (Vehicle & { averageRating?: number; ratingCount?: number })[];
  highlightDifferences: boolean;
  // Props para favoritos
  favoritedVehicles: Set<string>;
  isLoadingFavorite: Map<string, boolean>;
  onFavoriteToggle: (e: React.MouseEvent, vehicleId: string) => void;
  // Props para valoraciones
  userRatings: Map<string, number | null>;
  hoverRatings: Map<string, number | null>;
  vehicleRatings: Map<string, { average: number; count: number }>;
  isSubmittingRating: Map<string, boolean>;
  onSetRating: (vehicleId: string, rating: number) => void;
  onHoverRating: (vehicleId: string, rating: number | null) => void;
}

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
  // Props para favoritos
  favoritedVehicles,
  isLoadingFavorite,
  onFavoriteToggle,
  // Props para valoraciones
  userRatings,
  hoverRatings,
  vehicleRatings,
  isSubmittingRating,
  onSetRating,
  onHoverRating,
}) => {
  // Función para determinar qué valor es "mejor" para resaltarlo
  const getBestValue = (featureLabel: string, vehicles: Vehicle[]) => {
    if (vehicles.length < 2) return null;
    
    switch (featureLabel) {
      case "Precio":
        // Para precio, menor es mejor
        const minPrice = Math.min(...vehicles.map(v => v.price));
        return vehicles.findIndex(v => v.price === minPrice);
      case "Kilometraje":
        // Para kilometraje, menor es mejor
        const minMileage = Math.min(...vehicles.map(v => v.mileage));
        return vehicles.findIndex(v => v.mileage === minMileage);
      case "Año":
        // Para año, mayor es mejor
        const maxYear = Math.max(...vehicles.map(v => v.year));
        return vehicles.findIndex(v => v.year === maxYear);
      case "Valoración":
        // Para valoración, mayor es mejor
        const maxRating = Math.max(...vehicles.map(v => {
          const rating = vehicleRatings.get(v._id);
          return rating?.average ?? 0;
        }));
        return vehicles.findIndex(v => {
          const rating = vehicleRatings.get(v._id);
          return rating?.average === maxRating;
        });
      default:
        return null;
    }
  };

  const currentFeatures = featuresConfig(
    userRatings,
    hoverRatings,
    vehicleRatings,
    onHoverRating,
    onSetRating
  );

  const vehicleColumnWidth =
    vehicles.length > 0 ? `${(100 - 25) / vehicles.length}%` : "auto";

  const getFeatureValue = (vehicle: Vehicle, featureLabel: string) => {
    switch (featureLabel) {
      case "Precio":
        return vehicle.price;
      case "Año":
        return vehicle.year;
      case "Condición":
        return VEHICLE_CONDITIONS_LABELS[vehicle.condition];
      case "Kilometraje":
        return vehicle.mileage;
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

  const featuresToShow = currentFeatures.filter((feature) => {
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
              {vehicles.map((vehicle, index) => (
                <TableHead
                  key={vehicle._id}
                  className="text-center p-0 border-r"
                  style={{ width: vehicleColumnWidth }}
                >
                  <motion.div variants={itemVariants} className="h-full">
                    <Card className="overflow-hidden h-full flex flex-col border-0 shadow-none card-glass">
                      <CardContent className="p-2 md:p-4 flex flex-col flex-grow">
                        <div className="relative w-full aspect-video mb-2 md:mb-4 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={vehicle.images[0] || "/placeholder.svg"}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            fill
                            className="object-cover transition-transform hover:scale-105 duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="badge-premium text-xs">
                              Opción {index + 1}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col justify-end flex-grow space-y-1 md:space-y-2">
                          <h3 className="font-bold text-sm md:text-lg font-heading text-gradient-primary">
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
                              className="h-8 w-8 p-0 rounded-full"
                              onClick={(e) => onFavoriteToggle(e, vehicle._id)}
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
            {featuresToShow.map((feature, index) => {
              const bestIndex = highlightDifferences ? getBestValue(feature.label, vehicles) : null;
              
              return (
                <TableRow
                  key={feature.label}
                  className={cn(
                    index % 2 === 0 ? "bg-muted/10" : "",
                    "hover:bg-muted/20 transition-colors"
                  )}
                >
                  <TableCell className="sticky left-0 z-10 font-semibold bg-card w-1/4 align-top border-r text-sm md:text-base">
                    <div className="flex items-center gap-2">
                      {feature.icon}
                      <span>{feature.label}</span>
                    </div>
                  </TableCell>
                  {vehicles.map((vehicle, vehicleIndex) => (
                    <TableCell
                      key={vehicle._id}
                      className={cn(
                        "text-center align-top p-2 md:p-4 border-r",
                        bestIndex === vehicleIndex && "bg-success/5"
                      )}
                      style={{ width: vehicleColumnWidth }}
                    >
                      <motion.div variants={itemVariants}>
                        {feature.value(vehicle, vehicleIndex, bestIndex === vehicleIndex)}
                      </motion.div>
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default CompareTable;