import { Outlet, useMatches } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import SidebarComponent from "./sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { protectRoute } from "~/utils/middleware.server";
import { LoaderData } from "~/types/auth";

export default function DashboardLayout() {
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
  return json<LoaderData>({
    user: data.tokenPayload,
  });
};
