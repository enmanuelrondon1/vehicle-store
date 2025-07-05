// // src/services/vehicleService.ts

// import { MongoClient, Db, Collection, ObjectId, Filter, WithId } from 'mongodb';
// import { VehicleDataBackend as VehicleData, ApiResponseBackend as ApiResponse } from '@/types/types';
// import { ValidationUtils } from '../lib/validation';

// // Tipo específico para VehicleData con ObjectId real (para operaciones de MongoDB)
// interface VehicleDataMongo extends VehicleData {}

// // Definimos un tipo más específico para el filtro de MongoDB
// interface VehicleFilter extends Filter<VehicleDataMongo> {
//   _id?: ObjectId;
// }

// export class VehicleService {
//   private db: Db;
//   private collection: Collection<VehicleDataMongo>;

//   constructor(db: Db) {
//     this.db = db;
//     this.collection = db.collection<VehicleDataMongo>('vehicles');
//   }

//   async createVehicle(vehicleData: Omit<VehicleData, '_id' | 'postedDate' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<VehicleData>> {
//     try {
//       const now = new Date();
//       const dataToInsert: VehicleDataMongo = {
//         ...vehicleData,
//         postedDate: now,
//         createdAt: now,
//         updatedAt: now
//       };

//       console.log("Insertando vehículo en DB:", dataToInsert);
//       const result = await this.collection.insertOne(dataToInsert);

//       if (!result.acknowledged || !result.insertedId) {
//         console.error("Error: No se generó insertedId");
//         return {
//           success: false,
//           error: 'No se pudo crear el vehículo'
//         };
//       }

//       const insertedVehicle = {
//         ...dataToInsert,
//         _id: result.insertedId
//       };

//       console.log("Vehículo insertado con ID:", insertedVehicle._id.toString());

//       // Convertir para el frontend usando la función utilitaria existente
//       const { convertToFrontend } = await import('@/types/types');

//       return {
//         success: true,
//         data: convertToFrontend(insertedVehicle),
//         message: 'Vehículo creado exitosamente'
//       };
//     } catch (error) {
//       console.error('Error creating vehicle:', error);
//       return {
//         success: false,
//         error: 'Error interno del servidor al crear el vehículo'
//       };
//     }
//   }

//   async getVehicleById(id: string): Promise<ApiResponse<VehicleData>> {
//     try {
//       if (!ValidationUtils.isValidObjectId(id)) {
//         return {
//           success: false,
//           error: 'ID de vehículo inválido'
//         };
//       }

//       const filter: VehicleFilter = { _id: new ObjectId(id) };
//       const vehicle = await this.collection.findOne(filter);

//       if (!vehicle) {
//         return {
//           success: false,
//           error: 'Vehículo no encontrado'
//         };
//       }

//       // Convertir para el frontend usando la función utilitaria existente
//       const { convertToFrontend } = await import('@/types/types');

//       return {
//         success: true,
//         data: convertToFrontend(vehicle)
//       };
//     } catch (error) {
//       console.error('Error getting vehicle:', error);
//       return {
//         success: false,
//         error: 'Error interno del servidor al obtener el vehículo'
//       };
//     }
//   }

//   async updateVehicle(id: string, updateData: Partial<VehicleData>): Promise<ApiResponse<VehicleData>> {
//     try {
//       if (!ValidationUtils.isValidObjectId(id)) {
//         return {
//           success: false,
//           error: 'ID de vehículo inválido'
//         };
//       }

//       const dataToUpdate: Partial<VehicleDataMongo> = {
//         ...updateData,
//         updatedAt: new Date()
//       };

//       // Remover _id del objeto de actualización si existe
//       delete dataToUpdate._id;

//       const filter: VehicleFilter = { _id: new ObjectId(id) };
//       const result = await this.collection.findOneAndUpdate(
//         filter,
//         { $set: dataToUpdate },
//         { returnDocument: 'after' }
//       );

//       if (!result) {
//         return {
//           success: false,
//           error: 'Vehículo no encontrado'
//         };
//       }

//       // Convertir para el frontend usando la función utilitaria existente
//       const { convertToFrontend } = await import('@/types/types');

//       return {
//         success: true,
//         data: convertToFrontend(result),
//         message: 'Vehículo actualizado exitosamente'
//       };
//     } catch (error) {
//       console.error('Error updating vehicle:', error);
//       return {
//         success: false,
//         error: 'Error interno del servidor al actualizar el vehículo'
//       };
//     }
//   }

//   async deleteVehicle(id: string): Promise<ApiResponse<null>> {
//     try {
//       if (!ValidationUtils.isValidObjectId(id)) {
//         return {
//           success: false,
//           error: 'ID de vehículo inválido'
//         };
//       }

//       const filter: VehicleFilter = { _id: new ObjectId(id) };
//       const result = await this.collection.deleteOne(filter);

//       if (result.deletedCount === 0) {
//         return {
//           success: false,
//           error: 'Vehículo no encontrado'
//         };
//       }

//       return {
//         success: true,
//         data: null,
//         message: 'Vehículo eliminado exitosamente'
//       };
//     } catch (error) {
//       console.error('Error deleting vehicle:', error);
//       return {
//         success: false,
//         error: 'Error interno del servidor al eliminar el vehículo'
//       };
//     }
//   }
// }

// src/services/vehicleService.ts
import { Db, Collection, ObjectId, Filter } from "mongodb";
import {
  VehicleDataBackend as VehicleData,
  ApiResponseFrontend as ApiResponse, // Cambiar a ApiResponseFrontend
  VehicleDataFrontend,
} from "@/types/types";
import { ValidationUtils } from "../lib/validation";

// Tipo específico para VehicleData con ObjectId real y views opcional (para operaciones de MongoDB)
interface VehicleDataMongo extends VehicleData {
  views?: number;
}

// Definimos un tipo más específico para el filtro de MongoDB
interface VehicleFilter extends Filter<VehicleDataMongo> {
  _id?: ObjectId;
}

export class VehicleService {
  private db: Db;
  private collection: Collection<VehicleDataMongo>;

  constructor(db: Db) {
    this.db = db;
    this.collection = db.collection<VehicleDataMongo>("vehicles");
  }

  async createVehicle(
    vehicleData: Omit<
      VehicleData,
      "_id" | "postedDate" | "createdAt" | "updatedAt"
    >
  ): Promise<ApiResponse<VehicleDataFrontend>> {
    try {
      const now = new Date();
      const dataToInsert: VehicleDataMongo = {
        ...vehicleData,
        postedDate: now,
        createdAt: now,
        updatedAt: now,
        views: 0, // Inicializar views en 0 al crear un vehículo
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

      const insertedVehicle = {
        ...dataToInsert,
        _id: result.insertedId,
      };

      console.log("Vehículo insertado con ID:", insertedVehicle._id.toString());

      const { convertToFrontend } = await import("@/types/types");

      return {
        success: true,
        data: convertToFrontend(insertedVehicle),
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

  async getVehicleById(id: string): Promise<ApiResponse<VehicleDataFrontend>> {
    try {
      if (!ValidationUtils.isValidObjectId(id)) {
        return {
          success: false,
          error: "ID de vehículo inválido",
        };
      }

      const filter: VehicleFilter = { _id: new ObjectId(id) };
      const vehicle = await this.collection.findOne(filter);

      if (!vehicle) {
        return {
          success: false,
          error: "Vehículo no encontrado",
        };
      }

      const { convertToFrontend } = await import("@/types/types");

      return {
        success: true,
        data: convertToFrontend(vehicle),
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

      const dataToUpdate: Partial<VehicleDataMongo> = {
        ...updateData,
        updatedAt: new Date(),
      };

      delete dataToUpdate._id;

      const filter: VehicleFilter = { _id: new ObjectId(id) };
      const result = await this.collection.findOneAndUpdate(
        filter,
        { $set: dataToUpdate },
        { returnDocument: "after" }
      );

      if (!result) {
        return {
          success: false,
          error: "Vehículo no encontrado",
        };
      }

      const { convertToFrontend } = await import("@/types/types");

      return {
        success: true,
        data: convertToFrontend(result),
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

      const filter: VehicleFilter = { _id: new ObjectId(id) };
      const result = await this.collection.deleteOne(filter);

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

      const filter: VehicleFilter = { _id: new ObjectId(id) };
      const updateResult = await this.collection.findOneAndUpdate(
        filter,
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

      return {
        success: true,
        data: convertToFrontend(updateResult),
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
}