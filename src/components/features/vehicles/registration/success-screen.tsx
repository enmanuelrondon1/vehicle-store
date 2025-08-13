// src/components/features/vehicles/registration/success-screen.tsx
"use client"

import type React from "react"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessScreenProps {
  isDarkMode: boolean
  onCreateNew: () => void
  onViewAds: () => void
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ isDarkMode, onCreateNew, onViewAds }) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-20rem)]">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
        <h2 className={`text-2xl font-bold mt-4 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
          ¡Registro Exitoso!
        </h2>
        <p className={`text-lg mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Tu anuncio está pendiente de aprobación. Te notificaremos cuando esté publicado.
        </p>
        <div className="mt-6 space-x-4">
          <Button className="mt-4" onClick={onCreateNew}>
            Crear Nuevo Anuncio
          </Button>
          <Button className="mt-4" onClick={onViewAds}>
            Ver Anuncios
          </Button>
        </div>
      </div>
    </div>
  )
}
