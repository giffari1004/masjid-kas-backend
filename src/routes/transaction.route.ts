import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { uploadReceipt } from "../middlewares/upload.middleware";

const router = Router();

// Lindungi seluruh endpoint transaksi dengan middleware otorisasi JWT
router.use(authenticateToken);

// POST /api/transactions — Menambah transaksi baru + upload file nota
router.post("/", uploadReceipt, TransactionController.create);

// GET /api/transactions — Mengambil daftar riwayat transaksi dengan filter query params
router.get("/", TransactionController.findAll);

// GET /api/transactions/:id — Mengambil detail satu transaksi berdasarkan ID
router.get("/:id", TransactionController.findById);

// PUT /api/transactions/:id — Mengubah data transaksi + opsi ganti file nota
router.put("/:id", uploadReceipt, TransactionController.update);

// DELETE /api/transactions/:id — Menghapus data transaksi & file di Supabase Storage
router.delete("/:id", TransactionController.delete);

export default router;
