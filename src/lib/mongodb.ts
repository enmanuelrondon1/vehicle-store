// src/lib/mongodb.ts 
import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const uri = process.env.MONGODB_URI;
let clientPromise: Promise<MongoClient>;

// Extiende el tipo globalThis para incluir _mongoClientPromise
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    }).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  }).connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("vehicle_store");
}