// src/components/shared/notifications/NotificationBell.tsx
'use client';

import { useState, useEffect, Fragment } from "react";
import { Bell, Car, CheckCircle } from 'lucide-react';
import { Popover, Transition } from '@headlessui/react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleDataFrontend } from "@/types/types";

interface Notification {
  message: string;
  vehicleId: string;
  timestamp: string;
  type: 'new-vehicle' | 'status-update';
  read: boolean;
  vehicleData?: VehicleDataFrontend; // Hacemos opcional para notificaciones viejas
}

interface NotificationBellProps {
  onNotificationClick: (vehicle: VehicleDataFrontend) => void;
  className?: string; // Añadimos la propiedad className
}

export const NotificationBell = ({ onNotificationClick, className }: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadStateFromStorage = () => {
    try {
      const storedNotifications = localStorage.getItem('adminNotifications');
      if (storedNotifications) {
        const parsedNotifications: Notification[] = JSON.parse(storedNotifications);
        setNotifications(parsedNotifications.map(n => ({ ...n, read: n.read ?? true })));
      }
      const storedUnreadCount = localStorage.getItem('adminUnreadCount');
      if (storedUnreadCount) {
        setUnreadCount(parseInt(storedUnreadCount, 10));
      }
    } catch (error) {
      console.error("Error al cargar notificaciones desde localStorage", error);
      localStorage.removeItem('adminNotifications');
      localStorage.removeItem('adminUnreadCount');
    }
  };

  // Cargar notificaciones desde localStorage al montar y escuchar cambios para actualización en tiempo real
  useEffect(() => {
    loadStateFromStorage();
    window.addEventListener('storage', loadStateFromStorage);
    return () => {
      window.removeEventListener('storage', loadStateFromStorage);
    };
  }, []);

  const handleOpen = () => {
    setUnreadCount(0);
    localStorage.setItem('adminUnreadCount', '0');

    // Marcar todas las notificaciones como leídas al abrir el panel
    setTimeout(() => { // Usamos un pequeño delay para que el usuario vea el cambio de estado
      setNotifications(prev => {
        const allRead = prev.map(n => ({ ...n, read: true }));
        localStorage.setItem('adminNotifications', JSON.stringify(allRead));
        return allRead;
      });
    }, 500);
  };

  const handleNotificationClick = (notification: Notification, closePanel: () => void) => {
    // Avisamos al panel padre que queremos ver los detalles de este vehículo
    if (notification.vehicleData) {
      onNotificationClick(notification.vehicleData);
    }
    closePanel();
  };

  const handleClearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('adminNotifications');
    localStorage.removeItem('adminUnreadCount');
  };
  return (
    <Popover className={`relative ${className}`}>
      {({ close }) => (
        <>
          <Popover.Button
            as={Button}
            variant="outline"
            size="sm"
            onClick={handleOpen}
            className="relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <Badge
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground"
              >
                {unreadCount}
              </Badge>
            )}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute right-0 z-50 mt-2 w-80 max-w-sm transform">
              <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5 card-glass border border-border/20">
                <div className="relative p-4">
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
                  {notifications.length > 0 ? (
                    <div className="flow-root max-h-96 overflow-y-auto -mr-4 pr-4 mt-3">
                      <ul role="list" className="divide-y divide-border/20">
                        {notifications.map((item, index) => (
                          <li
                            key={`${item.vehicleId}-${item.timestamp}-${index}`}
                            onClick={() => handleNotificationClick(item, close)}
                            className={`flex items-center py-3 space-x-3 hover:bg-primary/10 cursor-pointer -mx-4 px-4 rounded-md transition-colors duration-200 ${
                              !item.read ? 'bg-primary/5' : ''
                            }`}
                          >
                            <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                              {item.type === 'new-vehicle' ? (
                                <Car className="h-5 w-5 text-primary" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-medium ${!item.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {item.message}
                              </p>
                              <p className="text-xs text-muted-foreground/80 mt-1">
                                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: es })}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-10">
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No tienes notificaciones</p>
                      <p className="text-sm">Las nuevas alertas aparecerán aquí.</p>
                    </div>
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};