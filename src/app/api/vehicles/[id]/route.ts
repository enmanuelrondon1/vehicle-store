// src/app/api/vehicles/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { VehicleService } from "@/services/vehicleService";
import { ApprovalStatus } from "@/types/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { ObjectId } from "mongodb";
import { removeFinancingDetails } from "@/lib/actions/vehicle.actions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params since they're now a Promise in Next.js 15
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid Vehicle ID" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "admin";

    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const vehicleService = new VehicleService(db);

    // Un admin puede ver cualquier vehículo, un usuario normal solo los aprobados.
    const statusFilter = isAdmin ? undefined : ApprovalStatus.APPROVED;
    const response = await vehicleService.getVehicleById(id, statusFilter);

    if (response.success && response.data) {
      // Por defecto, no es favorito
      response.data.isFavorited = false;

      if (session?.user?._id) {
        const favoritesCollection = db.collection("favorites");
        const favorite = await favoritesCollection.findOne({
          userId: new ObjectId(session.user._id),
          vehicleId: new ObjectId(id),
        });

        if (favorite) {
          response.data.isFavorited = true;
        }
      }
    }

    return NextResponse.json(response, {
      status: response.success ? 200 : 404,
    });
  } catch (error) {
    console.error("Error general en GET /api/vehicles/[id]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { success: false, error: `Error interno del servidor: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "No autorizado o sesión inválida" }, { status: 401 });
  }

  const { id } = params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "ID de vehículo inválido" }, { status: 400 });
  }

  try {
    // Aquí podrías manejar otras acciones DELETE en el futuro,
    // por ejemplo, eliminar el vehículo por completo.
    // Por ahora, la lógica de 'remove_financing' se ha movido a una Server Action.
    return NextResponse.json({ error: "Acción no especificada o no válida" }, { status: 400 });
  } catch (error) {
    console.error("Error en la operación DELETE:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}