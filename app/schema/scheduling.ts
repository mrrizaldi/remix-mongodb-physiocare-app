import { z } from "zod";
import { SessionTypes } from "~/schema/profile";

export enum SchedulingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export const schedulingSchema = z.object({
  staffId: z.string(), // ObjectId as string
  patientId: z.string(), // ObjectId as string
  serviceId: z.string(), // ObjectId as string
  date: z.date(),
  session: z.enum(Object.values(SessionTypes) as [string, ...string[]]),
  status: z.enum(Object.values(SchedulingStatus) as [string, ...string[]]),
  payment: z.object({
    amount: z.number(),
    status: z.enum(Object.values(PaymentStatus) as [string, ...string[]]),
    paymentMethod: z.string().optional(),
  }),
  medicalRecordId: z.string().optional(), // ObjectId as string
});
