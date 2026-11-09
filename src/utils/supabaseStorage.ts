import { createClient } from "@supabase/supabase-js";
import "multer"; 

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Inisialisasi Supabase client dengan service role key untuk operasi server-side
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const BUCKET_NAME = "receipts";

export const uploadFileToSupabase = async (
  file: Express.Multer.File,
): Promise<string> => {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `notes/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(
      `Gagal mengunggah file ke Supabase Storage: ${error.message}`,
    );
  }

  // Ambil public URL file yang baru di-upload
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
  return data.publicUrl;
};

export const deleteFileFromSupabase = async (
  fileUrl: string,
): Promise<void> => {
  try {
    const urlObj = new URL(fileUrl);
    const pathParts = urlObj.pathname.split(
      `/storage/v1/object/public/${BUCKET_NAME}/`,
    );

    // Validasi eksistensi path untuk menghindari tipe undefined
    if (pathParts.length > 1 && pathParts[1]) {
      const filePath: string = pathParts[1]; // Explicit casting ke tipe string
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
    }
  } catch (error) {
    console.error("Gagal menghapus file lama dari storage:", error);
  }
};
