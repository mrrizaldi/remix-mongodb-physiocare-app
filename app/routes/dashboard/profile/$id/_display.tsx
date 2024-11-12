// app/routes/profile.tsx
import type { LoaderFunction } from "@remix-run/node";
import ProfileDisplay from "~/components/ProfileDisplay";
import { json, useLoaderData } from "@remix-run/react";
import { getProfile } from "~/utils/profile.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const shouldRevalidate = url.searchParams.has("revalidate");

  if (shouldRevalidate) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
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

    return json(
      { profile: plainProfile },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Loader error:", error);
    return { profile: null };
  }
};

export default function ProfilePage() {
  const { profile } = useLoaderData<typeof loader>();

  if (!profile) {
    return <div>Profile not found</div>;
  }
  return <ProfileDisplay profile={profile} />;
}
