import { Profile } from "../models"; // Import model Profile yang sudah kita buat
import { connectDB } from "./db.server";
import { UpdateProfileInput, CreateProfileInput } from "~/schema/profile";
import type { Profile as ProfileType } from "~/schema/profile";
import bcrypt from "bcryptjs";

export async function createProfile(data: CreateProfileInput) {
  await connectDB();
  if (data.account.password) {
    data.account.password = await bcrypt.hash(data.account.password, 10);
  }
  return Profile.create(data);
}

export async function createManyProfiles(data: ProfileType[]) {
  await connectDB();
  const hashedData = await Promise.all(
    data.map(async (profile) => ({
      ...profile,
      account: {
        ...profile.account,
        password: await bcrypt.hash(profile.account.password, 10),
      },
    }))
  );
  return Profile.insertMany(hashedData);
}

export async function getProfiles() {
  await connectDB();
  const profiles = await Profile.find().lean();
  return profiles as ProfileType | null;
}

export async function getProfile(id: string) {
  await connectDB();
  const profile = await Profile.findById(id);
  return profile;
}

export async function getProfileByEmail(email: string) {
  await connectDB();
  const profile = await Profile.findOne({ "account.email": email }).lean();
  return profile as ProfileType | null;
}

export async function getExistingUser(email: string, username: string) {
  await connectDB();
  return Profile.findOne({
    $or: [{ "account.email": email }, { "account.username": username }],
  });
}

export async function updateProfile(id: string, data: UpdateProfileInput) {
  await connectDB();
  const profile = await Profile.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return profile;
}

export async function deleteProfile(id: string) {
  await connectDB();
  return Profile.findByIdAndDelete(id);
}

export async function deleteManyProfiles() {
  await connectDB();
  return Profile.deleteMany({});
}
