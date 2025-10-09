// src/components/features/admin/AdminPanelHeader.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, RefreshCw, Download, BarChart2 } from "lucide-react";
import { NotificationBell } from "../../shared/notifications/NotificationBell";
import type { VehicleDataFrontend } from "@/types/types";

interface AdminPanelHeaderProps {
  isDarkMode: boolean;
  isLoading: boolean;
  exportData: () => void;
  fetchVehicles: () => void;
  setVehicleFromNotification: (vehicle: VehicleDataFrontend | null) => void;
}

export const AdminPanelHeader = ({ isDarkMode, isLoading, exportData, fetchVehicles, setVehicleFromNotification }: AdminPanelHeaderProps) => {
  return (
    <Card className={isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white"}>
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 md:gap-3">
              <Car className="w-6 h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0" />
              <span className="truncate">Panel de Administrador</span>
            </CardTitle>
            <p className="text-slate-500 dark:text-slate-400 mt-1 md:mt-2 text-sm md:text-base">
              Gestiona los anuncios de vehículos y comprobantes de pago
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <NotificationBell onNotificationClick={setVehicleFromNotification} />
            <Button onClick={exportData} variant="outline" size="sm" className="text-xs sm:text-sm">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden xs:inline">Exportar</span>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-xs sm:text-sm">
              <Link href="/adminPanel/dashboard">
                <BarChart2 className="w-4 h-4 mr-2" />
                <span className="hidden xs:inline">Dashboard</span>
              </Link>
            </Button>
            <Button onClick={fetchVehicles} variant="outline" size="sm" disabled={isLoading} className="text-xs sm:text-sm">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden xs:inline">Actualizar</span>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

