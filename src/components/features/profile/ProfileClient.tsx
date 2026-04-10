// src/components/features/profile/ProfileClient.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Car,
  Heart,
  Settings,
  BarChart3,
  TrendingUp,
  Eye,
  Plus,
  Zap,
  Award,
  Activity,
  Clock,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import ProfileFavoritesList from "./ProfileFavoritesList";

// ✅ FIX #1: Lazy load componentes pesados — no se descargan hasta que se necesitan
const UserProfileCard = dynamic(() => import("./UserProfileCard"), {
  loading: () => <ProfileCardSkeleton />,
  ssr: false,
});

const UserVehicleList = dynamic(() => import("./UserVehicleList"), {
  loading: () => <VehicleListSkeleton />,
  ssr: false,
});

interface UserStats {
  published: number;
  pending: number;
  views: number;
  favorites: number; // recibidos por otros
  myFavorites: number; // guardados por ti
}

// ✅ FIX #2: Skeletons para los lazy components
function ProfileCardSkeleton() {
  return (
    <div className="space-y-4 p-6 rounded-xl border border-border/50 bg-card">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

function VehicleListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

const calculatePercentage = (value: number, max: number) =>
  Math.min((value / max) * 100, 100);

// ✅ FIX #3: ProgressBar sin framer-motion — CSS puro es más performante
const ProgressBar = ({ value, color }: { value: number; color: string }) => (
  <div className="mt-3 w-full bg-muted/40 rounded-full h-1.5 overflow-hidden">
    <div
      className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
      style={{ width: `${value}%` }}
    />
  </div>
);

const StatCard = ({
  icon: Icon,
  iconColor,
  bgColor,
  barColor,
  label,
  value,
  trend,
  trendIcon: TrendIcon,
  max,
}: {
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  barColor: string;
  label: string;
  value: number;
  trend: string;
  trendIcon: React.ElementType;
  max: number;
}) => (
  // ✅ FIX #4: hover con CSS Tailwind puro — sin motion wrapper
  <div
    className={`group relative overflow-hidden rounded-xl border border-border/50 p-5 transition-all duration-300 hover:shadow-xl hover:border-primary/50 bg-gradient-to-br ${bgColor} hover:-translate-y-1`}
  >
    <div className="flex items-center justify-between mb-3">
      <div
        className={`p-2 rounded-lg ${bgColor} group-hover:opacity-80 transition-colors duration-300`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className={`flex items-center ${iconColor}`}>
        <TrendIcon className="w-4 h-4 mr-1" />
        <span className="text-xs font-medium">{trend}</span>
      </div>
    </div>
    <div className={`text-3xl font-bold font-heading mb-1 ${iconColor}`}>
      {value.toLocaleString()}
    </div>
    <div className="text-sm font-medium text-muted-foreground">{label}</div>
    <ProgressBar value={calculatePercentage(value, max)} color={barColor} />
  </div>
);

// ✅ FIX #5: Loading skeleton de página completa
function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 pt-4 pb-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 xl:col-span-3">
            <ProfileCardSkeleton />
          </div>
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
            <VehicleListSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activeTab, setActiveTab] = useState("vehicles");
  const hasFetched = useRef(false);

  // ✅ FIX #6: redirect correcto en Client Components — usar router.replace, no redirect()
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/profile");
    }
  }, [status, router]);

  // ✅ FIX #7: hasFetched ref evita double-fetch en StrictMode
  useEffect(() => {
    if (!session?.user?.id || hasFetched.current) return;
    hasFetched.current = true;

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/stats");
        if (res.ok) setStats(await res.json());
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, [session?.user?.id]);

  if (status === "loading") return <PageLoadingSkeleton />;
  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 pt-4 pb-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ✅ FIX #8: animate-in con CSS puro de Tailwind — sin framer-motion */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <Card className="shadow-xl border-0 overflow-hidden card-glass relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl font-heading text-gradient-primary">
                      Mi Perfil
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Gestiona tu cuenta y tus publicaciones desde un solo lugar
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-premium"
                    asChild
                  >
                    <Link href={siteConfig.paths.publishAd}>
                      <Plus className="mr-2 h-4 w-4" />
                      Publicar anuncio
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="btn-premium">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100 sticky top-6 space-y-6">
              {/* ✅ UserProfileCard se carga lazy */}
              <UserProfileCard user={session.user} />

              <Card className="shadow-lg border-0 overflow-hidden card-glass">
                <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500" />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold font-heading">
                      Mi Nivel
                    </h3>
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0">
                      <Award className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-1000"
                        style={{ width: "75%" }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Publica 3 anuncios más para alcanzar el siguiente nivel
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Estadísticas */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <Card className="shadow-xl border-0 overflow-hidden card-glass">
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <BarChart3 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-heading">
                          Estadísticas
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Resumen de tu actividad
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="hidden sm:flex items-center gap-1 badge-premium"
                    >
                      <Activity className="w-3 h-3" />
                      Actualizado
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* ✅ FIX #9: stats con skeleton mientras carga — evita el "pop" */}
                  {stats === null ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-28 rounded-xl" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <StatCard
                        icon={Car}
                        iconColor="text-green-600 dark:text-green-400"
                        bgColor="from-green-500/5"
                        barColor="bg-green-500"
                        label="Publicados"
                        value={stats.published}
                        trend={`${stats.published} activos`}
                        trendIcon={TrendingUp}
                        max={20}
                      />
                      <StatCard
                        icon={Clock}
                        iconColor="text-amber-600 dark:text-amber-400"
                        bgColor="from-amber-500/5"
                        barColor="bg-amber-500"
                        label="Pendientes"
                        value={stats.pending}
                        trend="En revisión"
                        trendIcon={Clock}
                        max={10}
                      />
                      <StatCard
                        icon={Eye}
                        iconColor="text-blue-600  dark:text-blue-400"
                        bgColor="from-blue-500/5"
                        barColor="bg-blue-500"
                        label="Vistas totales"
                        value={stats.views}
                        trend="Vistas reales"
                        trendIcon={TrendingUp}
                        max={10000}
                      />
                      <StatCard
                        icon={Heart}
                        iconColor="text-red-600 dark:text-red-400"
                        bgColor="from-red-500/5"
                        barColor="bg-red-500"
                        label="Guardados" // ← antes: "Favoritos"
                        value={stats.favorites}
                        trend="Por otros usuarios" // ← antes: "Guardados"
                        trendIcon={Zap}
                        max={50}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <Card className="shadow-xl border-0 overflow-hidden card-glass">
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <CardContent className="p-0">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 bg-muted/20 border-b border-border/50 h-14">
                      <TabsTrigger
                        value="vehicles"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none transition-all duration-300"
                      >
                        <Car className="w-4 h-4 mr-2" />
                        Mis vehículos
                        {(stats?.published ?? 0) > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {stats?.published}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger
                        value="favorites"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none transition-all duration-300"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Favoritos
                        {(stats?.myFavorites ?? 0) > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {stats?.myFavorites}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger
                        value="settings"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none transition-all duration-300"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configuración
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="vehicles"
                      className="m-0 p-6 animate-in fade-in duration-300"
                    >
                      {/* ✅ UserVehicleList se carga lazy solo cuando el tab está activo */}
                      <UserVehicleList />
                    </TabsContent>

                    <TabsContent
                      value="favorites"
                      className="p-6 animate-in fade-in duration-300"
                    >
                      <div className="flex flex-col items-center justify-center p-16 text-center">
                        <div className="p-6 rounded-full bg-gradient-to-br from-red-500/10 to-pink-500/10 mb-6 hover:scale-105 transition-transform duration-300">
                          <Heart className="w-16 h-16 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 font-heading text-gradient-primary">
                          Mi lista de favoritos
                        </h3>
                        <p className="text-muted-foreground mb-8 max-w-md">
                          Gestiona todos los vehículos que has guardado desde tu
                          página de favoritos.
                        </p>
                        <Button className="btn-primary" asChild>
                          <Link href="/my-favorites">
                            <Heart className="mr-2 h-4 w-4" />
                            Ir a mis favoritos
                          </Link>
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="settings"
                      className="p-6 animate-in fade-in duration-300"
                    >
                      <div className="flex flex-col items-center justify-center p-16 text-center">
                        <div className="p-6 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-6 hover:scale-105 transition-transform duration-300">
                          <Settings className="w-16 h-16 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 font-heading text-gradient-primary">
                          Configuración
                        </h3>
                        <p className="text-muted-foreground mb-8 max-w-md">
                          Aquí podrás ajustar tu perfil y preferencias de la
                          aplicación.
                        </p>
                        <Button className="btn-primary">
                          Configurar perfil
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
