import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserProfileCard from "@/components/features/profile/UserProfileCard";
import UserVehicleList from "@/components/features/profile/UserVehicleList";

// Metadata para la página
export const metadata = {
  title: "Mi Perfil - AutoMarket",
  description: "Gestiona tu información personal, tus vehículos publicados y más.",
};

// Componente de la página de perfil
const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  // Si no hay sesión, redirigir al inicio de sesión
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/profile");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Tarjeta de perfil de usuario */}
        <UserProfileCard user={session.user} />

        {/* Sección de "Mis Anuncios" */}
        <section>
          <h2 className="text-3xl font-bold mb-6 border-b pb-2 text-gray-900 dark:text-white">Mis Anuncios</h2>
          <UserVehicleList />
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;