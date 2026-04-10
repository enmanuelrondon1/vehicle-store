// src/components/features/profile/UserVehicleList.tsx
"use client";

import React, { useState, useEffect, useCallback, forwardRef } from "react";
import { VehicleDataFrontend } from "@/types/types";
import { useSession } from "next-auth/react";
import {
  Loader, AlertCircle, Inbox, Plus, Grid, List, GitCompare,
  Sparkles, TrendingUp, Filter, Search, Eye, Trash2, DollarSign,
  BarChart3, ArrowUpRight, Clock, X, ChevronDown, MoreVertical, Activity,
} from "lucide-react";
import ProfileVehicleCard from "./ProfileVehicleCard";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { removeFinancingDetails } from "@/lib/actions/vehicle.actions";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ✅ FIX #1: Eliminada importación de framer-motion (~100KB ahorrados)
// Todas las animaciones reemplazadas con clases CSS de Tailwind

const UserVehicleList = forwardRef<HTMLDivElement>((props, ref) => {
  const { data: session, status } = useSession();
  const [vehicles, setVehicles] = useState<VehicleDataFrontend[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleDataFrontend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [isRemovingFinancing, setIsRemovingFinancing] = useState(false);
  const [vehicleToRemoveFinancing, setVehicleToRemoveFinancing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);
  // ✅ FIX #2: Estado para controlar animación de entrada de cards
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger CSS animations después del primer render
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const toggleCompare = (vehicleId: string) => {
    setCompareList((prev) => {
      if (prev.length >= 3 && !prev.includes(vehicleId)) {
        toast.warning("Puedes comparar un máximo de 3 vehículos a la vez.");
        return prev;
      }
      return prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId];
    });
  };

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user/vehicles");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cargar los vehículos");
      }
      const data = await response.json();
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los vehículos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchVehicles();
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status, fetchVehicles]);

  useEffect(() => {
    let filtered = [...vehicles];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.brand.toLowerCase().includes(term) ||
          v.model.toLowerCase().includes(term) ||
          v.year.toString().includes(term)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":   return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "oldest":   return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case "price-low":  return (a.price || 0) - (b.price || 0);
        case "price-high": return (b.price || 0) - (a.price || 0);
        case "views":    return (b.views || 0) - (a.views || 0);
        default: return 0;
      }
    });

    setFilteredVehicles(filtered);
  }, [searchTerm, vehicles, sortBy]);

  const openDeleteDialog = (id: string) => setVehicleToDelete(id);
  const openRemoveFinancingDialog = (id: string) => setVehicleToRemoveFinancing(id);

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/vehicles/${vehicleToDelete}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo eliminar el vehículo.");
      toast.success("Tu anuncio ha sido eliminado correctamente.");
      setVehicles((prev) => prev.filter((v) => v._id !== vehicleToDelete));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ocurrió un error al eliminar el anuncio.");
    } finally {
      setIsDeleting(false);
      setVehicleToDelete(null);
    }
  };

  const handleRemoveFinancing = async () => {
    if (!vehicleToRemoveFinancing) return;
    const userId = session?.user?.id;
    if (!userId) { toast.error("Debes iniciar sesión para realizar esta acción."); return; }

    setIsRemovingFinancing(true);
    try {
      const result = await removeFinancingDetails({ vehicleId: vehicleToRemoveFinancing, userId });
      if (result.success) {
        toast.success("La financiación ha sido eliminada correctamente.");
        setVehicles((prev) =>
          prev.map((v) =>
            v._id === vehicleToRemoveFinancing
              ? { ...v, offersFinancing: false, financingDetails: undefined }
              : v
          )
        );
      } else {
        throw new Error(result.error || "No se pudo eliminar la financiación.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ocurrió un error al eliminar la financiación.");
    } finally {
      setIsRemovingFinancing(false);
      setVehicleToRemoveFinancing(null);
    }
  };

  const getFilteredByTab = useCallback(() => {
    if (activeTab === "all")       return filteredVehicles;
    if (activeTab === "published") return filteredVehicles.filter((v) => v.status === "approved");
    if (activeTab === "pending")   return filteredVehicles.filter((v) => v.status === "pending" || v.status === "under_review");
    if (activeTab === "sold")      return filteredVehicles.filter((v) => v.status === "sold");
    return filteredVehicles;
  }, [activeTab, filteredVehicles]);

  const filteredByTab = getFilteredByTab();

  const totalViews    = vehicles.reduce((sum, v) => sum + (v.views || 0), 0);
  const avgViews      = vehicles.length > 0 ? Math.round(totalViews / vehicles.length) : 0;
  const publishedCount = vehicles.filter((v) => v.status === "approved").length;
  const pendingCount   = vehicles.filter((v) => v.status === "pending" || v.status === "under_review").length;

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 shadow-xl card-glass">
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <Loader className="w-12 h-12 animate-spin text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-heading mb-2">Cargando tus anuncios</h3>
            <p className="text-sm text-muted-foreground">Esto solo tomará un momento...</p>
            <div className="mt-4 flex justify-center space-x-1">
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  className="h-2 w-2 rounded-full bg-primary animate-pulse"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden border-destructive/20 shadow-xl">
        <div className="h-2 bg-gradient-to-r from-destructive to-destructive/80" />
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            {/* ✅ FIX #3: motion.div → CSS animate-in */}
            <div className="animate-in zoom-in duration-500 p-6 rounded-full bg-destructive/10 mb-6">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold font-heading mb-2">Error al cargar</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchVehicles} className="btn-primary">Reintentar</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" ref={ref}>
      {/* ✅ FIX #4: motion.div → animate-in CSS */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="shadow-xl border-0 overflow-hidden card-glass relative">
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />

          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-muted/30 to-transparent pb-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-3">
                {/* ✅ FIX #5: motion.div hover → CSS group hover */}
                <div className="group/icon relative inline-flex items-center justify-center rounded-full bg-primary/10 p-3 transition-transform duration-300 hover:rotate-12 hover:scale-110">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-gradient-primary">
                    Mis Anuncios
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Gestiona y administra tus publicaciones
                  </p>
                </div>
              </div>
              <Button asChild className="gap-2 btn-primary">
                <Link href={siteConfig.paths.publishAd}>
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Publicar</span>
                </Link>
              </Button>
            </div>

            {/* Estadísticas rápidas — CSS hover, sin motion */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Total publicados", value: publishedCount,          icon: Eye,      color: "primary",  bg: "from-primary/5"    },
                { label: "Pendientes",        value: pendingCount,            icon: Clock,    color: "amber-500", bg: "from-amber-500/5"  },
                { label: "Vistas totales",    value: totalViews,              icon: TrendingUp,color: "blue-500", bg: "from-blue-500/5"   },
                { label: "Promedio vistas",   value: avgViews,                icon: BarChart3, color: "green-500",bg: "from-green-500/5"  },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div
                  key={label}
                  className={`bg-gradient-to-br ${bg} to-transparent p-4 rounded-xl border border-border/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-2xl font-bold font-heading">{value.toLocaleString()}</p>
                    </div>
                    <div className={`p-2 rounded-lg bg-${color}/10`}>
                      <Icon className={`w-5 h-5 text-${color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Búsqueda y controles */}
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por marca, modelo o año..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-premium"
                />
                {searchTerm && (
                  <Button
                    variant="ghost" size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="hidden sm:inline">Ordenar</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {[
                      { key: "newest",     label: "Más recientes" },
                      { key: "oldest",     label: "Más antiguos" },
                      { key: "price-low",  label: "Precio: Menor a mayor" },
                      { key: "price-high", label: "Precio: Mayor a menor" },
                      { key: "views",      label: "Más vistos" },
                    ].map(({ key, label }) => (
                      <DropdownMenuItem key={key} onClick={() => setSortBy(key)}>
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline" size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(showFilters && "bg-primary/10 border-primary/30")}
                >
                  <Filter className="w-4 h-4" />
                </Button>

                <div className="flex items-center border rounded-md">
                  <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-r-none">
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="rounded-l-none">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* ✅ FIX #6: AnimatePresence → CSS transition con max-height */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                showFilters ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0"
              )}
            >
              <div className="p-4 bg-muted/20 rounded-xl border border-border/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rango de precio</label>
                    <div className="flex gap-2">
                      <Input placeholder="Mín" className="input-premium" />
                      <Input placeholder="Máx" className="input-premium" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Año</label>
                    <Input placeholder="Año" className="input-premium" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de vehículo</label>
                    <select className="w-full p-2 rounded-lg border border-input bg-background">
                      <option>Todos</option>
                      <option>Sedán</option>
                      <option>SUV</option>
                      <option>Coupé</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="mr-2">Limpiar filtros</Button>
                  <Button size="sm" className="btn-primary">Aplicar filtros</Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/20 border-b border-border/50">
              {[
                { value: "all",       label: "Todos",      count: vehicles.length },
                { value: "published", label: "Publicados", count: vehicles.filter((v) => v.status === "approved").length },
                { value: "pending",   label: "Pendientes", count: vehicles.filter((v) => v.status === "pending" || v.status === "under_review").length },
                { value: "sold",      label: "Vendidos",   count: vehicles.filter((v) => v.status === "sold").length },
              ].map(({ value, label, count }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300"
                >
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label.slice(0, 3)}</span>
                  <Badge variant="secondary" className="text-xs px-2">{count}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </Card>
      </div>

      {/* Grid de vehículos */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <Card className="shadow-xl border-0 overflow-hidden card-glass">
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardContent className="p-6">
            {filteredByTab.length === 0 ? (
              <div className="animate-in zoom-in duration-500 flex flex-col items-center justify-center p-16 text-center">
                <div className="p-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-6 hover:scale-105 transition-transform duration-300">
                  <Inbox className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-heading text-gradient-primary">
                  {activeTab === "all"
                    ? "No tienes anuncios publicados"
                    : `No tienes anuncios ${
                        activeTab === "published" ? "publicados"
                        : activeTab === "pending" ? "pendientes"
                        : "vendidos"
                      }`}
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md">
                  {activeTab === "all"
                    ? "¡Empieza a vender ahora! Publica tu primer vehículo."
                    : "No tienes vehículos en esta categoría actualmente."}
                </p>
                <Button asChild size="lg" className="gap-2 btn-primary">
                  <Link href={siteConfig.paths.publishAd}>
                    <Plus className="w-4 h-4" />
                    Publicar Vehículo
                  </Link>
                </Button>
              </div>
            ) : (
              // ✅ FIX #7: AnimatePresence + motion.div por card → CSS con stagger via animation-delay
              <div className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                  : "space-y-6"
              )}>
                {filteredByTab
                  .filter((v): v is VehicleDataFrontend & { _id: string } => !!v._id)
                  .map((vehicle, index) => (
                    <div
                      key={vehicle._id}
                      className={cn(
                        "transition-all duration-300 hover:-translate-y-1",
                        mounted ? "animate-in fade-in zoom-in-95 duration-300" : "opacity-0"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ProfileVehicleCard
                        vehicle={vehicle}
                        onDelete={openDeleteDialog}
                        onRemoveFinancing={openRemoveFinancingDialog}
                        onToggleCompare={toggleCompare}
                        isInCompareList={compareList.includes(vehicle._id)}
                      />
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!vehicleToDelete} onOpenChange={() => setVehicleToDelete(null)}>
        <AlertDialogContent className="card-glass">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading flex items-center gap-2">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              ¿Eliminar este anuncio?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El anuncio se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVehicle}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              {isDeleting ? "Eliminando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Financing Dialog */}
      <AlertDialog open={!!vehicleToRemoveFinancing} onOpenChange={() => setVehicleToRemoveFinancing(null)}>
        <AlertDialogContent className="card-glass">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <DollarSign className="w-5 h-5 text-amber-500" />
              </div>
              ¿Desactivar la financiación?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la calculadora de financiación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovingFinancing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveFinancing}
              disabled={isRemovingFinancing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemovingFinancing && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              {isRemovingFinancing ? "Desactivando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ✅ FIX #8: Compare Bar — AnimatePresence → CSS transition con visibility */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 transition-all duration-300",
          compareList.length > 0
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
      >
        <Card className="bg-background/95 backdrop-blur-xl shadow-2xl border-primary/20 card-glass overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex-shrink-0">
              <Badge className="text-lg h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                {compareList.length}
              </Badge>
            </div>
            <div className="flex-grow">
              <p className="font-semibold font-heading flex items-center gap-2">
                Comparación activa
                <Activity className="w-4 h-4 text-primary animate-pulse" />
              </p>
              <p className="text-sm text-muted-foreground">
                {compareList.length < 2
                  ? "Selecciona al menos 2 vehículos"
                  : `${compareList.length} vehículos listos`}
              </p>
            </div>
            <Button
              asChild
              disabled={compareList.length < 2}
              className="gap-2 btn-primary"
            >
              <Link href={`/compare?${compareList.map((id) => `vehicles=${id}`).join("&")}`}>
                <GitCompare className="w-4 h-4" />
                Comparar
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

UserVehicleList.displayName = "UserVehicleList";
export default UserVehicleList;