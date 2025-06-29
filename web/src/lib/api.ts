import { env } from "@/config/env";
import { getAccessToken } from "@/services/auth";
import { treaty } from "@elysiajs/eden";

export const api: ReturnType<typeof treaty> = treaty(env.API_URL, {
  fetcher: (url, config) => {
    const accessToken = getAccessToken();
    const headers = {
      ...config?.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };
    return fetch(url, { ...config, headers });
  },
});
