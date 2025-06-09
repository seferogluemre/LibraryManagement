import prisma from "./prisma";
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
    const stream = this.redis.scanStream({
      match: `${this.onlineUserPrefix}*`,
      count: 100,
    });

    const onlineUsersData = [];
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
                  e,
                );
                return null;
              }
            })
            .filter(Boolean);
          onlineUsersData.push(...parsedData);
        }
      }

      if (onlineUsersData.length === 0) {
        return {
          count: 0,
          users: [],
        };
      }

      const userIds = onlineUsersData.map((user) => user.userId);
      const usersFromDb = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          name: true,
          role: true,
        },
      });

      const usersMap = usersFromDb.reduce(
        (acc, user) => {
          acc[user.id] = { name: user.name, role: user.role };
          return acc;
        },
        {} as Record<string, { name: string; role: string }>,
      );

      const combinedUsers = onlineUsersData
        .map((user) => {
          const dbUser = usersMap[user.userId];
          if (!dbUser) {
            // Eğer kullanıcı veritabanında bulunamazsa, bu kaydı atla
            return null;
          }
          return {
            ...user,
            name: dbUser.name,
            role: dbUser.role,
          };
        })
        .filter(Boolean); // null olan kayıtları filtrele

      return {
        count: combinedUsers.length,
        users: combinedUsers,
      };
    } catch (error) {
      console.error("[CacheService] Çevrimiçi kullanıcılar alınırken hata oluştu:", error);
      throw new Error("Çevrimiçi kullanıcılar alınamadı.");
    }
  }
}

export const CacheService = new Cache();
