import mongoose from "mongoose";

/**
 * Serverless-safe cached Mongoose connection.
 * A single connection is reused across hot reloads / lambda invocations.
 */
const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = global as unknown as { _mongoose?: MongooseCache };

const cached: MongooseCache =
  globalForMongoose._mongoose ?? { conn: null, promise: null };

globalForMongoose._mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in environment");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: process.env.MONGODB_DB ?? "smilecare",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
