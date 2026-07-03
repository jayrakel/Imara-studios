import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const MAX_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '20', 10);

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp3', '.wav', '.pdf', '.mp4'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${ext} not allowed. Allowed: ${allowed.join(', ')}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
});
