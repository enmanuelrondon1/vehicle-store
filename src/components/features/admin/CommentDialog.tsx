// src/components/features/admin/CommentDialog.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  RefreshCw, 
  Plus, 
  User, 
  Calendar,
  AlertCircle
} from "lucide-react";
import type { VehicleComment } from "@/types/types";
import { useState } from "react";
import { InputField } from "@/components/shared/forms/InputField";

interface CommentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  comments: VehicleComment[];
  isLoading: boolean;
  onAddComment: (comment: string) => void;
}

export const CommentDialog = ({
  isOpen,
  onOpenChange,
  comments,
  isLoading,
  onAddComment,
}: CommentDialogProps) => {
  const [commentText, setCommentText] = useState("");

  // ========== Clase Mejorada de Inputs ==========
  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground " +
    "placeholder:text-muted-foreground/60 " +
    "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 " +
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30 " +
    "transition-all duration-200 ease-out hover:border-border/80";

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-heading">
              Comentarios del Vehículo
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lista de comentarios */}
          <Card className="shadow-sm border-border">
            <CardContent className="p-0">
              <ScrollArea className="h-64">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                      <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
                      <p className="text-sm text-muted-foreground">Cargando comentarios...</p>
                    </div>
                  </div>
                ) : comments.length > 0 ? (
                  <div className="p-4 space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment._id}
                        className={`p-4 rounded-xl border-l-4 ${
                          comment.type === "rejection"
                            ? "bg-destructive/5 border-destructive"
                            : comment.username === "Admin"
                              ? "bg-primary/5 border-primary"
                              : "bg-muted/30 border-border"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-background border">
                              <User className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <div>
                              <span className="font-medium text-sm text-foreground">
                                {comment.username}
                              </span>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString(
                                    "es-ES",
                                    { day: "numeric", month: "short", year: "numeric" }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              comment.type === "rejection"
                                ? "destructive"
                                : comment.username === "Admin"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {comment.type === "rejection"
                              ? "Rechazo"
                              : "Comentario"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground pl-9">
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-3 rounded-full bg-muted/50 mb-4">
                      <MessageSquare className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                      No hay comentarios
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Este vehículo aún no tiene comentarios. Sé el primero en agregar uno.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Formulario para agregar comentario */}
          <Card className="shadow-sm border-border">
            <CardContent className="p-4">
              <InputField
                label="Agregar nuevo comentario"
                icon={<MessageSquare className="w-4 h-4 text-primary" />}
                tooltip="Agrega un comentario sobre este vehículo para informar al vendedor"
                counter={{ current: commentText.length, max: 500 }}
              >
                <Textarea
                  id="comment"
                  placeholder="Escribe tu comentario aquí..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className={`${inputClass} min-h-[100px] resize-y`}
                  maxLength={500}
                />
              </InputField>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddComment}
            disabled={!commentText.trim() || isLoading}
            className="w-full sm:w-auto"
          >
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