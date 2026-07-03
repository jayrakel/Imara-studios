import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/jwt';
import { logger } from '../lib/logger';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    } else {
      logger.warn(`Invalid token attempt: ${err.message}`);
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions', required: roles, current: req.user.role });
      return;
    }
    next();
  };
}

// Convenience role sets
export const isAdmin = authorize('SUPER_ADMIN', 'STUDIO_ENGINEER', 'CHOIR_DIRECTOR');
export const isSuperAdmin = authorize('SUPER_ADMIN');
export const isChoirStaff = authorize('SUPER_ADMIN', 'CHOIR_DIRECTOR');
export const isAnyStaff = authorize('SUPER_ADMIN', 'STUDIO_ENGINEER', 'CHOIR_DIRECTOR');
export const isChoirMember = authorize('SUPER_ADMIN', 'CHOIR_DIRECTOR', 'CHOIR_MEMBER');
