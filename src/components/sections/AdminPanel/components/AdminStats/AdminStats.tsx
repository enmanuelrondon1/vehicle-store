"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, XCircle, Car } from "lucide-react"
import type { VehicleDataFrontend } from "@/types/types"

interface AdminStatsProps {
  vehicles: VehicleDataFrontend[]
  isDarkMode: boolean
}

export const AdminStats: React.FC<AdminStatsProps> = ({ vehicles, isDarkMode }) => {
  const stats = {
    total: vehicles.length,
    pending: vehicles.filter((v) => v.status === "pending").length,
    approved: vehicles.filter((v) => v.status === "approved").length,
    rejected: vehicles.filter((v) => v.status === "rejected").length,
  }

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Car,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Pendientes",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      title: "Aprobados",
      value: stats.approved,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Rechazados",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
