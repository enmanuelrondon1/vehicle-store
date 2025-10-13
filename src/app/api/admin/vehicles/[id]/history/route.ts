import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Resuelve los parámetros de la ruta
  const resolvedParams = await params;

  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "admin") {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  if (!ObjectId.isValid(resolvedParams.id)) {
    return NextResponse.json(
      { message: "ID de vehículo inválido" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("vehicle_store");

    const vehicle = await db
      .collection("vehicles")
      .findOne(
        { _id: new ObjectId(resolvedParams.id) },
        { projection: { history: 1 } }
      );

    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehículo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ history: vehicle.history || [] });
  } catch (error) {
    console.error("Error al obtener el historial del vehículo:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}