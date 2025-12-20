import { z } from "zod";

export const productCreateSchema = z
  .strictObject({
    imageUrl: z.string().trim(),
    nameFull: z.string().trim().min(1).max(100),
    nameShort: z.string().trim().min(1).max(50).optional(),
    brand: z.string().trim().min(1).max(30).optional(),
    price: z.coerce.number().min(0),
    quantity: z.coerce.number().min(0).default(0),
    categories: z.array(z.string().trim().min(0)).default([]),
    description: z.string().trim().min(1).max(500).optional(),
    caseInfo: z.string().trim().min(1).max(50).optional(),
    waterResistanceInfo: z.string().trim().min(1).max(50).optional(),
    strapColor: z.string().trim().min(1).max(50).optional(),
    strapMaterial: z.string().trim().min(1).max(50).optional(),
  })
  .transform((data) => ({
    ...data,
    nameShort: data.nameShort ?? data.nameFull.slice(0, 50),
  }));

export const categoryCreateSchema = z.strictObject({
  name: z.string().trim().min(1).max(70),
});
