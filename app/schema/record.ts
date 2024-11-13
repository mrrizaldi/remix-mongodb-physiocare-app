import { z } from "zod";

// Prescription Schema
export const prescriptionSchema = z.object({
  details: z.array(
    z.object({
      medicalInventory: z.string(), // ObjectId as string
      quantity: z.number().min(1),
      dosageInstructions: z.string().optional(),
    })
  ),
});

// Medical Record Schema
export const medicalRecordSchema = z.object({
  patientId: z.string(), // ObjectId as string
  complaint: z.string().optional(),
  medicalHistory: z.string().optional(),
  physicalExamination: z.string().optional(),
  vitals: z
    .object({
      systolic: z.number().optional(),
      diastolic: z.number().optional(),
      heartRate: z.number().optional(),
      respiratoryRate: z.number().optional(),
      temperature: z.number().optional(),
    })
    .optional(),
  serviceNotes: z.array(
    z.object({
      additionalNotes: z.string().optional(),
      prescription: prescriptionSchema.optional(),
    })
  ),
});
