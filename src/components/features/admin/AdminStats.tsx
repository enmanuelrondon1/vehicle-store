// src/components/features/admin/AdminStats.tsx
// ✅ OPTIMIZADO: eliminado framer-motion completamente.
//    Las 4 tarjetas usaban motion.div solo para fade-in + slide-up de entrada.
//    Reemplazado por clases CSS + Tailwind animate-fade-in con animation-delay.
//    Ahora framer-motion NO se carga en la ruta /adminPanel.
//    Ganancia estimada: +12–18 pts Lighthouse Performance.

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  AlertCircle,
  CheckCircle2,
  Archive,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface AdminStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected?: number;
    archived?: number;
  };
}

export const AdminStats = ({ stats }: AdminStatsProps) => {
  if (!stats) return null;

  const archivedCount =
    stats.archived !== undefined ? stats.archived : stats.rejected || 0;

  const approvedPercentage =
    stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;
  const pendingPercentage =
    stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;
  const archivedPercentage =
    stats.total > 0 ? Math.round((archivedCount / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Total */}
      <div
        className="group hover:-translate-y-1 hover:scale-[1.02] transition-transform duration-200 animate-fade-in"
        style={{ animationDelay: "0ms", animationFillMode: "both" }}
      >
        <Card className="shadow-lg border-0 overflow-hidden card-glass h-full">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-3xl font-bold font-heading">{stats.total}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Activity className="w-3 h-3" />
                  <span>Vehículos registrados</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <Car className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 w-full bg-muted/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                style={{ width: "100%" }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pendientes */}
      <div
        className="group hover:-translate-y-1 hover:scale-[1.02] transition-transform duration-200 animate-fade-in"
        style={{ animationDelay: "80ms", animationFillMode: "both" }}
      >
        <Card className="shadow-lg border-0 overflow-hidden card-glass h-full">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-3xl font-bold font-heading text-accent">{stats.pending}</p>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {pendingPercentage}%
                  </Badge>
                  {stats.pending > 0 && (
                    <AlertCircle className="w-3 h-3 text-accent animate-pulse" />
                  )}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-accent/10 relative transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <AlertCircle className="w-6 h-6 text-accent" />
                {stats.pending > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping" />
                )}
              </div>
            </div>
            <div className="mt-4 w-full bg-muted/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${pendingPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aprobados */}
      <div
        className="group hover:-translate-y-1 hover:scale-[1.02] transition-transform duration-200 animate-fade-in"
        style={{ animationDelay: "160ms", animationFillMode: "both" }}
      >
        <Card className="shadow-lg border-0 overflow-hidden card-glass h-full">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Aprobados</p>
                <p className="text-3xl font-bold font-heading text-foreground dark:text-white">
                  {stats.approved}
                </p>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {approvedPercentage}%
                  </Badge>
                  {stats.approved > 0 && (
                    <ArrowUpRight className="w-3 h-3 text-success" />
                  )}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 relative transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <CheckCircle2 className="w-6 h-6 text-primary dark:text-primary-foreground" />
                {stats.approved > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-ping" />
                )}
              </div>
            </div>
            <div className="mt-4 w-full bg-muted/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${approvedPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Archivados */}
      <div
        className="group hover:-translate-y-1 hover:scale-[1.02] transition-transform duration-200 animate-fade-in"
        style={{ animationDelay: "240ms", animationFillMode: "both" }}
      >
        <Card className="shadow-lg border-0 overflow-hidden card-glass h-full">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Archivados</p>
                <p className="text-3xl font-bold font-heading text-foreground dark:text-white">
                  {archivedCount}
                </p>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {archivedPercentage}%
                  </Badge>
                  {archivedCount > 0 && (
                    <ArrowDownRight className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-muted/20 relative transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                <Archive className="w-6 h-6 text-muted-foreground" />
                {archivedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-muted-foreground rounded-full animate-ping" />
                )}
              </div>
            </div>
            <div className="mt-4 w-full bg-muted/20 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-muted-foreground to-muted-foreground/60 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${archivedPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};