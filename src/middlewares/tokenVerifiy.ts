import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";

import { AuthenticationService } from "../services/AuthController";

import { verify } from "jsonwebtoken";
import { CustomSocket } from "../types";

export function authenticateHttpRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.query.token as string;

  const authService = Container.get(AuthenticationService);
  const userId = authService.verifyToken(token);

  if (userId) {
    req.userId = userId;
    next();
  } else {
    res.status(401).json({ error: "Invalid token" });
  }
}

export const socketIoAuth = (socket: CustomSocket, next: any) => {
  const token = socket.handshake.auth.token;
  console.log(`Client ${socket.id}, token ${token}`);

  if (!token) {
    return next(new Error("Authentication error: Token is missing"));
  }

  try {
    const decoded = verify(token, process.env.JWT_TOKEN);
    socket.decoded = decoded;

    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
};
