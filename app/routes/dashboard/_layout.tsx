import { Outlet, useRouteError } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import SidebarComponent from "./sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { protectRoute } from "~/utils/middleware.server";
import { SessionLoaderData } from "~/types/auth";

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

  if (response.headers.get("Location")) {
    return response;
  }

  const data = await response.json();
  return json<SessionLoaderData>({
    user: data.tokenPayload,
  });
};

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-container">
      <h1>Oops! Something went wrong</h1>
      <p>{error instanceof Error ? error.message : "Unknown error occurred"}</p>
    </div>
  );
}
