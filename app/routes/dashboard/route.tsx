import { Outlet } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { getUser } from "~/utils/session.server";
import SidebarComponent from "./sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

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
  const user = await getUser(request);
  console.log("ini dari loader dashboard", user);
  return json({ user });
};
