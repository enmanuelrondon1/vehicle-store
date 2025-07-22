
// src/services/vehicleService.ts
import { Db, Collection, ObjectId } from "mongodb";
import {
  VehicleDataBackend as VehicleData,
  ApiResponseFrontend as ApiResponse,
  VehicleDataFrontend,
  ApprovalStatus,
} from "@/types/types";
import { ValidationUtils } from "../lib/validation";
import { pusherServer } from "@/lib/pusher";
// import { pusherServer } from "@/lib/pusher";

// Tipo específico para MongoDB con ObjectId real
interface VehicleDataMongo {
  _id?: ObjectId;
  category: VehicleData['category'];
  subcategory?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  engine: string;
  transmission: VehicleData['transmission'];
  condition: VehicleData['condition'];
  location: string;
  features: string[];
  fuelType: VehicleData['fuelType'];
  doors: number;
  seats: number;
  weight?: number;
  loadCapacity?: number;
  sellerContact: VehicleData['sellerContact'];
  postedDate: Date;
  warranty: VehicleData['warranty'];
  description: string;
  images: string[];
  vin?: string;
  paymentProof?: string;
  status: ApprovalStatus;
  createdAt?: Date;
  updatedAt?: Date;
  views?: number;
}

// Tipos para los datos de analytics
interface GeneralStats {
  totalVehicles: number;
  averagePrice: number;
  totalViews: number;
}

interface StatusCount {
  _id: ApprovalStatus;
  count: number;
}

interface MonthlyPublication {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}

interface AvgPriceByCategory {
  _id: string; // category name
  averagePrice: number;
  count: number;
}

interface AnalyticsData {
  generalStats: GeneralStats;
  statusCounts: Record<string, number>;
  monthlyPublications: MonthlyPublication[];
  avgPriceByCategory: AvgPriceByCategory[];
}


export class VehicleService {
  private db: Db;
  private collection: Collection<VehicleDataMongo>;

  constructor(db: Db) {
    this.db = db;
    this.collection = db.collection<VehicleDataMongo>("vehicles");
  }

  // Función helper para convertir VehicleData a VehicleDataMongo
  private convertToMongo(vehicleData: Omit<VehicleData, "_id" | "postedDate" | "createdAt" | "updatedAt">): Omit<VehicleDataMongo, "_id" | "postedDate" | "createdAt" | "updatedAt"> {
    return {
      category: vehicleData.category,
      subcategory: vehicleData.subcategory,
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year,
      price: vehicleData.price,
      mileage: vehicleData.mileage,
      color: vehicleData.color,
      engine: vehicleData.engine,
      transmission: vehicleData.transmission,
      condition: vehicleData.condition,
      location: vehicleData.location,
      features: vehicleData.features,
      fuelType: vehicleData.fuelType,
      doors: vehicleData.doors,
      seats: vehicleData.seats,
      weight: vehicleData.weight,
      loadCapacity: vehicleData.loadCapacity,
      sellerContact: vehicleData.sellerContact,
      warranty: vehicleData.warranty,
      description: vehicleData.description,
      images: vehicleData.images,
      vin: vehicleData.vin,
      paymentProof: vehicleData.paymentProof,
      status: vehicleData.status || ApprovalStatus.PENDING, // Usar status, con valor por defecto
      views: 0,
    };
  }

  // Función helper para convertir VehicleDataMongo a VehicleData
  private convertFromMongo(mongoData: VehicleDataMongo): VehicleData {
    return {
      _id: mongoData._id?.toString(),
      category: mongoData.category,
      subcategory: mongoData.subcategory,
      brand: mongoData.brand,
      model: mongoData.model,
      year: mongoData.year,
      price: mongoData.price,
      mileage: mongoData.mileage,
      color: mongoData.color,
      engine: mongoData.engine,
      transmission: mongoData.transmission,
      condition: mongoData.condition,
      location: mongoData.location,
      features: mongoData.features,
      fuelType: mongoData.fuelType,
      doors: mongoData.doors,
      seats: mongoData.seats,
      weight: mongoData.weight,
      loadCapacity: mongoData.loadCapacity,
      sellerContact: mongoData.sellerContact,
      postedDate: mongoData.postedDate,
      warranty: mongoData.warranty,
      description: mongoData.description,
      images: mongoData.images,
      vin: mongoData.vin,
      paymentProof: mongoData.paymentProof,
      status: mongoData.status,
      createdAt: mongoData.createdAt,
      updatedAt: mongoData.updatedAt,
      views: mongoData.views,
    };
  }

  // Función helper para convertir datos de actualización parciales
  private convertUpdateDataToMongo(updateData: Partial<VehicleData>): Partial<VehicleDataMongo> {
    const dataWithoutId = { ...updateData };
    delete dataWithoutId._id;
    
    // Solo incluir campos que realmente están presentes en updateData
    const mongoData: Partial<VehicleDataMongo> = {};
    
    // Mapear solo los campos que están definidos
    (Object.keys(dataWithoutId) as (keyof typeof dataWithoutId)[]).forEach((key) => {
      const value = dataWithoutId[key];
      if (value !== undefined) {
        (mongoData as Record<string, unknown>)[key] = value;
      }
    });
    
    return mongoData;
  }

  async createVehicle(
    vehicleData: Omit<
      VehicleData,
      "_id" | "postedDate" | "createdAt" | "updatedAt"
    >
  ): Promise<ApiResponse<VehicleDataFrontend>> {
    try {
      const now = new Date();
      const mongoData = this.convertToMongo(vehicleData);
      
      const dataToInsert: VehicleDataMongo = {
        ...mongoData,
        postedDate: now,
        createdAt: now,
        updatedAt: now,
        views: 0,
        status: ApprovalStatus.PENDING,
      };

      console.log("Insertando vehículo en DB:", dataToInsert);
      const result = await this.collection.insertOne(dataToInsert);

      if (!result.acknowledged || !result.insertedId) {
        console.error("Error: No se generó insertedId");
        return {
          success: false,
          error: "No se pudo crear el vehículo",
        };
      }

      const insertedVehicle: VehicleDataMongo = {
        ...dataToInsert,
        _id: result.insertedId,
      };

      console.log("Vehículo insertado con ID:", insertedVehicle._id!.toString());

      const { convertToFrontend } = await import("@/types/types");
      const backendData = this.convertFromMongo(insertedVehicle);

      return {
        success: true,
        data: convertToFrontend(backendData),
        message: "Vehículo creado exitosamente",
      };
    } catch (error) {
      console.error("Error creating vehicle:", error);
      return {
        success: false,
        error: "Error interno del servidor al crear el vehículo",
      };
    }
  }

  async getVehicleById(id: string, approvalStatus?: ApprovalStatus): Promise<ApiResponse<VehicleDataFrontend>> {
  try {
    if (!ValidationUtils.isValidObjectId(id)) {
      return {
        success: false,
        error: "ID de vehículo inválido",
      };
    }

    // Construir el filtro base
    const filter: { _id: ObjectId; status?: ApprovalStatus } = { _id: new ObjectId(id) };
    
    // Agregar filtro de status si se proporciona
    if (approvalStatus) {
      filter.status = approvalStatus;
    }

    const vehicle = await this.collection.findOne(filter);

    if (!vehicle) {
      return {
        success: false,
        error: "Vehículo no encontrado",
      };
    }

    const { convertToFrontend } = await import("@/types/types");
    const backendData = this.convertFromMongo(vehicle);

    return {
      success: true,
      data: convertToFrontend(backendData),
    };
  } catch (error) {
    console.error("Error getting vehicle:", error);
    return {
      success: false,
      error: "Error interno del servidor al obtener el vehículo",
    };
  }
}
  async updateVehicle(
    id: string,
    updateData: Partial<VehicleData>
  ): Promise<ApiResponse<VehicleDataFrontend>> {
    try {
      if (!ValidationUtils.isValidObjectId(id)) {
        return {
          success: false,
          error: "ID de vehículo inválido",
        };
      }

      const mongoUpdateData = this.convertUpdateDataToMongo(updateData);
      mongoUpdateData.updatedAt = new Date();

      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: mongoUpdateData },
        { returnDocument: "after" }
      );

      if (!result) {
        return {
          success: false,
          error: "Vehículo no encontrado",
        };
      }

      const { convertToFrontend } = await import("@/types/types");
      const backendData = this.convertFromMongo(result);

      // Disparar notificación de cambio de estado si aplica
      if (updateData.status) {
        await pusherServer.trigger('private-admin-notifications', 'status-update', {
          message: `El estado de "${backendData.brand} ${backendData.model}" ha cambiado a ${updateData.status}.`,
          vehicleId: id,
          status: updateData.status,
          timestamp: new Date().toISOString(),
        });
      }

      return {
        success: true,
        data: convertToFrontend(backendData),
        message: "Vehículo actualizado exitosamente",
      };
    } catch (error) {
      console.error("Error updating vehicle:", error);
      return {
        success: false,
        error: "Error interno del servidor al actualizar el vehículo",
      };
    }
  }

  async deleteVehicle(id: string): Promise<ApiResponse<null>> {
    try {
      if (!ValidationUtils.isValidObjectId(id)) {
        return {
          success: false,
          error: "ID de vehículo inválido",
        };
      }

      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return {
          success: false,
          error: "Vehículo no encontrado",
        };
      }

      return {
        success: true,
        data: null,
        message: "Vehículo eliminado exitosamente",
      };
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      return {
        success: false,
        error: "Error interno del servidor al eliminar el vehículo",
      };
    }
  }

  async incrementVehicleViews(id: string): Promise<ApiResponse<VehicleDataFrontend>> {
    try {
      if (!ValidationUtils.isValidObjectId(id)) {
        return {
          success: false,
          error: "ID de vehículo inválido",
        };
      }

      const updateResult = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $inc: { views: 1 } },
        { returnDocument: "after", upsert: false }
      );

      if (!updateResult) {
        return {
          success: false,
          error: "Vehículo no encontrado",
        };
      }

      const { convertToFrontend } = await import("@/types/types");
      const backendData = this.convertFromMongo(updateResult);

      return {
        success: true,
        data: convertToFrontend(backendData),
        message: "Vistas incrementadas exitosamente",
      };
    } catch (error) {
      console.error("Error incrementing vehicle views:", error);
      return {
        success: false,
        error: "Error interno del servidor al incrementar las vistas",
      };
    }
  }

 async getAnalyticsData(): Promise<AnalyticsData | null> {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const result = await this.collection.aggregate([
      {
        $facet: {
          // 1. Estadísticas generales
          generalStats: [
            {
              $group: {
                _id: null,
                totalVehicles: { $sum: 1 },
                averagePrice: { $avg: '$price' },
                totalViews: { $sum: '$views' }
              }
            }
          ],
          // 2. Conteo de vehículos por estado
          statusCounts: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          // 3. Publicaciones por mes (últimos 6 meses)
          monthlyPublications: [
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
              $group: {
                _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
          ],
          // 4. Precio promedio por categoría
          avgPriceByCategory: [
            {
              $group: {
                _id: '$category',
                averagePrice: { $avg: '$price' },
                count: { $sum: 1 }
              }
            },
            { $sort: { count: -1 } }
          ]
        }
      }
    ]).toArray();

    if (!result[0]) {
      return null;
    }

    const analytics = result[0] as {
      generalStats: GeneralStats[];
      statusCounts: StatusCount[];
      monthlyPublications: MonthlyPublication[];
      avgPriceByCategory: AvgPriceByCategory[];
    };

    // Procesar y dar formato a los datos
    const formattedData: AnalyticsData = {
      generalStats: analytics.generalStats[0] || { totalVehicles: 0, averagePrice: 0, totalViews: 0 },
      statusCounts: analytics.statusCounts.reduce((acc: Record<string, number>, item: StatusCount) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      monthlyPublications: analytics.monthlyPublications,
      avgPriceByCategory: analytics.avgPriceByCategory,
    };

    return formattedData;

  } catch (error) {
    console.error("Error obteniendo datos de analytics:", error);
    throw error;
  }
}
}