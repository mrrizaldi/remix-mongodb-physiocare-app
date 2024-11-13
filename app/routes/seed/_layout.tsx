import { Outlet } from "@remix-run/react";

export default function SeedLayout() {
  return (
    <div className="p-6">
      <Outlet />
    </div>
  );
}
