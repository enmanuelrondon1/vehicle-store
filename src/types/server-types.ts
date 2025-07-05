// // types/server-types.ts - Solo para el servidor (incluye MongoDB)
// import { ObjectId } from 'mongodb';
// import { VehicleData } from './types-client';

// // Tipo que incluye campos de MongoDB (solo para el servidor)
// export interface VehicleDataBackend extends VehicleData {
//   _id?: ObjectId;
//   postedDate?: Date;
//   createdAt?: Date;
//   updatedAt?: Date;
// }