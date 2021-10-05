import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const user = jwt.verify(
      req.session!.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = user;
  } catch (error) {}
  next();
};
