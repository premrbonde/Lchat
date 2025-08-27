import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request type to include our user payload
export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

      // Attach user to the request object
      req.user = { userId: decoded.userId };

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};
