import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// User interface for JWT payload
export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  provider: "local" | "google"; // Track auth provider
  iat?: number;
  exp?: number;
}

// Extend Express Request to include user
// This extends the passport User interface to match our JwtPayload
declare global {
  namespace Express {
    interface User extends JwtPayload {}
    interface Request {
      user?: User;
    }
  }
}

// Extract JWT token from request
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
};

// Verify JWT token
const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};

export const generateToken = (
  payload: Omit<JwtPayload, "iat" | "exp">
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Main authentication middleware
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const user = verifyToken(token);
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

// Optional authentication middleware (doesn't throw error if no token)
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);

    if (token) {
      const user = verifyToken(token);
      req.user = user;
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return next(new ForbiddenError("Insufficient permissions"));
    }

    next();
  };
};

// Admin only middleware
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new UnauthorizedError("Authentication required"));
  }

  if (req.user.role !== "admin") {
    return next(new ForbiddenError("Admin access required"));
  }

  next();
};

// Check if user owns resource
export const checkOwnership = (userIdField: string = "userId") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }

    const resourceUserId = req.params[userIdField] || req.body[userIdField];

    if (req.user.id !== resourceUserId && req.user.role !== "admin") {
      return next(new ForbiddenError("Access denied"));
    }

    next();
  };
};

// Helper function to create user payload for token generation
export const createUserPayload = (
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  },
  provider: "local" | "google"
): Omit<JwtPayload, "iat" | "exp"> => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    provider,
  };
};
