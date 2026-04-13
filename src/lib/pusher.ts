// src/lib/pusher.ts
// ✅ OPTIMIZADO:
//    Antes: pusherServer y pusherClient se instanciaban juntos al importar el módulo.
//    El cliente de Pusher (~70KB) se ejecutaba en el servidor también.
//    Ahora: exports separados con lazy init para el cliente.
//    - pusherServer: solo para rutas de API (server-side)
//    - getPusherClient(): singleton lazy, solo se instancia en el browser

import PusherServer from "pusher";

// ── Server — solo se usa en API routes ───────────────────────────────────────
export const pusherServer = new PusherServer({
  appId:   process.env.PUSHER_APP_ID!,
  key:     process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret:  process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS:  true,
});

// ── Client — singleton lazy, nunca se ejecuta en el servidor ─────────────────
let pusherClientInstance: import("pusher-js").default | null = null;

export const getPusherClient = async () => {
  if (typeof window === "undefined") {
    throw new Error("getPusherClient() solo puede llamarse en el browser");
  }
  if (!pusherClientInstance) {
    const PusherClient = (await import("pusher-js")).default;
    pusherClientInstance = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      {
        cluster:      process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        authEndpoint: "/api/pusher/auth",
      }
    );
  }
  return pusherClientInstance;
};