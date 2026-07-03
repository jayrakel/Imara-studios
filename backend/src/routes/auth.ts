import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { generateAccessToken, generateRefreshToken, rotateRefreshToken, revokeAllUserTokens } from '../lib/jwt';
import { authenticate, AuthRequest } from '../middleware/auth';
import { logger } from '../lib/logger';

export const authRouter = Router();

const SALT_ROUNDS = 12;

// ─── POST /api/auth/login ─────────────────────────────────────────
authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Timing-safe: always compare even if user not found
    const hash = user?.passwordHash || '$2b$12$invalidhashfortimingequalityXXXXXXXXXXXXXXXXXXX';
    const valid = await bcrypt.compare(password, hash);

    if (!user || !valid || !user.isActive) {
      logger.warn(`Failed login attempt for email: ${email}`);
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const accessToken = generateAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = await generateRefreshToken(
      user.id,
      req.headers['user-agent'],
      req.ip
    );

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth',
    });

    res.json({
      accessToken,
      user: { id: user.id, email: user.email, role: user.role, name: user.name, avatarUrl: user.avatarUrl }
    });
  } catch (err) {
    logger.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ─── POST /api/auth/refresh ───────────────────────────────────────
authRouter.post('/refresh', async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    res.status(401).json({ error: 'No refresh token' });
    return;
  }

  try {
    const result = await rotateRefreshToken(token, req.headers['user-agent'], req.ip);

    if (!result) {
      res.clearCookie('refreshToken', { path: '/api/auth' });
      res.status(401).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });

    res.json({ accessToken: result.accessToken, user: result.user });
  } catch (err) {
    logger.error('Refresh token error:', err);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

// ─── POST /api/auth/logout ────────────────────────────────────────
authRouter.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user) {
      await revokeAllUserTokens(req.user.id);
    }
    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────
authRouter.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true, vocalRange: true, vocalPart: true, tempPassword: true, createdAt: true }
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ─── POST /api/auth/change-password ──────────────────────────────
authRouter.post('/change-password', authenticate, async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Both current and new password are required' });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) { res.status(401).json({ error: 'Current password is incorrect' }); return; }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    // Revoke all refresh tokens — forces re-login on all devices
    await revokeAllUserTokens(user.id);
    res.clearCookie('refreshToken', { path: '/api/auth' });

    res.json({ message: 'Password updated. Please log in again.' });
  } catch {
    res.status(500).json({ error: 'Password change failed' });
  }
});

// ═══════════════════════════════════════════════════════════════
// MEMBER MANAGEMENT — Admin / Choir Director only
// ═══════════════════════════════════════════════════════════════

function isAdminRole(role: string) {
  return ['SUPER_ADMIN', 'CHOIR_DIRECTOR'].includes(role);
}
function requireAdmin(req: AuthRequest, res: Response): boolean {
  if (!req.user || !isAdminRole(req.user.role)) {
    res.status(403).json({ error: 'Admin access required' });
    return false;
  }
  return true;
}

// GET /api/auth/members — List all users
authRouter.get('/members', authenticate, async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  const members = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true, role: true, vocalRange: true, vocalPart: true, isActive: true, tempPassword: true, createdAt: true }
  });
  res.json(members);
});

// POST /api/auth/members — Create a member account
authRouter.post('/members', authenticate, async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  const { name, email, password, vocalRange, vocalPart, role } = req.body as Record<string, string>;
  if (!name || !email || !password) { res.status(400).json({ error: 'name, email, and password are required' }); return; }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (existing) { res.status(409).json({ error: 'A user with this email already exists' }); return; }

  const validRoles = ['CHOIR_MEMBER', 'CHOIR_DIRECTOR', 'STUDIO_ENGINEER', 'SUPER_ADMIN'];
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name: name.trim(), email: email.toLowerCase().trim(), passwordHash,
      role: (validRoles.includes(role) ? role : 'CHOIR_MEMBER') as any,
      vocalRange: vocalRange || undefined, vocalPart: vocalPart || undefined, tempPassword: true,
    },
    select: { id: true, name: true, email: true, role: true, vocalRange: true, isActive: true }
  });

  try {
    const { sendMemberWelcome } = await import('../lib/email');
    await sendMemberWelcome({ to: email, name, tempPassword: password });
  } catch (e) { logger.warn('Welcome email failed:', e); }

  res.status(201).json({ message: 'Member account created', user });
});

// PATCH /api/auth/members/:id — Update member
authRouter.patch('/members/:id', authenticate, async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  const { name, vocalRange, vocalPart, role, isActive } = req.body as Record<string, string>;
  const validRoles = ['CHOIR_MEMBER', 'CHOIR_DIRECTOR', 'STUDIO_ENGINEER', 'SUPER_ADMIN'];
  const user = await prisma.user.update({
    where: { id: String(req.params.id) },
    data: {
      name: name?.trim() || undefined, vocalRange: vocalRange || undefined, vocalPart: vocalPart || undefined,
      role: validRoles.includes(role) ? (role as any) : undefined,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    },
    select: { id: true, name: true, email: true, role: true, vocalRange: true, isActive: true }
  });
  res.json(user);
});

// POST /api/auth/members/:id/reset-password — Reset password and email it
authRouter.post('/members/:id/reset-password', authenticate, async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  const { newPassword } = req.body as Record<string, string>;
  if (!newPassword || newPassword.length < 8) { res.status(400).json({ error: 'newPassword must be at least 8 characters' }); return; }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const user = await prisma.user.update({
    where: { id: String(req.params.id) }, data: { passwordHash, tempPassword: true },
    select: { id: true, name: true, email: true }
  });
  await revokeAllUserTokens(user.id);

  try {
    const { sendMemberWelcome } = await import('../lib/email');
    await sendMemberWelcome({ to: user.email, name: user.name, tempPassword: newPassword });
  } catch (e) { logger.warn('Reset email failed:', e); }

  res.json({ message: `Password reset for ${user.name}. Credentials emailed.` });
});

// DELETE /api/auth/members/:id — Soft-deactivate
authRouter.delete('/members/:id', authenticate, async (req: AuthRequest, res: Response) => {
  if (!requireAdmin(req, res)) return;
  const memberId = String(req.params.id);
  await prisma.user.update({ where: { id: memberId }, data: { isActive: false } });
  await revokeAllUserTokens(memberId);
  res.json({ message: 'Member deactivated' });
});
