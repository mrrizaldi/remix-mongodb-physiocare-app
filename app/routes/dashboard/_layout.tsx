import { Outlet, useMatches } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import SidebarComponent from "./sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { protectRoute } from "~/utils/middleware.server";
import { SessionLoaderData } from "~/types/auth";

export default function DashboardLayout() {
  const matches = useMatches();
  console.log(
    "Available routes:",
    matches.map((m) => m.id)
  );
  return (
    <div>
      <SidebarProvider>
        <SidebarComponent />
        <SidebarInset>
          <main className="p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const response = await protectRoute(request);
  const data = await response.json();
  return json<SessionLoaderData>({
    user: data.tokenPayload,
  });
};
