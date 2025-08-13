// src/components/sections/AdminPanel/components/VehicleGridView/VehicleGridView.tsx
"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle, XCircle, Clock, Eye, DollarSign, Gauge, MapPin, Car } from "lucide-react"
import { VehicleDataFrontend, ApprovalStatus } from "@/types/types"

interface VehicleGridViewProps {
  vehicles: VehicleDataFrontend[]
  onStatusChange: (vehicleId: string, status: ApprovalStatus) => void
  onVehicleSelect: (vehicle: VehicleDataFrontend) => void
  isDarkMode: boolean
}

export const VehicleGridView = ({ vehicles, onStatusChange, onVehicleSelect, isDarkMode }: VehicleGridViewProps) => {
  const getStatusBadge = (status: ApprovalStatus) => {
    const variants = {
      [ApprovalStatus.PENDING]: { variant: "secondary" as const, icon: Clock, text: "Pendiente" },
      [ApprovalStatus.APPROVED]: { variant: "default" as const, icon: CheckCircle, text: "Aprobado" },
      [ApprovalStatus.REJECTED]: { variant: "destructive" as const, icon: XCircle, text: "Rechazado" },
    }
    const config = variants[status] || variants[ApprovalStatus.PENDING]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay vehículos</h3>
        <p className="text-gray-600 dark:text-gray-400">No se encontraron vehículos con los filtros seleccionados.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {vehicles.map((vehicle) => (
        <Card
          key={vehicle._id}
          className={`${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          } hover:shadow-lg transition-all duration-200 hover:scale-105`}
        >
          <CardContent className="p-4">
            {/* Imagen */}
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
              <Image
                src={vehicle.images[0] || "/placeholder.svg?height=200&width=300"}
                alt={`${vehicle.brand} ${vehicle.model}`}
                fill
                className="object-cover"
              />
              {vehicle.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  +{vehicle.images.length - 1}
                </div>
              )}
              <div className="absolute top-2 left-2">{getStatusBadge(vehicle.status)}</div>
            </div>

            {/* Información básica */}
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-lg line-clamp-1">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.year}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">${vehicle.price.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Gauge className="w-4 h-4 text-blue-600" />
                  <span>{vehicle.mileage.toLocaleString()} km</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span className="line-clamp-1">{vehicle.location}</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => onVehicleSelect(vehicle)} className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver detalles
                    </Button>
                  </DialogTrigger>
                </Dialog>

                {/* ✅ CORREGIDO: Usar el enum ApprovalStatus */}
                {vehicle.status === ApprovalStatus.PENDING && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onStatusChange(vehicle._id!, ApprovalStatus.APPROVED)}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onStatusChange(vehicle._id!, ApprovalStatus.REJECTED)}
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}