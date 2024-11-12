// app/routes/update.tsx
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import ProfileUpdateForm from "~/components/ProfileForm";
import { getProfile, updateProfile } from "~/utils/profile.server";

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

import { Profile, UpdateProfileSchema } from "~/schema/profile";

export const action: ActionFunction = async ({ request, params }) => {
  try {
    if (!params.id) {
      return { error: "Profile ID is required" };
    }

    const formData = await request.formData();

    const rawUpdates: Record<string, FormDataEntryValue | null> = {};

    formData.forEach((value, key) => {
      rawUpdates[key] = value === "" ? null : value;
    });

    const updates = {
      name: rawUpdates.name?.toString(),
      dob: rawUpdates.dob ? new Date(rawUpdates.dob.toString()) : null,
      age: rawUpdates.age ? Number(rawUpdates.age) : null,
      gender: rawUpdates.gender?.toString() ?? null,
      address: rawUpdates.address?.toString() ?? null,
      phone: rawUpdates.phone?.toString() ?? null,
    };

    const validationResult = UpdateProfileSchema.safeParse(updates);

    if (!validationResult.success) {
      return { errors: validationResult.error };
    }

    await updateProfile(params.id, validationResult.data);

    return redirect(`/dashboard/profile/${params.id}`, {
      headers: {
        "X-Remix-Revalidate": "true",
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    return { error: "Failed to update profile" };
  }
};
export default function UpdateProfilePage() {
  const { profile } = useLoaderData<{ profile: Profile | null }>();
  if (!profile) {
    return <div>Loading profile...</div>;
  }
  return <ProfileUpdateForm profile={profile} />;
}
