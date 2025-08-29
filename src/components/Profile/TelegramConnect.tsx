// components/Profile/TelegramConnect.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface UserWithTelegram {
  telegramUserId?: string;
  telegramUsername?: string;
}

interface TelegramInfo {
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

const TelegramConnect = () => {
  const { data: session, status, update } = useSession();
  const [telegramInfo, setTelegramInfo] = useState<TelegramInfo>({ 
    linked: false, 
    username: '' 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pollingActive, setPollingActive] = useState(false);

  // Función para obtener el estado actual de Telegram
  const fetchTelegramStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/user/telegram-status');
      const data: TelegramStatusResponse = await response.json();
      
      if (data.success && data.data) {
        setTelegramInfo({
          linked: !!data.data.telegramUserId,
          username: data.data.telegramUsername || '',
          userId: data.data.telegramUserId
        });
        
        // Actualizar la sesión si hay cambios
        if (data.data.telegramUserId) {
          await update();
        }
      }
    } catch (error) {
      console.error('Error fetching Telegram status:', error);
    }
  }, [update]);

  // Polling para verificar conexión después de abrir Telegram
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (pollingActive) {
      interval = setInterval(async () => {
        await fetchTelegramStatus();
        
        // Si se conectó exitosamente, detener polling
        if (telegramInfo.linked) {
          setPollingActive(false);
          setSuccess('¡Conexión con Telegram establecida exitosamente!');
          setIsConnecting(false);
        }
      }, 3000); // Verificar cada 3 segundos
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pollingActive, telegramInfo.linked, fetchTelegramStatus]);

  // Detener polling después de 2 minutos
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (pollingActive) {
      timeout = setTimeout(() => {
        setPollingActive(false);
        setIsConnecting(false);
        if (!telegramInfo.linked) {
          setError('Tiempo agotado. Si confirmaste la conexión en Telegram, por favor refresca la página.');
        }
      }, 120000); // 2 minutos
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [pollingActive, telegramInfo.linked]);

  // Cargar estado inicial
  useEffect(() => {
    const loadInitialState = async () => {
      setIsLoading(true);
      
      if (status === 'authenticated' && session?.user) {
        // Primero intentar obtener de la sesión
        const userWithTelegram = session.user as UserWithTelegram;
        const sessionLinked = !!userWithTelegram.telegramUserId;
        
        if (sessionLinked) {
          setTelegramInfo({
            linked: true,
            username: userWithTelegram.telegramUsername || '',
            userId: userWithTelegram.telegramUserId
          });
        } else {
          // Si no está en la sesión, consultar la API
          await fetchTelegramStatus();
        }
      }
      
      setIsLoading(false);
    };

    loadInitialState();
  }, [session, status, fetchTelegramStatus]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleConnect = async () => {
    clearMessages();
    setIsConnecting(true);
    
    try {
      const response = await fetch('/api/telegram/link');
      const data: ApiResponse = await response.json();

      if (data.success && data.link) {
        // Abrir el enlace de Telegram
        window.open(data.link, '_blank');
        
        // Iniciar polling para verificar conexión
        setPollingActive(true);
        
        setSuccess('Se ha abierto Telegram. Confirma la vinculación en el bot para completar el proceso.');
      } else {
        throw new Error(data.error || 'No se pudo generar el enlace de Telegram.');
      }
    } catch (error) {
      console.error('Error connecting to Telegram:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al conectar con Telegram');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    clearMessages();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/telegram/disconnect', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        setTelegramInfo({ linked: false, username: '' });
        setSuccess('Conexión con Telegram desvinculada exitosamente.');
        await update(); // Actualizar sesión
      } else {
        throw new Error(data.error || 'No se pudo desvincular la cuenta.');
      }
    } catch (error) {
      console.error('Error disconnecting from Telegram:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido al desvincular');
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

  if (status !== 'authenticated') {
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
          Conecta tu cuenta para recibir notificaciones instantáneas sobre tus anuncios y actividad.
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
                  {pollingActive ? 'Esperando confirmación...' : 'Conectando...'}
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
              Verificando conexión cada 3 segundos... (se detendrá automáticamente en 2 minutos)
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TelegramConnect;