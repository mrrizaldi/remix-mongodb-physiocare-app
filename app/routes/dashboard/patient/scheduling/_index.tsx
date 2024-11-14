// routes/dashboard/patient/scheduling/_index.tsx
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react";
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
import { protectRoute } from "~/utils/middleware.server";
import { displayScheduleForPatient } from "~/utils/schedule.server";

type LoaderData = {
  schedules: Array<{
    id: string;
    date: string;
    session: string;
    staff: {
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
    // Authenticate user
    const response = await protectRoute(request);
    const { tokenPayload: user } = await response.json();

    if (!user) {
      throw new Response("Unauthorized", { status: 401 });
    }

    const schedules = await displayScheduleForPatient(user.id);

    return json({
      schedules: schedules.map((schedule) => ({
        id: schedule._id.toString(),
        date: schedule.date,
        session: schedule.session,
        staff: {
          id: schedule.staffId._id.toString(),
          name: schedule.staffId.name,
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
    console.error("Scheduling loader error:", error);
    throw error;
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

export default function SchedulingPage() {
  const { schedules } = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>My Appointments</CardTitle>
          <CardDescription>
            View and manage your scheduled appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
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
                  <TableCell>{schedule.service.name}</TableCell>
                  <TableCell>Dr. {schedule.staff.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(schedule.status)}
                    >
                      {schedule.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getPaymentStatusColor(schedule.payment.status)}
                    >
                      {schedule.payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    Rp {schedule.payment.amount.toLocaleString("id-ID")}
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
