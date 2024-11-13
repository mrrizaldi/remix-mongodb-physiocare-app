import { z } from "zod";

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  price: z.number().min(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Service = z.infer<typeof ServiceSchema>;

export const CreateServiceSchema = ServiceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateServiceSchema = CreateServiceSchema.partial();
