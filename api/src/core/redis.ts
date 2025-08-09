import { config } from "dotenv";
import Redis from "ioredis";

config({ path: "../../.env" });

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

redis.on("error", (error) => {
  console.error("Redis Bağlantı Hatası:", error);
});

redis.on("connect", () => {
  console.log("Redis Bağlantısı Başarılı! ✨");
});

export default redis;