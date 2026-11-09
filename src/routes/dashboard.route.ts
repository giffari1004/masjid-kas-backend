import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// Lindungi seluruh endpoint dashboard dengan autentikasi admin
router.use(authenticateToken);

// GET /api/dashboard/summary — Ringkasan kas (Total saldo, pemasukan & pengeluaran bulan ini)
router.get("/summary", DashboardController.getSummary);

export default router;
