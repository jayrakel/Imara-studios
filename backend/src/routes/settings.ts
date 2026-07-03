import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, isSuperAdmin, isAnyStaff } from '../middleware/auth';

export const settingsRouter = Router();

settingsRouter.get('/:key', async (req: Request, res: Response) => {
  const setting = await prisma.setting.findUnique({ where: { key: String(req.params.key) } });
  if (!setting) { res.status(404).json({ error: 'Setting not found' }); return; }
  res.json({ key: setting.key, value: setting.value });
});

settingsRouter.get('/', authenticate, isAnyStaff, async (_req, res) => {
  const settings = await prisma.setting.findMany({ orderBy: { key: 'asc' } });
  res.json(settings);
});

settingsRouter.put('/:key', authenticate, isSuperAdmin, async (req: Request, res: Response) => {
  const { value, label } = req.body;
  const setting = await prisma.setting.upsert({
    where: { key: String(req.params.key) },
    update: { value, label },
    create: { key: String(req.params.key), value, label }
  });
  res.json(setting);
});
