import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, isChoirStaff, isAnyStaff } from '../middleware/auth';

export const eventsRouter = Router();

// GET /api/events — Public
eventsRouter.get('/', async (req: Request, res: Response) => {
  const { upcoming } = req.query as Record<string, string>;
  const where: any = { isPublic: true };
  if (upcoming === 'true') where.eventDate = { gte: new Date() };
  const events = await prisma.event.findMany({ where, orderBy: { eventDate: 'asc' } });
  res.json(events);
});

// GET /api/events/all — Admin (includes private/blocked)
eventsRouter.get('/all', authenticate, isAnyStaff, async (_req, res) => {
  const events = await prisma.event.findMany({ orderBy: { eventDate: 'asc' } });
  res.json(events);
});

// POST /api/events — Admin create
eventsRouter.post('/', authenticate, isChoirStaff, async (req: Request, res: Response) => {
  const { title, description, venue, eventDate, endDate, isPublic, isBlocked, ticketUrl, imageUrl } = req.body;
  if (!title || !eventDate) { res.status(400).json({ error: 'title and eventDate required' }); return; }
  const event = await prisma.event.create({
    data: { title, description: description as string | undefined, venue: venue as string | undefined, eventDate: new Date(eventDate), endDate: endDate ? new Date(endDate) : undefined, isPublic: isPublic ?? true, isBlocked: isBlocked ?? false, ticketUrl: ticketUrl as string | undefined, imageUrl: imageUrl as string | undefined }
  });
  res.status(201).json(event);
});

// PUT /api/events/:id — Admin update
eventsRouter.put('/:id', authenticate, isChoirStaff, async (req: Request, res: Response) => {
  const { title, description, venue, eventDate, endDate, isPublic, isBlocked, ticketUrl, imageUrl } = req.body;
  const event = await prisma.event.update({
    where: { id: String(req.params.id) },
    data: { title, description: description as string | undefined, venue: venue as string | undefined, eventDate: eventDate ? new Date(eventDate) : undefined, endDate: endDate ? new Date(endDate) : undefined, isPublic, isBlocked, ticketUrl: ticketUrl as string | undefined, imageUrl: imageUrl as string | undefined }
  });
  res.json(event);
});

// DELETE /api/events/:id
eventsRouter.delete('/:id', authenticate, isChoirStaff, async (req: Request, res: Response) => {
  await prisma.event.delete({ where: { id: String(req.params.id) } });
  res.json({ message: 'Event deleted' });
});
