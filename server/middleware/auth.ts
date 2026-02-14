import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId: string | null;
}

export function extractUser(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthRequest;
  const authHeader = req.headers.authorization;

  // Debug logging for production issues
  console.log('[extractUser] SUPABASE_JWT_SECRET present:', !!process.env.SUPABASE_JWT_SECRET);
  console.log('[extractUser] Authorization header:', authHeader);

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const secret = process.env.SUPABASE_JWT_SECRET;

    if (!secret) {
      console.error('SUPABASE_JWT_SECRET is not set — cannot verify tokens');
      res.status(500).json({ error: 'Server misconfiguration: JWT secret missing' });
      return;
    }

    try {
      const decoded = jwt.verify(token, secret) as { sub: string };
      console.log('[extractUser] JWT decoded:', decoded);
      authReq.userId = decoded.sub;
      return next();
    } catch (err) {
      console.error('[extractUser] JWT verification failed:', (err as Error).message);
      res.status(401).json({ error: 'Invalid or expired token. Please sign in again.' });
      return;
    }
  } else {
    console.log('[extractUser] No valid Authorization header, using guest');
    authReq.userId = 'guest';
    return next();
  }
}
