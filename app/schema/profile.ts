import { z } from "zod";

export enum SessionTypes {
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
  EVENING = "EVENING",
}

export enum Days {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum RoleTypes {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  OFFICER = "OFFICER",
  PATIENT = "PATIENT",
}

export const AccountSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum([
    RoleTypes.ADMIN,
    RoleTypes.DOCTOR,
    RoleTypes.OFFICER,
    RoleTypes.PATIENT,
  ]),
});

const CapacitySchema = z.object({
  session: z.enum([
    SessionTypes.MORNING,
    SessionTypes.AFTERNOON,
    SessionTypes.EVENING,
  ]),
  maxPatients: z.number().min(1).default(5),
});

const ScheduleSchema = z.object({
  day: z.enum([
    Days.MONDAY,
    Days.TUESDAY,
    Days.WEDNESDAY,
    Days.THURSDAY,
    Days.FRIDAY,
    Days.SATURDAY,
    Days.SUNDAY,
  ]),
  isActive: z.boolean().default(true),
  capacities: z.array(CapacitySchema),
});

const SpecialtySchema = z.object({
  serviceId: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  active: z.boolean().default(true),
});

const PositionSchema = z.object({
  name: z.string(),
  maxSalary: z.number().optional(),
  minSalary: z.number().optional(),
});

export const StaffSchema = z.object({
  position: PositionSchema,
  salary: z.number().default(0),
  joinDate: z.date(),
  active: z.boolean().default(true),
  specialties: z.array(SpecialtySchema).optional(),
  schedule: z.array(ScheduleSchema).optional(),
});

export const ProfileSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  dob: z.date().optional(),
  age: z.number().min(0).optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  account: AccountSchema,
  staffDetails: z.union([StaffSchema, z.null()]).optional(),
});

export const CreateProfileSchema = ProfileSchema.omit({
  _id: true,
  dob: true,
  age: true,
  phone: true,
  address: true,
  staffDetails: true,
});
export const UpdateProfileSchema = ProfileSchema.partial();

export type Profile = z.infer<typeof ProfileSchema>;
export type Staff = z.infer<typeof StaffSchema>;
export type CreateProfileInput = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
