// app/routes/update.tsx
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect, useLoaderData, useMatches } from "@remix-run/react";
import ProfileUpdateForm from "~/components/ProfileForm";
import type { IProfile, ProfileUpdateFormProps } from "~/types/profile";
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

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  // Helper function to safely convert FormDataEntryValue to string
  const getString = (value: FormDataEntryValue | null): string | undefined => {
    if (value === null || value === "") return undefined;
    return value.toString();
  };

  // Helper function to safely convert FormDataEntryValue to number
  const getNumber = (value: FormDataEntryValue | null): number | undefined => {
    if (value === null || value === "") return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  };

  const updates: Partial<IProfile> = {
    name: getString(formData.get("name")),
    age: getNumber(formData.get("age")),
    gender: getString(formData.get("gender")),
    address: getString(formData.get("address")),
    phone: getString(formData.get("phone")),
  };

  // Remove undefined values
  Object.keys(updates).forEach((key) => {
    if (updates[key as keyof typeof updates] === undefined) {
      delete updates[key as keyof typeof updates];
    }
  });

  try {
    await updateProfile(params.id!, updates);
    return redirect(`/dashboard/profile/${params.id}`);
  } catch (error) {
    console.error("Update error:", error);
    return { error: "Failed to update profile" };
  }
};

export default function UpdateProfilePage() {
  const { profile } = useLoaderData<ProfileUpdateFormProps>();
  if (!profile) {
    return <div>Loading profile...</div>;
  }
  return <ProfileUpdateForm profile={profile} />;
}
