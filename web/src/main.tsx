import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Route ağacını import et
import { routeTree } from "./routeTree.gen";

// Auth state'i ve tiplerini import et
import { getAuthState, type AuthState, type User } from "./services/auth";

export interface RouterContext extends AuthState {
  login: (data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => void;
  logout: () => void;
}

const queryClient = new QueryClient();

// Router'ı oluştur
const router = createRouter({
  routeTree,
  context: {
    ...getAuthState(), 
    login: () => {},
    logout: () => {},
  },
  defaultPreload: 'intent',
});

// Router'ı register et
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  );
}
