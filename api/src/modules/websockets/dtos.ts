import { t } from "elysia";

export const websocketQuerySchema = t.Object({
  userId: t.String({ minLength: 1 }),
});
