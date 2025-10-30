// src/components/features/profile/UserVehicleList.tsx
"use client";

import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import { VehicleDataFrontend } from '@/types/types';
import { useSession } from 'next-auth/react';
import { Loader, AlertCircle, Inbox, Plus, Grid, List, GitCompare, Sparkles } from 'lucide-react';
import ProfileVehicleCard from './ProfileVehicleCard';
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
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { siteConfig } from "@/config/site";
import { cn } from '@/lib/utils';
import { removeFinancingDetails } from "@/lib/actions/vehicle.actions";

const UserVehicleList = forwardRef<HTMLDivElement>((props, ref) => {
  const { data: session, status } = useSession();
  const [vehicles, setVehicles] = useState<VehicleDataFrontend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [isRemovingFinancing, setIsRemovingFinancing] = useState(false);
  const [vehicleToRemoveFinancing, setVehicleToRemoveFinancing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [compareList, setCompareList] = useState<string[]>([]);

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
      const response = await fetch('/api/user/vehicles');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar los vehículos');
      }
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los vehículos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchVehicles();
    } else if (status === 'unauthenticated' || status === 'loading') {
      setIsLoading(false);
    }
  }, [status, fetchVehicles]);

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
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'No se pudo eliminar el vehículo.');
      }
      
      toast.success("Tu anuncio ha sido eliminado correctamente.");
      setVehicles(prev => prev.filter(v => v._id !== vehicleToDelete));

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
      } else {
        throw new Error(result.error || "No se pudo eliminar la financiación.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Ocurrió un error al eliminar la financiación."
      );
    } finally {
      setIsRemovingFinancing(false);
      setVehicleToRemoveFinancing(null);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (activeTab === "all") return true;
    if (activeTab === "published") return vehicle.status === 'approved';
    if (activeTab === "pending") return vehicle.status === 'pending' || vehicle.status === 'under_review';
    if (activeTab === "sold") return vehicle.status === 'sold';
    return true;
  });

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              <Loader className="relative w-12 h-12 animate-spin text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-heading mb-2">Cargando tus anuncios</h3>
            <p className="text-sm text-muted-foreground">Esto solo tomará un momento...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden border-destructive/20">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-6 rounded-full bg-destructive/10 mb-6">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold font-heading mb-2">Error al cargar</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchVehicles} variant="outline">
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden border-border/50 shadow-sm" ref={ref}>
        <CardHeader className="border-b border-border/50 bg-gradient-to-br from-muted/30 to-transparent">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold">Mis Anuncios</h2>
                <p className="text-sm text-muted-foreground">
                  Gestiona y administra tus publicaciones
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none border-r border-border"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Publish Button */}
              <Button asChild className="gap-2">
                <Link href={siteConfig.paths.publishAd}>
                  <Plus className="w-4 h-4" />
                  <span>Publicar</span>
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Tabs mejorados */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
              <TabsTrigger 
                value="all" 
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <span className="hidden sm:inline">Todos</span>
                <span className="sm:hidden">All</span>
                <Badge variant="secondary" className="text-xs px-2">
                  {vehicles.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="published" 
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <span className="hidden sm:inline">Publicados</span>
                <span className="sm:hidden">Pub</span>
                <Badge variant="secondary" className="text-xs px-2">
                  {vehicles.filter(v => v.status === 'approved').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <span className="hidden sm:inline">Pendientes</span>
                <span className="sm:hidden">Pend</span>
                <Badge variant="secondary" className="text-xs px-2">
                  {vehicles.filter(v => v.status === 'pending' || v.status === 'under_review').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="sold" 
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <span className="hidden sm:inline">Vendidos</span>
                <span className="sm:hidden">Sold</span>
                <Badge variant="secondary" className="text-xs px-2">
                  {vehicles.filter(v => v.status === 'sold').length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="p-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
                <Inbox className="w-16 h-16 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-3">
                {activeTab === "all" 
                  ? "No tienes anuncios publicados" 
                  : `No tienes anuncios ${activeTab === "published" ? "publicados" : activeTab === "pending" ? "pendientes" : "vendidos"}`
                }
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                {activeTab === "all" 
                  ? "¡Empieza a vender ahora! Publica tu primer vehículo para que miles de personas lo vean."
                  : `No tienes vehículos en esta categoría actualmente.`
                }
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link href={siteConfig.paths.publishAd}>
                  <Plus className="w-4 h-4" />
                  Publicar Vehículo
                </Link>
              </Button>
            </div>
          ) : (
            <div className={cn(
              "p-6",
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
                : "space-y-4"
            )}>
              {filteredVehicles
                .filter((vehicle): vehicle is VehicleDataFrontend & { _id: string } => !!vehicle._id)
                .map((vehicle) => (
                  <ProfileVehicleCard
                    key={vehicle._id}
                    vehicle={vehicle}
                    onDelete={openDeleteDialog}
                    onRemoveFinancing={openRemoveFinancingDialog}
                    onToggleCompare={toggleCompare}
                    isInCompareList={compareList.includes(vehicle._id)}
                  />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={!!vehicleToDelete} onOpenChange={() => setVehicleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">
              ¿Eliminar este anuncio?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El anuncio se eliminará permanentemente de la plataforma.
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
              {isDeleting ? 'Eliminando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Financing Dialog */}
      <AlertDialog open={!!vehicleToRemoveFinancing} onOpenChange={() => setVehicleToRemoveFinancing(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">
              ¿Desactivar la financiación?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la calculadora de financiación de este anuncio.
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
              {isRemovingFinancing && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              {isRemovingFinancing ? 'Desactivando...' : 'Confirmar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Compare Bar flotante */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in-50 duration-300">
          <Card className="bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-2xl border-primary/20">
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
                <p className="font-semibold font-heading">Comparación activa</p>
                <p className="text-sm text-muted-foreground">
                  {compareList.length < 2 
                    ? "Selecciona al menos 2 vehículos" 
                    : `${compareList.length} vehículos listos`}
                </p>
              </div>
              <Button 
                asChild 
                disabled={compareList.length < 2}
                className="gap-2"
              >
                <Link href={`/compare?${compareList.map(id => `vehicles=${id}`).join('&')}`}>
                  <GitCompare className="w-4 h-4" />
                  Comparar
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
});

UserVehicleList.displayName = "UserVehicleList";

export default UserVehicleList;