// src/components/features/admin/AdminPanel.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  XCircle,
  Car,
  RefreshCw,
  Trash2,
  MessageSquare,
  History,
  Download,
  Plus,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  BarChart2,
} from "lucide-react";
import { useDarkMode } from "@/context/DarkModeContext";
import { useAdminPanelEnhanced } from "@/hooks/use-admin-panel-enhanced";
import type {
  VehicleDataFrontend,
  ApprovalStatus as ApprovalStatusType,
} from "@/types/types";
import { PdfViewer } from "../payment/pdf-viewer";
import { AdminFilters } from "./AdminFilters";
import { VehicleGridView } from "./VehicleGridView";
import { VehicleListView } from "./VehicleListView";
import { AdminPagination } from "./AdminPagination";
import { NotificationBell } from "../../shared/notifications/NotificationBell";
import { filterVehicles } from "@/lib/vehicleUtils"; // Importa la nueva función
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

// Interfaces para las nuevas funcionalidades
interface VehicleComment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  type: "admin" | "system";
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

// Mapeo explícito
const ApprovalStatus = {
  PENDING: "pending" as ApprovalStatusType,
  APPROVED: "approved" as ApprovalStatusType,
  REJECTED: "rejected" as ApprovalStatusType,
};

export const AdminPanel = () => {
  const { isDarkMode } = useDarkMode();
  const {
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
    setAllVehicles, // Importamos la función para actualizar el estado
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
  const [vehicleHistory, setVehicleHistory] = useState<VehicleHistoryEntry[]>(
    []
  );
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [vehicleFromNotification, setVehicleFromNotification] =
    useState<VehicleDataFrontend | null>(null);

  // Efecto para asegurar que se cargan TODOS los vehículos al inicio.
  // Esto soluciona el problema de que los vehículos pendientes no aparezcan.
  useEffect(() => {
    const fetchAllVehiclesInitially = async () => {
      // Solo ejecutar si la lista está vacía para evitar recargas innecesarias
      if (allVehicles.length === 0) {
        try {
          // Hacemos una llamada a la API pidiendo explícitamente TODOS los estados.
          // Es posible que tu API ya devuelva todo por defecto, en cuyo caso puedes quitar `?status=all`.
          const response = await fetch("/api/admin/vehicles?status=all");
          const result = await response.json();
          if (result.success) {
            // Usamos la función del hook para actualizar la lista completa de vehículos.
            setAllVehicles(result.data);
          } else {
            console.error("Error al cargar todos los vehículos:", result.error);
          }
        } catch (error) {
          console.error("Error de red al cargar todos los vehículos:", error);
        }
      }
    };
    fetchAllVehiclesInitially();
  }, [setAllVehicles, allVehicles.length]);

  // Efecto para abrir el diálogo de detalles desde una notificación
  useEffect(() => {
    const fetchAndDisplayVehicle = async (vehicleId: string) => {
      try {
        // 1. Hacemos un fetch para obtener los datos completos y actualizados del vehículo.
        const response = await fetch(`/api/admin/vehicles/${vehicleId}`);
        const result = await response.json();

        if (result.success) {
          const fullVehicleData: VehicleDataFrontend = result.data;

          // 2. Abrimos el modal de detalles con los datos completos.
          setSelectedVehicle(fullVehicleData);

          // 3. Añadimos o actualizamos el vehículo en la lista principal.
          setAllVehicles((prevVehicles) => {
            const vehicleIndex = prevVehicles.findIndex(
              (v) => v._id === fullVehicleData._id
            );
            if (vehicleIndex > -1) {
              // Si ya existe, lo actualizamos por si acaso.
              const updatedVehicles = [...prevVehicles];
              updatedVehicles[vehicleIndex] = fullVehicleData;
              return updatedVehicles;
            }
            // Si no existe, lo añadimos al principio.
            return [fullVehicleData, ...prevVehicles];
          });
        } else {
          console.error(
            "Error al obtener datos del vehículo desde la notificación:",
            result.error
          );
        }
      } catch (e) {
        console.error("Error en fetchAndDisplayVehicle:", e);
      } finally {
        // Reseteamos el disparador independientemente del resultado.
        setVehicleFromNotification(null);
      }
    };

    if (vehicleFromNotification?._id) {
      fetchAndDisplayVehicle(vehicleFromNotification._id);
    }
  }, [vehicleFromNotification, setAllVehicles]);

  // Lógica centralizada para filtrar, ordenar y paginar los vehículos.
  // Esto reemplaza la lógica defectuosa del hook y los useEffect anteriores.
  const displayedVehicles = useMemo(() => {
    // 1. Filtrar
    const filtered = filterVehicles(allVehicles, filters);

    // 2. Ordenar
    const sorted = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return (
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
          );
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "views":
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    // 3. Paginar
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;

    return sorted.slice(startIndex, endIndex);
  }, [allVehicles, filters, pagination]);

  // Efecto para actualizar el total de items en la paginación cuando los filtros cambian.
  useEffect(() => {
    const filteredCount = filterVehicles(allVehicles, filters).length;

    if (pagination.totalItems !== filteredCount) {
      // Resetea a la página 1 cuando los filtros cambian el total de resultados
      updatePagination({ totalItems: filteredCount, currentPage: 1 });
    }
  }, [allVehicles, filters, pagination.totalItems, updatePagination]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-base md:text-lg">
            Cargando panel de administrador...
          </p>
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
            <h2 className="text-lg md:text-xl font-bold mb-2">
              Acceso Denegado
            </h2>
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
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm md:text-base">
              {error}
            </p>
            <Button
              onClick={fetchVehicles}
              size="sm"
              className="w-full sm:w-auto"
            >
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
        type: "admin",
      };

      // En una implementación real, harías:
      // const response = await fetch(`/api/admin/vehicles/${vehicleId}/comments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ comment })
      // });

      setVehicleComments((prev) => [newComment, ...prev]);
      setCommentText("");
      setShowCommentDialog(false);

      // Agregar entrada al historial
      const historyEntry: VehicleHistoryEntry = {
        id: Date.now().toString(),
        action: "Comentario agregado",
        details: `Se agregó un comentario: "${comment.substring(0, 50)}${
          comment.length > 50 ? "..." : ""
        }"`,
        author: "Admin",
        timestamp: new Date().toISOString(),
      };

      setVehicleHistory((prev) => [historyEntry, ...prev]);
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
          type: "admin",
        },
        {
          id: "2",
          text: "Estado cambiado automáticamente a pendiente",
          author: "Sistema",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          type: "system",
        },
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
          newValue: "approved",
        },
        {
          id: "2",
          action: "Vehículo creado",
          details: "Vehículo registrado en el sistema",
          author: "Sistema",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "3",
          action: "Comprobante subido",
          details: "Comprobante de pago adjuntado",
          author: "Usuario",
          timestamp: new Date(Date.now() - 90000000).toISOString(),
        },
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

  // const getStatusBadge = (status: string) => {
  //   const variants = {
  //     pending: {
  //       variant: "secondary" as const,
  //       icon: Clock,
  //       text: "Pendiente",
  //       className:
  //         "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  //     },
  //     approved: {
  //       variant: "default" as const,
  //       icon: CheckCircle,
  //       text: "Aprobado",
  //       className:
  //         "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  //     },
  //     rejected: {
  //       variant: "destructive" as const,
  //       icon: XCircle,
  //       text: "Rechazado",
  //       className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  //     },
  //   };

  //   const config =
  //     variants[status as keyof typeof variants] || variants.pending;
  //   const Icon = config.icon;

  //   return (
  //     <Badge
  //       variant={config.variant}
  //       className={`flex items-center gap-1 text-xs ${config.className}`}
  //     >
  //       <Icon className="w-3 h-3" />
  //       <span className="hidden xs:inline">{config.text}</span>
  //     </Badge>
  //   );
  // };

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

  const handleBulkAction = async (action: ApprovalStatusType) => {
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
    const allIds = new Set(displayedVehicles.map((v) => v._id!));
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
        "Email Vendedor",
        "Teléfono Vendedor",
        "Fecha Creación",
      ],
      ...allVehicles.map((v) =>
        [
          v._id,
          `"${v.brand}"`,
          `"${v.model}"`,
          v.year,
          v.price,
          v.status,
          `"${v.location.replace(/"/g, '""')}"`,
          `"${v.sellerContact.name.replace(/"/g, '""')}"`,
          v.sellerContact.email,
          v.sellerContact.phone,
          v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vehiculos_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`min-h-screen p-2 sm:p-4 lg:p-6 ${
        isDarkMode
          ? "bg-slate-900 text-slate-200"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header mejorado */}
        <Card
          className={isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white"}
        >
          <CardHeader className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 md:gap-3">
                  <Car className="w-6 h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0" />
                  <span className="truncate">Panel de Administrador</span>
                </CardTitle>
                <p className="text-slate-500 dark:text-slate-400 mt-1 md:mt-2 text-sm md:text-base">
                  Gestiona los anuncios de vehículos y comprobantes de pago
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <NotificationBell
                  onNotificationClick={setVehicleFromNotification}
                />
                <Button
                  onClick={exportData}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden xs:inline">Exportar</span>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <Link href="/adminPanel/dashboard">
                    <BarChart2 className="w-4 h-4 mr-2" />
                    <span className="hidden xs:inline">Dashboard</span>
                  </Link>
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
          className={isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white"}
        >
          <CardContent className="p-3 md:p-6">
            {viewMode === "grid" ? (
              <VehicleGridView
                vehicles={displayedVehicles}
                onStatusChange={handleStatusChange}
                onVehicleSelect={setSelectedVehicle}
                isDarkMode={isDarkMode}
              />
            ) : (
              <VehicleListView
                vehicles={displayedVehicles}
                selectedVehicles={selectedVehicles}
                isDarkMode={isDarkMode}
                onToggleSelection={toggleVehicleSelection}
                onClearSelection={clearSelection}
                onStatusChange={handleStatusChange}
                onVehicleSelect={setSelectedVehicle}
                onShowRejectDialog={(id) => {
                  setVehicleToReject(id);
                  setShowRejectDialog(true);
                }}
                onShowCommentDialog={(id) => {
                  setVehicleToComment(id);
                  loadVehicleComments(id);
                  setShowCommentDialog(true);
                }}
                onShowHistoryDialog={() => {
                  loadVehicleHistory();
                  setShowHistoryDialog(true);
                }}
                onShowDeleteDialog={(id) => {
                  setVehicleToDelete(id);
                  setShowDeleteDialog(true);
                }}
                onBulkAction={handleBulkAction}
              />
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

      {/* Dialog para ver detalles del vehículo (Refactorizado y único) */}
      <Dialog
        open={!!selectedVehicle}
        onOpenChange={(open) => !open && setSelectedVehicle(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedVehicle?.brand} {selectedVehicle?.model} (
              {selectedVehicle?.year})
            </DialogTitle>
          </DialogHeader>
          {selectedVehicle && (
            <ScrollArea className="pr-6 -mr-6 h-[70vh]">
              <div className="space-y-6 p-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedVehicle.images.map((image, index) => (
                    <div key={index} className="relative aspect-video">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${selectedVehicle.brand} ${
                          selectedVehicle.model
                        } - ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 border-b pb-2">
                      Especificaciones
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li>
                        <strong>Categoría:</strong> {selectedVehicle.category}
                      </li>
                      <li>
                        <strong>Subcategoría:</strong>{" "}
                        {selectedVehicle.subcategory}
                      </li>
                      <li>
                        <strong>Motor:</strong> {selectedVehicle.engine}
                      </li>
                      <li>
                        <strong>Puertas:</strong> {selectedVehicle.doors}
                      </li>
                      <li>
                        <strong>Asientos:</strong> {selectedVehicle.seats}
                      </li>
                      <li>
                        <strong>Condición:</strong> {selectedVehicle.condition}
                      </li>
                      <li>
                        <strong>Precio:</strong> {selectedVehicle.currency}{" "}
                        {selectedVehicle.price.toLocaleString()}
                        {selectedVehicle.isNegotiable && " (Negociable)"}
                      </li>
                      <li>
                        <strong>Tracción:</strong>{" "}
                        {selectedVehicle.driveType || "N/A"}
                      </li>
                      <li>
                        <strong>Cilindraje:</strong>{" "}
                        {selectedVehicle.displacement || "N/A"}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 border-b pb-2">
                      Características
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVehicle.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <h4 className="font-semibold mt-4 mb-2 border-b pb-2">
                      Documentación
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVehicle.documentation &&
                      selectedVehicle.documentation.length > 0 ? (
                        selectedVehicle.documentation.map((doc, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-green-500 text-green-700"
                          >
                            {doc}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          No se especificó documentación.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 border-b pb-2">
                    Descripción
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedVehicle.description}
                  </p>
                </div>

                {/* Información de Pago */}
                {(selectedVehicle.paymentProof ||
                  selectedVehicle.referenceNumber) && (
                  <div>
                    <h4 className="font-semibold mb-2 border-b pb-2">
                      Información de Pago
                    </h4>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-4">
                      {selectedVehicle.referenceNumber && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Número de Referencia:
                          </span>
                          <span className="text-sm font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                            {selectedVehicle.referenceNumber}
                          </span>
                        </div>
                      )}
                      {selectedVehicle.paymentProof && (
                        <PdfViewer
                          url={selectedVehicle.paymentProof}
                          vehicleId={selectedVehicle._id!}
                          isDarkMode={isDarkMode}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para rechazar con razón */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="mx-4 max-w-md sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base md:text-lg">
              Rechazar anuncio
            </AlertDialogTitle>
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
            <AlertDialogCancel className="w-full sm:w-auto">
              Cancelar
            </AlertDialogCancel>
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
                          comment.type === "admin" // El estilo de comentario de admin con azul se ve bien
                            ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                            : "bg-slate-100 dark:bg-slate-700 border-l-4 border-slate-400"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="font-medium text-sm">
                              {comment.author}
                            </span>
                            <Badge
                              variant={
                                comment.type === "admin"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {comment.type === "admin" ? "Admin" : "Sistema"}
                            </Badge>
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
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
              onClick={() =>
                vehicleToComment &&
                handleAddComment(vehicleToComment, commentText)
              }
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
                        <div className="absolute left-4 top-8 w-0.5 h-full bg-slate-300 dark:bg-slate-700"></div>
                      )}

                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            {entry.action.includes("Estado") ? (
                              <RefreshCw className="w-4 h-4 text-blue-600" />
                            ) : entry.action.includes("creado") ? (
                              <Plus className="w-4 h-4 text-green-600" />
                            ) : entry.action.includes("Comentario") ? (
                              <MessageSquare className="w-4 h-4 text-purple-600" />
                            ) : (
                              <FileText className="w-4 h-4 text-slate-600" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm">
                              {entry.action}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              {new Date(entry.timestamp).toLocaleString()}
                            </div>
                          </div>

                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {entry.details}
                          </p>

                          {entry.oldValue && entry.newValue && (
                            <div className="flex items-center gap-2 text-xs">
                              <Badge
                                variant="outline"
                                className="bg-red-50 text-red-700"
                              >
                                {entry.oldValue}
                              </Badge>
                              <span>→</span>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700"
                              >
                                {entry.newValue}
                              </Badge>
                            </div>
                          )}

                          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                            <User className="w-3 h-3" />
                            <span>por {entry.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
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
              ¿Estás seguro de que quieres eliminar este vehículo? Esta acción
              no se puede deshacer. Se eliminará permanentemente toda la
              información, imágenes y comprobantes asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium text-sm">Advertencia</span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              Esta acción es irreversible. Todos los datos del vehículo se
              perderán permanentemente.
            </p>
          </div>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                vehicleToDelete && handleDeleteVehicle(vehicleToDelete)
              }
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