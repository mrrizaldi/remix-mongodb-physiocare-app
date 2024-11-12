import { z } from "zod";

export const ProfileSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().max(100),
  dob: z.coerce.date().nullable(),
  age: z.number().int().min(0).nullable(),
  gender: z.string().max(10).nullable(),
  address: z.string().nullable(),
  phone: z.string().max(50).nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
});

export const CreateProfileSchema = ProfileSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateProfileSchema = CreateProfileSchema.partial();

export type Profile = z.infer<typeof ProfileSchema>;
export type CreateProfileInput = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
