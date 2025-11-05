// src/app/api/admin/verify-action/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/authOptions";

// 1. Asegúrate de que estas variables de entorno estén en tu archivo .env.local
const hashedPassword = process.env.SUPER_ADMIN_PASSWORD_HASH;
const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;

export async function POST(req: Request) {
  try {
    // --- Verificación de Seguridad ---
    const session = await getServerSession(authOptions);

    // Solo los administradores autenticados pueden intentar esta acción
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "No autorizado." }, { status: 403 });
    }

    if (!hashedPassword || !superAdminEmail) {
      console.error("CRITICAL: Las variables de entorno SUPER_ADMIN_PASSWORD_HASH o SUPER_ADMIN_EMAIL no están configuradas.");
      return NextResponse.json({ success: false, error: "Error de configuración del servidor." }, { status: 500 });
    }

    // --- Lógica de Verificación ---
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ success: false, error: "La contraseña es requerida." }, { status: 400 });
    }

    // Comparar la contraseña proporcionada con el hash almacenado
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return NextResponse.json({ success: false, error: "La contraseña de autorización es incorrecta." }, { status: 401 });
    }

    // Si la contraseña es correcta, devolver éxito
    return NextResponse.json({ success: true, message: "Verificación exitosa." });

  } catch (error) {
    console.error("Error en /api/admin/verify-action:", error);
    return NextResponse.json({ success: false, error: "Ocurrió un error en el servidor." }, { status: 500 });
  }
}