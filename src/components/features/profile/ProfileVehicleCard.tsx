//src/components/features/profile/ProfileVehicleCard.tsx
import React, { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { VehicleDataFrontend, ApprovalStatus } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  GitCompare,
  Banknote,
  CircleSlash,
  DollarSign,
  Calendar,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VehicleCardProps {
  vehicle: VehicleDataFrontend & { _id: string };
  onDelete: (id: string) => void;
  onRemoveFinancing: (id: string) => void; // Añadir nueva prop
  onToggleCompare: (id: string) => void;
  isInCompareList: boolean;
}

const StatusInfo: Record<
  ApprovalStatus | "sold",
  {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: JSX.Element;
    tooltip: string;
    className: string;
  }
> = {
  [ApprovalStatus.PENDING]: {
    text: "Pendiente",
    variant: "default",
    icon: <Clock className="w-4 h-4" />,
    tooltip: "Tu anuncio está esperando revisión por nuestro equipo.",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
  },
  [ApprovalStatus.UNDER_REVIEW]: {
    text: "En Revisión",
    variant: "secondary",
    icon: <Search className="w-4 h-4" />,
    tooltip: "Tu anuncio está siendo activamente revisado por nuestro equipo.",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  },
  [ApprovalStatus.APPROVED]: {
    text: "Aprobado",
    variant: "outline",
    icon: <CheckCircle className="w-4 h-4" />,
    tooltip:
      "¡Felicidades! Tu anuncio está activo y visible para todos los compradores.",
    className:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-900",
  },
  [ApprovalStatus.REJECTED]: {
    text: "Rechazado",
    variant: "destructive",
    icon: <XCircle className="w-4 h-4" />,
    tooltip:
      "El anuncio fue rechazado. Revisa los detalles y contacta a soporte si crees que es un error.",
    className:
      "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-900",
  },
  sold: {
    text: "Vendido",
    variant: "outline",
    icon: <DollarSign className="w-4 h-4" />,
    tooltip: "¡Felicidades! Has vendido este vehículo.",
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400 border-purple-200 dark:border-purple-900",
  },
};

const ProfileVehicleCard = ({
  vehicle,
  onDelete,
  onRemoveFinancing, // Usar nueva prop
  onToggleCompare,
  isInCompareList,
}: VehicleCardProps) => {
  const details = [
    {
      label: "Año",
      value: vehicle.year,
      icon: <Calendar className="w-4 h-4" />,
    },
  ];
  const imageUrl =
    vehicle.images?.[0] ||
    "https://res.cloudinary.com/dcdawwvx2/image/upload/f_auto,q_auto/v1718207295/Default-car_t3j2s6.png";
  const statusInfo = StatusInfo[vehicle.status];

  return (
    <TooltipProvider delayDuration={100}>
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="p-0 relative">
          <Link href={`/vehicle/${vehicle._id}`} passHref>
            <div className="relative overflow-hidden group">
              <Image
                src={imageUrl}
                alt={`${vehicle.brand} ${vehicle.model}`}
                width={400}
                height={250}
                className="object-cover w-full h-48 cursor-pointer transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>
          <div className="absolute top-3 left-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  className={`flex items-center gap-1.5 shadow-lg backdrop-blur-sm ${statusInfo.className}`}
                >
                  {statusInfo.icon}
                  <span className="font-semibold">{statusInfo.text}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 dark:bg-slate-950 text-white border-gray-700">
                <p>{statusInfo.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="p-5 flex-grow bg-white dark:bg-slate-800">
          <div className="mb-1">
            <CardTitle className="text-lg font-bold truncate hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-gray-900 dark:text-white leading-tight">
              <Link href={`/vehicle/${vehicle._id}`}>
                {vehicle.brand} {vehicle.model}
              </Link>
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
              {vehicle.year}
            </span>
          </div>
          <div className="mt-auto">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Precio
            </p>
            <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              {formatPrice(vehicle.price)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-3 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-gray-700">
          <div
            className={`grid ${
              vehicle.offersFinancing ? "grid-cols-4" : "grid-cols-2"
            } gap-1 w-full`}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-orange-600 dark:hover:text-orange-400 text-gray-700 dark:text-gray-300"
                >
                  <Link href={`/vehicle/${vehicle._id}`}>
                    <Eye className="w-4 h-4" />
                    <span className="sr-only">Ver</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 dark:bg-slate-950 text-white border-gray-700">
                <p>Ver Anuncio</p>
              </TooltipContent>
            </Tooltip>

            {vehicle.offersFinancing && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/profile/edit-ad/${vehicle._id}`}>
                        <Banknote className="w-4 h-4" />
                        <span className="sr-only">Editar Financiación</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 dark:bg-slate-950 text-white border-gray-700">
                    <p>Editar Financiación</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-amber-600 dark:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:text-amber-700 dark:hover:text-amber-400"
                      onClick={() => onRemoveFinancing(vehicle._id!)}
                    >
                      <CircleSlash className="w-4 h-4" />
                      <span className="sr-only">Desactivar Financiación</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 dark:bg-slate-950 text-white border-gray-700">
                    <p>Desactivar Financiación</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    isInCompareList
                      ? "text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  }
                  onClick={() => onToggleCompare(vehicle._id!)}
                  disabled={vehicle.status === "pending"}
                >
                  <GitCompare className="w-4 h-4" />
                  <span className="sr-only">Comparar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 dark:bg-slate-950 text-white border-gray-700">
                {vehicle.status === "pending" ? (
                  <p>El anuncio debe estar aprobado para poder comparar.</p>
                ) : (
                  <p>
                    {isInCompareList
                      ? "Quitar de la comparación"
                      : "Añadir a la comparación"}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default ProfileVehicleCard;