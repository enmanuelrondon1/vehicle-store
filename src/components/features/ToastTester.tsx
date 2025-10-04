"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ToastTester() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border dark:border-gray-700 flex flex-col gap-2">
        <h3 className="text-center font-semibold text-gray-900 dark:text-white">
          Probar Toasts
        </h3>
        <Button
          variant="outline"
          onClick={() => toast("Este es un toast normal.")}
        >
          Normal
        </Button>
        <Button
          className="bg-green-500 hover:bg-green-600 text-white"
          onClick={() =>
            toast.success("¡Éxito!", {
              description: "La operación se completó correctamente.",
            })
          }
        >
          Éxito
        </Button>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white"
          onClick={() =>
            toast.error("¡Error!", {
              description: "Algo salió mal. Inténtalo de nuevo.",
            })
          }
        >
          Error
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() =>
            toast.info("Información", {
              description: "Esta es una notificación informativa.",
            })
          }
        >
          Info
        </Button>
      </div>
    </div>
  );
}