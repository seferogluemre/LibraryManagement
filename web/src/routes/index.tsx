import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      throw redirect({
        to: "/dashboard",
      });
    } else {
      throw redirect({
        to: "/login",
      });
    }
  },
});
