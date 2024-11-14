import { Profile } from "~/models";
import { connectDB } from "./db.server";

export const getStaffPerServices = async (serviceId: string) => {
  await connectDB();
  const staffs = await Profile.find({
    "staffDetails.specialties.serviceId": serviceId,
  });
  return staffs;
};
