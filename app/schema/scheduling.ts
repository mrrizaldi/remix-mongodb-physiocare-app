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

const PaymentSchema = z.object({
  amount: z.number().positive(),
  status: z
    .enum([PaymentStatus.PENDING, PaymentStatus.PAID, PaymentStatus.CANCELLED])
    .default(PaymentStatus.PENDING),
  paymentMethod: z.string().optional(),
});

export const SchedulingResponseSchema = z.object({
  id: z.string(),
  date: z.string(),
  session: z.enum(Object.values(SessionTypes) as [string, ...string[]]),
  staff: z.object({
    id: z.string(),
    name: z.string(),
  }),
  service: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
  }),
  status: z.enum(Object.values(SchedulingStatus) as [string, ...string[]]),
  payment: PaymentSchema,
});

export const LoaderDataSchema = z.object({
  schedules: z.array(SchedulingResponseSchema),
});

export const DoctorSchedulingResponseSchema = z.object({
  schedules: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      session: z.enum(Object.values(SessionTypes) as [string, ...string[]]),
      patient: z.object({
        id: z.string(),
        name: z.string(),
      }),
      service: z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
      }),
      status: z.enum(Object.values(SchedulingStatus) as [string, ...string[]]),
      payment: z.object({
        amount: z.number(),
        status: z.enum(Object.values(PaymentStatus) as [string, ...string[]]),
      }),
    })
  ),
});

export const UpdateSchedulingSchema = z.object({
  scheduleId: z.string(),
  status: z.enum([SchedulingStatus.CONFIRMED, SchedulingStatus.CANCELLED]),
});

export type DoctorSchedulingResponse = z.infer<
  typeof DoctorSchedulingResponseSchema
>;
export type UpdateSchedulingInput = z.infer<typeof UpdateSchedulingSchema>;
export type SchedulingResponse = z.infer<typeof SchedulingResponseSchema>;
export type LoaderData = z.infer<typeof LoaderDataSchema>;
