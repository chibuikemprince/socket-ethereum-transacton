// src/services/AuthenticationService.ts
import { Service } from "typedi";
import { sign, verify } from "jsonwebtoken";
@Service()
export class AuthenticationService {
  generateToken(userId: number): string {
    const token = sign({ userId }, process.env.JWT_TOKEN, {
      expiresIn: "24h",
    });
    return token;
  }

  verifyToken(token: string): number | null {
    try {
      const decoded = verify(token, process.env.JWT_TOKEN) as {
        userId: number;
      };
      return decoded.userId;
    } catch (error) {
      return null;
    }
  }
}
