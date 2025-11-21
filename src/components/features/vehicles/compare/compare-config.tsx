import { Vehicle } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Phone, Star, Car, Fuel, Settings, MapPin, Calendar, Award, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  VEHICLE_CONDITIONS_LABELS,
  FUEL_TYPES_LABELS,
  TRANSMISSION_TYPES_LABELS,
} from "@/types/shared";

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

export const formatMileage = (mileage: number) =>
  `${new Intl.NumberFormat("es-ES").format(mileage)} km`;

export const featuresConfig = (
    userRatings: Map<string, number | null>,
    hoverRatings: Map<string, number | null>,
    vehicleRatings: Map<string, { average: number; count: number }>,
    onHoverRating: (vehicleId: string, rating: number | null) => void,
    onSetRating: (vehicleId: string, rating: number) => void
) => [
    {
      label: "Precio",
      value: (v: Vehicle, index: number, isBest: boolean) => (
        <div className={cn("text-center", isBest && "text-success font-bold")}>
          <span className="text-lg font-bold">{formatPrice(v.price)}</span>
          {isBest && (
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-xs text-success ml-1">Mejor precio</span>
            </div>
          )}
        </div>
      ),
      icon: <Car className="h-4 w-4" />,
    },
    {
      label: "Año",
      value: (v: Vehicle, index: number, isBest: boolean) => (
        <div className={cn("text-center", isBest && "text-success font-bold")}>
          <span className="text-lg font-bold">{v.year}</span>
          {isBest && (
            <div className="flex items-center justify-center mt-1">
              <Award className="h-4 w-4 text-success" />
              <span className="text-xs text-success ml-1">Más nuevo</span>
            </div>
          )}
        </div>
      ),
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      label: "Condición",
      value: (v: Vehicle) => (
        <Badge
          variant={v.condition === "new" ? "default" : "secondary"}
          className={cn(
            "text-xs font-medium",
            v.condition === "new" 
              ? "bg-success/10 text-success border-success/20" 
              : "bg-accent/10 text-accent border-accent/20"
          )}
        >
          {VEHICLE_CONDITIONS_LABELS[v.condition]}
        </Badge>
      ),
      icon: <Award className="h-4 w-4" />,
    },
    {
      label: "Kilometraje",
      value: (v: Vehicle, index: number, isBest: boolean) => (
        <div className={cn("text-center", isBest && "text-success font-bold")}>
          <span className="font-medium">{formatMileage(v.mileage)}</span>
          {isBest && (
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-xs text-success ml-1">Menor kilometraje</span>
            </div>
          )}
        </div>
      ),
      icon: <Car className="h-4 w-4" />,
    },
    {
      label: "Combustible",
      value: (v: Vehicle) => (
        <div className="flex items-center justify-center gap-2">
          <Fuel className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{FUEL_TYPES_LABELS[v.fuelType]}</span>
        </div>
      ),
      icon: <Fuel className="h-4 w-4" />,
    },
    {
      label: "Transmisión",
      value: (v: Vehicle) => (
        <div className="flex items-center justify-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {TRANSMISSION_TYPES_LABELS[v.transmission]}
          </span>
        </div>
      ),
      icon: <Settings className="h-4 w-4" />,
    },
    {
      label: "Ubicación",
      value: (v: Vehicle) => (
        <div className="flex items-center justify-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs">{v.location}</span>
        </div>
      ),
      icon: <MapPin className="h-4 w-4" />,
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
      icon: <Award className="h-4 w-4" />,
    },
    {
      label: "Valoración",
      value: (v: Vehicle, index: number, isBest: boolean) => {
        const userRating = userRatings.get(v._id);
        const hoverRating = hoverRatings.get(v._id);
        const vehicleRating = vehicleRatings.get(v._id);
        const displayRating =
          hoverRating ?? userRating ?? vehicleRating?.average ?? 0;
        const ratingCount = vehicleRating?.count ?? 0;

        return (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-1",
              isBest && "text-success font-bold"
            )}
            onMouseLeave={() => onHoverRating(v._id, null)}
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
                  onMouseEnter={() => onHoverRating(v._id, star)}
                  onClick={() => onSetRating(v._id, star)}
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
            {isBest && (
              <div className="flex items-center justify-center mt-1">
                <Star className="h-4 w-4 text-success" />
                <span className="text-xs text-success ml-1">Mejor valorado</span>
              </div>
            )}
          </div>
        );
      },
      icon: <Star className="h-4 w-4" />,
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
            className="w-full btn-primary"
            onClick={() => {
              const message = encodeURIComponent(
                `Hola ${v.sellerContact.name}, estoy interesado en tu ${
                  v.brand
                } ${v.model} por ${formatPrice(
                  v.price
                )}. ¿Podrías darme más información?`
              );
              window.open(
                `https://wa.me/${v.sellerContact.phone.replace(
                  /\D/g,
                  ""
                )}?text=${message}`,
                "_blank"
              );
            }}
          >
            <Phone className="mr-2 h-3 w-3" />
            Contactar
          </Button>
        </div>
      ),
      icon: null,
    },
];