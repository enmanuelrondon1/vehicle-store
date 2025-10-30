// src/components/features/profile/UserProfileCard.tsx
"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Shield, Edit, MapPin, Calendar, Phone, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ✅ Interface corregida - acepta los tipos que vienen de session.user
interface UserProfile {
  id?: string;
  _id?: string;
  role?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phone?: string | null;
  location?: string | null;
  createdAt?: string | Date | null; // ✅ Ahora acepta null también
  updatedAt?: string | Date | null; // ✅ Ahora acepta null también
}

interface UserProfileCardProps {
  user: UserProfile;
}

const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [phone, setPhone] = useState(user.phone || "");
  const [location, setLocation] = useState(user.location || "");

  const userRole = user.role === "admin" ? "Administrador" : "Usuario";
  const roleVariant = user.role === "admin" ? "default" : "secondary";

  const handleSaveChanges = async () => {
    startTransition(async () => {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, location }),
      });

      if (response.ok) {
        toast.success("¡Perfil actualizado con éxito!");
        document.getElementById('close-dialog')?.click();
        router.refresh();
      } else {
        const errorData = await response.json();
        toast.error("Error al actualizar el perfil.", {
          description: errorData.error || "Por favor, inténtalo de nuevo.",
        });
      }
    });
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 bg-card border-border/50">
        <CardHeader className="p-0 relative text-center">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/10 to-accent/10" />
          <div className="relative flex flex-col items-center justify-center pt-12 pb-6 px-6">
            <div className="relative">
              <Image
                src={
                  user.image ||
                  `https://ui-avatars.com/api/?name=${
                    user.name || user.email
                  }&background=random`
                }
                alt="Foto de perfil"
                width={100}
                height={100}
                className="relative rounded-full border-4 border-background shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 border-2 border-background">
                    <Shield className="w-4 h-4 text-primary-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Cuenta Verificada</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <CardTitle className="text-2xl font-heading mt-4">{user.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={roleVariant}
                className="flex items-center gap-1.5 backdrop-blur-sm"
              >
                <Shield className="w-3.5 h-3.5" />
                {userRole}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4 flex-grow">
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{user.phone || "No especificado"}</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{user.location || "No especificado"}</span>
            </div>
            {user.createdAt && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  Miembro desde{" "}
                  {new Date(user.createdAt).toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-2 bg-muted/30 border-t border-border/50">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-10 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                <span>Editar Perfil</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Editar Perfil</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="col-span-3"
                    placeholder="+52 55 1234 5678"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Ubicación
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="col-span-3"
                    placeholder="Ciudad, País"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button id="close-dialog" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleSaveChanges} disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default UserProfileCard;