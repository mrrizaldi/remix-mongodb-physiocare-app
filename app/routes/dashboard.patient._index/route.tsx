import { json, LoaderFunction, redirect } from "@remix-run/node";
import { protectRoute } from "~/utils/middleware.server";

export default function DashboardIndexRoute() {
  return (
    <div>
      <h1>Dashboard Patient</h1>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const authCheck = protectRoute(request, ["PATIENT"]);

    if (authCheck instanceof Response) {
      return authCheck;
    }

    return json({ authCheck });
  } catch (error) {
    return redirect("/login");
  }
};
