import { config } from "dotenv";
import { Redis } from "ioredis";

config({ path: "../../.env" });

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
});

redis.on("error", (error) => {
  console.error("Redis Bağlantı Hatası:", error);
});

redis.on("connect", () => {
  console.log("Redis Bağlantısı Başarılı! ✨");
});

export default redis;
