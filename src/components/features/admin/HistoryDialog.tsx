// src/components/features/admin/HistoryDialog.tsx
// VERSIÓN CON DISEÑO UNIFICADO

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  History, 
  RefreshCw, 
  Plus, 
  MessageSquare, 
  FileText, 
  Calendar, 
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import type { VehicleHistoryEntry } from "@/types/types";

interface HistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  history: VehicleHistoryEntry[];
  isLoading: boolean;
  vehicleId?: string;
}

export const HistoryDialog = ({ isOpen, onOpenChange, history, isLoading, vehicleId }: HistoryDialogProps) => {
  const getActionIcon = (action: string) => {
    if (action.includes("aprobado")) return <CheckCircle className="w-4 h-4" />;
    if (action.includes("rechazado")) return <XCircle className="w-4 h-4" />;
    if (action.includes("Comentario")) return <MessageSquare className="w-4 h-4" />;
    if (action.includes("creado")) return <Plus className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes("aprobado")) return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
    if (action.includes("rechazado")) return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    if (action.includes("Comentario")) return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
    if (action.includes("creado")) return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <History className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-heading">
              Historial del Vehículo
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="shadow-sm border-border">
            <CardContent className="p-0">
              <ScrollArea className="h-96">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                      <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground">Cargando historial...</p>
                    </div>
                  </div>
                ) : history.length > 0 ? (
                  <div className="p-6">
                    <div className="space-y-6">
                      {history.map((entry, index) => (
                        <div key={index} className="relative">
                          {index < history.length - 1 && (
                            <div className="absolute left-5 top-12 w-0.5 h-full bg-border"></div>
                          )}
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(entry.action)}`}>
                                {getActionIcon(entry.action)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 pb-6">
                              <div className="flex items-start justify-between mb-2 gap-2">
                                <h4 className="font-semibold text-sm text-foreground">{entry.action}</h4>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span className="whitespace-nowrap">
                                    {new Date(entry.timestamp).toLocaleString("es-ES", { 
                                      day: "numeric", 
                                      month: "short", 
                                      hour: "2-digit", 
                                      minute: "2-digit" 
                                    })}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm mb-3 text-muted-foreground">{entry.details}</p>
                              
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  <User className="w-3 h-3 mr-1" />
                                  {entry.author}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-3 rounded-full bg-muted/50 mb-4">
                      <History className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                      No hay historial disponible
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Este vehículo aún no tiene registros de cambios en su estado.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};