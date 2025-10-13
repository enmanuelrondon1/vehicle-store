"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, RefreshCw, Plus, User, X } from "lucide-react";
import type { VehicleComment } from "@/types/types";
import { useState } from "react";

interface CommentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  comments: VehicleComment[];
  isLoading: boolean;
  onAddComment: (comment: string) => void;
  isDarkMode: boolean;
}

export const CommentDialog = ({
  isOpen,
  onOpenChange,
  comments,
  isLoading,
  onAddComment,
  isDarkMode,
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
      <DialogContent
        className={`w-full max-w-sm mx-auto my-auto max-h-[80vh] flex flex-col gap-0 p-0 border-2 ${
          isDarkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <DialogTitle
            className={`flex items-center gap-2 text-base font-semibold ${
              isDarkMode ? "text-slate-100" : "text-slate-900"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-500" />
            Comentarios del vehículo
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className={`p-1 hover:bg-opacity-20 rounded transition-colors ${
              isDarkMode
                ? "hover:bg-slate-500 text-slate-400"
                : "hover:bg-slate-200 text-slate-600"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comentarios - Área scrolleable */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full w-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-24 p-4">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
              </div>
            ) : comments.length > 0 ? (
              <div className="p-3 space-y-2">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className={`p-2.5 rounded-lg border-l-4 text-sm ${
                      comment.username === "Admin"
                        ? isDarkMode
                          ? "bg-blue-900/30 border-blue-500"
                          : "bg-blue-50 border-blue-500"
                        : isDarkMode
                          ? "bg-slate-700/40 border-slate-600"
                          : "bg-slate-100 border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <User className="w-3.5 h-3.5 flex-shrink-0 text-slate-500" />
                        <span
                          className={`font-medium text-xs ${
                            isDarkMode
                              ? "text-slate-200"
                              : "text-slate-800"
                          }`}
                        >
                          {comment.username}
                        </span>
                        {comment.username === "Admin" && (
                          <Badge
                            className="text-xs px-1.5 py-0 h-5"
                            variant="default"
                          >
                            Admin
                          </Badge>
                        )}
                      </div>
                      <span
                        className={`text-xs flex-shrink-0 whitespace-nowrap ${
                          isDarkMode
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        {new Date(comment.createdAt).toLocaleDateString(
                          "es-ES",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </span>
                    </div>
                    <p
                      className={`text-xs break-words leading-relaxed ${
                        isDarkMode
                          ? "text-slate-300"
                          : "text-slate-700"
                      }`}
                    >
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`flex flex-col items-center justify-center h-24 p-4 text-center ${
                  isDarkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                <MessageSquare className="w-8 h-8 mx-auto mb-1 opacity-50" />
                <p className="text-xs">No hay comentarios aún</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Formulario */}
        <div
          className={`p-3 border-t ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <Label
            htmlFor="comment"
            className={`text-xs font-medium block mb-2 ${
              isDarkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Agregar comentario
          </Label>
          <Textarea
            id="comment"
            placeholder="Escribe aquí..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={isLoading}
            className={`min-h-[70px] text-sm resize-none ${
              isDarkMode
                ? "bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500"
                : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
            }`}
          />
        </div>

        {/* Footer */}
        <DialogFooter className="flex-row gap-2 p-3 border-t" style={{
          borderColor: isDarkMode ? "#475569" : "#e2e8f0"
        }}>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setCommentText("");
            }}
            className={`flex-1 text-sm h-8 ${
              isDarkMode
                ? "bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddComment}
            disabled={!commentText.trim() || isLoading}
            className="flex-1 text-sm h-8 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 mr-1" />
                Comentar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};