import { z } from "zod";

export const fridayReportQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Format tanggal harus YYYY-MM-DD",
    }),
});

export const monthlyReportQuerySchema = z.object({
  month: z.coerce
    .number()
    .int()
    .min(1, { message: "Bulan minimal 1" })
    .max(12, { message: "Bulan maksimal 12" }),
  year: z.coerce
    .number()
    .int()
    .min(2000, { message: "Tahun minimal 2000" })
    .max(2100, { message: "Tahun maksimal 2100" }),
});

export type FridayReportQueryParams = z.infer<typeof fridayReportQuerySchema>;
export type MonthlyReportQueryParams = z.infer<typeof monthlyReportQuerySchema>;
