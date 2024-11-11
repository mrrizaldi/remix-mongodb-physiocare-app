import { useRouteLoaderData } from "@remix-run/react";
import { LoaderData } from "~/types/auth";

export function useAuth() {
  const data = useRouteLoaderData("routes/dashboard/_layout") as LoaderData;
  return {
    user: data?.user,
    isAuthenticated: !!data?.user,
  };
}
