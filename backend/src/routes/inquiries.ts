import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, isAdmin, isAnyStaff, AuthRequest } from '../middleware/auth';
import { sendClientAutoResponder, sendAdminAlert, sendInquiryReply } from '../lib/email';
import { sendNewInquirySmsAlert } from '../lib/sms';

export const inquiriesRouter = Router();

// ─── POST /api/inquiries — Public submission ──────────────────────
inquiriesRouter.post('/', async (req: Request, res: Response) => {
  const {
    type, clientName, clientEmail, clientPhone, clientCompany,
    serviceType, message, preferredDate, numTracks, estimatedRuntime,
    referenceLinks, eventDate, venueName, audienceSize, repertoireStyle
  } = req.body;

  if (!type || !clientName || !clientEmail || !message) {
    res.status(400).json({ error: 'Missing required fields: type, clientName, clientEmail, message' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clientEmail)) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        type, clientName: clientName.trim(), clientEmail: clientEmail.toLowerCase().trim(),
        clientPhone, clientCompany, serviceType, message: message.trim(),
        preferredDate: preferredDate ? new Date(preferredDate) : undefined,
        numTracks: numTracks ? parseInt(numTracks) : undefined,
        estimatedRuntime, referenceLinks: referenceLinks || [],
        eventDate: eventDate ? new Date(eventDate) : undefined,
        venueName, audienceSize: audienceSize ? parseInt(audienceSize) : undefined,
        repertoireStyle,
      }
    });

    // Fire & forget notifications — don't block response
    Promise.all([
      sendClientAutoResponder({ to: clientEmail, clientName, inquiryType: type, referenceId: inquiry.id }),
      sendAdminAlert({ clientName, clientEmail, inquiryType: type, serviceType, referenceId: inquiry.id, message }),
      sendNewInquirySmsAlert({ clientName, inquiryType: type, referenceId: inquiry.id }),
    ]).catch(console.error);

    res.status(201).json({
      message: 'Inquiry submitted successfully. You will hear from us within 12–24 hours.',
      referenceId: inquiry.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// ─── GET /api/inquiries — Admin: list all ────────────────────────
inquiriesRouter.get('/', authenticate, isAnyStaff, async (req: Request, res: Response) => {
  const { status, type, search, page = '1', limit = '20' } = req.query as Record<string, string>;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: any = {};
  if (status) where.status = status;
  if (type) where.type = type;
  if (search) {
    where.OR = [
      { clientName: { contains: search, mode: 'insensitive' } },
      { clientEmail: { contains: search, mode: 'insensitive' } },
      { clientCompany: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [inquiries, total] = await Promise.all([
    prisma.inquiry.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit), include: { emailReplies: { orderBy: { sentAt: 'desc' }, take: 1 } } }),
    prisma.inquiry.count({ where }),
  ]);

  res.json({ data: inquiries, total, page: parseInt(page), limit: parseInt(limit) });
});

// ─── GET /api/inquiries/:id ───────────────────────────────────────
inquiriesRouter.get('/:id', authenticate, isAnyStaff, async (req: Request, res: Response) => {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: String(req.params.id) },
    include: { emailReplies: { orderBy: { sentAt: 'asc' } } }
  });
  if (!inquiry) { res.status(404).json({ error: 'Inquiry not found' }); return; }
  res.json(inquiry);
});

// ─── PATCH /api/inquiries/:id/status ─────────────────────────────
inquiriesRouter.patch('/:id/status', authenticate, isAnyStaff, async (req: Request, res: Response) => {
  const { status, quotedAmount, notes } = req.body;
  const inquiry = await prisma.inquiry.update({
    where: { id: String(req.params.id) },
    data: { status, quotedAmount: quotedAmount ? parseFloat(quotedAmount) : undefined, notes }
  });
  res.json(inquiry);
});

// ─── POST /api/inquiries/:id/reply ───────────────────────────────
inquiriesRouter.post('/:id/reply', authenticate, isAnyStaff, async (req: Request, res: Response) => {
  const { subject, body } = req.body;
  if (!subject || !body) { res.status(400).json({ error: 'subject and body required' }); return; }

  const inquiry = await prisma.inquiry.findUnique({ where: { id: String(req.params.id) } });
  if (!inquiry) { res.status(404).json({ error: 'Inquiry not found' }); return; }

  await sendInquiryReply({ to: inquiry.clientEmail, clientName: inquiry.clientName, subject, body });
  const reply = await prisma.emailReply.create({ data: { inquiryId: inquiry.id, subject, body } });

  res.json({ message: 'Reply sent', reply });
});
