//src/components/features/profile/UserVehicleList.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { VehicleDataFrontend } from '@/types/types';
import { useSession } from 'next-auth/react';
import { Loader, AlertCircle, Inbox } from 'lucide-react';
import VehicleCard from './VehicleCard';
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

const UserVehicleList = () => {
  const { status } = useSession();
  const [vehicles, setVehicles] = useState<VehicleDataFrontend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

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
      
      // Filtrar vehículos para mostrar solo los aprobados
      const approvedVehicles = data.filter(
        (vehicle: VehicleDataFrontend) => vehicle.status === 'approved'
      );
      console.log("Vehículos aprobados para mostrar:", approvedVehicles);
      
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

      // Actualizar la lista de vehículos
      setVehicles(prev => prev.filter(v => v._id !== vehicleToDelete));

    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ocurrió un error al eliminar el anuncio.");
    } finally {
      setIsDeleting(false);
      setVehicleToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800/50 p-16 text-center shadow-sm">
        <Loader className="w-12 h-12 animate-spin mb-4 text-orange-500" />
        <span className="text-xl font-semibold text-gray-900 dark:text-white">Cargando tus anuncios...</span>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Estamos buscando tus vehículos publicados.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-16 text-center shadow-sm">
        <AlertCircle className="w-12 h-12 mb-4 text-red-600 dark:text-red-500" />
        <span className="text-xl font-semibold text-red-700 dark:text-red-400">Error al cargar</span>
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800/50 p-16 text-center shadow-sm">
        <div className="bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-950 dark:to-pink-950 p-6 rounded-full mb-6">
          <Inbox className="w-16 h-16 text-orange-600 dark:text-orange-400" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
          No tienes anuncios publicados
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          ¡Empieza a vender ahora! Publica tu primer vehículo para que miles de personas lo vean.
        </p>
        <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
          <Link href="/postAd">Publicar Vehículo</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle._id} vehicle={vehicle} onDelete={openDeleteDialog} />
        ))}
      </div>

      <AlertDialog open={!!vehicleToDelete} onOpenChange={() => setVehicleToDelete(null)}>
        <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">
              ¿Estás seguro de que quieres eliminar este anuncio?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Esta acción no se puede deshacer. El anuncio se eliminará permanentemente
              de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVehicle}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {isDeleting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              {isDeleting ? 'Eliminando...' : 'Confirmar Eliminación'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserVehicleList;