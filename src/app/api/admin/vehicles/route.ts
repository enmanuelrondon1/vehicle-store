// src/app/api/admin/vehicles/route.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { ApiResponseBackend,  } from "@/types/types"
import type { WithId, Document } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

// Tipo específico para documentos de MongoDB


// Función para convertir documento de MongoDB a nuestro tipo
const convertMongoDocumentToVehicle = (doc: WithId<Document>) => {
  return {
    _id: doc._id.toString(),
    category: doc.category,
    subcategory: doc.subcategory,
    brand: doc.brand,
    brandOther: doc.brandOther,
    model: doc.model,
    year: doc.year,
    price: doc.price,
    currency: doc.currency,
    isNegotiable: doc.isNegotiable,
    mileage: doc.mileage,
    color: doc.color,
    engine: doc.engine,
    displacement: doc.displacement,
    transmission: doc.transmission,
    condition: doc.condition,
    location: doc.location,
    features: doc.features || [],
    fuelType: doc.fuelType,
    doors: doc.doors,
    seats: doc.seats,
    weight: doc.weight,
    driveType: doc.driveType,
    loadCapacity: doc.loadCapacity,
    sellerContact: doc.sellerContact,
    postedDate: doc.postedDate,
    warranty: doc.warranty,
    description: doc.description,
    images: doc.images || [],
    documentation: doc.documentation || [],
    vin: doc.vin,
    referenceNumber: doc.referenceNumber,
    paymentProof: doc.paymentProof,
    status: doc.status,
    views: doc.views,
    isFeatured: doc.isFeatured,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

const createErrorResponse = (error: string, validationErrors?: Record<string, string[]>): ApiResponseBackend<null> => ({
  success: false,
  error,
  ...(validationErrors && { validationErrors }),
})

const createSuccessResponse = <T>(
  data: T,
  message?: string
): ApiResponseBackend<T> => ({
  success: true,
  data,
  message,
});

export async function GET(): Promise<NextResponse> {
  try {
    console.log("GET /api/admin/vehicles - Iniciando...");

    // ✅ CORRECCIÓN: Pasar authOptions a getServerSession
    const session = await getServerSession(authOptions);
    console.log("Sesión en API:", session);

    if (!session || !session.user) {
      console.log("Acceso denegado - No hay sesión");
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), {
        status: 403,
      });
    }

    if (session.user.role !== "admin") {
      console.log(
        "Acceso denegado - No es administrador, rol:",
        session.user.role
      );
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), {
        status: 403,
      });
    }

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
      console.log("Obteniendo TODOS los vehículos...");
      
      // ✅ SOLUCIÓN: Obtener TODOS los vehículos, no solo los pendientes
      const vehicles = await db
        .collection("vehicles")
        .find({}) // ← Cambio principal: sin filtro de status\
        .sort({ createdAt: -1 }) // Ordenar por más recientes primero
        .toArray();

      // Convertir documentos de MongoDB a nuestros tipos
      const formattedVehicles = vehicles.map((vehicle) => {
        const convertedVehicle = convertMongoDocumentToVehicle(vehicle);
        // Convertir fechas a strings para el frontend
        return {
          ...convertedVehicle,
          postedDate: convertedVehicle.postedDate.toISOString(),
          createdAt: convertedVehicle.createdAt?.toISOString(),
          updatedAt: convertedVehicle.updatedAt?.toISOString(),
        };
      });

      console.log("Total de vehículos obtenidos:", formattedVehicles.length);
      
      // ✅ Mostrar estadísticas por estado para debug
      const statusStats = formattedVehicles.reduce((acc, vehicle) => {
        const accCopy = { ...acc };
        accCopy[vehicle.status] = (accCopy[vehicle.status] || 0) + 1;
        return accCopy;
      }, {} as Record<string, number>);
      
      console.log("📊 Vehículos por estado:", statusStats);

      return NextResponse.json(
        createSuccessResponse(
          formattedVehicles,
          "Lista completa de vehículos obtenida"
        ),
        { status: 200 }
      );
    } catch (serviceError) {
      console.error("Error al obtener vehículos:", serviceError);
      return NextResponse.json(
        createErrorResponse("Error al procesar la lista de vehículos"),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error general en GET /api/admin/vehicles:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      createErrorResponse(`Error interno del servidor: ${errorMessage}`),
      { status: 500 }
    );
  }
}