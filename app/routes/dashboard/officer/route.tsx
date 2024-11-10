import { json, LoaderFunction } from "@remix-run/node";
import { protectRoute } from "~/utils/middleware.server";

export default function DashboardIndexRoute() {
  return (
    <div>
      <h1>Dashboard Officer</h1>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const authCheck = protectRoute(request, ["OFFICER"]);

  if (authCheck instanceof Response) {
    return authCheck;
  }

  return json({ authCheck });
};
