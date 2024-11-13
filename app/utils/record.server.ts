import { MedicalRecord } from "~/models/index";

export async function createManyMedicalRecords(records: any[]) {
  return await MedicalRecord.insertMany(records);
}

export async function deleteManyMedicalRecords() {
  return await MedicalRecord.deleteMany({});
}

export async function getMedicalRecords() {
  return await MedicalRecord.find().lean();
}
