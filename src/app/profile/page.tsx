// src/app/profile/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import UserProfileCard from "@/components/features/profile/UserProfileCard";
import UserVehicleList from "@/components/features/profile/UserVehicleList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Car, Heart, Settings, BarChart3, TrendingUp, Eye } from "lucide-react";
import { getUserStats } from "@/lib/actions/profile.actions";

export const metadata: Metadata = {
  title: "Mi Perfil - AutoMarket",
  description: "Gestiona tu información personal, tus vehículos publicados y más.",
};

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    redirect("/login?callbackUrl=/profile");
  }

  const stats = await getUserStats(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header con gradiente sutil */}
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Mi Perfil
        </h1>
        <p className="text-muted-foreground">
          Gestiona tu cuenta y tus publicaciones desde un solo lugar
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Sidebar - Perfil del usuario */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-6 space-y-6">
            <UserProfileCard user={session.user} />
          </div>
        </aside> 

        {/* Main Content */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Tarjeta de estadísticas mejorada */}
          <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-heading">Estadísticas</CardTitle>
                    <p className="text-sm text-muted-foreground">Resumen de tu actividad</p>
                  </div>
                </div>
                <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Actualizado
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Publicados */}
                <div className="group relative overflow-hidden rounded-xl border border-border/50 p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 bg-gradient-to-br from-green-500/5 to-transparent">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
                        <Car className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <TrendingUp className="w-4 h-4 text-green-600/50 dark:text-green-400/50" />
                    </div>
                    <div className="text-3xl font-bold font-heading mb-1 text-green-700 dark:text-green-400">
                      {stats.published}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Publicados</div>
                  </div>
                </div>

                {/* Pendientes */}
                <div className="group relative overflow-hidden rounded-xl border border-border/50 p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 bg-gradient-to-br from-amber-500/5 to-transparent">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors duration-300">
                        <Settings className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {stats.pending}
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold font-heading mb-1 text-amber-700 dark:text-amber-400">
                      {stats.pending}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Pendientes</div>
                  </div>
                </div>

                {/* Vistas totales */}
                <div className="group relative overflow-hidden rounded-xl border border-border/50 p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 bg-gradient-to-br from-blue-500/5 to-transparent">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                        <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <TrendingUp className="w-4 h-4 text-blue-600/50 dark:text-blue-400/50" />
                    </div>
                    <div className="text-3xl font-bold font-heading mb-1 text-blue-700 dark:text-blue-400">
                      {stats.views.toLocaleString()}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Vistas totales</div>
                  </div>
                </div>

                {/* Favoritos */}
                <div className="group relative overflow-hidden rounded-xl border border-border/50 p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 bg-gradient-to-br from-red-500/5 to-transparent">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors duration-300">
                        <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <Heart className="w-4 h-4 text-red-600/50 dark:text-red-400/50 fill-red-600/20 dark:fill-red-400/20" />
                    </div>
                    <div className="text-3xl font-bold font-heading mb-1 text-red-700 dark:text-red-400">
                      {stats.favorites}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Favoritos</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Panel de vehículos */}
          <Card className="overflow-hidden border-border/50 shadow-sm">
            <CardContent className="p-0">
              <Tabs defaultValue="vehicles" className="w-full">
                <TabsContent value="vehicles" className="m-0">
                  <UserVehicleList />
                </TabsContent>
                <TabsContent value="favorites" className="p-6">
                  <div className="flex flex-col items-center justify-center p-16 text-center">
                    <div className="p-6 rounded-full bg-gradient-to-br from-red-500/10 to-pink-500/10 mb-6">
                      <Heart className="w-16 h-16 text-red-500 dark:text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold font-heading mb-3">Tus favoritos</h3>
                    <p className="text-muted-foreground mb-8 max-w-md">
                      Aquí verás todos los vehículos que has guardado como favoritos.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="p-6">
                  <div className="flex flex-col items-center justify-center p-16 text-center">
                    <div className="p-6 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
                      <Settings className="w-16 h-16 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold font-heading mb-3">Configuración</h3>
                    <p className="text-muted-foreground mb-8 max-w-md">
                      Aquí podrás ajustar tu perfil y preferencias de la aplicación.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;