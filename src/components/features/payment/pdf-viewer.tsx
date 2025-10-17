// src/components/sections/AdminPanel/components/pdf-viewer/pdf-viewer.tsx
"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, FileText, AlertCircle } from "lucide-react";

interface PdfViewerProps {
  url: string;
  vehicleId: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url, vehicleId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Crear un enlace temporal para descargar
      const link = document.createElement("a");
      link.href = url;
      link.download = `comprobante-pago-${vehicleId}.pdf`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      // Agregar al DOM, hacer clic y remover
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Error al descargar el archivo");
      console.error("Download error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInNewTab = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FileText className="w-4 h-4" />
        <span>Comprobante de pago disponible</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleViewInNewTab}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Ver PDF
        </Button>

        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {isLoading ? "Descargando..." : "Descargar"}
        </Button>
      </div>

      {/* Vista previa del PDF en iframe */}
      <div className="mt-4 border rounded-lg overflow-hidden">
        <iframe
          src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
          width="100%"
          height="400"
          className="border-0"
          title={`Comprobante de pago - ${vehicleId}`}
          onError={() => setError("No se pudo cargar la vista previa del PDF")}
        />
      </div>
    </div>
  );
};