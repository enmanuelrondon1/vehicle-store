//src/components/features/admin/AdminStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  AlertCircle, 
  CheckCircle2, 
  Archive,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

interface AdminStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected?: number; // Mantener por compatibilidad
    archived?: number; // Nueva propiedad
  };
}

export const AdminStats = ({ stats }: AdminStatsProps) => {
  if (!stats) return null;

  // Compatibilidad con ambas propiedades (rejected y archived)
  const archivedCount = stats.archived !== undefined ? stats.archived : (stats.rejected || 0);
  
  // Calcular porcentajes para mostrar tendencias
  const approvedPercentage = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;
  const pendingPercentage = stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;
  const archivedPercentage = stats.total > 0 ? Math.round((archivedCount / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de vehículos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group"
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
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 shimmer-effect"
              >
                <Car className="w-6 h-6 text-primary" />
              </motion.div>
            </div>
            
            {/* Barra de progreso visual */}
            <div className="mt-4 w-full bg-muted/20 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
              ></motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pendientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group"
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
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <AlertCircle className="w-3 h-3 text-accent" />
                    </motion.div>
                  )}
                </div>
              </div>
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="p-3 rounded-xl bg-accent/10 relative"
              >
                <AlertCircle className="w-6 h-6 text-accent" />
                {stats.pending > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Barra de progreso visual */}
            <div className="mt-4 w-full bg-muted/20 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pendingPercentage}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              ></motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Aprobados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group"
      >
        <Card className="shadow-lg border-0 overflow-hidden card-glass h-full">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Aprobados</p>
                <p className="text-3xl font-bold font-heading text-foreground dark:text-white">{stats.approved}</p>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {approvedPercentage}%
                  </Badge>
                  {stats.approved > 0 && (
                    <ArrowUpRight className="w-3 h-3 text-success" />
                  )}
                </div>
              </div>
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="p-3 rounded-xl bg-primary/10 relative"
              >
                <CheckCircle2 className="w-6 h-6 text-primary dark:text-primary-foreground" />
                {stats.approved > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Barra de progreso visual */}
            <div className="mt-4 w-full bg-muted/20 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${approvedPercentage}%` }}
                transition={{ duration: 1, delay: 0.7 }}
              ></motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Archivados (cambiado de "Rechazados") */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group"
      >
        <Card className="shadow-lg border-0 overflow-hidden card-glass h-full">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Archivados</p>
                <p className="text-3xl font-bold font-heading text-foreground dark:text-white">{archivedCount}</p>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {archivedPercentage}%
                  </Badge>
                  {archivedCount > 0 && (
                    <ArrowDownRight className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              </div>
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="p-3 rounded-xl bg-muted/20 relative"
              >
                <Archive className="w-6 h-6 text-muted-foreground" />
                {archivedCount > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-muted-foreground rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  ></motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Barra de progreso visual */}
            <div className="mt-4 w-full bg-muted/20 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-muted-foreground to-muted-foreground/60 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${archivedPercentage}%` }}
                transition={{ duration: 1, delay: 0.8 }}
              ></motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};