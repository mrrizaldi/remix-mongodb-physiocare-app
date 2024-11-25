import { json, LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { protectRoute } from "~/utils/middleware.server";

export default function DashboardIndexRoute() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const authCheck = protectRoute(request, ["MEDICS"]);

  if (authCheck instanceof Response) {
    return authCheck;
  }

  return json({ authCheck });
};
