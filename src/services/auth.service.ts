import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginInput } from "../schemas/auth.schema";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-masjid";
const JWT_EXPIRES_IN = "1d"; // Token berlaku 1 hari

export class AuthService {
  static async login(data: LoginInput) {
    const { username, password } = data;

    // 1. Cari data admin di database
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      throw new Error("Username atau password salah.");
    }

    // 2. Verifikasi password dengan bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error("Username atau password salah.");
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    // 4. Return token dan info akun admin (menyembunyikan password)
    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        createdAt: admin.createdAt,
      },
    };
  }
}
