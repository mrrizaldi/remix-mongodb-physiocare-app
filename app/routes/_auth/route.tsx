// app/routes/auth.tsx
import { Outlet } from "@remix-run/react";
import { Card, CardContent } from "~/components/ui/card";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Outlet context={{ CardWrapper }} />
      </div>
    </div>
  );
}
// Reusable card wrapper component
function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <CardContent className="py-8 px-4 sm:px-10">{children}</CardContent>
    </Card>
  );
}
