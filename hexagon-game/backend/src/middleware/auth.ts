import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../database';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret_key';
    
    // Verify token
    const decoded = jwt.verify(token, secret) as { userId: number };
    
    // Check if user exists in DB
    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.id, decoded.userId)).limit(1);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token: user not found' });
    }

    // Attach user ID to request object
    req.userId = user.id;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};