// src/components/features/admin/dialogs/HistoryDialog.tsx
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
import { History, RefreshCw, Plus, MessageSquare, FileText, Calendar, User } from "lucide-react";
import type { VehicleHistoryEntry } from "@/types/types"; // AÑADIDO: Importar el tipo global

/* ELIMINADO: La interfaz local que causa el conflicto
interface VehicleHistoryEntry {
  id: string;
  action: string;
  details: string;
  author: string;
  timestamp: string;
  oldValue?: string;
  newValue?: string;
}
*/

interface HistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  history: VehicleHistoryEntry[];
  isLoading: boolean;
  isDarkMode: boolean;
}

export const HistoryDialog = ({ isOpen, onOpenChange, history, isLoading, isDarkMode }: HistoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`mx-4 max-w-md sm:max-w-3xl ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
            <History className="w-5 h-5 text-purple-500" />
            Historial del vehículo
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto">
          <ScrollArea className="h-full pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-purple-500" />
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-6">
                {history.map((entry, index) => (
                  <div key={entry.id} className="relative">
                    {index < history.length - 1 && (
                      <div className={`absolute left-4 top-10 w-0.5 h-full ${isDarkMode ? "bg-slate-600" : "bg-slate-300"}`}></div>
                    )}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${entry.action.includes("Estado") ? "bg-blue-100 dark:bg-blue-900/50" : entry.action.includes("creado") ? "bg-green-100 dark:bg-green-900/50" : entry.action.includes("Comentario") ? "bg-purple-100 dark:bg-purple-900/50" : "bg-slate-100 dark:bg-slate-700"}`}>
                          {entry.action.includes("Estado") ? (
                            <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          ) : entry.action.includes("creado") ? (
                            <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : entry.action.includes("Comentario") ? (
                            <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          ) : (
                            <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pb-6">
                        <div className="flex items-start justify-between mb-1 gap-2">
                          <h4 className={`font-semibold text-sm ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>{entry.action}</h4>
                          <div className={`flex items-center gap-1.5 text-xs flex-shrink-0 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="whitespace-nowrap">{new Date(entry.timestamp).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        </div>
                        <p className={`text-sm mb-2 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{entry.details}</p>
                        
                        <div className={`flex items-center gap-1.5 text-xs ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                          <User className="w-3.5 h-3.5" />
                          <span>por {entry.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay historial disponible</p>
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={`w-full sm:w-auto ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600" : ""}`}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};