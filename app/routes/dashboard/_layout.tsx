import { Outlet } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import SidebarComponent from "./sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { protectRoute } from "~/utils/middleware.server";

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
  return protectRoute(request);
};
