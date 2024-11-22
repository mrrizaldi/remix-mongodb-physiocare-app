// routes/dashboard/doctor/scheduling/_index.tsx
import { json, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import {
  useLoaderData,
  useNavigation,
  Form,
  useRouteError,
} from "@remix-run/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { protectRoute } from "~/utils/middleware.server";
import { findDoctorSchedulingById } from "~/utils/doctor.server";
import { getScheduleById } from "~/utils/schedule.server";

type LoaderData = {
  schedules: Array<{
    id: string;
    date: string;
    session: string;
    patient: {
      id: string;
      name: string;
    };
    service: {
      id: string;
      name: string;
      price: number;
    };
    status: string;
    payment: {
      amount: number;
      status: string;
    };
  }>;
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Authenticate doctor
    const response = await protectRoute(request);
    const { tokenPayload: user } = await response.json();

    if (!user || user.role !== "DOCTOR") {
      throw new Response("Unauthorized", { status: 401 });
    }

    const schedules = await findDoctorSchedulingById(user.id);

    return json({
      schedules: schedules.map((schedule) => ({
        id: schedule._id.toString(),
        date: schedule.date,
        session: schedule.session,
        patient: {
          id: schedule.patientId._id.toString(),
          name: schedule.patientId.name,
        },
        service: {
          id: schedule.serviceId._id.toString(),
          name: schedule.serviceId.name,
          price: schedule.serviceId.price,
        },
        status: schedule.status,
        payment: schedule.payment,
      })),
    });
  } catch (error) {
    console.error("Doctor scheduling loader error:", error);
    throw error;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const scheduleId = formData.get("scheduleId") as string;
    const newStatus = formData.get("status") as string;

    // Validate input
    if (!scheduleId || !newStatus) {
      throw new Error("Invalid input");
    }

    // Authenticate doctor
    const response = await protectRoute(request);
    const { tokenPayload: user } = await response.json();

    if (!user || user.role !== "DOCTOR") {
      throw new Response("Unauthorized", { status: 401 });
    }

    const schedule = await getScheduleById(scheduleId);

    if (!schedule) {
      throw new Error("Schedule not found");
    }

    // Check if status was already changed from WAITING
    if (schedule.status !== "WAITING") {
      throw new Error("Status can only be changed once");
    }

    // Update status
    schedule.status = newStatus;
    await schedule.save();

    return json({ success: true });
  } catch (error) {
    console.error("Update status error:", error);
    return json(
      {
        errors: {
          submit: error instanceof Error ? error.message : "Update failed",
        },
      },
      { status: 400 }
    );
  }
}

function getStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case "WAITING":
      return "bg-yellow-500";
    case "CONFIRMED":
      return "bg-blue-500";
    case "COMPLETED":
      return "bg-green-500";
    case "CANCELLED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function getPaymentStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "bg-yellow-500";
    case "PAID":
      return "bg-green-500";
    case "FAILED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

export default function DoctorSchedulingPage() {
  const { schedules } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const isUpdating = navigation.state === "submitting";

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Patient Appointments</CardTitle>
          <CardDescription>Manage your patient appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <div className="font-medium">
                      {new Date(schedule.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {schedule.session}
                    </div>
                  </TableCell>
                  <TableCell>{schedule.patient.name}</TableCell>
                  <TableCell>{schedule.service.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getPaymentStatusColor(schedule.payment.status)}
                    >
                      {schedule.payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(schedule.status)}
                    >
                      {schedule.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {schedule.status === "WAITING" &&
                      schedule.payment.status === "PAID" && (
                        <Form method="post" className="flex items-center gap-2">
                          <input
                            type="hidden"
                            name="scheduleId"
                            value={schedule.id}
                          />
                          <Select name="status" defaultValue="">
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CONFIRMED">Confirm</SelectItem>
                              <SelectItem value="CANCELLED">Cancel</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button type="submit" disabled={isUpdating} size="sm">
                            {isUpdating ? "Updating..." : "Update"}
                          </Button>
                        </Form>
                      )}
                  </TableCell>
                </TableRow>
              ))}
              {schedules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No appointments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            {error instanceof Error ? error.message : "An error occurred"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please try again or contact support if the problem persists.</p>
        </CardContent>
      </Card>
    </div>
  );
}
