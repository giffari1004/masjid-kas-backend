import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

// Lindungi seluruh endpoint laporan dengan middleware otorisasi JWT
router.use(authenticateToken);

// GET /api/reports/friday?date=YYYY-MM-DD — Rekap khusus transaksi hari Jumat
router.get("/friday", ReportController.getFridayReport);

// GET /api/reports/monthly?month=MM&year=YYYY — Rekap penuh seluruh kategori bulanan
router.get("/monthly", ReportController.getMonthlyReport);

export default router;
