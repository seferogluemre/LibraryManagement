import { env } from "@/config/env";
import { treaty } from "@elysiajs/eden";

export const api: ReturnType<typeof treaty> = treaty(env.API_URL, {
  fetch: {
    credentials: "include",
  },
});
