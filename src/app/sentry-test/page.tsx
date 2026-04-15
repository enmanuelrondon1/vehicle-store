"use client";
import { useState } from "react";

export default function SentryTest() {
  const [enviado, setEnviado] = useState(false);

  const dispararError = () => {
    try {
      throw new Error("Test Sentry 1Auto.market ✅");
    } catch (e) {
      // Enviamos manualmente a Sentry
      import("@sentry/nextjs").then(({ captureException }) => {
        captureException(e);
        setEnviado(true);
      });
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Página de prueba Sentry</h1>
      <button
        onClick={dispararError}
        style={{ background: enviado ? "#22c55e" : "red", color: "white", padding: "15px 30px", borderRadius: "8px", fontSize: "18px", cursor: "pointer", marginTop: "20px", transition: "background 0.3s" }}
      >
        {enviado ? "✅ Error enviado a Sentry!" : "🔴 Disparar error de prueba"}
      </button>
      {enviado && (
        <p style={{ marginTop: "20px", color: "#22c55e", fontSize: "16px" }}>
          Revisa 1automarket.sentry.io/issues en 1-2 minutos
        </p>
      )}
    </div>
  );
}
