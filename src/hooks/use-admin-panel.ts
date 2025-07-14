// src/hooks/use-admin-panel.ts
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import type { VehicleDataFrontend, ApprovalStatus } from "@/types/types"

export const useAdminPanel = () => {
  const { data: session, status } = useSession()
  const [vehicles, setVehicles] = useState<VehicleDataFrontend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchVehicles()
    } else if (status === "authenticated") {
      setError("No tienes permisos de administrador")
      setIsLoading(false)
    }
  }, [status, session])

  const fetchVehicles = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/admin/vehicles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setVehicles(data.data || [])
      } else {
        setError(data.error || "Error desconocido al cargar los vehículos")
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err)
      setError(err instanceof Error ? err.message : "Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: ApprovalStatus) => {
    try {
      const response = await fetch(`/api/admin/vehicles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el estado")
      }

      // Actualizar el estado local
      setVehicles((prev) => prev.map((vehicle) => (vehicle._id === id ? { ...vehicle, status: newStatus } : vehicle)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar")
    }
  }

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (filter === "all") return true
    return vehicle.status === filter
  })

  return {
    vehicles: filteredVehicles,
    isLoading,
    error,
    filter,
    setFilter,
    handleStatusChange,
    fetchVehicles,
    isAdmin: session?.user?.role === "admin",
    status,
  }
}
