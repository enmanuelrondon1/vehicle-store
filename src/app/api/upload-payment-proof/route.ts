import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import clientPromise from "@/lib/mongodb";
import { VehicleService } from "@/services/vehicleService";
import { convertToRawUrl } from "@/lib/cloudinary";

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: unknown;
}




export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("POST /api/upload-payment-proof - Iniciando...");

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const formData = await req.formData();
    const vehicleId = formData.get("vehicleId")?.toString();
    const file = formData.get("file") as File;

    if (!vehicleId || !file) {
      return NextResponse.json({ success: false, error: "Faltan vehicleId o archivo" }, { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Tipo de archivo no permitido. Solo PNG, JPG o PDF." }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: "El archivo excede el tamaño máximo de 5MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "vehicle-payment-proofs",
          resource_type: file.type === "application/pdf" ? "raw" : "auto",
          upload_preset: "vehicle-upload",
          format: file.type === "application/pdf" ? "pdf" : undefined,
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result as CloudinaryUploadResult);
          else reject(new Error("No se recibió resultado de Cloudinary"));
        }
      );
      uploadStream.end(buffer);
    });

    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const vehicleService = new VehicleService(db);

    const vehicleUpdate = {
      paymentProof: convertToRawUrl(uploadResult.secure_url),
      paymentProofPublicId: uploadResult.public_id,
      updatedAt: new Date(),
    };

    const response = await vehicleService.updateVehicle(vehicleId, vehicleUpdate);

    if (!response.success) {
      return NextResponse.json(response, { status: 400 });
    }

    return NextResponse.json({ success: true, data: null, message: "Comprobante subido exitosamente" }, { status: 200 });
  } catch (error) {
    console.error("Error en POST /api/upload-payment-proof:", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 });
  }
}