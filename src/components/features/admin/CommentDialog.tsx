// src/components/features/admin/CommentDialog.tsx
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
import type { VehicleComment } from "@/types/types";
import { useState } from "react";
import { TextareaField } from "@/components/shared/forms/TextareaField";

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

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="mx-4 max-w-md sm:max-w-2xl bg-card border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-card-foreground">
            <MessageSquare className="w-5 h-5 text-primary" />
            Comentarios del vehículo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto">
            <ScrollArea className="h-full">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div
                      key={comment._id}
                      className={`p-4 rounded-lg border-l-4 ${
                        comment.type === "rejection"
                          ? "bg-destructive/10 border-destructive"
                          : comment.username === "Admin"
                            ? "bg-primary/10 border-primary"
                            : "bg-muted border-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-sm text-card-foreground">
                            {comment.username}
                          </span>
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
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString(
                            "es-ES",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay comentarios aún</p>
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="border-t pt-4 border-border">
            <TextareaField label="Agregar nuevo comentario">
              <Textarea
                id="comment"
                placeholder="Escribe tu comentario aquí..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mt-2 min-h-[80px] bg-background border text-foreground placeholder:text-muted-foreground"
              />
            </TextareaField>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
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