// src/components/sections/AdminPanel/components/NotificationBell/NotificationBell.tsx
'use client';

import { useState, useEffect, Fragment } from "react";
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/lib/pusher';
import { Bell, Car, CheckCircle } from 'lucide-react';
import { Popover, Transition } from '@headlessui/react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
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
}

export const NotificationBell = ({ onNotificationClick }: NotificationBellProps) => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session?.user?.role !== 'admin') {
      return;
    }

    try {
      const channel = pusherClient.subscribe('private-admin-notifications');

      const handleNotification = (data: Notification, type: Notification['type']) => {
        const newNotification: Notification = { ...data, type, read: false };
        
        // Actualizamos el estado y localStorage en una sola operación para garantizar la sincronización
        setNotifications((prev) => {
          const updatedNotifications = [newNotification, ...prev.slice(0, 9)];
          localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
          return updatedNotifications;
        });
        setUnreadCount((prev) => {
          const newCount = prev + 1;
          localStorage.setItem('adminUnreadCount', newCount.toString());
          return newCount;
        });

        // Reproducir sonido de notificación
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.error("Error al reproducir sonido:", e));
      };

      channel.bind('new-vehicle', (data: Notification) => handleNotification(data, 'new-vehicle'));
      channel.bind('status-update', (data: Notification) => handleNotification(data, 'status-update'));

      return () => {
        pusherClient.unsubscribe('private-admin-notifications');
        channel.unbind_all();
      };
    } catch (error) {
      console.error("Error subscribing to Pusher channel:", error);
    }
  }, [session]);

  // Cargar notificaciones desde localStorage al montar el componente
  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem('adminNotifications');
      if (storedNotifications) {
        const parsedNotifications: Notification[] = JSON.parse(storedNotifications);
        // Aseguramos que las notificaciones viejas se marquen como leídas por defecto
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
  }, []);

  if (session?.user?.role !== 'admin') {
    return null;
  }

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
    <Popover className="relative">
      {({ close }) => (
        <>
          <Popover.Button
            onClick={handleOpen}
            className="relative p-2 rounded-lg transition-colors bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
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
            <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 max-w-sm transform px-4 sm:px-0">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-8 bg-white dark:bg-gray-800 p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notificaciones</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-xs text-blue-600 hover:underline dark:text-blue-400 focus:outline-none"
                        aria-label="Limpiar todas las notificaciones"
                      >
                        Limpiar todo
                      </button>
                    )}
                  </div>
                  {notifications.length > 0 ? (
                    <div className="flow-root max-h-96 overflow-y-auto -mr-4 pr-4">
                      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                        {notifications.map((item, index) => (
                          <li
                            key={`${item.vehicleId}-${item.timestamp}-${index}`} // Usamos un key más robusto
                            onClick={() => handleNotificationClick(item, close)}
                            className={`flex items-center py-4 space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer -mx-4 px-4 rounded-md transition-colors duration-300 ${
                              !item.read ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {item.type === 'new-vehicle' ? (
                                <Car className="h-6 w-6 text-blue-500" />
                              ) : (
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm ${!item.read ? 'text-gray-800 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                                {item.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale: es })}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No tienes notificaciones nuevas.</p>
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
