import { ObjectId } from "mongodb";

// src/types/user.types.ts
export interface User {
  _id?: ObjectId;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  favorites?: string[];
}