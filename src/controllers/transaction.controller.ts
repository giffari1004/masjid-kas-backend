import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.service";
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
} from "../schemas/transaction.schema";
import { ZodError } from "zod";

export class TransactionController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedData = createTransactionSchema.parse(req.body);
      const result = await TransactionService.create(validatedData, req.file);

      res.status(201).json({
        status: "success",
        message: "Transaksi kas berhasil dicatat",
        data: result,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "error",
          message: "Validasi input gagal",
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

  static async findAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const validatedQuery = transactionQuerySchema.parse(req.query);
      const result = await TransactionService.findAll(validatedQuery);

      res.status(200).json({
        status: "success",
        message: "Berhasil mengambil daftar transaksi",
        ...result,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "error",
          message: "Parameter query tidak valid",
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

  static async findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;

      if (!id) {
        res
          .status(400)
          .json({
            status: "error",
            message: "ID transaksi tidak valid atau tidak disertakan.",
          });
        return;
      }

      const result = await TransactionService.findById(id);

      res.status(200).json({
        status: "success",
        message: "Berhasil mengambil detail transaksi",
        data: result,
      });
    } catch (error: any) {
      if (error.message === "Transaksi tidak ditemukan.") {
        res.status(404).json({ status: "error", message: error.message });
        return;
      }
      next(error);
    }
  }

  static async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;

      if (!id) {
        res
          .status(400)
          .json({
            status: "error",
            message: "ID transaksi tidak valid atau tidak disertakan.",
          });
        return;
      }

      const validatedData = updateTransactionSchema.parse(req.body);
      const result = await TransactionService.update(
        id,
        validatedData,
        req.file,
      );

      res.status(200).json({
        status: "success",
        message: "Transaksi kas berhasil diperbarui",
        data: result,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "error",
          message: "Validasi input gagal",
          errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }
      if (error.message === "Transaksi tidak ditemukan.") {
        res.status(404).json({ status: "error", message: error.message });
        return;
      }
      next(error);
    }
  }

  static async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const rawId = req.params.id;
      const id = Array.isArray(rawId) ? rawId[0] : rawId;

      if (!id) {
        res
          .status(400)
          .json({
            status: "error",
            message: "ID transaksi tidak valid atau tidak disertakan.",
          });
        return;
      }

      await TransactionService.delete(id);

      res.status(200).json({
        status: "success",
        message: "Transaksi kas berhasil dihapus",
      });
    } catch (error: any) {
      if (error.message === "Transaksi tidak ditemukan.") {
        res.status(404).json({ status: "error", message: error.message });
        return;
      }
      next(error);
    }
  }
}
