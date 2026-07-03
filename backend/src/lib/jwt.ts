import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from './prisma';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('JWT secrets must be defined in environment variables');
}

export interface JwtPayload {
  sub: string;        // userId
  email: string;
  role: string;
  jti: string;        // JWT ID for revocation tracking
}

export function generateAccessToken(payload: Omit<JwtPayload, 'jti'>): string {
  return jwt.sign(
    { ...payload, jti: uuidv4() },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES as any, issuer: 'imara-studios', audience: 'imara-studios-client' } as any
  );
}

export async function generateRefreshToken(
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<string> {
  // Expire old refresh tokens (keep max 5 per user per device category)
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { token, userId, expiresAt, userAgent, ipAddress }
  });

  return token;
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET, {
    issuer: 'imara-studios',
    audience: 'imara-studios-client'
  }) as JwtPayload;
}

export async function rotateRefreshToken(
  oldToken: string,
  userAgent?: string,
  ipAddress?: string
): Promise<{ accessToken: string; refreshToken: string; user: { id: string; email: string; role: string; name: string } } | null> {
  const record = await prisma.refreshToken.findUnique({
    where: { token: oldToken },
    include: { user: true }
  });

  if (!record || record.revoked || record.expiresAt < new Date()) {
    // If token is already revoked, it may be a replay attack — revoke ALL tokens for this user
    if (record?.revoked) {
      await prisma.refreshToken.updateMany({
        where: { userId: record.userId },
        data: { revoked: true }
      });
    }
    return null;
  }

  // Revoke the old token
  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { revoked: true }
  });

  const user = record.user;
  const accessToken = generateAccessToken({ sub: user.id, email: user.email, role: user.role });
  const refreshToken = await generateRefreshToken(user.id, userAgent, ipAddress);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role, name: user.name }
  };
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true }
  });
}
