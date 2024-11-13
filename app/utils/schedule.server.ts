import { Scheduling } from "~/models";

export async function createManySchedules(schedules: any[]) {
  return await Scheduling.insertMany(schedules);
}

export async function getSchedules() {
  return await Scheduling.find().lean();
}
export async function deleteManySchedules() {
  return await Scheduling.deleteMany({});
}
