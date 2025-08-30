// src/app/profile/page.tsx

import TelegramConnect from '@/components/Profile/TelegramConnect'; // O la nueva ruta si la mueves
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfilePage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
      
      <div className="grid gap-8 md:grid-cols-3">
        
        {/* Columna 1: Información del Usuario (Ejemplo) */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Información de la Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Aquí iría la información del usuario, email, etc. */}
            <p>Información del usuario aquí...</p>
          </CardContent>
        </Card>

        {/* Columna 2: Componentes de Configuración */}
        <div className="md:col-span-2 space-y-8">
          {/* Aquí es donde colocas tu componente */}
          <TelegramConnect />

          {/* Podrías añadir más tarjetas de configuración aquí en el futuro */}
          {/* <ChangePasswordCard /> */}
          {/* <NotificationPreferencesCard /> */}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
