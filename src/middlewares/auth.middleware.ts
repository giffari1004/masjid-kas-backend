import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/auth.types";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-masjid";

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer <TOKEN>

  if (!token) {
    res.status(401).json({
      status: "error",
      message: "Token otorisasi tidak ditemukan. Akses ditolak.",
    });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({
        status: "error",
        message: "Token tidak valid atau kedaluwarsa.",
      });
      return;
    }

    req.user = decoded as { id: string; username: string };
    next();
  });
};
