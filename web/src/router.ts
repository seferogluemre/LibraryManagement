// src/router.ts
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useAuth } from "./services/auth";

interface MyRouterContext {
  auth: ReturnType<typeof useAuth>;
}

// Set up a Router instance
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: undefined!, // Bu, aşağıda inject edilecek
  } as MyRouterContext,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}