// src/components/features/admin/AnalyticsDashboard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  isDarkMode: boolean;
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
      ? "text-green-500"
      : trend === "down"
        ? "text-red-500"
        : "text-gray-500";

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 ${colorClass}`} />
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
  <Card className="dark:bg-slate-800/60 dark:border-slate-700">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando Analíticas
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-slate-400">Cargando datos de analíticas...</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ErrorCard = ({ error }: { error: string }) => (
  <Card className="border-red-500/50 bg-red-50 dark:bg-red-900/20 dark:border-red-500/30">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-300">
        <XCircle className="h-5 w-5" />
        Error en Dashboard
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-red-700 dark:text-red-400">{error}</p>
    </CardContent>
  </Card>
);

const StatusDistributionChart = ({
  statusCounts,
  isDarkMode,
}: {
  statusCounts: AnalyticsData["statusCounts"];
  isDarkMode: boolean;
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
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">No hay datos disponibles</p>
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
            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
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
            backgroundColor: isDarkMode
              ? "rgba(15, 23, 42, 0.9)" // slate-900
              : "rgba(255, 255, 255, 0.95)",
            borderColor: isDarkMode ? "hsl(215 28% 17%)" : "#e2e8f0", // slate-800, slate-200
            color: isDarkMode ? "#fff" : "#333",
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
  isDarkMode,
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
          colorClass="text-blue-600 dark:text-blue-400"
          className="dark:bg-blue-900/20 dark:border-blue-700/50 border-l-4 border-l-blue-500"
        />
        <StatCard
          title="Precio Promedio"
          value={formatPrice(generalStats.averagePrice)}
          icon={DollarSign}
          colorClass="text-green-600 dark:text-green-400"
          className="dark:bg-green-900/20 dark:border-green-700/50 border-l-4 border-l-green-500"
        />
        <StatCard
          title="Vistas Totales"
          value={formatNumber(generalStats.totalViews)}
          icon={Eye}
          colorClass="text-purple-600 dark:text-purple-400"
          className="dark:bg-purple-900/20 dark:border-purple-700/50 border-l-4 border-l-purple-500"
        />
        <StatCard
          title="Tasa de Aprobación"
          value={`${approvalRate.toFixed(1)}%`}
          icon={CheckCircle}
          colorClass="text-emerald-600 dark:text-emerald-400"
          className="dark:bg-emerald-900/20 dark:border-emerald-700/50 border-l-4 border-l-emerald-500"
        />
      </div>

      {/* Estados de Vehículos */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Vehículos Pendientes" value={statusCounts.pending || 0} icon={Clock} colorClass="text-yellow-600 dark:text-yellow-400" className="dark:bg-yellow-900/20 dark:border-yellow-700/50" />
        <StatCard
          title="Vehículos Aprobados"
          value={statusCounts.approved || 0}
          icon={CheckCircle}
          colorClass="text-green-600 dark:text-green-400"
          className="dark:bg-green-900/20 dark:border-green-700/50"
        />
        <StatCard
          title="Vehículos Rechazados"
          value={statusCounts.rejected || 0}
          icon={XCircle}
          colorClass="text-red-600 dark:text-red-400"
          className="dark:bg-red-900/20 dark:border-red-700/50"
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico de Publicaciones por Mes */}
        <Card className="dark:bg-slate-800/60 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Publicaciones por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            {publicationChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={publicationChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "hsl(222 47% 11% / 0.5)" : "#e2e8f0"}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: isDarkMode ? "#94a3b8" : "#64748b",
                      fontSize: 12,
                    }}
                    axisLine={{ stroke: isDarkMode ? "#475569" : "#cbd5e1" }}
                  />
                  <YAxis
                    tick={{
                      fill: isDarkMode ? "#94a3b8" : "#64748b",
                      fontSize: 12,
                    }}
                    axisLine={{ stroke: isDarkMode ? "#475569" : "#cbd5e1" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode
                        ? "rgba(15, 23, 42, 0.9)" // slate-900
                        : "rgba(255, 255, 255, 0.95)",
                      border: `1px solid ${isDarkMode ? "hsl(215 28% 17%)" : "#e2e8f0"}`, // slate-800, slate-200
                      color: isDarkMode ? "#f1f5f9" : "#0f172a", // slate-100, slate-900
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
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">
                  No hay datos de publicaciones disponibles
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribución de Estados */}
        <Card className="dark:bg-slate-800/60 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Distribución de Estados</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusDistributionChart
              statusCounts={statusCounts}
              isDarkMode={isDarkMode}
            />
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Precios por Categoría */}
      <Card className="dark:bg-slate-800/60 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Precio Promedio por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryPriceChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={categoryPriceChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? "hsl(222 47% 11% / 0.5)" : "#e2e8f0"}
                />
                <XAxis
                  dataKey="name"
                  tick={{
                    fill: isDarkMode ? "#94a3b8" : "#64748b",
                    fontSize: 12,
                  }}
                  axisLine={{ stroke: isDarkMode ? "#475569" : "#cbd5e1" }}
                />
                <YAxis
                  tickFormatter={(value) => `$${Number(value) / 1000}k`}
                  tick={{
                    fill: isDarkMode ? "#94a3b8" : "#64748b",
                    fontSize: 12,
                  }}
                  axisLine={{ stroke: isDarkMode ? "#475569" : "#cbd5e1" }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatPrice(value),
                    name,
                  ]}
                  labelFormatter={(label) => `Categoría: ${label}`}
                  contentStyle={{
                    backgroundColor: isDarkMode
                      ? "rgba(15, 23, 42, 0.9)" // slate-900
                      : "rgba(255, 255, 255, 0.95)",
                    border: `1px solid ${isDarkMode ? "hsl(215 28% 17%)" : "#e2e8f0"}`, // slate-800, slate-200
                    color: isDarkMode ? "#f1f5f9" : "#0f172a", // slate-100, slate-900
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
            <div className="flex items-center justify-center h-[400px]">
              <p className="text-muted-foreground">
                No hay datos de categorías disponibles
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
