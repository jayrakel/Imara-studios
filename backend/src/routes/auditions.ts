import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { uploadToR2 } from '../lib/storage';
import { authenticate, isChoirStaff } from '../middleware/auth';
import { upload } from '../middleware/upload';

export const auditionsRouter = Router();

// GET /api/auditions/open — Check if auditions are open (public)
auditionsRouter.get('/open', async (_req, res) => {
  const setting = await prisma.setting.findUnique({ where: { key: 'auditions_open' } });
  res.json({ open: setting?.value === 'true' });
});

// POST /api/auditions — Public submission
auditionsRouter.post('/', upload.array('mediaFiles', 5), async (req: Request, res: Response) => {
  // Check if auditions are open
  const setting = await prisma.setting.findUnique({ where: { key: 'auditions_open' } });
  if (setting?.value !== 'true') {
    res.status(403).json({ error: 'Auditions are currently closed. Check back soon!' });
    return;
  }

  const { name, email, phone, vocalRange, vocalPart, experienceYears, experienceNotes, mediaLinks, availability, motivation } = req.body as Record<string, string>;
  if (!name || !email || !vocalRange) {
    res.status(400).json({ error: 'name, email, and vocalRange are required' });
    return;
  }

  const files = (req.files as Express.Multer.File[]) || [];
  const uploaded = await Promise.all(files.map(f => uploadToR2(f.buffer, f.originalname, f.mimetype)));
  const mediaFiles = uploaded.map(u => u.url);
  const linksArray = Array.isArray(mediaLinks) ? mediaLinks : mediaLinks ? [mediaLinks] : [];

  const application = await prisma.auditionApplication.create({
    data: {
      name: name.trim(), email: email.toLowerCase().trim(), phone,
      vocalRange, vocalPart, experienceYears: experienceYears ? parseInt(experienceYears) : undefined,
      experienceNotes, mediaLinks: linksArray, mediaFiles, availability, motivation
    }
  });
  res.status(201).json({ message: 'Application submitted! We will be in touch.', id: application.id });
});

// GET /api/auditions — Admin: list all
auditionsRouter.get('/', authenticate, isChoirStaff, async (req: Request, res: Response) => {
  const { status, vocalRange } = req.query as Record<string, string>;
  const where: any = {};
  if (status) where.status = status;
  if (vocalRange) where.vocalRange = vocalRange;
  const apps = await prisma.auditionApplication.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(apps);
});

// PATCH /api/auditions/:id/status — Admin: update status
auditionsRouter.patch('/:id/status', authenticate, isChoirStaff, async (req: Request, res: Response) => {
  const { status, reviewNotes } = req.body;
  const app = await prisma.auditionApplication.update({ where: { id: String(req.params.id) }, data: { status, reviewNotes } });
  res.json(app);
});
