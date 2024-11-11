import { IProfile } from "~/types/profile";
import { Profile } from "../models"; // Import model Profile yang sudah kita buat
import { connectDB } from "./db.server";

export async function getProfile(userId: string) {
  await connectDB();
  const profile = await Profile.findById(userId);
  return profile;
}

export async function updateProfile(
  userId: string,
  profileData: Partial<IProfile>
) {
  const profile = await Profile.findByIdAndUpdate(userId, profileData, {
    new: true,
    runValidators: true,
  });
  return profile;
}
