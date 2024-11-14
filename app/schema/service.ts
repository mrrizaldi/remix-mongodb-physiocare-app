import { z } from "zod";
import { Service } from "~/models";

export const ServiceSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  price: z.number().min(0),
});

export type Service = z.infer<typeof ServiceSchema>;

export const CreateServiceSchema = ServiceSchema.omit({
  id: true,
});
export const UpdateServiceSchema = CreateServiceSchema.partial();
