import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, isAnyStaff, isSuperAdmin } from '../middleware/auth';

export const contentRouter = Router();

// GET /api/content — Public: all content blocks
contentRouter.get('/', async (_req, res) => {
  const blocks = await prisma.contentBlock.findMany({ orderBy: { key: 'asc' } });
  // Return as key-value map for easy consumption
  const map: Record<string, string> = {};
  for (const b of blocks) map[b.key] = b.value;
  res.json(map);
});

// GET /api/content/admin — Admin: full objects with metadata
contentRouter.get('/admin', authenticate, isAnyStaff, async (req: Request, res: Response) => {
  const { group } = req.query as Record<string, string>;
  const where: any = {};
  if (group) where.group = group;
  const blocks = await prisma.contentBlock.findMany({ where, orderBy: [{ group: 'asc' }, { key: 'asc' }] });
  res.json(blocks);
});

// GET /api/content/:key
contentRouter.get('/:key', async (req: Request, res: Response) => {
  const block = await prisma.contentBlock.findUnique({ where: { key: String(req.params.key) } });
  if (!block) { res.status(404).json({ error: 'Content block not found' }); return; }
  res.json(block);
});

// PUT /api/content/:key — Admin: upsert
contentRouter.put('/:key', authenticate, isAnyStaff, async (req: Request, res: Response) => {
  const { value, type, label, group } = req.body as Record<string, string>;
  if (value === undefined) { res.status(400).json({ error: 'value required' }); return; }
  const block = await prisma.contentBlock.upsert({
    where: { key: String(req.params.key) },
    update: { value, type, label, group },
    create: { key: String(req.params.key), value, type: type || 'text', label, group }
  });
  res.json(block);
});

// PUT /api/content/batch — Admin: bulk update
contentRouter.put('/batch/update', authenticate, isAnyStaff, async (req: Request, res: Response) => {
  const { blocks } = req.body;
  if (!Array.isArray(blocks)) { res.status(400).json({ error: 'blocks array required' }); return; }
  const results = await Promise.all(
    blocks.map(({ key, value, label, group, type }: any) =>
      prisma.contentBlock.upsert({
        where: { key },
        update: { value, label, group, type },
        create: { key, value, type: type || 'text', label, group }
      })
    )
  );
  res.json({ updated: results.length, blocks: results });
});
