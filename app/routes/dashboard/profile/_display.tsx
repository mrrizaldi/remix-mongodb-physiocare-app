// app/routes/profile.tsx
import type { LoaderFunction } from "@remix-run/node";
import ProfileDisplay from "~/components/ProfileDisplay";
import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import type { IProfile } from "~/types/profile"; // Create a types file
import { getProfile } from "~/utils/profile.server";
import { UserData } from "~/types/auth";
import { protectRoute } from "~/utils/middleware.server";

interface LoaderData {
  profile: IProfile;
}
export const loader: LoaderFunction = async ({ request }) => {
  try {
    const response = await protectRoute(request);
    const { tokenPayload: data } = await response.json();
    const profile = await getProfile(data.id);

    const plainProfile = profile
      ? {
          ...profile.toObject(),
          _id: profile._id.toString(),
          createdAt: profile.createdAt.toISOString(),
          updatedAt: profile.updatedAt.toISOString(),
        }
      : null;

    return { profile: plainProfile };
  } catch (error) {
    console.error("Loader error:", error);
    return { profile: null };
  }
};

export default function ProfilePage() {
  const { profile } = useLoaderData<typeof loader>();
  if (!profile) {
    return <div>Loading profile...</div>;
  }
  return <ProfileDisplay profile={profile} />;
}
