//src/app/sentry-test/page.tsx
"use client";

export default function SentryTest() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Página de prueba Sentry</h1>
      <button
        onClick={() => { throw new Error("Test Sentry 1Auto.market ✅") }}
        style={{ background: "red", color: "white", padding: "15px 30px", borderRadius: "8px", fontSize: "18px", cursor: "pointer", marginTop: "20px" }}
      >
        🔴 Disparar error de prueba
      </button>
    </div>
  );
}
