"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { VehicleDataFrontend } from "@/types/types";

interface Notification {
  message: string;
  vehicleId: string;
  timestamp: string;
  type: "new-vehicle" | "status-update";
  read: boolean;
  vehicleData?: VehicleDataFrontend;
}

// Clase para manejar el audio de forma segura
class NotificationAudio {
  private audio: HTMLAudioElement;
  private isUnlocked: boolean = false;
  private pendingPlays: (() => void)[] = [];

  constructor(audioSrc: string) {
    this.audio = new Audio(audioSrc);
    this.audio.preload = "auto";
    this.setupAudioUnlock();
  }

  private setupAudioUnlock() {
    const unlock = async () => {
      try {
        // Intentar reproducir silenciosamente para desbloquear
        this.audio.muted = true;
        await this.audio.play();
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.muted = false;
        this.isUnlocked = true;

        // Ejecutar reproducciones pendientes
        this.pendingPlays.forEach((play) => play());
        this.pendingPlays = [];

        // Remover listeners
        document.removeEventListener("click", unlock);
        document.removeEventListener("keydown", unlock);
        document.removeEventListener("touchstart", unlock);

        console.log(
          "🔊 Audio desbloqueado - Las notificaciones ahora reproducirán sonido"
        );
      } catch (error) {
        // Aún no se puede reproducir
        console.warn("No se pudo desbloquear el audio:", error);
        console.log(
          "🔒 Audio aún bloqueado - Haz clic en cualquier lugar para habilitar notificaciones de audio"
        );
      }
    };

    // Escuchar la primera interacción del usuario
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
  }

  public async play(): Promise<boolean> {
    if (this.isUnlocked) {
      try {
        await this.audio.play();
        return true;
      } catch (error) {
        console.error("Error al reproducir sonido:", error);
        return false;
      }
    } else {
      // Agregar a la cola de reproducciones pendientes
      this.pendingPlays.push(() => this.play());
      console.log(
        "⏳ Sonido pendiente - Haz clic en cualquier lugar para habilitar notificaciones de audio"
      );
      return false;
    }
  }

  public destroy() {
    this.audio.src = "";
    this.pendingPlays = [];
  }
}

export const GlobalNotificationHandler = () => {
  const { data: session } = useSession();
  const audioPlayerRef = useRef<NotificationAudio | null>(null);

  // Inicializar el reproductor de audio
  useEffect(() => {
    audioPlayerRef.current = new NotificationAudio("/notification.mp3");

    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.destroy();
      }
    };
  }, []);

  // Función para reproducir sonido de forma segura
  const playNotificationSound = useCallback(async () => {
    if (audioPlayerRef.current) {
      const played = await audioPlayerRef.current.play();

      if (!played) {
        // Mostrar notificación visual como fallback
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Nueva notificación de vehículo", {
            icon: "/car.svg",
            body: "Tienes nuevas notificaciones pendientes",
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    // Solo suscribir si el usuario es admin
    if (session?.user?.role !== "admin") {
      return;
    }

    try {
      const channel = pusherClient.subscribe("private-admin-notifications");

      const handleNotification = async (
        data: Notification,
        type: Notification["type"]
      ) => {
        const newNotification: Notification = { ...data, type, read: false };

        // Verificar duplicados
        const storedNotifications = localStorage.getItem("adminNotifications");
        const currentNotifications: Notification[] = storedNotifications
          ? JSON.parse(storedNotifications)
          : [];

        const notificationId = `${newNotification.vehicleId}-${newNotification.timestamp}`;
        const isDuplicate = currentNotifications.some(
          (n) => `${n.vehicleId}-${n.timestamp}` === notificationId
        );
        if (isDuplicate) return;

        // Añadir la nueva notificación
        const updatedNotifications = [
          newNotification,
          ...currentNotifications.slice(0, 9),
        ];
        localStorage.setItem(
          "adminNotifications",
          JSON.stringify(updatedNotifications)
        );

        const storedUnreadCount = localStorage.getItem("adminUnreadCount");
        const currentUnreadCount = storedUnreadCount
          ? parseInt(storedUnreadCount, 10)
          : 0;
        const newCount = currentUnreadCount + 1;
        localStorage.setItem("adminUnreadCount", newCount.toString());

        // Disparar evento para otros componentes
        window.dispatchEvent(new Event("storage"));

        // 🔊 Reproducir sonido de forma segura
        await playNotificationSound();
      };

      channel.bind("new-vehicle", (data: Notification) =>
        handleNotification(data, "new-vehicle")
      );
      channel.bind("status-update", (data: Notification) =>
        handleNotification(data, "status-update")
      );

      return () => {
        if (channel) pusherClient.unsubscribe("private-admin-notifications");
      };
    } catch (error) {
      console.error("Error al suscribirse al canal de Pusher:", error);
    }
  }, [session, playNotificationSound]);

  return null;
};
