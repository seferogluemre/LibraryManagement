export interface JWTConfig {
  secret: string;
  accessTokenExpireTime: string;
  refreshTokenExpireTime: string;
}

export const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || "xETAbnJnH9VC",
  accessTokenExpireTime: process.env.JWT_ACCESS_EXPIRE || "15m", // 15 dakika
  refreshTokenExpireTime: process.env.JWT_REFRESH_EXPIRE || "7d", // 7 gün
};
