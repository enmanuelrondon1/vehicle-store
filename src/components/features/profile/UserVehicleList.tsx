// src/components/features/profile/UserVehicleList.tsx
"use client";

import React, { useState, useEffect, useCallback, forwardRef } from "react";
import { VehicleDataFrontend } from "@/types/types";
import { useSession } from "next-auth/react";
import {
  Loader,
  AlertCircle,
  Inbox,
  Plus,
  Grid,
  List,
  GitCompare,
  Sparkles,
  TrendingUp,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Shield,
  CheckCircle,
  BarChart3,
  Zap,
  ArrowUpRight,
  Star,
  Clock,
  X,
  ChevronDown,
  MoreVertical,
  Activity,
} from "lucide-react";
import ProfileVehicleCard from "./ProfileVehicleCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      setError(
        err instanceof Error ? err.message : "Error al cargar los vehículos"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchVehicles();
    } else if (status === "unauthenticated" || status === "loading") {
      setIsLoading(false);
    }
  }, [status, fetchVehicles]);

  useEffect(() => {
    let filtered = vehicles;
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.year.toString().includes(searchTerm)
      );
    }
    
    // Ordenar según la selección
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "views") {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    
    setFilteredVehicles(filtered);
  }, [searchTerm, vehicles, sortBy]);

  const openDeleteDialog = (id: string) => {
    setVehicleToDelete(id);
  };

  const openRemoveFinancingDialog = (id: string) => {
    setVehicleToRemoveFinancing(id);
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/vehicles/${vehicleToDelete}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo eliminar el vehículo.");
      }

      toast.success("Tu anuncio ha sido eliminado correctamente.");
      setVehicles((prev) => prev.filter((v) => v._id !== vehicleToDelete));
      setFilteredVehicles((prev) => prev.filter((v) => v._id !== vehicleToDelete));
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al eliminar el anuncio."
      );
    } finally {
      setIsDeleting(false);
      setVehicleToDelete(null);
    }
  };

  const handleRemoveFinancing = async () => {
    if (!vehicleToRemoveFinancing) return;

    const userId = session?.user?.id;
    if (!userId) {
      toast.error("Debes iniciar sesión para realizar esta acción.");
      return;
    }

    setIsRemovingFinancing(true);
    try {
      const result = await removeFinancingDetails({
        vehicleId: vehicleToRemoveFinancing,
        userId: userId,
      });

      if (result.success) {
        toast.success("La financiación ha sido eliminada correctamente.");
        setVehicles((prev) =>
          prev.map((v) =>
            v._id === vehicleToRemoveFinancing
              ? { ...v, offersFinancing: false, financingDetails: undefined }
              : v
          )
        );
        setFilteredVehicles((prev) =>
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
      toast.error(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al eliminar la financiación."
      );
    } finally {
      setIsRemovingFinancing(false);
      setVehicleToRemoveFinancing(null);
    }
  };

  const getFilteredByTab = useCallback(() => {
    let filtered = filteredVehicles;
    
    if (activeTab === "all") return filtered;
    if (activeTab === "published") return filtered.filter((v) => v.status === "approved");
    if (activeTab === "pending") return filtered.filter((v) => v.status === "pending" || v.status === "under_review");
    if (activeTab === "sold") return filtered.filter((v) => v.status === "sold");
    
    return filtered;
  }, [activeTab, filteredVehicles]);

  const filteredByTab = getFilteredByTab();

  // Calcular estadísticas
  const totalViews = vehicles.reduce((sum, v) => sum + (v.views || 0), 0);
  const avgViews = vehicles.length > 0 ? Math.round(totalViews / vehicles.length) : 0;
  const publishedCount = vehicles.filter(v => v.status === "approved").length;
  const pendingCount = vehicles.filter(v => v.status === "pending" || v.status === "under_review").length;

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 shadow-xl card-glass">
        <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50"></div>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative">
                <Loader className="w-12 h-12 animate-spin text-primary" />
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" style={{ animationDuration: '1.5s' }}></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold font-heading mb-2">
              Cargando tus anuncios
            </h3>
            <p className="text-sm text-muted-foreground">
              Esto solo tomará un momento...
            </p>
            <div className="mt-4 flex justify-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden border-destructive/20 shadow-xl">
        <div className="h-2 bg-gradient-to-r from-destructive to-destructive/80"></div>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-full bg-destructive/10 mb-6"
            >
              <AlertCircle className="w-12 h-12 text-destructive" />
            </motion.div>
            <h3 className="text-xl font-semibold font-heading mb-2">
              Error al cargar
            </h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchVehicles} className="btn-primary">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header premium mejorado */}
        <Card className="shadow-xl border-0 overflow-hidden card-glass relative">
          {/* Efectos de brillo superior */}
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50"></div>
          
          {/* Patrón de puntos premium */}
          <div className="absolute top-0 left-0 w-full h-32 opacity-5 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle, var(--primary) 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          <CardHeader className="border-b border-border/50 bg-gradient-to-br from-muted/30 to-transparent pb-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 shimmer-effect">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.div>
                </motion.div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-gradient-primary">
                    Mis Anuncios
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Gestiona y administra tus publicaciones
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button asChild className="gap-2 btn-primary">
                  <Link href={siteConfig.paths.publishAd}>
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Publicar</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-primary/5 to-transparent p-4 rounded-xl border border-border/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total publicados</p>
                    <p className="text-2xl font-bold font-heading">{publishedCount}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-amber-500/5 to-transparent p-4 rounded-xl border border-border/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Pendientes</p>
                    <p className="text-2xl font-bold font-heading">{pendingCount}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-blue-500/5 to-transparent p-4 rounded-xl border border-border/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Vistas totales</p>
                    <p className="text-2xl font-bold font-heading">{totalViews.toLocaleString()}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-green-500/5 to-transparent p-4 rounded-xl border border-border/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Promedio vistas</p>
                    <p className="text-2xl font-bold font-heading">{avgViews.toLocaleString()}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Barra de búsqueda y filtros mejorada */}
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por marca, modelo o año..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-premium"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
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
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      Más recientes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                      Más antiguos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price-low")}>
                      Precio: Menor a mayor
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price-high")}>
                      Precio: Mayor a menor
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("views")}>
                      Más vistos
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(showFilters && "bg-primary/10 border-primary/30")}
                >
                  <Filter className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Panel de filtros expandible */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-4 bg-muted/20 rounded-xl border border-border/30"
                >
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
                    <Button variant="outline" size="sm" className="mr-2">
                      Limpiar filtros
                    </Button>
                    <Button size="sm" className="btn-primary">
                      Aplicar filtros
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardHeader>
          
          {/* Tabs mejoradas */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/20 border-b border-border/50">
              <TabsTrigger
                value="all"
                className="flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300"
              >
                <span className="hidden sm:inline">Todos</span>
                <span className="sm:hidden">All</span>
                <Badge variant="secondary" className="text-xs px-2">
                  {vehicles.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="published"
                className="flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300"
              >
                <span className="hidden sm:inline">Publicados</span>
                <span className="sm:hidden">Pub</span>
                <Badge variant="secondary" className="text-xs px-2">
                  {vehicles.filter((v) => v.status === "approved").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300"
              >
                <span className="hidden sm:inline">Pendientes</span>
                <span className="sm:hidden">Pend</span>
                <Badge variant="secondary" className="text-xs px-2">
                  {
                    vehicles.filter(
                      (v) =>
                        v.status === "pending" || v.status === "under_review"
                    ).length
                  }
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="sold"
                className="flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-300"
              >
                <span className="hidden sm:inline">Vendidos</span>
                <span className="sm:hidden">Sold</span>
                <Badge variant="secondary" className="text-xs px-2">
                  {vehicles.filter((v) => v.status === "sold").length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>
      </motion.div>

      {/* Grid de vehículos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="shadow-xl border-0 overflow-hidden card-glass">
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
          <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50"></div>
          
          <CardContent className="p-6">
            {filteredByTab.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center p-16 text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-6 relative"
                >
                  <Inbox className="w-16 h-16 text-primary" />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.div>
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 font-heading text-gradient-primary">
                  {activeTab === "all"
                    ? "No tienes anuncios publicados"
                    : `No tienes anuncios ${
                        activeTab === "published"
                          ? "publicados"
                          : activeTab === "pending"
                          ? "pendientes"
                          : "vendidos"
                      }`}
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md">
                  {activeTab === "all"
                    ? "¡Empieza a vender ahora! Publica tu primer vehículo para que miles de personas lo vean."
                    : `No tienes vehículos en esta categoría actualmente.`}
                </p>
                <Button asChild size="lg" className="gap-2 btn-primary">
                  <Link href={siteConfig.paths.publishAd}>
                    <Plus className="w-4 h-4" />
                    Publicar Vehículo
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <AnimatePresence>
                <motion.div
                  layout
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                      : "space-y-6"
                  )}
                >
                  {filteredByTab
                    .filter(
                      (vehicle): vehicle is VehicleDataFrontend & { _id: string } =>
                        !!vehicle._id
                    )
                    .map((vehicle, index) => (
                      <motion.div
                        key={vehicle._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                      >
                        <ProfileVehicleCard
                          vehicle={vehicle}
                          onDelete={openDeleteDialog}
                          onRemoveFinancing={openRemoveFinancingDialog}
                          onToggleCompare={toggleCompare}
                          isInCompareList={compareList.includes(vehicle._id)}
                        />
                      </motion.div>
                    ))}
                </motion.div>
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Dialog mejorado */}
      <AlertDialog
        open={!!vehicleToDelete}
        onOpenChange={() => setVehicleToDelete(null)}
      >
        <AlertDialogContent className="card-glass">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading flex items-center gap-2">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              ¿Eliminar este anuncio?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El anuncio se eliminará
              permanentemente de la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
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

      {/* Remove Financing Dialog mejorado */}
      <AlertDialog
        open={!!vehicleToRemoveFinancing}
        onOpenChange={() => setVehicleToRemoveFinancing(null)}
      >
        <AlertDialogContent className="card-glass">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <DollarSign className="w-5 h-5 text-amber-500" />
              </div>
              ¿Desactivar la financiación?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la calculadora de
              financiación de este anuncio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovingFinancing}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveFinancing}
              disabled={isRemovingFinancing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemovingFinancing && (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isRemovingFinancing ? "Desactivando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Compare Bar flotante mejorada */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-2xl border-primary/20 card-glass overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
                    <Badge className="relative text-lg h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                      {compareList.length}
                    </Badge>
                  </div>
                </div>
                <div className="flex-grow">
                  <p className="font-semibold font-heading flex items-center gap-2">
                    Comparación activa
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Activity className="w-4 h-4 text-primary" />
                    </motion.div>
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
                  <Link
                    href={`/compare?${compareList
                      .map((id) => `vehicles=${id}`)
                      .join("&")}`}
                  >
                    <GitCompare className="w-4 h-4" />
                    Comparar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

UserVehicleList.displayName = "UserVehicleList";

export default UserVehicleList;