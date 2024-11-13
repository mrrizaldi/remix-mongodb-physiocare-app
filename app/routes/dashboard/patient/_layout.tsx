import { Outlet } from "@remix-run/react";

export default function patientLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
