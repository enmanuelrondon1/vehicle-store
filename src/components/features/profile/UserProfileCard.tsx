// src/components/features/profile/UserProfileCard.tsx
"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail, Shield, Edit, MapPin, Calendar, Phone, Loader2,
  Award, CheckCircle, Star, Zap, TrendingUp, Users,
} from "lucide-react";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserProfile {
  id?: string;
  _id?: string;
  role?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  phone?: string | null;
  location?: string | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

interface UserProfileCardProps {
  user: UserProfile;
}

// ✅ FIX #1: Generar iniciales para avatar local — sin llamada externa a ui-avatars.com
// Esto elimina una request externa que bloqueaba el LCP
function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return "U";
}

function AvatarFallback({ name, email }: { name?: string | null; email?: string | null }) {
  const initials = getInitials(name, email);
  return (
    <div className="w-[120px] h-[120px] rounded-full border-4 border-background shadow-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
      <span className="text-3xl font-bold text-white">{initials}</span>
    </div>
  );
}

const UserProfileCard = ({ user }: UserProfileCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [phone, setPhone] = useState(user.phone || "");
  const [location, setLocation] = useState(user.location || "");
  // ✅ FIX #2: Estado para manejar error de imagen — fallback a initials
  const [imgError, setImgError] = useState(false);

  const userRole = user.role === "admin" ? "Administrador" : "Usuario";
  const roleVariant = user.role === "admin" ? "default" : "secondary";

  const capitalizedName = user.name
    ? user.name.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "";

  const calculateTrustLevel = () => {
    if (!user.createdAt) return 1;
    const days = Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / 86400000
    );
    if (user.role === "admin") return 5;
    if (days > 365) return 4;
    if (days > 180) return 3;
    if (days > 30) return 2;
    return 1;
  };

  const trustLevel = calculateTrustLevel();
  const trustLevelLabels = ["Novato", "Confiable", "Experimentado", "Experto", "Premium"];

  const handleSaveChanges = async () => {
    startTransition(async () => {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, location }),
      });

      if (response.ok) {
        toast.success("¡Perfil actualizado con éxito!");
        document.getElementById("close-dialog")?.click();
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
      {/* ✅ FIX #3: Reemplazamos motion.div por CSS transitions — elimina framer-motion del bundle inicial */}
      <div className="transition-transform duration-300 hover:-translate-y-1">
        <Card className="group flex flex-col h-full overflow-hidden transition-all duration-500 hover:shadow-2xl card-glass border-border/50 relative">
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50" />

          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <CardHeader className="p-0 relative text-center">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />

            <div className="relative flex flex-col items-center justify-center pt-12 pb-6 px-6">
              <div className="relative group/avatar">
                {/* ✅ FIX #4: Imagen local con fallback de iniciales — sin ui-avatars.com */}
                {user.image && !imgError ? (
                  <div className="relative w-[120px] h-[120px]">
                    <Image
                      src={user.image}
                      alt="Foto de perfil"
                      width={120}
                      height={120}
                      // ✅ FIX #5: priority para imagen LCP — carga inmediata
                      priority
                      className="rounded-full border-4 border-background shadow-lg object-cover transition-transform duration-300 group-hover/avatar:scale-105"
                      onError={() => setImgError(true)}
                    />
                  </div>
                ) : (
                  <AvatarFallback name={user.name} email={user.email} />
                )}

                {/* Badge verificación — CSS puro */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute bottom-0 right-0 bg-gradient-to-r from-primary to-accent rounded-full p-2 border-2 border-background shadow-lg transition-transform duration-300 hover:scale-110">
                      <Shield className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Cuenta Verificada</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <CardTitle className="text-2xl md:text-3xl font-heading mt-4 text-gradient-primary">
                {capitalizedName}
              </CardTitle>

              <div className="flex items-center gap-2 mt-2">
                <Badge variant={roleVariant} className="flex items-center gap-1.5 px-3 py-1 badge-premium">
                  <Shield className="w-4 h-4" />
                  {userRole}
                </Badge>
                {user.role === "admin" && (
                  <Badge className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 border-amber-500/30">
                    <Award className="w-4 h-4" />
                    Premium
                  </Badge>
                )}
              </div>

              {/* Nivel de confianza — CSS stagger con animation-delay */}
              <div className="mt-4 w-full max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Nivel de confianza</span>
                  <span className="text-xs font-medium">{trustLevelLabels[trustLevel - 1]}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 transition-all duration-300 ${
                        i < trustLevel ? "fill-primary text-primary" : "text-muted-foreground/30"
                      }`}
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4 flex-grow">
            <div className="space-y-3">
              {/* ✅ FIX #6: motion.div → CSS hover con group — sin JS overhead */}
              {[
                { icon: Mail,     value: user.email,                    fallback: null },
                { icon: Phone,    value: user.phone,                    fallback: "No especificado" },
                { icon: MapPin,   value: user.location,                 fallback: "No especificado" },
              ].map(({ icon: Icon, value, fallback }) => (
                <div
                  key={Icon.displayName}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 group/item transition-transform duration-200 hover:translate-x-1"
                >
                  <div className="p-1.5 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground truncate">
                    {value || fallback}
                  </span>
                </div>
              ))}

              {user.createdAt && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 group/item transition-transform duration-200 hover:translate-x-1">
                  <div className="p-1.5 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">
                    Miembro desde{" "}
                    {new Date(user.createdAt).toLocaleDateString("es-ES", {
                      month: "long", year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* ✅ FIX #7: Eliminados datos hardcodeados falsos (98%, 24 ventas, 5★) */}
            {/* Solo mostramos datos reales del usuario */}
          </CardContent>

          <CardFooter className="p-4 bg-muted/20 border-t border-border/30">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-11 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2 group/btn"
                >
                  <Edit className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                  <span>Editar Perfil</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] card-glass">
                <DialogHeader>
                  <DialogTitle className="text-xl font-heading text-gradient-primary flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Editar Perfil
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right font-medium">Teléfono</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="col-span-3 input-premium"
                      placeholder="+58 424 123 4567"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right font-medium">Ubicación</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="col-span-3 input-premium"
                      placeholder="Ciudad, País"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button id="close-dialog" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button onClick={handleSaveChanges} disabled={isPending} className="btn-primary">
                    {isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</>
                    ) : (
                      <><CheckCircle className="mr-2 h-4 w-4" />Guardar Cambios</>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default UserProfileCard;