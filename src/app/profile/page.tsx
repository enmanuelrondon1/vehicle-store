// src/app/profile/page.tsx
"use client";

import { redirect } from "next/navigation";
import UserProfileCard from "@/components/features/profile/UserProfileCard";
import UserVehicleList from "@/components/features/profile/UserVehicleList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Car, Heart, Settings, BarChart3, TrendingUp, Eye, Plus, Star, Shield, Clock, MapPin, Zap, Award, Activity } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const [session, setSession] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("vehicles");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener sesión del cliente
        const response = await fetch("/api/auth/session");
        const sessionData = await response.json();
        
        if (!sessionData || !sessionData.user || !sessionData.user.id) {
          redirect("/login?callbackUrl=/profile");
          return;
        }

        setSession(sessionData);
        
        // Obtener estadísticas
        const statsResponse = await fetch(`/api/user/stats?id=${sessionData.user.id}`);
        const userStats = await statsResponse.json();
        setStats(userStats);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 pt-4 pb-8 px-4 mt-16 md:mt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-xl animate-pulse"></div>
          </div>
          <p className="mt-6 text-muted-foreground font-medium">Cargando tu perfil...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '150ms' }}></div>
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session || !session.user || !session.user.id) {
    return null; // El useEffect ya redirigirá si es necesario
  }

  // Calcular porcentajes para las barras de progreso
  const calculatePercentage = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 pt-4 pb-8 px-4 mt-16 md:mt-16">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header premium mejorado con efecto de onda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-xl border-0 overflow-hidden card-glass relative">
            {/* Efecto de onda superior */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50"></div>
            
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 shimmer-effect">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
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
                  <Button variant="outline" size="sm" className="btn-premium" asChild>
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
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Sidebar - Perfil del usuario */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="sticky top-6 space-y-6"
            >
              <UserProfileCard user={session.user} />
              
              {/* Tarjeta de nivel premium */}
              <Card className="shadow-lg border-0 overflow-hidden card-glass">
                <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500"></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold font-heading">Mi Nivel</h3>
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
                      <motion.div 
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                      ></motion.div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Publica 3 anuncios más para alcanzar el siguiente nivel
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Tarjeta de estadísticas premium mejorada */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-xl border-0 overflow-hidden card-glass">
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50"></div>
                
                <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BarChart3 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                      </div>
                      <div>
                        <CardTitle className="text-xl font-heading">Estadísticas</CardTitle>
                        <p className="text-sm text-muted-foreground">Resumen de tu actividad</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="hidden sm:flex items-center gap-1 badge-premium">
                      <Activity className="w-3 h-3" />
                      Actualizado
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Publicados */}
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="group relative overflow-hidden rounded-xl border border-border/50 p-5 transition-all duration-300 hover:shadow-xl hover:border-primary/50 bg-gradient-to-br from-green-500/5 to-transparent"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10 group-hover:mr-0 group-hover:mt-0 transition-all duration-500"></div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
                            <Car className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">+12%</span>
                          </div>
                        </div>
                        <div className="text-3xl font-bold font-heading mb-1 text-green-700 dark:text-green-400">
                          {stats?.published || 0}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">Publicados</div>
                        
                        {/* Barra de progreso */}
                        <div className="mt-3 w-full bg-green-500/20 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            className="h-full bg-green-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${calculatePercentage(stats?.published || 0, 20)}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          ></motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Pendientes */}
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="group relative overflow-hidden rounded-xl border border-border/50 p-5 transition-all duration-300 hover:shadow-xl hover:border-primary/50 bg-gradient-to-br from-amber-500/5 to-transparent"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -mr-10 -mt-10 group-hover:mr-0 group-hover:mt-0 transition-all duration-500"></div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors duration-300">
                            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <Badge variant="secondary" className="text-xs badge-premium">
                            {stats?.pending || 0}
                          </Badge>
                        </div>
                        <div className="text-3xl font-bold font-heading mb-1 text-amber-700 dark:text-amber-400">
                          {stats?.pending || 0}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">Pendientes</div>
                        
                        {/* Barra de progreso */}
                        <div className="mt-3 w-full bg-amber-500/20 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            className="h-full bg-amber-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${calculatePercentage(stats?.pending || 0, 10)}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          ></motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Vistas totales */}
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="group relative overflow-hidden rounded-xl border border-border/50 p-5 transition-all duration-300 hover:shadow-xl hover:border-primary/50 bg-gradient-to-br from-blue-500/5 to-transparent"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10 group-hover:mr-0 group-hover:mt-0 transition-all duration-500"></div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex items-center text-blue-600 dark:text-blue-400">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">+24%</span>
                          </div>
                        </div>
                        <div className="text-3xl font-bold font-heading mb-1 text-blue-700 dark:text-blue-400">
                          {(stats?.views || 0).toLocaleString()}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">Vistas totales</div>
                        
                        {/* Barra de progreso */}
                        <div className="mt-3 w-full bg-blue-500/20 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            className="h-full bg-blue-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${calculatePercentage(stats?.views || 0, 10000)}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          ></motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Favoritos */}
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="group relative overflow-hidden rounded-xl border border-border/50 p-5 transition-all duration-300 hover:shadow-xl hover:border-primary/50 bg-gradient-to-br from-red-500/5 to-transparent"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -mr-10 -mt-10 group-hover:mr-0 group-hover:mt-0 transition-all duration-500"></div>
                      
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors duration-300">
                            <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex items-center text-red-600 dark:text-red-400">
                            <Zap className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">+8%</span>
                          </div>
                        </div>
                        <div className="text-3xl font-bold font-heading mb-1 text-red-700 dark:text-red-400">
                          {stats?.favorites || 0}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">Favoritos</div>
                        
                        {/* Barra de progreso */}
                        <div className="mt-3 w-full bg-red-500/20 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            className="h-full bg-red-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${calculatePercentage(stats?.favorites || 0, 50)}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          ></motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Panel de vehículos con tabs mejoradas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="shadow-xl border-0 overflow-hidden card-glass">
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse opacity-50"></div>
                
                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted/20 border-b border-border/50 h-14">
                      <TabsTrigger 
                        value="vehicles" 
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none transition-all duration-300"
                      >
                        <Car className="w-4 h-4 mr-2" />
                        Mis vehículos
                        {stats?.published > 0 && (
                          <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
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
                        {stats?.favorites > 0 && (
                          <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {stats?.favorites}
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
                    
                    <TabsContent value="vehicles" className="m-0 p-6 animate-fade-in">
                      <UserVehicleList />
                    </TabsContent>
                    
                    <TabsContent value="favorites" className="p-6 animate-fade-in">
                      <div className="flex flex-col items-center justify-center p-16 text-center">
                        <motion.div 
                          className="p-6 rounded-full bg-gradient-to-br from-red-500/10 to-pink-500/10 mb-6 relative"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart className="w-16 h-16 text-red-500" />
                          <motion.div 
                            className="absolute inset-0 rounded-full bg-red-500/20"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          ></motion.div>
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-3 font-heading text-gradient-primary">
                          Tus favoritos
                        </h3>
                        <p className="text-muted-foreground mb-8 max-w-md">
                          Aquí verás todos los vehículos que has guardado como favoritos.
                        </p>
                        <Button className="btn-primary" asChild>
                          <Link href="/my-favorites">
                            Ver favoritos
                          </Link>
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="settings" className="p-6 animate-fade-in">
                      <div className="flex flex-col items-center justify-center p-16 text-center">
                        <motion.div 
                          className="p-6 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-6 relative"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Settings className="w-16 h-16 text-primary" />
                          <motion.div 
                            className="absolute inset-0 rounded-full bg-primary/20"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          ></motion.div>
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-3 font-heading text-gradient-primary">
                          Configuración
                        </h3>
                        <p className="text-muted-foreground mb-8 max-w-md">
                          Aquí podrás ajustar tu perfil y preferencias de la aplicación.
                        </p>
                        <Button className="btn-primary">
                          Configurar perfil
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;