import { z } from "zod";

export enum InventoryTypes {
  MEDICINE = "MEDICINE",
  AIDS = "AIDS",
  EQUIPMENT = "EQUIPMENT",
  SUPPLY = "SUPPLY",
}

export const MedicalInventorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().min(0),
  stock: z.number().min(0),
  type: z.enum([
    InventoryTypes.MEDICINE,
    InventoryTypes.AIDS,
    InventoryTypes.EQUIPMENT,
    InventoryTypes.SUPPLY,
  ]),
});

export const CreateMedicalInventorySchema = MedicalInventorySchema;

export const UpdateMedicalInventorySchema =
  CreateMedicalInventorySchema.partial();

export type MedicalInventory = z.infer<typeof MedicalInventorySchema>;
export type CreateMedicalInventoryInput = z.infer<
  typeof CreateMedicalInventorySchema
>[];
export type UpdateMedicalInventoryInput = z.infer<
  typeof UpdateMedicalInventorySchema
>;
