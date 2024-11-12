import { Outlet } from "@remix-run/react";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react"; // pastikan lucide-react sudah diinstall
import { Progress } from "~/components/ui/progress";

export default function ProfileLayout() {
  const navigation = useNavigation();
  const isRevalidating = navigation.state === "loading";

  return (
    <div>
      {isRevalidating && (
        <div className="fixed top-4 right-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <Progress value={33} />
        </div>
      )}
      <Outlet />
    </div>
  );
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  actionResult,
  currentParams,
  nextParams,
  defaultShouldRevalidate,
}) => {
  // Revalidate jika ada update di child routes
  if (actionResult?.headers?.get("X-Remix-Revalidate")) {
    return true;
  }

  // Revalidate jika params berubah
  if (currentParams.id !== nextParams.id) {
    return true;
  }

  return defaultShouldRevalidate;
};
