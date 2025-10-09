// src/components/features/admin/dialogs/VehicleDetailsDialog.tsx
"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import type { VehicleDataFrontend } from "@/types/types";
import { PdfViewer } from "../payment/pdf-viewer";
// import { PdfViewer } from "../../payment/pdf-viewer";

interface VehicleDetailsDialogProps {
  vehicle: VehicleDataFrontend | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isDarkMode: boolean;
}

export const VehicleDetailsDialog = ({ vehicle, isOpen, onOpenChange, isDarkMode }: VehicleDetailsDialogProps) => {
  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[90vh] ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? "text-slate-100" : "text-slate-900"}>
            {vehicle.brand} {vehicle.model} ({vehicle.year})
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="pr-6 -mr-6 h-[70vh]">
          <div className="space-y-6 p-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {vehicle.images.map((image, index) => (
                <div key={index} className="relative aspect-video">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${vehicle.brand} ${vehicle.model} - ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-semibold mb-2 border-b pb-2 ${isDarkMode ? "text-slate-200 border-slate-600" : "text-slate-900 border-slate-200"}`}>
                  Especificaciones
                </h4>
                <ul className={`space-y-1 text-sm ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                  <li><strong>Categoría:</strong> {vehicle.category}</li>
                  <li><strong>Subcategoría:</strong> {vehicle.subcategory}</li>
                  <li><strong>Motor:</strong> {vehicle.engine}</li>
                  <li><strong>Puertas:</strong> {vehicle.doors}</li>
                  <li><strong>Asientos:</strong> {vehicle.seats}</li>
                  <li><strong>Condición:</strong> {vehicle.condition}</li>
                  <li>
                    <strong>Precio:</strong> {vehicle.currency} {vehicle.price.toLocaleString()}
                    {vehicle.isNegotiable && " (Negociable)"}
                  </li>
                  <li><strong>Tracción:</strong> {vehicle.driveType || "N/A"}</li>
                  <li><strong>Cilindraje:</strong> {vehicle.displacement || "N/A"}</li>
                </ul>
              </div>
              <div>
                <h4 className={`font-semibold mb-2 border-b pb-2 ${isDarkMode ? "text-slate-200 border-slate-600" : "text-slate-900 border-slate-200"}`}>
                  Características
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <h4 className={`font-semibold mt-4 mb-2 border-b pb-2 ${isDarkMode ? "text-slate-200 border-slate-600" : "text-slate-900 border-slate-200"}`}>
                  Documentación
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vehicle.documentation && vehicle.documentation.length > 0 ? (
                    vehicle.documentation.map((doc, index) => (
                      <Badge key={index} variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
                        {doc}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No se especificó documentación.</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h4 className={`font-semibold mb-2 border-b pb-2 ${isDarkMode ? "text-slate-200 border-slate-600" : "text-slate-900 border-slate-200"}`}>
                Descripción
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {vehicle.description}
              </p>
            </div>

            {(vehicle.paymentProof || vehicle.referenceNumber) && (
              <div>
                <h4 className={`font-semibold mb-2 border-b pb-2 ${isDarkMode ? "text-slate-200 border-slate-600" : "text-slate-900 border-slate-200"}`}>
                  Información de Pago
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-4">
                  {vehicle.referenceNumber && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">Número de Referencia:</span>
                      <span className="text-sm font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {vehicle.referenceNumber}
                      </span>
                    </div>
                  )}
                  {vehicle.paymentProof && (
                    <PdfViewer
                      url={vehicle.paymentProof}
                      vehicleId={vehicle._id!}
                      isDarkMode={isDarkMode}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

