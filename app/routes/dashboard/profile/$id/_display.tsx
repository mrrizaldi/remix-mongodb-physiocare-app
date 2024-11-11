// app/routes/profile.tsx
import type { LoaderFunction } from "@remix-run/node";
import ProfileDisplay from "~/components/ProfileDisplay";
import { useLoaderData } from "@remix-run/react";
import { getProfile } from "~/utils/profile.server";

export const loader: LoaderFunction = async ({ params }) => {
  try {
    if (!params.id) {
      return { profile: null };
    }

    const profile = await getProfile(params.id);
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
  return <ProfileDisplay profile={profile} />;
}
