// types.ts
import { z } from "zod";

export const InventoryTypes = {
  MEDICINE: "MEDICINE",
  EQUIPMENT: "EQUIPMENT",
  SUPPLY: "SUPPLY",
} as const;

export const medicalInventorySchema = z.object({
  _id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().min(0),
  type: z.enum(Object.values(InventoryTypes) as [string, ...string[]]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const prescriptionDetailSchema = z.object({
  medicalInventory: z.string(),
  quantity: z.number().positive(),
  dosageInstructions: z.string().optional(),
});

export const vitalsSchema = z.object({
  systolic: z.number().min(0).max(300),
  diastolic: z.number().min(0).max(200),
  heartRate: z.number().min(0).max(300),
  respiratoryRate: z.number().min(0).max(100),
  temperature: z.number().min(30).max(45),
});

export const serviceNoteSchema = z.object({
  additionalNotes: z.string().optional(),
  prescription: z.object({
    details: z.array(prescriptionDetailSchema),
  }),
});

export const medicalRecordSchema = z.object({
  patientId: z.string(),
  complaint: z.string().optional(),
  medicalHistory: z.string().optional(),
  physicalExamination: z.string().optional(),
  vitals: vitalsSchema,
  serviceNotes: z.array(serviceNoteSchema),
});

// Base schema for viewing medical inventory items
export const medicalInventoryViewSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(["MEDICINE", "EQUIPMENT", "SUPPLY"]),
});

// Schema for viewing prescription details
export const prescriptionDetailViewSchema = z.object({
  medicalInventory: z.string(),
  quantity: z.number(),
  dosageInstructions: z.string(),
  medicineDetails: medicalInventoryViewSchema.optional(), // For populated data
});

// Schema for viewing service notes
export const serviceNoteViewSchema = z.object({
  additionalNotes: z.string(),
  prescription: z.object({
    details: z.array(prescriptionDetailViewSchema),
  }),
  createdAt: z.date().optional(),
});

// Schema for viewing vitals
export const vitalsViewSchema = z.object({
  systolic: z.number(),
  diastolic: z.number(),
  heartRate: z.number(),
  respiratoryRate: z.number(),
  temperature: z.number(),
});

// Main schema for viewing medical records
export const patientMedicalRecordViewSchema = z.object({
  _id: z.string(),
  patientId: z.string(),
  doctorId: z.string().optional(),
  doctorName: z.string().optional(),
  complaint: z.string(),
  medicalHistory: z.string(),
  physicalExamination: z.string(),
  vitals: vitalsViewSchema,
  serviceNotes: z.array(serviceNoteViewSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type exports
export type MedicalInventoryView = z.infer<typeof medicalInventoryViewSchema>;
export type PrescriptionDetailView = z.infer<
  typeof prescriptionDetailViewSchema
>;
export type ServiceNoteView = z.infer<typeof serviceNoteViewSchema>;
export type VitalsView = z.infer<typeof vitalsViewSchema>;
export type PatientMedicalRecordView = z.infer<
  typeof patientMedicalRecordViewSchema
>;
export type MedicalInventory = z.infer<typeof medicalInventorySchema>;
export type PrescriptionDetail = z.infer<typeof prescriptionDetailSchema>;
export type Vitals = z.infer<typeof vitalsSchema>;
export type ServiceNote = z.infer<typeof serviceNoteSchema>;
export type MedicalRecord = z.infer<typeof medicalRecordSchema>;
