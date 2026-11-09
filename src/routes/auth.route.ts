import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate";
import { loginSchema } from "../schemas/auth.schema";

const router = Router();

// POST /api/auth/login
router.post("/login", validateBody(loginSchema), AuthController.login);

export default router;
