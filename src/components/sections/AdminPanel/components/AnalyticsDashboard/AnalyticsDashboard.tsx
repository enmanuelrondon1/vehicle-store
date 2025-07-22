// src/components/sections/AdminPanel/components/AnalyticsDashboard/AnalyticsDashboard.tsx
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
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  Car,
} from "lucide-react";

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
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  colorClass,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 text-muted-foreground ${colorClass}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export const AnalyticsDashboard = ({
  data,
  isDarkMode,
}: AnalyticsDashboardProps) => {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard de Analíticas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cargando datos de analíticas...</p>
        </CardContent>
      </Card>
    );
  }

  const {
    generalStats,
    statusCounts,
    monthlyPublications,
    avgPriceByCategory,
  } = data;

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
  const publicationChartData = monthlyPublications.map((item) => ({
    name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    Publicaciones: item.count,
  }));

  const categoryPriceChartData = avgPriceByCategory.map((item) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    "Precio Promedio": Math.round(item.averagePrice),
  }));

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="space-y-4">
      {/* Fila de Estadísticas Rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vehículos"
          value={generalStats.totalVehicles}
          icon={Car}
          colorClass="text-blue-500"
        />
        <StatCard
          title="Vehículos Pendientes"
          value={statusCounts.pending || 0}
          icon={Clock}
          colorClass="text-yellow-500"
        />
        <StatCard
          title="Vehículos Aprobados"
          value={statusCounts.approved || 0}
          icon={CheckCircle}
          colorClass="text-green-500"
        />
        <StatCard
          title="Vehículos Rechazados"
          value={statusCounts.rejected || 0}
          icon={XCircle}
          colorClass="text-red-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <StatCard
          title="Precio Promedio"
          value={formatPrice(generalStats.averagePrice)}
          icon={DollarSign}
          colorClass="text-green-500"
        />
        <StatCard
          title="Vistas Totales"
          value={generalStats.totalViews.toLocaleString()}
          icon={Eye}
          colorClass="text-purple-500"
        />
      </div>

      {/* Fila de Gráficos */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Publicaciones por Mes (Últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={publicationChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#333" : "#fff",
                    border: "1px solid #ccc",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Publicaciones"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Precio Promedio por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPriceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <Tooltip
                  formatter={(value: number) => formatPrice(value)}
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#333" : "#fff",
                    border: "1px solid #ccc",
                  }}
                />
                <Legend />
                <Bar dataKey="Precio Promedio" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
