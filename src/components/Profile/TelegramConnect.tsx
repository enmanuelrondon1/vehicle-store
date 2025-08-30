"use client"; // Necesario si el hook usa 'useState' o 'useEffect'

// components/Profile/TelegramConnect.tsx
import React from "react";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useTelegramConnection } from "@/hooks/useTelegramConnection";

const TelegramConnect = () => {
  const { status } = useSession();
  const {
    telegramInfo,
    isLoading,
    isConnecting,
    error,
    success,
    pollingActive,
    handleConnect,
    handleDisconnect,
    handleRefresh,
  } = useTelegramConnection();

  // No renderizar nada si el usuario no está autenticado
  if (status !== "authenticated") {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Conexión con Telegram
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Conecta tu cuenta para recibir notificaciones instantáneas sobre tus
          anuncios y actividad.
        </p>

        {/* Mensajes de estado */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Estado de conexión */}
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">Verificando estado...</span>
          </div>
        ) : telegramInfo.linked ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Conectado a Telegram</span>
            </div>

            {telegramInfo.username && (
              <p className="text-sm text-muted-foreground">
                Usuario: @{telegramInfo.username}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                Desvincular
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {pollingActive
                    ? "Esperando confirmación..."
                    : "Conectando..."}
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Conectar con Telegram
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Verificar estado
            </Button>
          </div>
        )}

        {/* Indicador de polling activo */}
        {pollingActive && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            <div className="flex items-center gap-2">
              <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
              Verificando conexión cada 3 segundos... (se detendrá
              automáticamente en 2 minutos)
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TelegramConnect;
