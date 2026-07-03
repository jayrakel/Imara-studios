import { Router, Request, Response } from 'express';
import { uploadToR2, deleteFromR2 } from '../lib/storage';
import { prisma } from '../lib/prisma';
import { authenticate, isAnyStaff, isChoirStaff, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

export const mediaRouter = Router();

// Pre-seeded site image keys — auto-created on first GET
const DEFAULT_IMAGES = [
  { key: 'hero_studio', label: 'Studio Hero (Home Page)', filename: '', url: '/images/studio-hero.jpg' },
  { key: 'hero_choir', label: 'Choir Hero', filename: '', url: '/images/choir-hero.jpg' },
  { key: 'vocal_training', label: 'Vocal Training Page', filename: '', url: '/images/vocal-training.jpg' },
  { key: 'video_production', label: 'Video Production Page', filename: '', url: '/images/video-production.jpg' },
  { key: 'logo', label: 'Studio Logo', filename: '', url: '/images/logo.png' },
];

async function ensureDefaults() {
  for (const img of DEFAULT_IMAGES) {
    await prisma.siteImage.upsert({
      where: { key: img.key },
      update: {},
      create: img,
    });
  }
}

// ─── GET /api/media/images  — Admin: list all managed site images ──────────────
mediaRouter.get('/images', authenticate, isAnyStaff, async (_req: Request, res: Response) => {
  await ensureDefaults();
  const images = await prisma.siteImage.findMany({ orderBy: { key: 'asc' } });
  res.json(images);
});

// ─── GET /api/media/images/:key  — Public: get current URL for a specific image ─
mediaRouter.get('/images/:key', async (req: Request, res: Response) => {
  const key = String(req.params.key);
  const image = await prisma.siteImage.findUnique({ where: { key } });
  if (!image) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }
  res.json({ key: image.key, url: image.url });
});

// ─── POST /api/media/images/:key  — Admin: replace a site image via R2 ─────────
mediaRouter.post('/images/:key', authenticate, isChoirStaff, upload.single('image'), async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'Image file (field: image) required' });
    return;
  }

  const key = String(req.params.key);
  const existing = await prisma.siteImage.findUnique({ where: { key } });

  // Delete old R2 object if it was a custom upload (filename is an R2 key, not empty)
  if (existing?.filename) {
    await deleteFromR2(existing.filename).catch(() => { /* ignore if not found */ });
  }

  // Upload new file to R2
  const { key: r2Key, url: newUrl } = await uploadToR2(
    req.file.buffer,
    req.file.originalname,
    req.file.mimetype
  );

  const body = req.body as Record<string, string>;
  const label = body?.label || existing?.label || key;

  const image = await prisma.siteImage.upsert({
    where: { key },
    update: { url: newUrl, filename: r2Key, label },
    create: { key, label, url: newUrl, filename: r2Key },
  });

  res.json({ message: 'Image updated successfully', image });
});
