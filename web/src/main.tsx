import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Route ağacını import et
import { routeTree } from "./routeTree.gen";

// Auth state'i ve tiplerini import et
import { getAuthState, type AuthState, type User } from "./lib/auth";

// Auth context'i için arayüz (interface) tanımla
// Bu, tüm router tarafından kullanılacak context'in yapısıdır.
export interface RouterContext extends AuthState {
  login: (data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => void;
  logout: () => void;
}

// Router'ı oluştur
const router = createRouter({
  routeTree,
  context: {

    ...getAuthState(), 
    login: () => {},
    logout: () => {},
  },
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
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
