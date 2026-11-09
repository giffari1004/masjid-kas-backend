import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validateBody = (schema: z.ZodType) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Validasi dan parsing request body sesuai schema
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
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
  };
};
