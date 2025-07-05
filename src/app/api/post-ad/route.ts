// import { NextRequest, NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";
// import { VehicleService } from "@/services/vehicleService";
// import { ApiResponseBackend, convertToFrontend } from "@/types/types";
// import { z } from "zod";

// const SellerContactSchema = z.object({
//   name: z.string().min(1, "El nombre es requerido"),
//   email: z.string().email("Email inválido"),
//   phone: z.string().min(1, "El teléfono es requerido"),
// });

// const CreateVehicleSchema = z.object({
//   category: z.string().min(1, "La categoría es requerida"),
//   subcategory: z.string().optional(),
//   brand: z.string().min(1, "La marca es requerida"),
//   model: z.string().min(1, "El modelo es requerido"),
//   year: z.number().min(1900, "Año inválido"),
//   price: z.number().positive("El precio debe ser mayor a 0"),
//   mileage: z.number().min(0, "El kilometraje no puede ser negativo"),
//   color: z.string().min(1, "El color es requerido"),
//   engine: z.string().optional(),
//   transmission: z.string().min(1, "La transmisión es requerida"),
//   condition: z.string().min(1, "La condición es requerida"),
//   location: z.string().min(1, "La ubicación es requerida"),
//   features: z.array(z.string()).default([]),
//   fuelType: z.string().min(1, "El tipo de combustible es requerido"),
//   doors: z.number().min(1, "El número de puertas debe ser al menos 1").optional(),
//   seats: z.number().min(1, "El número de asientos debe ser al menos 1").optional(),
//   weight: z.number().optional(),
//   loadCapacity: z.number().optional(),
//   sellerContact: SellerContactSchema,
//   availability: z.string().optional(),
//   warranty: z.string().optional(),
//   description: z.string().optional(),
//   images: z.array(z.string()).default([]),
//   vin: z
//     .string()
//     .regex(
//       /^[A-HJ-NPR-Z0-9]{17}$/,
//       "El VIN debe tener 17 caracteres alfanuméricos (sin I, O, Q)"
//     )
//     .optional(),
//   paymentProof: z.string().url("La URL del comprobante debe ser válida").optional(),
//   // 🔥 CAMPOS NUEVOS QUE FALTABAN:
//   selectedBank: z.string().min(1, "El banco es requerido").optional(),
//   referenceNumber: z.string().min(1, "El número de referencia es requerido").optional(),
// });

// const createErrorResponse = (
//   error: string,
//   validationErrors?: any
// ): ApiResponseBackend<null> => ({
//   success: false,
//   error,
//   ...(validationErrors && { validationErrors }),
// });

// const createSuccessResponse = <T>(
//   data: T,
//   message?: string
// ): ApiResponseBackend<T> => ({
//   success: true,
//   data,
//   message,
// });

// // 🔥 FUNCIÓN HELPER PARA SUBIR ARCHIVO A CLOUDINARY
// async function uploadToCloudinary(file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", "vehicle-upload"); // Asegúrate de que este preset exista

//   const response = await fetch(
//     `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Error al subir archivo a Cloudinary");
//   }

//   const data = await response.json();
//   return data.secure_url;
// }

// export async function POST(req: NextRequest): Promise<NextResponse> {
//   try {
//     console.log("POST /api/post-ad - Iniciando...");

//     let body;
//     let paymentProofUrl: string | undefined;

//     // 🔥 DETECTAR SI ES FORMDATA O JSON
//     const contentType = req.headers.get("content-type");
//     const isFormData = contentType?.includes("multipart/form-data");

//     if (isFormData) {
//       // 🔥 MANEJAR FORMDATA (CON ARCHIVO)
//       console.log("Procesando FormData...");
//       const formData = await req.formData();
      
//       // Extraer vehicleData del FormData
//       const vehicleDataString = formData.get("vehicleData") as string;
//       if (!vehicleDataString) {
//         return NextResponse.json(
//           createErrorResponse("No se encontraron datos del vehículo"),
//           { status: 400 }
//         );
//       }

//       try {
//         body = JSON.parse(vehicleDataString);
//         console.log("VehicleData parseado:", JSON.stringify(body, null, 2));
//       } catch (parseError) {
//         console.error("Error al parsear vehicleData:", parseError);
//         return NextResponse.json(
//           createErrorResponse("Formato de vehicleData inválido"),
//           { status: 400 }
//         );
//       }

//       // Extraer y subir archivo si existe
//       const paymentProofFile = formData.get("paymentProof") as File;
//       if (paymentProofFile && paymentProofFile.size > 0) {
//         console.log("Subiendo comprobante de pago...");
//         try {
//           paymentProofUrl = await uploadToCloudinary(paymentProofFile);
//           console.log("Comprobante subido:", paymentProofUrl);
//         } catch (uploadError) {
//           console.error("Error al subir comprobante:", uploadError);
//           return NextResponse.json(
//             createErrorResponse("Error al subir el comprobante de pago"),
//             { status: 500 }
//           );
//         }
//       }
//     } else {
//       // 🔥 MANEJAR JSON (SIN ARCHIVO) - MANTIENE COMPATIBILIDAD
//       try {
//         body = await req.json();
//         console.log("Body JSON recibido:", JSON.stringify(body, null, 2));
//       } catch (parseError) {
//         console.error("Error al parsear JSON:", parseError);
//         return NextResponse.json(
//           createErrorResponse("Formato de datos inválido"),
//           { status: 400 }
//         );
//       }
//     }

//     // 🔥 AGREGAR PAYMENT PROOF URL AL BODY SI EXISTE
//     if (paymentProofUrl) {
//       body.paymentProof = paymentProofUrl;
//     }

//     const validationResult = CreateVehicleSchema.safeParse(body);

//     if (!validationResult.success) {
//       console.error("Errores de validación:", validationResult.error);
//       const formErrors: { [key: string]: string } = {};
//       validationResult.error.errors.forEach((error) => {
//         const field = error.path.join(".");
//         formErrors[field] = error.message;
//       });
//       console.log("Errores formateados:", formErrors);
//       return NextResponse.json(
//         createErrorResponse("Datos de entrada inválidos", formErrors),
//         { status: 400 }
//       );
//     }

//     console.log("Validación exitosa, datos:", validationResult.data);

//     const vehicleData = {
//       ...validationResult.data,
//       postedDate: new Date(),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     console.log("Datos preparados para DB:", vehicleData);

//     let client;
//     try {
//       client = await clientPromise;
//       console.log("Conexión a MongoDB exitosa");
//     } catch (dbError) {
//       console.error("Error de conexión a MongoDB:", dbError);
//       return NextResponse.json(
//         createErrorResponse("Error de conexión a la base de datos"),
//         { status: 500 }
//       );
//     }

//     try {
//       const db = client.db("vehicle_store");
//       const vehicleService = new VehicleService(db);
//       console.log(
//         "VehicleService creado, insertando vehículo en vehicle_store.vehicles..."
//       );

//       const response = await vehicleService.createVehicle(vehicleData as any);
//       console.log("Respuesta del servicio:", response);

//       if (response.success && response.data) {
//         const frontendData = convertToFrontend(response.data);
//         // Asegurar que _id esté presente
//         const frontendResponse = {
//           ...response,
//           data: { _id: response.data._id, ...frontendData },
//         };
//         console.log("Respuesta exitosa con _id:", frontendResponse);
//         return NextResponse.json(frontendResponse, { status: 201 });
//       } else {
//         console.error("Error del servicio:", response.error);
//         return NextResponse.json(response, { status: 400 });
//       }
//     } catch (serviceError) {
//       console.error("Error en VehicleService:", serviceError);
//       return NextResponse.json(
//         createErrorResponse("Error al procesar los datos del vehículo"),
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Error general en POST /api/post-ad:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Error desconocido";
//     const errorStack = error instanceof Error ? error.stack : "";
//     console.error("Stack trace:", errorStack);
//     return NextResponse.json(
//       createErrorResponse(`Error interno del servidor: ${errorMessage}`),
//       { status: 500 }
//     );
//   }
// }

// // Métodos GET, PUT, DELETE se mantienen igual...
// export async function GET(req: NextRequest): Promise<NextResponse> {
//   try {
//     console.log("GET /api/post-ad - Iniciando...");
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         createErrorResponse("ID de vehículo requerido"),
//         { status: 400 }
//       );
//     }

//     const client = await clientPromise;
//     const db = client.db();
//     const vehicleService = new VehicleService(db);
//     const response = await vehicleService.getVehicleById(id);

//     return NextResponse.json(response, {
//       status: response.success ? 200 : 404,
//     });
//   } catch (error) {
//     console.error("Error en GET /api/post-ad:", error);
//     return NextResponse.json(
//       createErrorResponse("Error interno del servidor"),
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(req: NextRequest): Promise<NextResponse> {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         createErrorResponse("ID de vehículo requerido"),
//         { status: 400 }
//       );
//     }

//     const body = await req.json();
//     const validationResult = CreateVehicleSchema.partial().safeParse({
//       ...body,
//       updatedAt: new Date(),
//     });

//     if (!validationResult.success) {
//       const formErrors: { [key: string]: string } = {};
//       validationResult.error.errors.forEach((error) => {
//         const field = error.path.join(".");
//         formErrors[field] = error.message;
//       });

//       return NextResponse.json(
//         createErrorResponse("Datos de entrada inválidos", formErrors),
//         { status: 400 }
//       );
//     }

//     const client = await clientPromise;
//     const db = client.db();
//     const vehicleService = new VehicleService(db);
//     const response = await vehicleService.updateVehicle(
//       id,
//       validationResult.data as any
//     );

//     return NextResponse.json(response, {
//       status: response.success ? 200 : 404,
//     });
//   } catch (error) {
//     console.error("Error en PUT /api/post-ad:", error);
//     return NextResponse.json(
//       createErrorResponse("Error interno del servidor"),
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest): Promise<NextResponse> {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         createErrorResponse("ID de vehículo requerido"),
//         { status: 400 }
//       );
//     }

//     const client = await clientPromise;
//     const db = client.db();
//     const vehicleService = new VehicleService(db);
//     const response = await vehicleService.deleteVehicle(id);

//     return NextResponse.json(response, {
//       status: response.success ? 200 : 404,
//     });
//   } catch (error) {
//     console.error("Error en DELETE /api/post-ad:", error);
//     return NextResponse.json(
//       createErrorResponse("Error interno del servidor"),
//       { status: 500 }
//     );
//   }
// }



// src/app/api/post-ad/route.ts
// src/app/api/post-ad/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";
// import { VehicleService } from "@/services/vehicleService";
// import { ApiResponseBackend, convertToFrontend } from "@/types/types";
// import { z } from "zod";

// const SellerContactSchema = z.object({
//   name: z.string().min(1, "El nombre es requerido"),
//   email: z.string().email("Email inválido"),
//   phone: z.string().min(1, "El teléfono es requerido"),
// });

// const CreateVehicleSchema = z.object({
//   category: z.string().min(1, "La categoría es requerida"),
//   subcategory: z.string().optional(),
//   brand: z.string().min(1, "La marca es requerida"),
//   model: z.string().min(1, "El modelo es requerido"),
//   year: z.number().min(1900, "Año inválido"),
//   price: z.number().positive("El precio debe ser mayor a 0"),
//   mileage: z.number().min(0, "El kilometraje no puede ser negativo"),
//   color: z.string().min(1, "El color es requerido"),
//   engine: z.string().optional(),
//   transmission: z.string().min(1, "La transmisión es requerida"),
//   condition: z.string().min(1, "La condición es requerida"),
//   location: z.string().min(1, "La ubicación es requerida"),
//   features: z.array(z.string()).default([]),
//   fuelType: z.string().min(1, "El tipo de combustible es requerido"),
//   doors: z.number().min(1, "El número de puertas debe ser al menos 1").optional(),
//   seats: z.number().min(1, "El número de asientos debe ser al menos 1").optional(),
//   weight: z.number().optional(),
//   loadCapacity: z.number().optional(),
//   sellerContact: SellerContactSchema,
//   availability: z.string().optional(),
//   warranty: z.string().optional(),
//   description: z.string().optional(),
//   images: z.array(z.string()).default([]),
//   vin: z
//     .string()
//     .regex(
//       /^[A-HJ-NPR-Z0-9]{17}$/,
//       "El VIN debe tener 17 caracteres alfanuméricos (sin I, O, Q)"
//     )
//     .optional(),
//   paymentProof: z.string().url("La URL del comprobante debe ser válida").optional(),
//   selectedBank: z.string().min(1, "El banco es requerido").optional(),
//   referenceNumber: z.string().min(1, "El número de referencia es requerido").optional(),
// });

// // ✅ Mantener el tipo `any` como tenías antes
// const createErrorResponse = (
//   error: string,
//   validationErrors?: any
// ): ApiResponseBackend<null> => ({
//   success: false,
//   error,
//   ...(validationErrors && { validationErrors }),
// });

// const createSuccessResponse = <T>(
//   data: T,
//   message?: string
// ): ApiResponseBackend<T> => ({
//   success: true,
//   data,
//   message,
// });

// // 🔥 FUNCIÓN HELPER PARA SUBIR ARCHIVO A CLOUDINARY
// async function uploadToCloudinary(file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", "vehicle-upload");

//   const response = await fetch(
//     `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//     {
//       method: "POST",
//       body: formData,
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Error al subir archivo a Cloudinary");
//   }

//   const data = await response.json();
//   return data.secure_url;
// }

// export async function POST(req: NextRequest): Promise<NextResponse> {
//   try {
//     console.log("POST /api/post-ad - Iniciando...");

//     let body;
//     let paymentProofUrl: string | undefined;

//     const contentType = req.headers.get("content-type");
//     const isFormData = contentType?.includes("multipart/form-data");

//     if (isFormData) {
//       console.log("Procesando FormData...");
//       const formData = await req.formData();
      
//       const vehicleDataString = formData.get("vehicleData") as string;
//       if (!vehicleDataString) {
//         return NextResponse.json(
//           createErrorResponse("No se encontraron datos del vehículo"),
//           { status: 400 }
//         );
//       }

//       try {
//         body = JSON.parse(vehicleDataString);
//         console.log("VehicleData parseado:", JSON.stringify(body, null, 2));
//       } catch (parseError) {
//         console.error("Error al parsear vehicleData:", parseError);
//         return NextResponse.json(
//           createErrorResponse("Formato de vehicleData inválido"),
//           { status: 400 }
//         );
//       }

//       const paymentProofFile = formData.get("paymentProof") as File;
//       if (paymentProofFile && paymentProofFile.size > 0) {
//         console.log("Subiendo comprobante de pago...");
//         try {
//           paymentProofUrl = await uploadToCloudinary(paymentProofFile);
//           console.log("Comprobante subido:", paymentProofUrl);
//         } catch (uploadError) {
//           console.error("Error al subir comprobante:", uploadError);
//           return NextResponse.json(
//             createErrorResponse("Error al subir el comprobante de pago"),
//             { status: 500 }
//           );
//         }
//       }
//     } else {
//       try {
//         body = await req.json();
//         console.log("Body JSON recibido:", JSON.stringify(body, null, 2));
//       } catch (parseError) {
//         console.error("Error al parsear JSON:", parseError);
//         return NextResponse.json(
//           createErrorResponse("Formato de datos inválido"),
//           { status: 400 }
//         );
//       }
//     }

//     if (paymentProofUrl) {
//       body.paymentProof = paymentProofUrl;
//     }

//     const validationResult = CreateVehicleSchema.safeParse(body);

//     if (!validationResult.success) {
//       console.error("Errores de validación:", validationResult.error);
//       const formErrors: { [key: string]: string } = {};
//       validationResult.error.errors.forEach((error) => {
//         const field = error.path.join(".");
//         formErrors[field] = error.message;
//       });
//       console.log("Errores formateados:", formErrors);
//       return NextResponse.json(
//         createErrorResponse("Datos de entrada inválidos", formErrors),
//         { status: 400 }
//       );
//     }

//     console.log("Validación exitosa, datos:", validationResult.data);

//     const vehicleData = {
//       ...validationResult.data,
//       postedDate: new Date(),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     console.log("Datos preparados para DB:", vehicleData);

//     let client;
//     try {
//       client = await clientPromise;
//       console.log("Conexión a MongoDB exitosa");
//     } catch (dbError) {
//       console.error("Error de conexión a MongoDB:", dbError);
//       return NextResponse.json(
//         createErrorResponse("Error de conexión a la base de datos"),
//         { status: 500 }
//       );
//     }

//     try {
//       const db = client.db("vehicle_store");
//       const vehicleService = new VehicleService(db);
//       console.log(
//         "VehicleService creado, insertando vehículo en vehicle_store.vehicles..."
//       );

//       const response = await vehicleService.createVehicle(vehicleData as any);
//       console.log("Respuesta del servicio:", response);

//       if (response.success && response.data) {
//         const frontendData = convertToFrontend(response.data);
//         const frontendResponse = {
//           ...response,
//           data: { _id: response.data._id, ...frontendData },
//         };
//         console.log("Respuesta exitosa con _id:", frontendResponse);
//         return NextResponse.json(frontendResponse, { status: 201 });
//       } else {
//         console.error("Error del servicio:", response.error);
//         return NextResponse.json(response, { status: 400 });
//       }
//     } catch (serviceError) {
//       console.error("Error en VehicleService:", serviceError);
//       return NextResponse.json(
//         createErrorResponse("Error al procesar los datos del vehículo"),
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Error general en POST /api/post-ad:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Error desconocido";
//     const errorStack = error instanceof Error ? error.stack : "";
//     console.error("Stack trace:", errorStack);
//     return NextResponse.json(
//       createErrorResponse(`Error interno del servidor: ${errorMessage}`),
//       { status: 500 }
//     );
//   }
// }

// export async function GET(req: NextRequest): Promise<NextResponse> {
//   try {
//     console.log("GET /api/post-ad - Iniciando...");
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         createErrorResponse("ID de vehículo requerido"),
//         { status: 400 }
//       );
//     }

//     const client = await clientPromise;
//     const db = client.db();
//     const vehicleService = new VehicleService(db);
//     const response = await vehicleService.getVehicleById(id);

//     return NextResponse.json(response, {
//       status: response.success ? 200 : 404,
//     });
//   } catch (error) {
//     console.error("Error en GET /api/post-ad:", error);
//     return NextResponse.json(
//       createErrorResponse("Error interno del servidor"),
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(req: NextRequest): Promise<NextResponse> {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         createErrorResponse("ID de vehículo requerido"),
//         { status: 400 }
//       );
//     }

//     const body = await req.json();
//     const validationResult = CreateVehicleSchema.partial().safeParse({
//       ...body,
//       updatedAt: new Date(),
//     });

//     if (!validationResult.success) {
//       const formErrors: { [key: string]: string } = {};
//       validationResult.error.errors.forEach((error) => {
//         const field = error.path.join(".");
//         formErrors[field] = error.message;
//       });

//       return NextResponse.json(
//         createErrorResponse("Datos de entrada inválidos", formErrors),
//         { status: 400 }
//       );
//     }

//     const client = await clientPromise;
//     const db = client.db();
//     const vehicleService = new VehicleService(db);
//     const response = await vehicleService.updateVehicle(
//       id,
//       validationResult.data as any
//     );

//     return NextResponse.json(response, {
//       status: response.success ? 200 : 404,
//     });
//   } catch (error) {
//     console.error("Error en PUT /api/post-ad:", error);
//     return NextResponse.json(
//       createErrorResponse("Error interno del servidor"),
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest): Promise<NextResponse> {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         createErrorResponse("ID de vehículo requerido"),
//         { status: 400 }
//       );
//     }

//     const client = await clientPromise;
//     const db = client.db();
//     const vehicleService = new VehicleService(db);
//     const response = await vehicleService.deleteVehicle(id);

//     return NextResponse.json(response, {
//       status: response.success ? 200 : 404,
//     });
//   } catch (error) {
//     console.error("Error en DELETE /api/post-ad:", error);
//     return NextResponse.json(
//       createErrorResponse("Error interno del servidor"),
//       { status: 500 }
//     );
//   }
// }





// src/app/api/post-ad/route.ts

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { VehicleService } from "@/services/vehicleService";
import { ApiResponseFrontend, VehicleDataBackend } from "@/types/types";
import { z } from "zod";

const SellerContactSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
});

// ✅ Usar enum o union types para mayor precisión
const CreateVehicleSchema = z.object({
  category: z.string().min(1, "La categoría es requerida"),
  subcategory: z.string().optional(),
  brand: z.string().min(1, "La marca es requerida"),
  model: z.string().min(1, "El modelo es requerido"),
  year: z.number().min(1900, "Año inválido"),
  price: z.number().positive("El precio debe ser mayor a 0"),
  mileage: z.number().min(0, "El kilometraje no puede ser negativo"),
  color: z.string().min(1, "El color es requerido"),
  engine: z.string().optional(),
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
  availability: z.string().optional(),
  warranty: z.string().optional(),
  description: z.string().optional(),
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
  referenceNumber: z.string().min(1, "El número de referencia es requerido").optional(),
});

// ✅ CORREGIR: Usar ApiResponseFrontend para respuestas
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
    console.log("POST /api/post-ad - Iniciando...");

    let body;
    let paymentProofUrl: string | undefined;

    const contentType = req.headers.get("content-type");
    const isFormData = contentType?.includes("multipart/form-data");

    if (isFormData) {
      console.log("Procesando FormData...");
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
        console.log("VehicleData parseado:", JSON.stringify(body, null, 2));
      } catch (parseError) {
        console.error("Error al parsear vehicleData:", parseError);
        return NextResponse.json(
          createErrorResponse("Formato de vehicleData inválido"),
          { status: 400 }
        );
      }

      const paymentProofFile = formData.get("paymentProof") as File;
      if (paymentProofFile && paymentProofFile.size > 0) {
        console.log("Subiendo comprobante de pago...");
        try {
          paymentProofUrl = await uploadToCloudinary(paymentProofFile);
          console.log("Comprobante subido:", paymentProofUrl);
        } catch (uploadError) {
          console.error("Error al subir comprobante:", uploadError);
          return NextResponse.json(
            createErrorResponse("Error al subir el comprobante de pago"),
            { status: 500 }
          );
        }
      }
    } else {
      try {
        body = await req.json();
        console.log("Body JSON recibido:", JSON.stringify(body, null, 2));
      } catch (parseError) {
        console.error("Error al parsear JSON:", parseError);
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
      // ✅ CORREGIR: Formatear errores como string[]
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

    // ✅ CORREGIR: Preparar datos para el backend (sin fechas automáticas)
    const vehicleDataForBackend = {
      ...validationResult.data,
      // No incluir fechas aquí, el VehicleService las manejará
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
        // ✅ CORREGIR: Ya no necesitamos convertir, VehicleService ya retorna VehicleDataFrontend
        console.log("Respuesta exitosa con _id:", response.data._id);
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
      error instanceof Error ? error.message : "Error desconocido";
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
      // ✅ CORREGIR: Formatear errores como string[]
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
    
    // ✅ CORREGIR: Usar type assertion para evitar conflictos de tipos
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