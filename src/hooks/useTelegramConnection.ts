// src/hooks/useTelegramConnection.ts
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface UserWithTelegram {
  telegramUserId?: string;
  telegramUsername?: string;
}

export interface TelegramInfo {
  linked: boolean;
  username: string;
  userId?: string;
}

interface ApiResponse {
  success: boolean;
  link?: string;
  error?: string;
}

interface TelegramStatusResponse {
  success: boolean;
  data?: {
    telegramUserId?: string;
    telegramUsername?: string;
  };
  error?: string;
}

export const useTelegramConnection = () => {
  const { data: session, status, update } = useSession();
  const [telegramInfo, setTelegramInfo] = useState<TelegramInfo>({
    linked: false,
    username: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pollingActive, setPollingActive] = useState(false);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const fetchTelegramStatus = useCallback(
    async (shouldUpdateSession = false) => {
      try {
        const response = await fetch("/api/user/telegram-status");
        const data: TelegramStatusResponse = await response.json();

        if (data.success && data.data) {
          const isLinked = !!data.data.telegramUserId;
          setTelegramInfo({
            linked: isLinked,
            username: data.data.telegramUsername || "",
            userId: data.data.telegramUserId,
          });

          if (isLinked && shouldUpdateSession) {
            await update();
          }
          return isLinked;
        }
        return false;
      } catch (err) {
        console.error("Error fetching Telegram status:", err);
        setError("No se pudo verificar el estado de Telegram.");
        return false;
      }
    },
    [update]
  );

  useEffect(() => {
    if (status === "authenticated") {
      const userWithTelegram = session?.user as UserWithTelegram;
      if (userWithTelegram?.telegramUserId) {
        setTelegramInfo({
          linked: true,
          username: userWithTelegram.telegramUsername || "",
          userId: userWithTelegram.telegramUserId,
        });
        setIsLoading(false);
      } else {
        fetchTelegramStatus().finally(() => setIsLoading(false));
      }
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [session, status, fetchTelegramStatus]);

  useEffect(() => {
    if (!pollingActive) return;

    const interval = setInterval(async () => {
      const isLinked = await fetchTelegramStatus(true);
      if (isLinked) {
        setPollingActive(false);
        setSuccess("¡Conexión con Telegram establecida exitosamente!");
        setIsConnecting(false);
      }
    }, 3000);

    const timeout = setTimeout(() => {
      setPollingActive(false);
      setIsConnecting(false);
      if (!telegramInfo.linked) {
        setError(
          "Tiempo agotado. Si confirmaste la conexión, por favor refresca la página."
        );
      }
    }, 120000); // 2 minutos

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pollingActive, fetchTelegramStatus, telegramInfo.linked]);

  const handleConnect = async () => {
    clearMessages();
    setIsConnecting(true);
    try {
      const response = await fetch("/api/telegram/link");
      const data: ApiResponse = await response.json();

      if (data.success && data.link) {
        window.open(data.link, "_blank");
        setPollingActive(true);
        setSuccess(
          "Se ha abierto Telegram. Confirma la vinculación en el bot para completar el proceso."
        );
      } else {
        throw new Error(
          data.error || "No se pudo generar el enlace de Telegram."
        );
      }
    } catch (err) {
      console.error("Error connecting to Telegram:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al conectar con Telegram"
      );
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    clearMessages();
    setIsLoading(true);
    try {
      const response = await fetch("/api/telegram/disconnect", {
        method: "POST",
      });
      const data: ApiResponse = await response.json();

      if (data.success) {
        setTelegramInfo({ linked: false, username: "" });
        setSuccess("Conexión con Telegram desvinculada exitosamente.");
        await update();
      } else {
        throw new Error(data.error || "No se pudo desvincular la cuenta.");
      }
    } catch (err) {
      console.error("Error disconnecting from Telegram:", err);
      setError(
        err instanceof Error ? err.message : "Error desconocido al desvincular"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    clearMessages();
    setIsLoading(true);
    await fetchTelegramStatus();
    setIsLoading(false);
  };

  return {
    telegramInfo,
    isLoading,
    isConnecting,
    error,
    success,
    pollingActive,
    handleConnect,
    handleDisconnect,
    handleRefresh
  };
};
