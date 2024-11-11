import { useRouteLoaderData } from "@remix-run/react";
import { SessionLoaderData } from "~/types/auth";

export function useAuth() {
  const data = useRouteLoaderData(
    "routes/dashboard/_layout"
  ) as SessionLoaderData;
  return {
    user: data?.user,
    isAuthenticated: !!data?.user,
  };
}
