// src/components/features/admin/VehicleDetailsDialog.tsx
// ✅ OPTIMIZADO:
//    1. PdfViewer cargado con dynamic() — mismo fix que VehicleListView.
//    2. Imágenes de galería con loading="lazy" y sizes correctos.
//    3. Imagen principal con sizes para evitar descarga oversized.

"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Car,
  Settings,
  DollarSign,
  Users,
  Shield,
  CreditCard,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import type { VehicleDataFrontend } from "@/types/types";

// ✅ PdfViewer lazy — solo se descarga si el vehículo tiene comprobante
const PdfViewer = dynamic(
  () => import("../payment/pdf-viewer").then((m) => m.PdfViewer),
  {
    ssr: false,
    loading: () => (
      <p className="text-xs text-muted-foreground animate-pulse">Cargando PDF...</p>
    ),
  }
);

interface VehicleDetailsDialogProps {
  vehicle: VehicleDataFrontend | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const VehicleDetailsDialog = ({
  vehicle,
  isOpen,
  onOpenChange,
}: VehicleDetailsDialogProps) => {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col overflow-hidden">

        {/* ── Imagen principal ── */}
        <div className="relative h-64 md:h-80 bg-muted shrink-0">
          <Image
            src={vehicle.images[0] || "/placeholder.svg?height=400&width=800"}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <DialogTitle className="text-2xl font-heading text-white">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </DialogTitle>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
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

        {/* ── Contenido scrolleable ── */}
        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-6 space-y-6 pb-8">

            {/* Galería */}
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
                          // ✅ lazy en galería — no bloquean el render inicial del dialog
                          loading="lazy"
                          sizes="(max-width: 768px) 50vw, 200px"
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
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Año",          value: vehicle.year },
                      { label: "Kilometraje",  value: `${vehicle.mileage.toLocaleString()} km` },
                      { label: "Color",        value: vehicle.color },
                      { label: "Transmisión",  value: vehicle.transmission },
                    ].map(({ label, value }) => (
                      <div key={label} className="space-y-1">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
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
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Motor",       value: vehicle.engine      || "N/A" },
                      { label: "Cilindraje",  value: vehicle.displacement || "N/A" },
                      { label: "Tracción",    value: vehicle.driveType   || "N/A" },
                      { label: "Combustible", value: vehicle.fuelType },
                    ].map(({ label, value }) => (
                      <div key={label} className="space-y-1">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Características */}
            {vehicle.features.length > 0 && (
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
                      <Badge key={index} variant="secondary">{feature}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
            {vehicle.description && (
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
            )}

            {/* Vendedor */}
            <Card className="shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Información del Vendedor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Nombre",     value: vehicle.sellerContact.name },
                    { label: "Email",      value: vehicle.sellerContact.email },
                    { label: "Teléfono",   value: vehicle.sellerContact.phone },
                    { label: "Ubicación",  value: vehicle.location },
                  ].map(({ label, value }) => (
                    <div key={label} className="space-y-1">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pago — solo si existe */}
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
                      <PdfViewer url={vehicle.paymentProof} vehicleId={vehicle._id!} />
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