// src/components/features/admin/states/AdminPanelAccessDenied.tsx

import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export const AdminPanelAccessDenied = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <Card className="max-w-md w-full">
      <CardContent className="p-4 md:p-6 text-center">
        <XCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg md:text-xl font-bold mb-2">Acceso Denegado</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          No tienes permisos de administrador para acceder a esta página.
        </p>
      </CardContent>
    </Card>
  </div>
);