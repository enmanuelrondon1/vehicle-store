// src/services/userService.ts
import { Db, ObjectId } from "mongodb";
import { User } from "@/types/user.types";

export class UserService {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  private get collection() {
    return this.db.collection<User>("users");
  }

  async getUserById(userId: string): Promise<User | null> {
    if (!ObjectId.isValid(userId)) {
      return null;
    }
    const user = await this.collection.findOne({
      _id: new ObjectId(userId),
    });
    return user;
  }
}