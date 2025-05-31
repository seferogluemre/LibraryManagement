import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../../core/prisma";
import {
  NotFoundException,
  UnauthorizedException,
} from "../../utils/http-errors";
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

    // JWT token'ları oluştur
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

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh token ile yeni token'lar oluştur
   */
  static async refreshToken(payload: RefreshTokenRequest): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { refreshToken } = payload;

    const tokenPayload = await JWTHelpers.verifyToken(refreshToken);
    if (!tokenPayload || tokenPayload.type !== "refresh") {
      throw new UnauthorizedException("Geçersiz refresh token");
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenPayload.userId },
    });

    if (!user) {
      throw new UnauthorizedException("Kullanıcı bulunamadı");
    }

    // Yeni token'lar oluştur
    const newAccessToken = await JWTHelpers.generateAccessToken(
      user.id,
      user.email,
      user.role
    );
    const newRefreshToken = await JWTHelpers.generateRefreshToken(
      user.id,
      user.email,
      user.role
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Token'dan kullanıcı bilgilerini al
   */
  static async me(authorizationHeader: string): Promise<UserProfile> {
    // Authorization header'dan token'ı çıkar
    const token = this.extractTokenFromHeader(authorizationHeader);

    // Token'ı doğrula
    const tokenPayload = await JWTHelpers.verifyToken(token);
    if (!tokenPayload || tokenPayload.type !== "access") {
      throw new UnauthorizedException("Geçersiz access token");
    }

    // Kullanıcıyı veritabanından al
    const user = await prisma.user.findUnique({
      where: { id: tokenPayload.userId },
    });

    if (!user) {
      throw new NotFoundException("Kullanıcı bulunamadı");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  /**
   * Kullanıcı çıkışı (şu an için sadece başarı mesajı döner)
   * TODO: Gelecekte token blacklist sistemi eklenebilir
   */
  static async logout(): Promise<{ message: string }> {
    // Token'ı geçersiz kılma işlemi burada yapılabilir
    // Şu an için sadece başarı mesajı dönüyoruz
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

    return authorizationHeader.substring(7); // "Bearer " kısmını çıkar
  }

  /**
   * Token'ı doğrular ve kullanıcı bilgilerini döner (middleware için)
   */
  static async validateToken(token: string): Promise<AuthenticatedUser> {
    const tokenPayload = await JWTHelpers.verifyToken(token);
    if (!tokenPayload || tokenPayload.type !== "access") {
      throw new UnauthorizedException("Geçersiz token");
    }

    const user = await prisma.user.findUnique({
      where: { id: tokenPayload.userId },
    });

    if (!user) {
      throw new UnauthorizedException("Kullanıcı bulunamadı");
    }

    return user;
  }
}
