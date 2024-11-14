import { getStaffPerServices } from "~/utils/staff.server";

export default function Testing() {
  return <div>ini testing doang</div>;
}

export const loader = async () => {
  const staffService = await getStaffPerServices("6733252ab93cadf6c374beb4");
  console.log(staffService);
  return staffService;
};
