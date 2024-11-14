import { Date } from "mongoose";
import { PaymentStatus, Scheduling, SchedulingStatus } from "~/models";
import { SessionTypes } from "~/schema/profile";
import { connectDB } from "./db.server";
import { CreateScheduleInput } from "~/schema/scheduling";

export async function createManySchedules(schedules: any[]) {
  return await Scheduling.insertMany(schedules);
}

export async function getSchedules() {
  return await Scheduling.find().lean();
}
export async function deleteManySchedules() {
  return await Scheduling.deleteMany({});
}

export async function createSchedule(
  payload: Partial<CreateScheduleInput> & { paymentAmount: number }
) {
  try {
    await connectDB();

    // Restructure payload to match the schema
    const scheduleData = {
      staffId: payload.staffId,
      patientId: payload.patientId,
      serviceId: payload.serviceId,
      date: payload.date,
      session: payload.session,
      payment: {
        amount: payload.paymentAmount,
        status: PaymentStatus.PENDING, // Assuming you have this enum
      },
      status: SchedulingStatus.WAITING, // Assuming you have this enum
    };

    const schedule = await Scheduling.create(scheduleData);
    console.log("Schedule created:", schedule);
    return schedule;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw error;
  }
}

export async function displayScheduleForPatient(id: string) {
  await connectDB();

  // Fetch schedules for the patient
  const schedules = await Scheduling.find({ patientId: id })
    .populate("staffId", "name") // Populate staff details
    .populate("serviceId", "name price") // Populate service details
    .sort({ date: -1 }) // Sort by date descending
    .exec();

  return schedules;
}

export async function findByIdAndUpdateSchedulingPaymentStatus(id: string) {
  await connectDB();
  const schedule = await Scheduling.findOneAndUpdate(
    { _id: id },
    { "payment.status": PaymentStatus.PAID },
    { new: true }
  );
  return schedule;
}
export async function getScheduleById(_id: string) {
  await connectDB();
  const schedule = await Scheduling.findById(_id);
  return schedule;
}
