import redis from "./redis";

class Cache {
  private readonly redis = redis;
  private readonly onlineUserPrefix = "online:user:";

  private getOnlineUserKey(userId: string): string {
    return `${this.onlineUserPrefix}${userId}`;
  }

  async setOnlineUser(userId: string, socketId: string) {
    const key = this.getOnlineUserKey(userId);
    const value = JSON.stringify({
      isOnline: true,
      socketId,
      lastSeen: new Date().toISOString(),
    });

    await this.redis.set(key, value, "EX", 60 * 60 * 12);
  }

  async getOnlineUser(userId: string) {
    const key = this.getOnlineUserKey(userId);
    const user = await this.redis.get(key);
    return user ? JSON.parse(user) : null;
  }

  async removeOnlineUser(userId: string) {
    const key = this.getOnlineUserKey(userId);
    await this.redis.del(key);
  }

  async getAllOnlineUsers() {
    try {
      const stream = this.redis.scanStream({
        match: `${this.onlineUserPrefix}*`,
        count: 100,
      });

      const onlineUsers = [];
      try {
        for await (const keys of stream) {
          if (keys.length > 0) {
            const values = await this.redis.mget(keys);
            const parsedData = values
              .map((val, index) => {
                if (!val) return null;
                try {
                  const userId = keys[index].replace(this.onlineUserPrefix, "");
                  const data = JSON.parse(val);
                  return { userId, ...data };
                } catch (e) {
                  console.error(
                    `[CacheService] JSON parse hatası. Anahtar: ${keys[index]}`,
                    e
                  );
                  return null;
                }
              })
              .filter(Boolean);
            onlineUsers.push(...parsedData);
          }
        }
      } catch (streamError) {
        console.error(
          "[CacheService] Redis tarama (scanStream) sırasında hata:",
          streamError
        );
        return {
          status: "SCAN_STREAM_ERROR",
          error: (streamError as Error).message,
          users: [],
        };
      }
      return {
        count: onlineUsers.length,
        users: onlineUsers,
      };
    } catch (error) {
      console.error("[CacheService] getAllOnlineUsers genel hatası:", error);
      return {
        status: "GENERAL_CACHE_ERROR",
        error: (error as Error).message,
        users: [],
      };
    }
  }
}

export const CacheService = new Cache();
