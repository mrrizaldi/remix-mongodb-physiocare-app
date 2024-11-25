import { Types } from "mongoose";
import { connectDB } from "./db.server";
import { Profile, MedicalInventory, MedicalRecord, Scheduling } from "~/models";
import {
  type PatientMedicalRecordView,
  type ServiceNoteView,
  type PrescriptionDetailView,
} from "~/schema/record";

interface MedicalRecordDocument {
  _id: Types.ObjectId;
  patientId: string;
  doctorId?: string;
  doctorName?: string;
  complaint: string;
  medicalHistory: string;
  physicalExamination: string;
  vitals: {
    systolic: number;
    diastolic: number;
    heartRate: number;
    respiratoryRate: number;
    temperature: number;
  };
  serviceNotes: Array<{
    additionalNotes?: string;
    prescription: {
      details: Array<{
        medicalInventory: Types.ObjectId;
        quantity: number;
        dosageInstructions?: string;
      }>;
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export async function getPatients() {
  await connectDB();
  return (await Profile.find({ "account.role": "PATIENT" }).lean()) as any;
}

export async function getMedicalInventory() {
  await connectDB();
  return await MedicalInventory.find().lean();
}

export async function createMedicalRecord(recordData: any) {
  try {
    await connectDB();
    const medicalRecord = await MedicalRecord.create(recordData);
    console.log("Medical record created:", medicalRecord);
    return medicalRecord;
  } catch (error) {
    console.error("Error creating medical record:", error);
    throw error;
  }
}

export async function getMedicalRecordsById(
  patientId: string
): Promise<PatientMedicalRecordView[]> {
  await connectDB();
  const records = await MedicalRecord.find({ patientId })
    .populate({
      path: "serviceNotes.prescription.details.medicalInventory",
      model: "MedicalInventory",
      select: "name description type",
    })
    .sort({ createAt: -1 })
    .lean<MedicalRecordDocument[]>();

  if (!records) {
    return [];
  }

  return records.map((record) => ({
    _id: record._id.toString(),
    patientId: record.patientId,
    doctorId: record.doctorId,
    doctorName: record.doctorName,
    complaint: record.complaint,
    medicalHistory: record.medicalHistory,
    physicalExamination: record.physicalExamination,
    vitals: record.vitals,
    serviceNotes: record.serviceNotes.map(
      (note): ServiceNoteView => ({
        additionalNotes: note.additionalNotes || "",
        prescription: {
          details: note.prescription.details.map(
            (detail): PrescriptionDetailView => ({
              medicalInventory: detail.medicalInventory.toString(),
              quantity: detail.quantity,
              dosageInstructions: detail.dosageInstructions || "",
              medicineDetails: detail.medicalInventory as any, // Type assertion needed because of populate
            })
          ),
        },
      })
    ),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }));
}

export async function getMedicalInventoryItems(itemIds: string[]) {
  await connectDB();
  return await MedicalInventory.find({ _id: { $in: itemIds } }).lean();
}

export async function getScheduling(id: string) {
  await connectDB();
  return await Scheduling.findById(id).lean();
}
export async function getMedicalRecords() {
  await connectDB();
  return await MedicalRecord.find().lean();
}
