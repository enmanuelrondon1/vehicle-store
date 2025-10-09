// src/components/features/admin/states/AdminPanelError.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, RefreshCw } from "lucide-react";

interface AdminPanelErrorProps {
  error: string;
  onRetry: () => void;
}

export const AdminPanelError = ({ error, onRetry }: AdminPanelErrorProps) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <Card className="max-w-md w-full">
      <CardContent className="p-4 md:p-6 text-center">
        <XCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-lg md:text-xl font-bold mb-2">Error</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm md:text-base">{error}</p>
        <Button onClick={onRetry} size="sm" className="w-full sm:w-auto">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      </CardContent>
    </Card>
  </div>
);