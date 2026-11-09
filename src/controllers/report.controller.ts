import { Request, Response, NextFunction } from "express";
import { ReportService } from "../services/report.service";
import {
  fridayReportQuerySchema,
  monthlyReportQuerySchema,
} from "../schemas/report.schema";
import { ZodError } from "zod";

export class ReportController {
  static async getFridayReport(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedQuery = fridayReportQuerySchema.parse(req.query);
      const result = await ReportService.getFridayReport(validatedQuery);

      res.status(200).json({
        status: "success",
        message: "Berhasil mengambil rekapitulasi transaksi hari Jumat",
        data: result,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "error",
          message: "Parameter tanggal query tidak valid",
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

  static async getMonthlyReport(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedQuery = monthlyReportQuerySchema.parse(req.query);
      const result = await ReportService.getMonthlyReport(validatedQuery);

      res.status(200).json({
        status: "success",
        message: "Berhasil mengambil rekapitulasi bulanan kas masjid",
        data: result,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "error",
          message: "Parameter bulan atau tahun query tidak valid",
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
