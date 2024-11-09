// app/db.server.ts
import mongoose from "mongoose";

let db: mongoose.Connection;

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (db) {
    return db;
  }

  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  });

  db = connection.connection;

  db.on("error", console.error.bind(console, "MongoDB connection error:"));

  return db;
}

export { db };
