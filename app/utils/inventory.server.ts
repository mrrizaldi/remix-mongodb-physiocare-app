// app/utils/inventory.server.ts
import { MedicalInventory } from "~/models/index";
import { connectDB } from "./db.server";
import type {
  CreateMedicalInventoryInput,
  UpdateMedicalInventoryInput,
} from "~/schema/inventory";

export async function getMedicalInventories() {
  await connectDB();
  return MedicalInventory.find().sort({ name: 1 });
}

export async function getMedicalInventory(id: string) {
  await connectDB();
  return MedicalInventory.findById(id);
}

export async function createMedicalInventory(
  data: CreateMedicalInventoryInput
) {
  await connectDB();
  return MedicalInventory.insertMany(data);
}

export async function updateMedicalInventory(
  id: string,
  data: UpdateMedicalInventoryInput
) {
  await connectDB();
  return MedicalInventory.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteMedicalInventory(id: string) {
  await connectDB();
  return MedicalInventory.findByIdAndDelete(id);
}

export async function deleteManyMedicalInventories() {
  await connectDB();
  return MedicalInventory.deleteMany({});
}
