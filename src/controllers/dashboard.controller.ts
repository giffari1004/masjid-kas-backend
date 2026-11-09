import { Request, Response, NextFunction } from "express";
import { DashboardService } from "../services/dashboard.service";
import { dashboardQuerySchema } from "../schemas/dashboard.schema";
import { ZodError } from "zod";

export class DashboardController {
  static async getSummary(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedQuery = dashboardQuerySchema.parse(req.query);
      const result = await DashboardService.getSummary(validatedQuery);

      res.status(200).json({
        status: "success",
        message: "Berhasil mengambil ringkasan dashboard kas masjid",
        data: result,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "error",
          message: "Parameter query bulan atau tahun tidak valid",
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  }
}
