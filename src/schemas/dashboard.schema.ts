import { z } from "zod";

export const dashboardQuerySchema = z.object({
  month: z.coerce
    .number()
    .int()
    .min(1, { message: "Bulan minimal 1" })
    .max(12, { message: "Bulan maksimal 12" })
    .optional(),
  year: z.coerce
    .number()
    .int()
    .min(2000, { message: "Tahun minimal 2000" })
    .max(2100, { message: "Tahun maksimal 2100" })
    .optional(),
});

export type DashboardQueryParams = z.infer<typeof dashboardQuerySchema>;
