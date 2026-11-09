import multer from "multer";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Format file tidak didukung. Hanya file gambar (JPG, PNG) dan PDF yang diizinkan.",
      ),
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batas ukuran file 5MB
  fileFilter,
});

export const uploadReceipt = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  upload.single("receipt")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({
        status: "error",
        message: `Kesalahan upload file: ${err.message}`,
      });
      return;
    } else if (err) {
      res.status(400).json({
        status: "error",
        message: err.message,
      });
      return;
    }
    next();
  });
};
