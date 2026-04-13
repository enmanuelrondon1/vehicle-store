// src/components/shared/notifications/NotificationBell.tsx
// ✅ OPTIMIZADO:
//    1. Eliminado @headlessui/react (Popover + Transition) — reemplazado por
//       shadcn Popover que ya está instalado. Ahorra ~30KB de bundle duplicado.
//    2. La animación del panel usa CSS transition de Tailwind en lugar de
//       el componente Transition de headlessui.

"use client";

import { useState, useEffect } from "react";
import { Bell, Car, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { VehicleDataFrontend } from "@/types/types";

interface Notification {
  message: string;
  vehicleId: string;
  timestamp: string;
  type: "new-vehicle" | "status-update";
  read: boolean;
  vehicleData?: VehicleDataFrontend;
}

interface NotificationBellProps {
  onNotificationClick: (vehicle: VehicleDataFrontend) => void;
  className?: string;
}

export const NotificationBell = ({
  onNotificationClick,
  className,
}: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const loadStateFromStorage = () => {
    try {
      const stored = localStorage.getItem("adminNotifications");
      if (stored) {
        const parsed: Notification[] = JSON.parse(stored);
        setNotifications(parsed.map((n) => ({ ...n, read: n.read ?? true })));
      }
      const storedCount = localStorage.getItem("adminUnreadCount");
      if (storedCount) setUnreadCount(parseInt(storedCount, 10));
    } catch {
      localStorage.removeItem("adminNotifications");
      localStorage.removeItem("adminUnreadCount");
    }
  };

  useEffect(() => {
    loadStateFromStorage();
    window.addEventListener("storage", loadStateFromStorage);
    return () => window.removeEventListener("storage", loadStateFromStorage);
  }, []);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) return;

    // Marcar como leídas al abrir
    setUnreadCount(0);
    localStorage.setItem("adminUnreadCount", "0");
    setTimeout(() => {
      setNotifications((prev) => {
        const allRead = prev.map((n) => ({ ...n, read: true }));
        localStorage.setItem("adminNotifications", JSON.stringify(allRead));
        return allRead;
      });
    }, 500);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.vehicleData) {
      onNotificationClick(notification.vehicleData);
    }
    setOpen(false);
  };

  const handleClearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem("adminNotifications");
    localStorage.removeItem("adminUnreadCount");
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`relative ${className ?? ""}`}
          aria-label="Notificaciones"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 p-0 card-glass border border-border/20 rounded-2xl shadow-lg"
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-border/20">
            <h3 className="text-lg font-heading font-semibold text-gradient-primary">
              Notificaciones
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-primary hover:underline focus:outline-none"
                aria-label="Limpiar todas las notificaciones"
              >
                Limpiar todo
              </button>
            )}
          </div>

          {/* Lista o estado vacío */}
          {notifications.length > 0 ? (
            <ul
              role="list"
              className="divide-y divide-border/20 max-h-96 overflow-y-auto mt-3 -mx-4"
            >
              {notifications.map((item, index) => (
                <li
                  key={`${item.vehicleId}-${item.timestamp}-${index}`}
                  onClick={() => handleNotificationClick(item)}
                  className={`flex items-center gap-3 py-3 px-4 hover:bg-primary/10 cursor-pointer transition-colors duration-200 ${
                    !item.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                    {item.type === "new-vehicle" ? (
                      <Car className="h-5 w-5 text-primary" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        !item.read ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {item.message}
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-1">
                      {formatDistanceToNow(new Date(item.timestamp), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No tienes notificaciones</p>
              <p className="text-sm">Las nuevas alertas aparecerán aquí.</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};