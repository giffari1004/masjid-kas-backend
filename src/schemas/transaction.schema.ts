import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["IN", "OUT"], { message: "Type harus bernilai IN atau OUT" }),
  category: z.enum(
    ["OPERASIONAL", "JUMAT", "PEMBANGUNAN", "EVENT", "ZAKAT_MAL"],
    {
      message: "Kategori kas tidak valid",
    },
  ),
  source: z.string().optional(),
  amount: z.coerce
    .number({ message: "Amount harus berupa angka" })
    .positive({ message: "Amount harus lebih besar dari 0" }),
  donorName: z.string().optional(),
  description: z.string().optional(),
  transactionDate: z.coerce.date().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionQuerySchema = z.object({
  type: z.enum(["IN", "OUT"]).optional(),
  category: z
    .enum(["OPERASIONAL", "JUMAT", "PEMBANGUNAN", "EVENT", "ZAKAT_MAL"])
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionQueryParams = z.infer<typeof transactionQuerySchema>;
