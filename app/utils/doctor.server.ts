import { Scheduling } from "~/models";
import { connectDB } from "./db.server";

export async function findDoctorSchedulingById(id: string) {
  await connectDB();

  // Fetch schedules for the doctor
  const schedules = await Scheduling.find({ staffId: id })
    .populate("patientId", "name") // Populate patient details
    .populate("serviceId", "name price") // Populate service details
    .sort({ date: -1 }) // Sort by date descending
    .exec();

  return schedules;
}
