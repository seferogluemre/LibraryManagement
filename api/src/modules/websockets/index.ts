import { CacheService } from "#core/cache.service";
import { randomUUID } from "crypto";
import Elysia from "elysia";
import { websocketQuerySchema } from "./dtos";

export const websockets = new Elysia({
  prefix: "/ws",
  name: "WebSockets",
}).ws("/", {
  query: websocketQuerySchema,

  open(ws) {
    const { userId } = ws.data.query;
    const socketId = randomUUID();

    CacheService.setOnlineUser(userId, socketId);

    ws.send({
      type: "WELCOME",
      message: `Sunucuya başarıyla bağlandınız. Socket ID: ${socketId}`,
    });
  },

  close(ws) {
    const { userId } = ws.data.query;

    CacheService.removeOnlineUser(userId);
  },
});
