import { z } from "zod";
import { SessionTypes } from "~/schema/profile";
import { ObjectId } from "mongodb";

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
const objectIdSchema = z
  .string()
  .refine((val) => ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  })
  .transform((val) => new ObjectId(val));

export const CreateSchedulingSchema = z.object({
  staffId: objectIdSchema,
  patientId: objectIdSchema,
  serviceId: objectIdSchema,
  date: z.date(),
  session: z.enum(Object.values(SessionTypes) as [string, ...string[]]),
  paymentAmount: z.number().optional(),
});

export type CreateScheduleInput = z.infer<typeof CreateSchedulingSchema>;
