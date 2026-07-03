import { Router, Request, Response } from 'express';
import { uploadToR2, deleteFromR2 } from '../lib/storage';
import { prisma } from '../lib/prisma';
import { authenticate, isChoirStaff, isChoirMember, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';

export const songsRouter = Router();

// ─── GET /api/songs  — Public: only isPublic:true songs (portfolio player) ─────
songsRouter.get('/', async (_req: Request, res: Response) => {
  const songs = await prisma.choirSong.findMany({
    where: { isPublic: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    select: { id: true, title: true, artist: true, category: true, url: true, coverArtUrl: true, durationSecs: true },
  });
  res.json(songs);
});

// ─── GET /api/songs/members  — Private: all songs for logged-in choir members ───
songsRouter.get('/members', authenticate, isChoirMember, async (_req: Request, res: Response) => {
  const songs = await prisma.choirSong.findMany({
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    select: { id: true, title: true, artist: true, category: true, url: true, coverArtUrl: true, durationSecs: true, isPublic: true, createdAt: true },
  });
  res.json(songs);
});

// ─── POST /api/songs  — Admin upload (audio + optional cover) ──────────────────
const songUploadFields = upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]);

songsRouter.post('/', authenticate, isChoirStaff, songUploadFields as any, async (req: AuthRequest, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const audioFile = files?.['audio']?.[0];
  const coverFile = files?.['cover']?.[0];

  if (!audioFile) {
    res.status(400).json({ error: 'Audio file (field: audio) is required' });
    return;
  }

  const { title, artist, category, isPublic, sortOrder } = req.body as Record<string, string>;
  if (!title) { res.status(400).json({ error: 'title is required' }); return; }

  // Upload audio to R2
  const { key: audioKey, url: audioUrl } = await uploadToR2(audioFile.buffer, audioFile.originalname, audioFile.mimetype);

  // Upload cover art if provided
  let coverArtUrl: string | undefined;
  if (coverFile) {
    const { url } = await uploadToR2(coverFile.buffer, coverFile.originalname, coverFile.mimetype);
    coverArtUrl = url;
  }

  const song = await prisma.choirSong.create({
    data: {
      title: title.trim(),
      artist: artist?.trim() || undefined,
      category: (category as any) || 'PERFORMANCE',
      filename: audioKey,
      url: audioUrl,
      coverArtUrl,
      isPublic: isPublic === 'true',
      sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      uploadedById: req.user?.id,
    },
  });

  res.status(201).json({ message: 'Song uploaded', song });
});

// ─── PATCH /api/songs/:id  — Admin update metadata / toggle public ────────────
songsRouter.patch('/:id', authenticate, isChoirStaff, async (req: Request, res: Response) => {
  const { title, artist, category, isPublic, sortOrder } = req.body as Record<string, string>;
  const song = await prisma.choirSong.update({
    where: { id: String(req.params.id) },
    data: {
      title: title?.trim() || undefined,
      artist: artist?.trim() || undefined,
      category: (category as any) || undefined,
      isPublic: isPublic !== undefined ? isPublic === 'true' : undefined,
      sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : undefined,
    },
  });
  res.json(song);
});

// ─── DELETE /api/songs/:id  — Admin delete + R2 cleanup ─────────────────────
songsRouter.delete('/:id', authenticate, isChoirStaff, async (req: Request, res: Response) => {
  const songId = String(req.params.id);
  const song = await prisma.choirSong.findUnique({ where: { id: songId } });
  if (!song) { res.status(404).json({ error: 'Song not found' }); return; }

  await deleteFromR2(song.filename);
  await prisma.choirSong.delete({ where: { id: songId } });
  res.json({ message: 'Song deleted' });
});
