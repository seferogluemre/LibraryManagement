import { jwt, type JWTPayloadSpec } from "@elysiajs/jwt";
import { jwtConfig } from "../config/jwt-config";

export interface JWTPayload extends JWTPayloadSpec {
  userId: string;
  email: string;
  role: string;
  type: "access" | "refresh";
}

export class JWTHelpers {
  private static jwtInstance = jwt({
    name: "jwt",
    secret: jwtConfig.secret,
  });

  /**
   * Access token oluşturur (kısa süreli)
   */
  static async generateAccessToken(
    userId: string,
    email: string,
    role: string
  ): Promise<string> {
    const payload: JWTPayload = {
      userId,
      email,
      role,
      type: "access",
      exp:
        Math.floor(Date.now() / 1000) +
        this.parseTimeToSeconds(jwtConfig.accessTokenExpireTime),
    };

    return await this.jwtInstance.decorator.jwt.sign(
      payload as unknown as Record<string, string | number>
    );
  }

  /**
   * Refresh token oluşturur (uzun süreli)
   */
  static async generateRefreshToken(
    userId: string,
    email: string,
    role: string
  ): Promise<string> {
    const payload: JWTPayload = {
      userId,
      email,
      role,
      type: "refresh",
      exp:
        Math.floor(Date.now() / 1000) +
        this.parseTimeToSeconds(jwtConfig.refreshTokenExpireTime),
    };

    return await this.jwtInstance.decorator.jwt.sign(
      payload as unknown as Record<string, string | number>
    );
  }

  /**
   * Token'ı doğrular ve payload'ı döner
   */
  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const payload = await this.jwtInstance.decorator.jwt.verify(token);
      return payload as unknown as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Token'dan payload'ı çıkarır (doğrulama yapmaz)
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      const base64Payload = token.split(".")[1];
      const decodedPayload = Buffer.from(base64Payload, "base64").toString(
        "utf-8"
      );
      return JSON.parse(decodedPayload) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Time string'i saniyeye çevirir (örn: "15m" -> 900)
   */
  private static parseTimeToSeconds(timeStr: string): number {
    const unit = timeStr.slice(-1);
    const value = parseInt(timeStr.slice(0, -1));

    switch (unit) {
      case "s":
        return value;
      case "m":
        return value * 60;
      case "h":
        return value * 60 * 60;
      case "d":
        return value * 24 * 60 * 60;
      default:
        return 900; // Default 15 dakika
    }
  }
}
