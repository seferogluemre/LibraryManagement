export interface JWTConfig {
  secret: string;
  accessTokenExpireTime: string;
  refreshTokenExpireTime: string;
}

export const jwtConfig: JWTConfig = {
  secret: process.env.JWT_SECRET || "xetabnjh9vc",
  accessTokenExpireTime: process.env.JWT_ACCESS_EXPIRE || "15m",
  refreshTokenExpireTime: process.env.JWT_REFRESH_EXPIRE || "7d",
};
