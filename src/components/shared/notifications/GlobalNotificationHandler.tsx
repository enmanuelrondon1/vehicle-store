// src/components/shared/notifications/GlobalNotificationHandler.tsx
// ✅ OPTIMIZADO:
//    1. pusherClient reemplazado por getPusherClient() — Pusher se carga lazy
//       solo cuando el usuario es admin y solo en el browser.
//    2. Eliminados console.log/warn/error en producción.
//    3. Cleanup correcto del canal al desmontar.

"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getPusherClient } from "@/lib/pusher";
import { VehicleDataFrontend } from "@/types/types";

interface Notification {
  message: string;
  vehicleId: string;
  timestamp: string;
  type: "new-vehicle" | "status-update";
  read: boolean;
  vehicleData?: VehicleDataFrontend;
}

// ── Audio handler ─────────────────────────────────────────────────────────────
class NotificationAudio {
  private audio: HTMLAudioElement;
  private isUnlocked = false;
  private pendingPlays: (() => void)[] = [];

  constructor(src: string) {
    this.audio = new Audio(src);
    this.audio.preload = "auto";
    this.setupUnlock();
  }

  private setupUnlock() {
    const unlock = async () => {
      try {
        this.audio.muted = true;
        await this.audio.play();
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.muted = false;
        this.isUnlocked = true;
        this.pendingPlays.forEach((fn) => fn());
        this.pendingPlays = [];
      } catch {
        // Audio still blocked — will retry on next interaction
      }
    };
    document.addEventListener("click",      unlock, { once: true });
    document.addEventListener("keydown",    unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
  }

  async play(): Promise<boolean> {
    if (this.isUnlocked) {
      try {
        await this.audio.play();
        return true;
      } catch {
        return false;
      }
    }
    this.pendingPlays.push(() => this.play());
    return false;
  }

  destroy() {
    this.audio.src = "";
    this.pendingPlays = [];
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export const GlobalNotificationHandler = () => {
  const { data: session } = useSession();
  const audioRef = useRef<NotificationAudio | null>(null);

  useEffect(() => {
    audioRef.current = new NotificationAudio("/notification.mp3");
    return () => { audioRef.current?.destroy(); };
  }, []);

  const playSound = useCallback(async () => {
    if (!audioRef.current) return;
    const played = await audioRef.current.play();
    if (!played && "Notification" in window && Notification.permission === "granted") {
      new Notification("Nueva notificación de vehículo", {
        icon: "/car.svg",
        body: "Tienes nuevas notificaciones pendientes",
      });
    }
  }, []);

  useEffect(() => {
    if (session?.user?.role !== "admin") return;

    let unsubscribed = false;

    const setup = async () => {
      try {
        const client = await getPusherClient();
        if (unsubscribed) return;

        const channel = client.subscribe("private-admin-notifications");

        const handleNotification = async (
          data: Notification,
          type: Notification["type"]
        ) => {
          const newNotification: Notification = { ...data, type, read: false };
          const notificationId = `${newNotification.vehicleId}-${newNotification.timestamp}`;

          const stored = localStorage.getItem("adminNotifications");
          const current: Notification[] = stored ? JSON.parse(stored) : [];

          if (current.some((n) => `${n.vehicleId}-${n.timestamp}` === notificationId)) return;

          const updated = [newNotification, ...current.slice(0, 9)];
          localStorage.setItem("adminNotifications", JSON.stringify(updated));

          const currentCount = parseInt(localStorage.getItem("adminUnreadCount") || "0", 10);
          localStorage.setItem("adminUnreadCount", String(currentCount + 1));

          await playSound();
        };

        channel.bind("new-vehicle",   (data: Notification) => handleNotification(data, "new-vehicle"));
        channel.bind("status-update", (data: Notification) => handleNotification(data, "status-update"));
      } catch {
        // Pusher connection failed silently
      }
    };

    setup();

    return () => {
      unsubscribed = true;
      getPusherClient()
        .then((client) => client.unsubscribe("private-admin-notifications"))
        .catch(() => {});
    };
  }, [session, playSound]);

  return null;
};