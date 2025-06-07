import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../../core/prisma";
import { UnauthorizedException } from "../../utils/http-errors";
import { JWTHelpers } from "../../utils/jwt-helpers";
import type {
  AuthenticatedUser,
  LoginRequest,
  RefreshTokenRequest,
  UserProfile,
} from "./types";

export abstract class AuthService {
  /**
   * Email ve şifre ile kullanıcı girişi
   * Mevcut session varsa günceller, yoksa yeni oluşturur
   */
  static async login(payload: LoginRequest): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    const { email, password } = payload;

    // Kullanıcıyı email ile bul
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException("Geçersiz email veya şifre");
    }

    // Şifre doğrulaması
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Geçersiz email veya şifre");
    }

    const accessToken = await JWTHelpers.generateAccessToken(
      user.id,
      user.email,
      user.role
    );
    const refreshToken = await JWTHelpers.generateRefreshToken(
      user.id,
      user.email,
      user.role
    );

    // Session expire time hesapla (refresh token'ın expire time'ı)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 gün

    // Mevcut session varsa güncelle, yoksa yeni oluştur
    await prisma.session.upsert({
      where: { userId: user.id },
      update: {
        accessToken,
        refreshToken,
        expiresAt,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        accessToken,
        refreshToken,
        expiresAt,
      },
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh token ile yeni token'lar oluştur
   * Session'ı günceller
   */
  static async refreshToken(payload: RefreshTokenRequest): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { refreshToken } = payload;

    // Refresh token'ı doğrula
    const tokenPayload = await JWTHelpers.verifyToken(refreshToken);
    if (!tokenPayload || tokenPayload.type !== "refresh") {
      throw new UnauthorizedException("Geçersiz refresh token");
    }

    // Session'ı veritabanından kontrol et
    const session = await prisma.session.findUnique({
      where: { userId: tokenPayload.userId },
      include: { user: true },
    });

    if (!session || session.refreshToken !== refreshToken) {
      throw new UnauthorizedException("Geçersiz refresh token");
    }

    // Session'ın süresi dolmuş mu kontrol et
    if (session.expiresAt < new Date()) {
      // Süresi dolmuş session'ı sil
      await prisma.session.delete({
        where: { userId: tokenPayload.userId },
      });
      throw new UnauthorizedException("Session süresi dolmuş");
    }

    // Yeni token'lar oluştur
    const newAccessToken = await JWTHelpers.generateAccessToken(
      session.user.id,
      session.user.email,
      session.user.role
    );
    const newRefreshToken = await JWTHelpers.generateRefreshToken(
      session.user.id,
      session.user.email,
      session.user.role
    );

    // Yeni expire time hesapla
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7); // 7 gün

    // Session'ı güncelle
    await prisma.session.update({
      where: { userId: session.userId },
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: newExpiresAt,
        updatedAt: new Date(),
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Token'dan kullanıcı bilgilerini al
   * Session kontrolü yapar
   */
  static async me(authorizationHeader: string): Promise<UserProfile> {
    // Authorization header'dan token'ı çıkar
    const token = this.extractTokenFromHeader(authorizationHeader);

    // Token'ı doğrula
    const tokenPayload = await JWTHelpers.verifyToken(token);
    if (!tokenPayload || tokenPayload.type !== "access") {
      throw new UnauthorizedException("Geçersiz access token");
    }

    // Session'ı kontrol et
    const session = await prisma.session.findUnique({
      where: { userId: tokenPayload.userId },
      include: { user: true },
    });

    if (!session || session.accessToken !== token) {
      throw new UnauthorizedException("Geçersiz session");
    }

    // Session'ın süresi dolmuş mu kontrol et
    if (session.expiresAt < new Date()) {
      // Süresi dolmuş session'ı sil
      await prisma.session.delete({
        where: { userId: tokenPayload.userId },
      });
      throw new UnauthorizedException("Session süresi dolmuş");
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      createdAt: session.user.createdAt,
    };
  }

  /**
   * Kullanıcı çıkışı
   * Session'ı veritabanından siler
   */
  static async logout(userId?: string): Promise<{ message: string }> {
    if (userId) {
      // Kullanıcının session'ını sil
      await prisma.session.deleteMany({
        where: { userId },
      });
    }

    return {
      message: "Başarıyla çıkış yapıldı",
    };
  }

  /**
   * Authorization header'dan Bearer token'ı çıkarır
   */
  private static extractTokenFromHeader(authorizationHeader: string): string {
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Authorization header gerekli");
    }

    return authorizationHeader.substring(7);
  }

  /**
   * Token'ı doğrular ve kullanıcı bilgilerini döner (middleware için)
   * Session kontrolü yapar
   */
  static async validateToken(token: string): Promise<AuthenticatedUser> {
    const tokenPayload = await JWTHelpers.verifyToken(token);
    if (!tokenPayload || tokenPayload.type !== "access") {
      throw new UnauthorizedException("Geçersiz token");
    }

    // Session'ı kontrol et
    const session = await prisma.session.findUnique({
      where: { userId: tokenPayload.userId },
      include: { user: true },
    });

    if (!session || session.accessToken !== token) {
      throw new UnauthorizedException("Geçersiz session");
    }

    // Session'ın süresi dolmuş mu kontrol et
    if (session.expiresAt < new Date()) {
      // Süresi dolmuş session'ı sil
      await prisma.session.delete({
        where: { userId: tokenPayload.userId },
      });
      throw new UnauthorizedException("Session süresi dolmuş");
    }

    return session.user;
  }

  /**
   * Süresi dolmuş session'ları temizle
   * Cron job veya scheduled task olarak çalıştırılabilir
   */
  static async cleanExpiredSessions(): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
}
