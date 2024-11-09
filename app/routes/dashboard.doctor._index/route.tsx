import { json, LoaderFunction } from "@remix-run/node";
import { protectRoute } from "~/utils/middleware.server";

export default function DashboardIndexRoute() {
  return (
    <div>
      <h1>Dashboard Medics</h1>
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
