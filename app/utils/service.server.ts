// app/utils/service.server.ts
import { Service } from "~/models/index";
import { connectDB } from "./db.server";

interface ServiceData {
  name: string;
  price: number;
}

export async function getServices() {
  await connectDB();
  return Service.find().sort({ name: 1 });
}

export async function getService(id: string) {
  await connectDB();
  return Service.findById(id);
}

export async function createService(data: ServiceData | ServiceData[]) {
  await connectDB();
  return Service.create(data);
}

export async function updateService(
  id: string,
  data: Partial<{ name: string; price: number }>
) {
  await connectDB();
  return Service.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteService(id: string) {
  await connectDB();
  return Service.findByIdAndDelete(id);
}

export async function deleteManyServices() {
  await connectDB();
  return Service.deleteMany({});
}
