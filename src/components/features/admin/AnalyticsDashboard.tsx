// src/components/features/admin/AnalyticsDashboard.tsx
// VERSIÓN CON DISEÑO UNIFICADO

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  Car,
  TrendingUp,
  TrendingDown,
  Activity,
  Loader2,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { useMemo } from "react";

interface AnalyticsData {
  generalStats: {
    totalVehicles: number;
    averagePrice: number;
    totalViews: number;
  };
  statusCounts: {
    pending?: number;
    approved?: number;
    rejected?: number;
  };
  monthlyPublications: {
    _id: { year: number; month: number };
    count: number;
  }[];
  avgPriceByCategory: {
    _id: string;
    averagePrice: number;
    count: number;
  }[];
}

interface AnalyticsDashboardProps {
  data: AnalyticsData | null;
  isLoading?: boolean;
  error?: string;
}

// Constantes para colores de estado
const STATUS_COLORS = {
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
} as const;

const StatCard = ({
  title,
  value,
  icon: Icon,
  colorClass,
  className,
  trend,
  trendValue,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
  className?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}) => {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Activity;
  const trendColorClass =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
      ? "text-red-600"
      : "text-muted-foreground";

  return (
    <Card className={`shadow-sm border-border ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className={`h-4 w-4 ${colorClass}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{value}</div>
          {trend && trendValue && (
            <div className={`flex items-center text-xs ${trendColorClass}`}>
              <TrendIcon className="h-3 w-3 mr-1" />
              {trendValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingCard = () => (
  <Card className="shadow-sm border-border">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando Analíticas
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-center h-32">
        <div className="text-center space-y-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
          </div>
          <p className="text-sm text-muted-foreground">Cargando datos de analíticas...</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ErrorCard = ({ error }: { error: string }) => (
  <Card className="shadow-sm border-border">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-destructive">
        <XCircle className="h-5 w-5" />
        Error en Dashboard
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="p-4 rounded-xl border-2 border-destructive/20 bg-destructive/5">
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-2">
              Error al cargar datos
            </h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatusDistributionChart = ({
  statusCounts,
}: {
  statusCounts: AnalyticsData["statusCounts"];
}) => {
  const data = useMemo(
    () =>
      [
        {
          name: "Pendientes",
          value: statusCounts.pending || 0,
          color: STATUS_COLORS.pending,
        },
        {
          name: "Aprobados",
          value: statusCounts.approved || 0,
          color: STATUS_COLORS.approved,
        },
        {
          name: "Rechazados",
          value: statusCounts.rejected || 0,
          color: STATUS_COLORS.rejected,
        },
      ].filter((item) => item.value > 0),
    [statusCounts]
  );

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <div className="p-3 rounded-full bg-muted/50 mb-4">
          <PieChartIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          No hay datos disponibles
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          No hay vehículos registrados con diferentes estados para mostrar en este gráfico.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(Number(percent ?? 0) * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderColor: "#e2e8f0",
            color: "#333",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const AnalyticsDashboard = ({
  data,
  isLoading = false,
  error,
}: AnalyticsDashboardProps) => {
  // Memoización de datos procesados
  const { publicationChartData, categoryPriceChartData } = useMemo(() => {
    if (!data) {
      return { publicationChartData: [], categoryPriceChartData: [] };
    }
    const { monthlyPublications, avgPriceByCategory } = data;
    const monthNames = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    const publicationChartData = monthlyPublications
      .sort((a, b) => {
        if (a._id.year !== b._id.year) return a._id.year - b._id.year;
        return a._id.month - b._id.month;
      })
      .map((item) => ({
        name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        Publicaciones: item.count,
        fullDate: new Date(item._id.year, item._id.month - 1),
      }));

    const categoryPriceChartData = avgPriceByCategory
      .sort((a, b) => b.averagePrice - a.averagePrice)
      .map((item) => ({
        name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
        "Precio Promedio": Math.round(item.averagePrice),
        count: item.count,
      }));

    return { publicationChartData, categoryPriceChartData };
  }, [data]);

  // Estados de carga y error
  if (isLoading) return <LoadingCard />;
  if (error) return <ErrorCard error={error} />;
  if (!data) return <LoadingCard />;

  const { generalStats, statusCounts } = data;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Cálculo de métricas adicionales
  const totalStatusVehicles =
    (statusCounts.pending || 0) +
    (statusCounts.approved || 0) +
    (statusCounts.rejected || 0);
  const approvalRate =
    totalStatusVehicles > 0
      ? ((statusCounts.approved || 0) / totalStatusVehicles) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vehículos"
          value={formatNumber(generalStats.totalVehicles)}
          icon={Car}
          colorClass="text-primary"
        />
        <StatCard
          title="Precio Promedio"
          value={formatPrice(generalStats.averagePrice)}
          icon={DollarSign}
          colorClass="text-green-600"
        />
        <StatCard
          title="Vistas Totales"
          value={formatNumber(generalStats.totalViews)}
          icon={Eye}
          colorClass="text-purple-600"
        />
        <StatCard
          title="Tasa de Aprobación"
          value={`${approvalRate.toFixed(1)}%`}
          icon={CheckCircle}
          colorClass="text-emerald-600"
        />
      </div>

      {/* Estados de Vehículos */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Estados de Vehículos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-xl border-2 border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                  <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold">{statusCounts.pending || 0}</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aprobados</p>
                  <p className="text-2xl font-bold">{statusCounts.approved || 0}</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl border-2 border-red-500/20 bg-red-50/50 dark:bg-red-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rechazados</p>
                  <p className="text-2xl font-bold">{statusCounts.rejected || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico de Publicaciones por Mes */}
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5 text-primary" />
              Publicaciones por Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {publicationChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={publicationChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "#cbd5e1" }}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={{ stroke: "#cbd5e1" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e2e8f0",
                      color: "#333",
                      borderRadius: "0.5rem",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Publicaciones"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <div className="p-3 rounded-full bg-muted/50 mb-4">
                  <TrendingUpIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  No hay datos disponibles
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  No hay publicaciones registradas para mostrar en este gráfico.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribución de Estados */}
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Distribución de Estados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusDistributionChart statusCounts={statusCounts} />
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Precios por Categoría */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Precio Promedio por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoryPriceChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={categoryPriceChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  tickFormatter={(value) => `$${Number(value) / 1000}k`}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#cbd5e1" }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatPrice(value),
                    name,
                  ]}
                  labelFormatter={(label) => `Categoría: ${label}`}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e2e8f0",
                    color: "#333",
                    borderRadius: "0.5rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="Precio Promedio"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <div className="p-3 rounded-full bg-muted/50 mb-4">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                No hay datos disponibles
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                No hay categorías registradas para mostrar en este gráfico.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};