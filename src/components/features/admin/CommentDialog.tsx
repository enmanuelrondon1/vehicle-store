// src/components/features/admin/dialogs/CommentDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, RefreshCw, Plus, User } from "lucide-react";

interface VehicleComment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  type: "admin" | "system";
}

interface CommentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  comments: VehicleComment[];
  isLoading: boolean;
  commentText: string;
  setCommentText: (text: string) => void;
  onAddComment: () => void;
  isDarkMode: boolean;
}

export const CommentDialog = ({
  isOpen,
  onOpenChange,
  comments,
  isLoading,
  commentText,
  setCommentText,
  onAddComment,
  isDarkMode,
}: CommentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`mx-4 max-w-md sm:max-w-2xl ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
            <MessageSquare className="w-5 h-5 text-blue-500" />
            Comentarios del vehículo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto">
            <ScrollArea className="h-full">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className={`p-4 rounded-lg border-l-4 ${comment.type === "admin" ? (isDarkMode ? "bg-blue-900/30 border-blue-500" : "bg-blue-50 border-blue-500") : (isDarkMode ? "bg-slate-700/50 border-slate-500" : "bg-slate-100 border-slate-400")}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className={`w-4 h-4 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`} />
                          <span className={`font-medium text-sm ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{comment.author}</span>
                          <Badge variant={comment.type === "admin" ? "default" : "secondary"} className="text-xs">{comment.type === "admin" ? "Admin" : "Sistema"}</Badge>
                        </div>
                        <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{new Date(comment.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay comentarios aún</p>
                </div>
              )}
            </ScrollArea>
          </div>

          <div className={`border-t pt-4 ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
            <Label htmlFor="comment" className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
              Agregar nuevo comentario
            </Label>
            <Textarea
              id="comment"
              placeholder="Escribe tu comentario aquí..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className={`mt-2 min-h-[80px] ${isDarkMode ? "bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500" : "bg-white border-slate-300"}`}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className={`w-full sm:w-auto ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600" : ""}`}>
            Cancelar
          </Button>
          <Button onClick={onAddComment} disabled={!commentText.trim() || isLoading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Agregar comentario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};