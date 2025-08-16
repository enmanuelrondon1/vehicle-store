//src/app/api/confirm-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { VehicleService } from "@/services/vehicleService";
import { ApprovalStatus, type VehicleDataBackend } from "@/types/types";
import { convertToRawUrl } from "@/lib/cloudinary";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const {
      vehicleId,
      paymentProofUrl,
      paymentProofPublicId,
      referenceNumber,
      bank,
    } = body;

    if (
      !vehicleId ||
      !paymentProofUrl ||
      !paymentProofPublicId ||
      !referenceNumber ||
      !bank
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan datos requeridos para confirmar el pago.",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const vehicleService = new VehicleService(db);

    const vehicleUpdate: Partial<VehicleDataBackend> = {
      paymentProof: convertToRawUrl(paymentProofUrl), // Usamos la función que ya tenías
      paymentProofPublicId: paymentProofPublicId,
      referenceNumber: referenceNumber, // CORREGIDO: El tipo usa 'referenceNumber'
      paymentBank: bank,
      status: ApprovalStatus.UNDER_REVIEW, // Cambiamos el estado del vehículo
      updatedAt: new Date(),
    };

    const response = await vehicleService.updateVehicle(
      vehicleId,
      vehicleUpdate
    );

    if (!response.success) {
      // El servicio ya debería devolver un error detallado
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json(
      { success: true, message: "Pago confirmado y en revisión." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST /api/confirm-payment:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
