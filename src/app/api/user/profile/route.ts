import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { logger } from "@/lib/logger";

// Esquema de validación para los datos del perfil
const ProfileUpdateSchema = z.object({
  phone: z.string().optional(),
  location: z.string().optional(),
});

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { success: false, error: "Acceso no autorizado" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validationResult = ProfileUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { phone, location } = validationResult.data;

    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const users = db.collection("users");

    const result = await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          phone,
          location,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      // Si no se modificó nada, puede ser porque los datos son los mismos
      // o porque el usuario no se encontró (aunque esto es poco probable si hay sesión).
      // Devolvemos éxito de todas formas para una mejor experiencia de usuario.
      return NextResponse.json({
        success: true,
        message: "Perfil actualizado correctamente (sin cambios detectados).",
      });
    }

    logger.info(`Perfil actualizado para el usuario: ${session.user.email}`);

    return NextResponse.json({
      success: true,
      message: "Perfil actualizado correctamente.",
    });

  } catch (error) {
    logger.error(`Error al actualizar el perfil para ${session.user.email}:`, error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}