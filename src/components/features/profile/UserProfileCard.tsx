// src/components/features/profile/UserProfileCard.tsx
"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Shield,
  Edit,
  MapPin,
  Calendar,
  Phone,
  Loader2,
  Award,
  CheckCircle,
  Star,
  Zap,
  TrendingUp,
  Users,
  Crown,
  Diamond,
} from "lucide-react";
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
import { motion } from "framer-motion";

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

  const capitalizedName = user.name
    ? user.name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

  // Calcular nivel de confianza basado en la antigüedad y rol
  const calculateTrustLevel = () => {
    if (!user.createdAt) return 1;
    
    const daysSinceCreation = Math.floor(
      (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (user.role === "admin") return 5;
    if (daysSinceCreation > 365) return 4;
    if (daysSinceCreation > 180) return 3;
    if (daysSinceCreation > 30) return 2;
    return 1;
  };

  const trustLevel = calculateTrustLevel();
  const trustLevelLabels = ["Novato", "Confiable", "Experimentado", "Experto", "Premium"];
  const trustLevelColors = ["bg-gray-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-gradient-to-r from-amber-500 to-orange-500"];

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5 }}
      >
        <Card className="group flex flex-col h-full overflow-hidden transition-all duration-500 hover:shadow-2xl card-glass border-border/50 relative">
          {/* Efectos de brillo superior */}
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-primary"></div>
          <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50"></div>
          
          {/* Efecto de brillo en hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <CardHeader className="p-0 relative text-center">
            {/* Fondo degradido premium */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent"></div>
            
            {/* Patrón de puntos premium */}
            <div className="absolute top-0 left-0 w-full h-32 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle, var(--primary) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            <div className="relative flex flex-col items-center justify-center pt-12 pb-6 px-6">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Image
                    src={
                      user.image ||
                      `https://ui-avatars.com/api/?name=${
                        user.name || user.email
                      }&background=random&uppercase=true`
                    }
                    alt="Foto de perfil"
                    width={120}
                    height={120}
                    className="relative rounded-full border-4 border-background shadow-lg"
                  />
                  
                  {/* Efecto de brillo alrededor de la foto */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-primary/20"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  ></motion.div>
                </motion.div>

                {/* Badge de verificación premium mejorado */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute bottom-0 right-0 bg-gradient-to-r from-primary to-accent rounded-full p-2 border-2 border-background shadow-lg">
                        <Shield className="w-5 h-5 text-primary-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Cuenta Verificada</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              </div>

              <CardTitle className="text-2xl md:text-3xl font-heading mt-4 text-gradient-primary">
                {capitalizedName}
              </CardTitle>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={roleVariant}
                  className="flex items-center gap-1.5 px-3 py-1 badge-premium"
                >
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
              
              {/* Nivel de confianza */}
              <div className="mt-4 w-full max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Nivel de confianza</span>
                  <span className="text-xs font-medium">{trustLevelLabels[trustLevel - 1]}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 * i }}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          i < trustLevel
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4 flex-grow">
            <div className="space-y-3">
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 group"
              >
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-foreground truncate">
                  {user.email}
                </span>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 group"
              >
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-foreground">
                  {user.phone || "No especificado"}
                </span>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 group"
              >
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-foreground">
                  {user.location || "No especificado"}
                </span>
              </motion.div>

              {user.createdAt && (
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30 group"
                >
                  <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">
                    Miembro desde{" "}
                    {new Date(user.createdAt).toLocaleDateString("es-ES", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </motion.div>
              )}
            </div>
            
            {/* Estadísticas adicionales */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <div className="grid grid-cols-3 gap-2 text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-2 rounded-lg bg-primary/5"
                >
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 " />
                  </div>
                  <div className="text-lg font-bold ">98%</div>
                  <div className="text-xs text-muted-foreground">Respuesta</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-2 rounded-lg bg-accent/5"
                >
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-lg font-bold text-accent">24</div>
                  <div className="text-xs text-muted-foreground">Ventas</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-2 rounded-lg bg-success/5"
                >
                  <div className="flex items-center justify-center mb-1">
                    <Zap className="w-4 h-4 text-success" />
                  </div>
                  <div className="text-lg font-bold text-success">5★</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </motion.div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 bg-muted/20 border-t border-border/30">
            <Dialog>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-11 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Editar Perfil</span>
                  </Button>
                </motion.div>
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
                    <Label htmlFor="phone" className="text-right font-medium">
                      Teléfono
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="col-span-3 input-premium"
                      placeholder="+52 55 1234 5678"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="location"
                      className="text-right font-medium"
                    >
                      Ubicación
                    </Label>
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
                    <Button id="close-dialog" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleSaveChanges}
                    disabled={isPending}
                    className="btn-primary"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};

export default UserProfileCard;