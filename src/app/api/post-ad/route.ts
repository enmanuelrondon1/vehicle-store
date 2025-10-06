// src/app/api/post-ad/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { pusherServer } from "@/lib/pusher";
import { VehicleService } from "@/services/vehicleService";
import { ApiResponseFrontend, VehicleDataBackend, ApprovalStatus, Currency } from "@/types/types";
import { sendNewVehicleNotificationEmail } from "@/lib/mailer";
import { toTitleCase } from "@/lib/utils";
import { z } from "zod";
import { logger } from "@/lib/logger";

const SellerContactSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
});

const FinancingDetailsSchema = z.object({
  interestRate: z.number(),
  loanTerm: z.number(),
});

const CreateVehicleSchema = z.object({
  category: z.string().min(1, "La categoría es requerida"),
  subcategory: z.string().optional(),
  brand: z.string().min(1, "La marca es requerida"),
  brandOther: z.string().optional(),
  model: z.string().min(1, "El modelo es requerido"),
  year: z.number().min(1900, "Año inválido"),
  price: z.number().positive("El precio debe ser mayor a 0"),
  currency: z.nativeEnum(Currency).default(Currency.USD),
  isNegotiable: z.boolean().optional(),
  offersFinancing: z.boolean().optional(),
  financingDetails: FinancingDetailsSchema.optional(),
  mileage: z.number().min(0, "El kilometraje no puede ser negativo"),
  color: z.string().min(1, "El color es requerido"),
  engine: z.string().optional(),
  displacement: z.string().optional(),
  driveType: z.string().optional(),
  transmission: z.string().min(1, "La transmisión es requerida"),
  condition: z.string().min(1, "La condición es requerida"),
  location: z.string().min(1, "La ubicación es requerida"),
  features: z.array(z.string()).default([]),
  fuelType: z.string().min(1, "El tipo de combustible es requerido"),
  doors: z.number().min(1, "El número de puertas debe ser al menos 1").optional(),
  seats: z.number().min(1, "El número de asientos debe ser al menos 1").optional(),
  weight: z.number().optional(),
  loadCapacity: z.number().optional(),
  sellerContact: SellerContactSchema,
  status: z.enum([ApprovalStatus.PENDING, ApprovalStatus.APPROVED, ApprovalStatus.REJECTED]).default(ApprovalStatus.PENDING),
  warranty: z.string().optional(),
  description: z.string().optional(),
  documentation: z.array(z.string()).optional(),
  images: z.array(z.string()).default([]),
  vin: z
    .string()
    .regex(
      /^[A-HJ-NPR-Z0-9]{17}$/,
      "El VIN debe tener 17 caracteres alfanuméricos (sin I, O, Q)"
    )
    .optional(),
  paymentProof: z.string().url("La URL del comprobante debe ser válida").optional(),
  selectedBank: z.string().min(1, "El banco es requerido").optional(),
  referenceNumber: z
    .string()
    .min(8, "La referencia debe tener al menos 8 dígitos")
    .max(20, "La referencia no puede exceder 20 caracteres")
    .optional(),
});

const createErrorResponse = (
  error: string,
  validationErrors?: Record<string, string[]>
): ApiResponseFrontend<null> => ({
  success: false,
  error,
  ...(validationErrors && { validationErrors }),
});

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "vehicle-upload");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Error al subir archivo a Cloudinary");
  }

  const data = await response.json();
  return data.secure_url;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    logger.info("POST /api/post-ad - Iniciando...");

    let body;
    let paymentProofUrl: string | undefined;

    const contentType = req.headers.get("content-type");
    const isFormData = contentType?.includes("multipart/form-data");

    if (isFormData) {
      logger.info("Procesando FormData...");
      const formData = await req.formData();
      
      const vehicleDataString = formData.get("vehicleData") as string;
      if (!vehicleDataString) {
        return NextResponse.json(
          createErrorResponse("No se encontraron datos del vehículo"),
          { status: 400 }
        );
      }

      try {
        body = JSON.parse(vehicleDataString);
        logger.log("VehicleData parseado:", JSON.stringify(body, null, 2));
      } catch (parseError) {
        logger.error("Error al parsear vehicleData:", parseError);
        return NextResponse.json(
          createErrorResponse("Formato de vehicleData inválido"),
          { status: 400 }
        );
      }

      const paymentProofFile = formData.get("paymentProof") as File;
      if (paymentProofFile && paymentProofFile.size > 0) {
        logger.info("Subiendo comprobante de pago...");
        try {
          paymentProofUrl = await uploadToCloudinary(paymentProofFile);
          logger.info("Comprobante subido:", paymentProofUrl);
        } catch (uploadError) {
          logger.error("Error al subir comprobante:", uploadError);
          return NextResponse.json(
            createErrorResponse("Error al subir el comprobante de pago"),
            { status: 500 }
          );
        }
      }
    } else {
      try {
        body = await req.json();
        logger.log("Body JSON recibido:", JSON.stringify(body, null, 2));
      } catch (parseError) {
        logger.error("Error al parsear JSON:", parseError);
        return NextResponse.json(
          createErrorResponse("Formato de datos inválido"),
          { status: 400 }
        );
      }
    }

    if (paymentProofUrl) {
      body.paymentProof = paymentProofUrl;
    }

    const validationResult = CreateVehicleSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Errores de validación:", validationResult.error);
      const formErrors: Record<string, string[]> = {};
      validationResult.error.errors.forEach((error) => {
        const field = error.path.join(".");
        if (!formErrors[field]) {
          formErrors[field] = [];
        }
        formErrors[field].push(error.message);
      });
      console.log("Errores formateados:", formErrors);
      return NextResponse.json(
        createErrorResponse("Datos de entrada inválidos", formErrors),
        { status: 400 }
      );
    }

    console.log("Validación exitosa, datos:", validationResult.data);

    const validatedData = validationResult.data;

    // Normalizar el nombre del vendedor a Title Case
    if (validatedData.sellerContact?.name) {
      validatedData.sellerContact.name = toTitleCase(validatedData.sellerContact.name);
    }

    const vehicleDataForBackend = {
      ...validatedData,
      status: ApprovalStatus.PENDING, // Asignar status por defecto
    } as Omit<VehicleDataBackend, "_id" | "postedDate" | "createdAt" | "updatedAt">;

    console.log("Datos preparados para DB:", vehicleDataForBackend);

    let client;
    try {
      client = await clientPromise;
      console.log("Conexión a MongoDB exitosa");
    } catch (dbError) {
      console.error("Error de conexión a MongoDB:", dbError);
      return NextResponse.json(
        createErrorResponse("Error de conexión a la base de datos"),
        { status: 500 }
      );
    }

    try {
      const db = client.db("vehicle_store");
      const vehicleService = new VehicleService(db);
      console.log(
        "VehicleService creado, insertando vehículo en vehicle_store.vehicles..."
      );

      const response = await vehicleService.createVehicle(vehicleDataForBackend);
      console.log("Respuesta del servicio:", response);

      if (response.success && response.data) {
        console.log("Respuesta exitosa con _id:", response.data._id);

        // Notificar a los administradores (Pusher y Email)
        try {
          // response.data ya está en formato VehicleDataFrontend gracias al servicio
          const frontendVehicle = response.data;

          // 🚀 Notificación en tiempo real con Pusher
          const notificationPayload = {
            message: `Nuevo vehículo: ${frontendVehicle.brand} ${frontendVehicle.model}`,
            vehicleId: frontendVehicle._id,
            timestamp: new Date().toISOString(),
            vehicleData: frontendVehicle,
          };

          await pusherServer.trigger(
            'private-admin-notifications',
            'new-vehicle',
            notificationPayload
          );
          logger.info(`Notificación Pusher enviada para vehículo ${frontendVehicle._id}`);

          // 📧 Notificación por correo electrónico
          await sendNewVehicleNotificationEmail(frontendVehicle);

        } catch (notificationError) {
          // Si las notificaciones fallan, no se debe interrumpir el flujo principal.
          // Solo se registra el error.
          logger.error('Error al enviar notificaciones (Pusher/Email):', notificationError);
        }

        return NextResponse.json(response, { status: 201 });
      } else {
        console.error("Error del servicio:", response.error);
        return NextResponse.json(response, { status: 400 });
      }
    } catch (serviceError) {
      console.error("Error en VehicleService:", serviceError);
      return NextResponse.json(
        createErrorResponse("Error al procesar los datos del vehículo"),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error general en POST /api/post-ad:", error);
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Stack trace:", errorStack);
    return NextResponse.json(
      createErrorResponse(`Error interno del servidor: ${errorMessage}`),
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log("GET /api/post-ad - Iniciando...");
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        createErrorResponse("ID de vehículo requerido"),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const vehicleService = new VehicleService(db);
    const response = await vehicleService.getVehicleById(id);

    return NextResponse.json(response, {
      status: response.success ? 200 : 404,
    });
  } catch (error) {
    console.error("Error en GET /api/post-ad:", error);
    return NextResponse.json(
      createErrorResponse("Error interno del servidor"),
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        createErrorResponse("ID de vehículo requerido"),
        { status: 400 }
      );
    }

    const body = await req.json();
    const validationResult = CreateVehicleSchema.partial().safeParse({
      ...body,
      updatedAt: new Date(),
    });

    if (!validationResult.success) {
      const formErrors: Record<string, string[]> = {};
      validationResult.error.errors.forEach((error) => {
        const field = error.path.join(".");
        if (!formErrors[field]) {
          formErrors[field] = [];
        }
        formErrors[field].push(error.message);
      });

      return NextResponse.json(
        createErrorResponse("Datos de entrada inválidos", formErrors),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const vehicleService = new VehicleService(db);
    
    const response = await vehicleService.updateVehicle(
      id,
      validationResult.data as Partial<VehicleDataBackend>
    );

    return NextResponse.json(response, {
      status: response.success ? 200 : 404,
    });
  } catch (error) {
    console.error("Error en PUT /api/post-ad:", error);
    return NextResponse.json(
      createErrorResponse("Error interno del servidor"),
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        createErrorResponse("ID de vehículo requerido"),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const vehicleService = new VehicleService(db);
    const response = await vehicleService.deleteVehicle(id);

    return NextResponse.json(response, {
      status: response.success ? 200 : 404,
    });
  } catch (error) {
    console.error("Error en DELETE /api/post-ad:", error);
    return NextResponse.json(
      createErrorResponse("Error interno del servidor"),
      { status: 500 }
    );
  }
}