"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/"); // Redirigir a login tras cerrar sesión
  };

  return (
    <button
      onClick={handleLogout}
      className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
    >
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;