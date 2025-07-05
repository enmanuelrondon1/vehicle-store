// app/debug-logout/page.tsx
"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LogoutDebugPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState("");

  const testLogout1 = async () => {
    console.log("🔴 ANTES DEL LOGOUT:");
    console.log("Status:", status);
    console.log("Session:", session);
    
    setDebugInfo("Iniciando logout...");
    
    try {
      const result = await signOut({ 
        redirect: false,
        callbackUrl: "/" 
      });
      
      console.log("🟡 RESULTADO SIGNOUT:", result);
      setDebugInfo("SignOut ejecutado, redirigiendo...");
      
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
      
    } catch (error) {
      console.error("❌ ERROR EN SIGNOUT:", error);
      setDebugInfo(`Error: ${error}`);
    }
  };

  const testLogout2 = async () => {
    console.log("🔴 PRUEBA 2 - Logout directo:");
    
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("❌ ERROR:", error);
    }
  };

  const testLogout3 = async () => {
    console.log("🔴 PRUEBA 3 - Logout + reload:");
    
    try {
      await signOut({ redirect: false });
      window.location.href = "/";
    } catch (error) {
      console.error("❌ ERROR:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔧 Debug Logout</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold mb-2">Estado Actual de la Sesión:</h4>
            <div className="space-y-1 text-sm">
              <p><strong>Status:</strong> <span className={`px-2 py-1 rounded ${status === 'authenticated' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{status}</span></p>
              <p><strong>Usuario:</strong> {session?.user?.email || "No logueado"}</p>
              <p><strong>Nombre:</strong> {session?.user?.name || "N/A"}</p>
              <p><strong>Rol:</strong> {session?.user?.role || "N/A"}</p>
            </div>
          </div>

          {debugInfo && (
            <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              {debugInfo}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={testLogout1}
              className="block w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
              disabled={status !== "authenticated"}
            >
              🧪 Prueba 1: Logout + Router (Tu método actual)
            </button>

            <button
              onClick={testLogout2}
              className="block w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              disabled={status !== "authenticated"}
            >
              🧪 Prueba 2: Logout con Redirect Automático
            </button>

            <button
              onClick={testLogout3}
              className="block w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
              disabled={status !== "authenticated"}
            >
              🧪 Prueba 3: Logout + Window.location
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">📋 Instrucciones:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
              <li>Abre las DevTools del navegador (F12)</li>
              <li>Ve a la pestaña &quot;Console&quot;</li>
              <li>Presiona uno de los botones de prueba</li>
              <li>Observa los logs que aparecen en la consola</li>
              <li>Verifica si el estado cambia de &quot;authenticated&quot; a &quot;unauthenticated&quot;</li>
            </ol>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutDebugPage;