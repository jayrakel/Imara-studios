import { Router, Request, Response } from 'express';
import { uploadToR2, deleteFromR2 } from '../lib/storage';
import { prisma } from '../lib/prisma';
import { authenticate, isChoirStaff, isChoirMember, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

export const galleryRouter = Router();

// GET /api/gallery — Public: approved photos only
galleryRouter.get('/', async (req: Request, res: Response) => {
  const { category } = req.query as Record<string, string>;
  const where: any = { status: 'APPROVED' };
  if (category) where.category = category;
  const photos = await prisma.galleryPhoto.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }] });
  res.json(photos);
});

// GET /api/gallery/pending — Admin: pending photos
galleryRouter.get('/pending', authenticate, isChoirStaff, async (_req, res) => {
  const photos = await prisma.galleryPhoto.findMany({ where: { status: 'PENDING' }, include: { uploader: { select: { id: true, name: true, email: true } } }, orderBy: { createdAt: 'desc' } });
  res.json(photos);
});

// POST /api/gallery/upload — Choir member upload
galleryRouter.post('/upload', authenticate, isChoirMember, upload.single("photo"), async (req: AuthRequest, res: Response) => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }
  const { caption, altText, category } = req.body as Record<string, string>;
  const { key, url } = await uploadToR2(req.file.buffer, req.file.originalname, req.file.mimetype);
  const photo = await prisma.galleryPhoto.create({
    data: { uploaderId: req.user!.id, filename: key, url, caption, altText, category: category || 'bts', status: 'PENDING' }
  });
  res.status(201).json({ message: 'Photo uploaded. Pending admin approval.', photo });
});

// PATCH /api/gallery/:id/publish — Admin approve
galleryRouter.patch('/:id/publish', authenticate, isChoirStaff, async (req: Request, res: Response) => {
  const { altText, caption, sortOrder } = req.body as Record<string, string>;
  const photo = await prisma.galleryPhoto.update({
    where: { id: String(req.params.id) },
    data: { status: 'APPROVED', publishedAt: new Date(), altText, caption, sortOrder: sortOrder ? parseInt(sortOrder) : undefined }
  });
  res.json(photo);
});

// PATCH /api/gallery/:id/reject — Admin reject
galleryRouter.patch('/:id/reject', authenticate, isChoirStaff, async (req: Request, res: Response) => {
  const photo = await prisma.galleryPhoto.update({ where: { id: String(req.params.id) }, data: { status: 'REJECTED' } });
  // filename column stores the R2 object key
  await deleteFromR2(photo.filename);
  res.json({ message: 'Photo rejected and removed' });
});

// DELETE /api/gallery/:id — Admin delete
galleryRouter.delete('/:id', authenticate, isChoirStaff, async (req: Request, res: Response) => {
  const photo = await prisma.galleryPhoto.delete({ where: { id: String(req.params.id) } });
  await deleteFromR2(photo.filename);
  res.json({ message: 'Photo deleted' });
});
