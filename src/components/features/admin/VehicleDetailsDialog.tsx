// src/components/features/admin/VehicleDetailsDialog.tsx
// VERSIÓN CON DISEÑO UNIFICADO Y SCROLL OPTIMIZADO

"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Car,
  Settings,
  Palette,
  DollarSign,
  Gauge,
  MapPin,
  Calendar,
  Users,
  Shield,
  CreditCard,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import type { VehicleDataFrontend } from "@/types/types";
import { PdfViewer } from "../payment/pdf-viewer";

interface VehicleDetailsDialogProps {
  vehicle: VehicleDataFrontend | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const VehicleDetailsDialog = ({ vehicle, isOpen, onOpenChange }: VehicleDetailsDialogProps) => {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col overflow-hidden">
        {/* Header con imagen principal */}
        <div className="relative h-64 md:h-80 bg-muted shrink-0">
          <Image
            src={vehicle.images[0] || "/placeholder.svg?height=400&width=800"}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <DialogTitle className="text-2xl font-heading text-white">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {vehicle.category}
              </Badge>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">
                  ${vehicle.price.toLocaleString()} {vehicle.currency}
                </span>
                {vehicle.isNegotiable && (
                  <Badge variant="outline" className="border-white/30 text-white">
                    Negociable
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido con scroll */}
        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-6 space-y-6 pb-8">
            {/* Galería de imágenes */}
            {vehicle.images.length > 1 && (
              <Card className="shadow-sm border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Galería de Imágenes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {vehicle.images.slice(1).map((image, index) => (
                      <div key={index} className="relative aspect-video">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${vehicle.brand} ${vehicle.model} - ${index + 2}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Especificaciones principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary" />
                    Especificaciones Principales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Año</p>
                      <p className="font-medium">{vehicle.year}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Kilometraje</p>
                      <p className="font-medium">{vehicle.mileage.toLocaleString()} km</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Color</p>
                      <p className="font-medium">{vehicle.color}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Transmisión</p>
                      <p className="font-medium">{vehicle.transmission}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Detalles Técnicos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Motor</p>
                      <p className="font-medium">{vehicle.engine || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Cilindraje</p>
                      <p className="font-medium">{vehicle.displacement || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Tracción</p>
                      <p className="font-medium">{vehicle.driveType || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Combustible</p>
                      <p className="font-medium">{vehicle.fuelType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Características */}
            <Card className="shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Características
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documentación */}
            <Card className="shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Documentación
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehicle.documentation && vehicle.documentation.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {vehicle.documentation.map((doc, index) => (
                      <Badge key={index} variant="outline" className="border-green-500 text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No se especificó documentación.</p>
                )}
              </CardContent>
            </Card>

            {/* Descripción */}
            <Card className="shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Descripción
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {vehicle.description}
                </p>
              </CardContent>
            </Card>

            {/* Información del vendedor */}
            <Card className="shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Información del Vendedor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Nombre</p>
                    <p className="font-medium">{vehicle.sellerContact.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{vehicle.sellerContact.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{vehicle.sellerContact.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Ubicación</p>
                    <p className="font-medium">{vehicle.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de pago */}
            {(vehicle.paymentProof || vehicle.referenceNumber) && (
              <Card className="shadow-sm border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Información de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vehicle.referenceNumber && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Número de Referencia:</span>
                      <Badge variant="outline" className="font-mono">
                        {vehicle.referenceNumber}
                      </Badge>
                    </div>
                  )}
                  {vehicle.paymentProof && (
                    <div>
                      <p className="text-sm font-medium mb-2">Comprobante de Pago:</p>
                      <PdfViewer
                        url={vehicle.paymentProof}
                        vehicleId={vehicle._id!}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};