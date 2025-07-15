

// src/components/sections/AdminPanel.tsx
"use client";

import { useState, Fragment } from "react";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Gauge,
  Palette,
  Settings,
  Fuel,
  Car,
  RefreshCw,
  MoreVertical,
  Trash2,
  MessageSquare,
  History,
  Download,
  Plus,
  Calendar,
  User,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { generateVehiclePdf } from "@/lib/pdfGenerator";
import { useDarkMode } from "@/context/DarkModeContext";
import { useAdminPanelEnhanced } from "@/hooks/use-admin-panel-enhanced";
import type { VehicleDataFrontend } from "@/types/types";
import { PdfViewer } from "./components/pdf-viewer/pdf-viewer";
import { AdminStats } from "./components/AdminStats/AdminStats";
import { AdminFilters } from "./components/AdminFilters/AdminFilters";
import { VehicleGridView } from "./components/VehicleGridView/VehicleGridView";
import { AdminPagination } from "./components/AdminPagination/AdminPagination";
import { ApprovalStatus } from "@/types/shared";

// Interfaces para las nuevas funcionalidades
interface VehicleComment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  type: 'admin' | 'system';
}

interface VehicleHistoryEntry {
  id: string;
  action: string;
  details: string;
  author: string;
  timestamp: string;
  oldValue?: string;
  newValue?: string;
}

export const AdminPanel = () => {
  const { isDarkMode } = useDarkMode();
  const {
    vehicles,
    allVehicles,
    isLoading,
    error,
    isAdmin,
    status,
    viewMode,
    setViewMode,
    filters,
    updateFilters,
    pagination,
    updatePagination,
    goToPage,
    nextPage,
    prevPage,
    handleStatusChange,
    fetchVehicles,
    deleteVehicle,
  } = useAdminPanelEnhanced();

  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleDataFrontend | null>(null);
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(
    new Set()
  );
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [vehicleToReject, setVehicleToReject] = useState<string | null>(null);

  // Estados para las nuevas funcionalidades
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [vehicleToComment, setVehicleToComment] = useState<string | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [vehicleComments, setVehicleComments] = useState<VehicleComment[]>([]);
  const [vehicleHistory, setVehicleHistory] = useState<VehicleHistoryEntry[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-base md:text-lg">Cargando panel de administrador...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-4 md:p-6 text-center">
            <XCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg md:text-xl font-bold mb-2">Acceso Denegado</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              No tienes permisos de administrador para acceder a esta página.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-4 md:p-6 text-center">
            <XCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg md:text-xl font-bold mb-2">Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm md:text-base">{error}</p>
            <Button onClick={fetchVehicles} size="sm" className="w-full sm:w-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Funciones para manejar comentarios
  const handleAddComment = async (vehicleId: string, comment: string) => {
    try {
      setIsLoadingComments(true);
      
      // Simular API call - aquí implementarías la llamada real
      const newComment: VehicleComment = {
        id: Date.now().toString(),
        text: comment,
        author: "Admin", // Obtener del session
        createdAt: new Date().toISOString(),
        type: 'admin',
      };

      // En una implementación real, harías:
      // const response = await fetch(`/api/admin/vehicles/${vehicleId}/comments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ comment })
      // });

      setVehicleComments(prev => [newComment, ...prev]);
      setCommentText("");
      setShowCommentDialog(false);

      // Agregar entrada al historial
      const historyEntry: VehicleHistoryEntry = {
        id: Date.now().toString(),
        action: "Comentario agregado",
        details: `Se agregó un comentario: "${comment.substring(0, 50)}${comment.length > 50 ? '...' : ''}"`,
        author: "Admin",
        timestamp: new Date().toISOString()
      };

      setVehicleHistory(prev => [historyEntry, ...prev]);

    } catch (error) {
      console.error("Error al agregar comentario:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Función para cargar comentarios
  const loadVehicleComments = async (vehicleId: string) => {
    try {
      setIsLoadingComments(true);
      
      // Simular datos de comentarios - en una implementación real harías la llamada a la API
      console.log(`Cargando comentarios para el vehículo: ${vehicleId}`);
      const mockComments: VehicleComment[] = [
        {
          id: "1",
          text: "Vehículo revisado, documentación completa",
          author: "Admin",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          type: 'admin'
        },
        {
          id: "2", 
          text: "Estado cambiado automáticamente a pendiente",
          author: "Sistema",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          type: 'system'
        }
      ];
      
      setVehicleComments(mockComments);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Función para cargar historial
  const loadVehicleHistory = async () => {
    try {
      setIsLoadingHistory(true);
      
      // Simular datos de historial - en una implementación real harías la llamada a la API
      const mockHistory: VehicleHistoryEntry[] = [
        {
          id: "1",
          action: "Estado cambiado",
          details: "Estado cambiado de 'pendiente' a 'aprobado'",
          author: "Admin",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          oldValue: "pending",
          newValue: "approved"
        },
        {
          id: "2",
          action: "Vehículo creado",
          details: "Vehículo registrado en el sistema",
          author: "Sistema",
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "3",
          action: "Comprobante subido",
          details: "Comprobante de pago adjuntado",
          author: "Usuario",
          timestamp: new Date(Date.now() - 90000000).toISOString()
        }
      ];
      
      setVehicleHistory(mockHistory);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Función para eliminar vehículo
  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const result = await deleteVehicle(vehicleId);
      
      if (result.success) {
        // Cerrar dialog y limpiar estado
        setShowDeleteDialog(false);
        setVehicleToDelete(null);
        
        // Opcional: mostrar mensaje de éxito
        console.log("Vehículo eliminado exitosamente");
      } else {
        console.error("Error al eliminar:", result.error);
      }
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
    }
  };


  const getStatusBadge = (status: string) => {
    const variants = {
      pending: {
        variant: "secondary" as const,
        icon: Clock,
        text: "Pendiente",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      approved: {
        variant: "default" as const,
        icon: CheckCircle,
        text: "Aprobado",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      rejected: {
        variant: "destructive" as const,
        icon: XCircle,
        text: "Rechazado",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
    };

    const config =
      variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant}
        className={`flex items-center gap-1 text-xs ${config.className}`}
      >
        <Icon className="w-3 h-3" />
        <span className="hidden xs:inline">{config.text}</span>
      </Badge>
    );
  };

  const handleRejectWithReason = async (vehicleId: string, reason: string) => {
    try {
      await handleStatusChange(vehicleId, ApprovalStatus.REJECTED, reason);
      setShowRejectDialog(false);
      setRejectReason("");
      setVehicleToReject(null);
    } catch (error) {
      console.error("Error al rechazar:", error);
    }
  };

  const handleBulkAction = async (action: ApprovalStatus) => {
    if (selectedVehicles.size === 0) return;

    try {
      const promises = Array.from(selectedVehicles).map((vehicleId) =>
        handleStatusChange(vehicleId, action)
      );
      await Promise.all(promises);
      setSelectedVehicles(new Set());
    } catch (error) {
      console.error("Error en acción masiva:", error);
    }
  };

  const toggleVehicleSelection = (vehicleId: string) => {
    const newSelected = new Set(selectedVehicles);
    if (newSelected.has(vehicleId)) {
      newSelected.delete(vehicleId);
    } else {
      newSelected.add(vehicleId);
    }
    setSelectedVehicles(newSelected);
  };

  const selectAllVisible = () => {
    const allIds = new Set(vehicles.map((v) => v._id!));
    setSelectedVehicles(allIds);
  };

  const clearSelection = () => {
    setSelectedVehicles(new Set());
  };

  const exportData = () => {
    const csvContent = [
      [
        "ID",
        "Marca",
        "Modelo",
        "Año",
        "Precio",
        "Estado",
        "Ubicación",
        "Vendedor",
      ],
      ...vehicles.map((v) => [
        v._id,
        v.brand,
        v.model,
        v.year,
        v.price,
        v.status,
        v.location,
        v.sellerContact.name,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vehiculos_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const VehicleActions = ({ vehicle }: { vehicle: VehicleDataFrontend }) => (
    <Menu as="div" className="relative">
      <Menu.Button as={Button} variant="ghost" size="sm" className="h-8 w-8 p-0">
        <MoreVertical className="w-4 h-4" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    active ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver detalles
                </button>
              )}
            </Menu.Item>
            <hr className="border-gray-200 dark:border-gray-700" />
            {vehicle.status !== "approved" && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleStatusChange(vehicle._id!, ApprovalStatus.APPROVED)}
                    className={`flex items-center w-full px-4 py-2 text-sm text-green-600 ${
                      active ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar
                  </button>
                )}
              </Menu.Item>
            )}
            {vehicle.status !== "pending" && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleStatusChange(vehicle._id!, ApprovalStatus.PENDING)}
                    className={`flex items-center w-full px-4 py-2 text-sm text-yellow-600 ${
                      active ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Marcar como pendiente
                  </button>
                )}
              </Menu.Item>
            )}
            {vehicle.status !== "rejected" && (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      setVehicleToReject(vehicle._id!);
                      setShowRejectDialog(true);
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${
                      active ? "bg-gray-100 dark:bg-gray-700" : ""
                    }`}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar
                  </button>
                )}
              </Menu.Item>
            )}
            <hr className="border-gray-200 dark:border-gray-700" />
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    setVehicleToComment(vehicle._id!);
                    loadVehicleComments(vehicle._id!);
                    setShowCommentDialog(true);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    active ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Agregar comentario
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    loadVehicleHistory();
                    setShowHistoryDialog(true);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    active ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <History className="w-4 h-4 mr-2" />
                  Ver historial
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => generateVehiclePdf(vehicle)}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    active ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </button>
              )}
            </Menu.Item>
            <hr className="border-gray-200 dark:border-gray-700" />
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    setVehicleToDelete(vehicle._id!);
                    setShowDeleteDialog(true);
                  }}
                  className={`flex items-center w-full px-4 py-2 text-sm text-red-600 ${
                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                  }`}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );

  const MobileActionSheet = ({ vehicle }: { vehicle: VehicleDataFrontend }) => (
    <div className="flex flex-col sm:hidden gap-2 mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="grid grid-cols-2 gap-2">
        {vehicle.status !== "approved" && (
          <Button
            onClick={() => handleStatusChange(vehicle._id!, ApprovalStatus.APPROVED)}
            className="bg-green-600 hover:bg-green-700 text-xs h-8"
            size="sm"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprobar
          </Button>
        )}
        {vehicle.status !== "rejected" && (
          <Button
            onClick={() => {
              setVehicleToReject(vehicle._id!);
              setShowRejectDialog(true);
            }}
            variant="destructive"
            size="sm"
            className="text-xs h-8"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Rechazar
          </Button>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSelectedVehicle(vehicle)}
        className="text-xs h-8"
      >
        <Eye className="w-3 h-3 mr-1" />
        Ver detalles
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setVehicleToComment(vehicle._id!);
            loadVehicleComments(vehicle._id!);
            setShowCommentDialog(true);
          }}
          className="text-xs h-8"
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          Comentar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            loadVehicleHistory();
            setShowHistoryDialog(true);
          }}
          className="text-xs h-8"
        >
          <History className="w-3 h-3 mr-1" />
          Historial
        </Button>
      </div>
      <div className="grid grid-cols-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => generateVehiclePdf(vehicle)}
          className="text-xs h-8"
        >
          <Download className="w-3 h-3 mr-1" />
          Descargar PDF
        </Button>
      </div>
    </div>
  );

  const VehicleListView = ({
    vehicles,
  }: {
    vehicles: VehicleDataFrontend[];
  }) => {
    if (vehicles.length === 0) {
      return (
        <div className="text-center py-8 md:py-12">
          <Car className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base md:text-lg font-semibold mb-2">No hay vehículos</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base px-4">
            No se encontraron vehículos con los filtros seleccionados.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 md:space-y-6">
        {/* Acciones masivas */}
        {selectedVehicles.size > 0 && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-sm font-medium">
                    {selectedVehicles.size} vehículo
                    {selectedVehicles.size !== 1 ? "s" : ""} seleccionado
                    {selectedVehicles.size !== 1 ? "s" : ""}
                  </span>
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    Limpiar selección
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction(ApprovalStatus.APPROVED)}
                    className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aprobar seleccionados
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction(ApprovalStatus.REJECTED)}
                    className="text-xs sm:text-sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rechazar seleccionados
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {vehicles.map((vehicle) => (
          <Card
            key={vehicle._id}
            className={`${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            } hover:shadow-lg transition-all duration-200 ${
              selectedVehicles.has(vehicle._id!) ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <CardContent className="p-3 md:p-6">
              <div className="flex flex-col space-y-4">
                {/* Header móvil con checkbox y estado */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedVehicles.has(vehicle._id!)}
                      onCheckedChange={() => toggleVehicleSelection(vehicle._id!)}
                    />
                    <h3 className="text-base md:text-xl font-bold line-clamp-1">
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(vehicle.status)}
                    <div className="hidden sm:block">
                      <VehicleActions vehicle={vehicle} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  {/* Imagen del vehículo */}
                  <div className="relative w-full lg:w-64 h-48 lg:h-40 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <Image
                      src={
                        vehicle.images[0] ||
                        "/placeholder.svg?height=200&width=300"
                      }
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      fill
                      className="object-cover"
                    />
                    {vehicle.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        +{vehicle.images.length - 1} fotos
                      </div>
                    )}
                  </div>

                  {/* Información del vehículo */}
                  <div className="flex-1 space-y-3 md:space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 text-xs md:text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                        <span className="font-semibold">
                          ${vehicle.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                        <span>{vehicle.mileage.toLocaleString()} km</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
                        <span className="truncate">{vehicle.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Palette className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                        <span>{vehicle.color}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                        <span className="truncate">{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
                        <span>{vehicle.fuelType}</span>
                      </div>
                    </div>

                    {vehicle.description && (
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm md:text-base">
                        {vehicle.description}
                      </p>
                    )}

                    {/* Información del vendedor */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                      <h4 className="font-semibold mb-2 text-sm md:text-base">
                        Información del vendedor:
                      </h4>
                      <div className="space-y-1 text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {vehicle.sellerContact.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                          <span className="truncate">{vehicle.sellerContact.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                          <span>{vehicle.sellerContact.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Comprobante de pago */}
                    {vehicle.paymentProof && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <PdfViewer
                          url={vehicle.paymentProof}
                          vehicleId={vehicle._id!}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    )}

                    {/* Acciones rápidas - Desktop */}
                    <div className="hidden sm:flex flex-wrap gap-2 pt-4 border-t">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedVehicle(vehicle)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {vehicle.brand} {vehicle.model} ({vehicle.year})
                            </DialogTitle>
                          </DialogHeader>
                          {selectedVehicle && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {vehicle.images.map((image, index) => (
                                  <div
                                    key={index}
                                    className="relative aspect-video"
                                  >
                                    <Image
                                      src={image || "/placeholder.svg"}
                                      alt={`${vehicle.brand} ${vehicle.model} - ${
                                        index + 1
                                      }`}
                                      fill
                                      className="object-cover rounded-lg"
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    Especificaciones:
                                  </h4>
                                  <ul className="space-y-1 text-sm">
                                    <li>Categoría: {vehicle.category}</li>
                                    <li>Subcategoría: {vehicle.subcategory}</li>
                                    <li>Motor: {vehicle.engine}</li>
                                    <li>Puertas: {vehicle.doors}</li>
                                    <li>Asientos: {vehicle.seats}</li>
                                    <li>Condición: {vehicle.condition}</li>
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    Características:
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {vehicle.features.map((feature, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Botones de estado mejorados */}
                      {vehicle.status !== "approved" && (
                        <Button
                          onClick={() =>
                            handleStatusChange(
                              vehicle._id!,
                              ApprovalStatus.APPROVED
                            )
                          }
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aprobar
                        </Button>
                      )}

                      {vehicle.status !== "pending" && (
                        <Button
                          onClick={() =>
                            handleStatusChange(
                              vehicle._id!,
                              ApprovalStatus.PENDING
                            )
                          }
                          variant="outline"
                          size="sm"
                          className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Pendiente
                        </Button>
                      )}

                      {vehicle.status !== "rejected" && (
                        <Button
                          onClick={() => {
                            setVehicleToReject(vehicle._id!);
                            setShowRejectDialog(true);
                          }}
                          variant="destructive"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rechazar
                        </Button>
                      )}
                    </div>

                    {/* Acciones móviles */}
                    <MobileActionSheet vehicle={vehicle} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen p-2 sm:p-4 lg:p-6 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header mejorado */}
        <Card
          className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}
        >
          <CardHeader className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 md:gap-3">
                  <Car className="w-6 h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0" />
                  <span className="truncate">Panel de Administrador</span>
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-1 md:mt-2 text-sm md:text-base">
                  Gestiona los anuncios de vehículos y comprobantes de pago
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <Button onClick={exportData} variant="outline" size="sm" className="text-xs sm:text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden xs:inline">Exportar</span>
                </Button>
                <Button
                  onClick={fetchVehicles}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="text-xs sm:text-sm"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                  <span className="hidden xs:inline">Actualizar</span>
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Estadísticas */}
        <AdminStats vehicles={allVehicles} isDarkMode={isDarkMode} />

        {/* Filtros */}
        <AdminFilters
          filters={filters}
          onFiltersChange={updateFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalResults={allVehicles.length}
          isDarkMode={isDarkMode}
          onSelectAll={selectAllVisible}
          onClearSelection={clearSelection}
          selectedCount={selectedVehicles.size}
        />

        {/* Contenido principal */}
        <Card
          className={isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}
        >
          <CardContent className="p-3 md:p-6">
            {viewMode === "grid" ? (
              <VehicleGridView
                vehicles={vehicles}
                onStatusChange={handleStatusChange}
                onVehicleSelect={setSelectedVehicle}
                isDarkMode={isDarkMode}
              />
            ) : (
              <VehicleListView vehicles={vehicles} />
            )}

            {/* Paginación */}
            <div className="mt-6">
              <AdminPagination
                pagination={pagination}
                onPageChange={goToPage}
                onItemsPerPageChange={(itemsPerPage) =>
                  updatePagination({ itemsPerPage })
                }
                onNextPage={nextPage}
                onPrevPage={prevPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para rechazar con razón */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="mx-4 max-w-md sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base md:text-lg">Rechazar anuncio</AlertDialogTitle>
            <AlertDialogDescription className="text-sm md:text-base">
              ¿Estás seguro de que quieres rechazar este anuncio? Puedes agregar
              una razón opcional.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Razón del rechazo (opcional)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[80px] md:min-h-[100px] text-sm"
            />
          </div>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                vehicleToReject &&
                handleRejectWithReason(vehicleToReject, rejectReason)
              }
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
            >
              Rechazar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    {/* Dialog para agregar comentarios */}
    <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
      <DialogContent className="mx-4 max-w-md sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Comentarios del vehículo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Lista de comentarios existentes */}
          <div className="max-h-60 overflow-y-auto">
            <ScrollArea className="h-full">
              {isLoadingComments ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
              ) : vehicleComments.length > 0 ? (
                <div className="space-y-3">
                  {vehicleComments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-lg ${
                        comment.type === 'admin'
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                          : 'bg-gray-50 dark:bg-gray-700 border-l-4 border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium text-sm">{comment.author}</span>
                          <Badge variant={comment.type === 'admin' ? 'default' : 'secondary'} className="text-xs">
                            {comment.type === 'admin' ? 'Admin' : 'Sistema'}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay comentarios aún</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Formulario para nuevo comentario */}
          <div className="border-t pt-4">
            <Label htmlFor="comment" className="text-sm font-medium">
              Agregar nuevo comentario
            </Label>
            <Textarea
              id="comment"
              placeholder="Escribe tu comentario aquí..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="mt-2 min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setShowCommentDialog(false);
              setCommentText("");
            }}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => vehicleToComment && handleAddComment(vehicleToComment, commentText)}
            disabled={!commentText.trim() || isLoadingComments}
            className="w-full sm:w-auto"
          >
            {isLoadingComments ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Agregar comentario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Dialog para ver historial */}
    <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
      <DialogContent className="mx-4 max-w-md sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Historial del vehículo
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-96 overflow-y-auto">
          <ScrollArea className="h-full">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : vehicleHistory.length > 0 ? (
              <div className="space-y-4">
                {vehicleHistory.map((entry, index) => (
                  <div key={entry.id} className="relative">
                    {/* Línea de tiempo */}
                    {index < vehicleHistory.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200 dark:bg-gray-600"></div>
                    )}
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          {entry.action.includes('Estado') ? (
                            <RefreshCw className="w-4 h-4 text-blue-600" />
                          ) : entry.action.includes('creado') ? (
                            <Plus className="w-4 h-4 text-green-600" />
                          ) : entry.action.includes('Comentario') ? (
                            <MessageSquare className="w-4 h-4 text-purple-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{entry.action}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {entry.details}
                        </p>
                        
                        {entry.oldValue && entry.newValue && (
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="outline" className="bg-red-50 text-red-700">
                              {entry.oldValue}
                            </Badge>
                            <span>→</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {entry.newValue}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <User className="w-3 h-3" />
                          <span>por {entry.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay historial disponible</p>
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowHistoryDialog(false)}
            className="w-full sm:w-auto"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Dialog para confirmar eliminación */}
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent className="mx-4 max-w-md sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Eliminar vehículo
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm md:text-base">
            ¿Estás seguro de que quieres eliminar este vehículo? Esta acción no se puede deshacer.
            Se eliminará permanentemente toda la información, imágenes y comprobantes asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium text-sm">Advertencia</span>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
            Esta acción es irreversible. Todos los datos del vehículo se perderán permanentemente.
          </p>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full sm:w-auto">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => vehicleToDelete && handleDeleteVehicle(vehicleToDelete)}
            className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar permanentemente
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
  );
};