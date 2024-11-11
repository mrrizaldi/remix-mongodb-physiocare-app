// app/schemas/profile.schema.ts
import { z } from "zod";

export const accountSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
      invalid_type_error: "Username must be a string",
    })
    .min(3, "Username must be at least 3 characters"),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format"),
});

// Profile Schema
export const profileSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2, "Name must be at least 2 characters"),

  dob: z
    .date({
      invalid_type_error: "Invalid date format",
    })
    .optional(),

  age: z
    .number({
      invalid_type_error: "Age must be a number",
    })
    .int("Age must be an integer")
    .min(0, "Age cannot be negative")
    .max(150, "Age cannot be more than 150")
    .optional(),

  gender: z.enum(["male", "female", "other"] as const).optional(),

  address: z
    .string({
      invalid_type_error: "Address must be a string",
    })
    .min(5, "Address must be at least 5 characters")
    .optional(),

  phone: z
    .string({
      invalid_type_error: "Phone must be a string",
    })
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .optional(),

  account: accountSchema,
});

// Type untuk Profile
export type Profile = z.infer<typeof profileSchema>;

// Schema untuk Update Profile (partial version)
export const profileUpdateSchema = profileSchema.partial().extend({
  name: profileSchema.shape.name,
  account: accountSchema.partial().extend({
    username: accountSchema.shape.username,
    email: accountSchema.shape.email,
  }),
});

// Type untuk Update Profile
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;

// Schema untuk form input (berbeda dengan model karena handling string input dari form)
export const profileFormSchema = profileSchema
  .extend({
    dob: z
      .string() // Form menggunakan string untuk date input
      .transform((str) => (str ? new Date(str) : undefined))
      .optional(),
    age: z
      .string() // Form menggunakan string untuk number input
      .transform((str) => (str ? parseInt(str, 10) : undefined))
      .optional(),
  })
  .omit({ account: true }) // Handle account fields terpisah
  .extend({
    username: accountSchema.shape.username,
    email: accountSchema.shape.email,
  });

// Type untuk form input
export type ProfileFormData = z.infer<typeof profileFormSchema>;

// Validation functions
export const validateProfile = (data: unknown) => {
  return profileSchema.safeParse(data);
};

export const validateProfileUpdate = (data: unknown) => {
  return profileUpdateSchema.safeParse(data);
};

export const validateProfileForm = (data: unknown) => {
  return profileFormSchema.safeParse(data);
};
