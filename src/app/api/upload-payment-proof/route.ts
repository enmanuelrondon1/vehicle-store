import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import clientPromise from "@/lib/mongodb";
import { VehicleService } from "@/services/vehicleService";

// 🔥 CORREGIDO: Tipo específico para la respuesta de Cloudinary
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}

// 🔥 CORREGIDO: Tipo para respuesta de error
interface ErrorResponse {
  success: false;
  error: string;
}

// 🔥 CORREGIDO: Tipo para respuesta de éxito
interface SuccessResponse {
  success: true;
  data: null;
  message: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("POST /api/upload-payment-proof - Iniciando...");

    // Configurar Cloudinary
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const formData = await req.formData();
    const vehicleId = formData.get("vehicleId")?.toString();
    const file = formData.get("file") as File;

    if (!vehicleId || !file) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: "Faltan vehicleId o archivo",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validar tipo y tamaño del archivo
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: "Tipo de archivo no permitido. Solo PNG, JPG o PDF.",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: "El archivo excede el tamaño máximo de 5MB.",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Subir archivo a Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "vehicle-payment-proofs",
          resource_type: "auto",
          upload_preset: "vehicle-upload", // Cambia a "vehicle-payment-proof" si creaste un nuevo preset
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result as CloudinaryUploadResult);
          else reject(new Error("No se recibió resultado de Cloudinary"));
        }
      );
      uploadStream.end(buffer);
    });

    // Actualizar vehículo en MongoDB
    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const vehicleService = new VehicleService(db);

    const vehicleUpdate = {
      paymentProof: uploadResult.secure_url,
      updatedAt: new Date(),
    };

    const response = await vehicleService.updateVehicle(vehicleId, vehicleUpdate);

    if (!response.success) {
      return NextResponse.json(response, { status: 400 });
    }

    const successResponse: SuccessResponse = {
      success: true,
      data: null,
      message: "Comprobante subido exitosamente",
    };

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    console.error("Error en POST /api/upload-payment-proof:", error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: "Error interno del servidor",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}