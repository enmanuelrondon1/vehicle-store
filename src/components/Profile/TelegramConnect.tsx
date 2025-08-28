// components/Profile/TelegramConnect.tsx
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Extender el tipo de usuario para incluir propiedades de Telegram
interface UserWithTelegram {
  telegramUserId?: string;
  telegramUsername?: string;
}

const TelegramConnect = () => {
  const { data: session, status } = useSession();
  const [telegramInfo, setTelegramInfo] = useState({ linked: false, username: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Simulación: En una app real, obtendrías esta info del 'session' o de una API
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Aquí deberías tener el estado de vinculación del usuario.
      // Por ejemplo, si tu objeto `session.user` incluye `telegramUserId`.
      const userWithTelegram = session.user as UserWithTelegram;
      const isLinked = !!userWithTelegram.telegramUserId;
      const username = userWithTelegram.telegramUsername || '';
      setTelegramInfo({ linked: isLinked, username });
    }
    setIsLoading(false);
  }, [session, status]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/telegram/link');
      const data = await response.json();

      if (data.success && data.link) {
        // Abrir el enlace de Telegram en una nueva pestaña
        window.open(data.link, '_blank');
        alert('Se ha abierto Telegram para que confirmes la vinculación. Refresca esta página en un momento para ver el estado actualizado.');
      } else {
        throw new Error(data.error || 'No se pudo generar el enlace.');
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Error desconocido');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (status !== 'authenticated') {
    return null; // No mostrar nada si el usuario no está logueado
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold text-lg">Conexión con Telegram</h3>
      <p className="text-sm text-gray-600 mb-4">
        Conecta tu cuenta para recibir notificaciones sobre tus anuncios.
      </p>
      {isLoading ? (
        <p>Cargando...</p>
      ) : telegramInfo.linked ? (
        <div className="text-green-600">
          <p>✅ Conectado a Telegram.</p>
          {/* Si tienes el username, lo muestras */}
          {telegramInfo.username && <p>Usuario: @{telegramInfo.username}</p>}
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {isLoading ? 'Generando enlace...' : 'Conectar con Telegram'}
        </button>
      )}
    </div>
  );
};

export default TelegramConnect;