import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";
import authRoutes from './routes/auth.route'
import transactionRoutes from "./routes/transaction.route";
import dashboardRoutes from "./routes/dashboard.route"

// Load environment variables dari file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ====================
// 1. MIDDLEWARE
// ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====================
// 2. ROUTES PLACEHOLDER
// ====================
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Backend API Kas Masjid berjalan dengan baik!",
    timestamp: new Date().toISOString(),
  });
});

// Contoh routing modular (nanti bisa di-import dari folder /routes)
// app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes)
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ====================
// 3. GLOBAL ERROR HANDLER
// ====================
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("[Error Stack]:", err.stack);
  res.status(500).json({
    status: "error",
    message: "Terjadi kesalahan pada server internal.",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ====================
// 4. SERVER & DB LISTENER
// ====================
app.listen(PORT, async () => {
  try {
    // Tes koneksi database Prisma / Supabase saat server menyala
    await prisma.$connect();
    console.log(
      "✅ Berhasil terhubung ke database PostgreSQL via Supabase & Prisma",
    );
  } catch (error) {
    console.error("❌ Gagal terhubung ke database:", error);
  }

  console.log(`🚀 Server Express sedang berjalan di http://localhost:${PORT}`);
});
