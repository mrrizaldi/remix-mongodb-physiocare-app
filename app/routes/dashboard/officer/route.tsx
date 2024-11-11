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
  return protectRoute(request, ["OFFICER"]);
};
