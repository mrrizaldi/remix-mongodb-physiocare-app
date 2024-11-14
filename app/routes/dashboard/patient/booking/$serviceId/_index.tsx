import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
  useRouteLoaderData,
  redirect,
} from "@remix-run/react";
import { json, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getStaffPerServices } from "~/utils/staff.server";
import { Profile } from "~/schema/profile";
import { createSchedule } from "~/utils/schedule.server";
import { z } from "zod";
import { protectRoute } from "~/utils/middleware.server";
import { SessionLoaderData } from "~/types/auth";
import { ObjectId } from "mongodb";
import { getService } from "~/utils/service.server";
import { CreateSchedulingSchema } from "~/schema/scheduling";

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.serviceId) {
    return json({ staffs: null });
  }

  const staffs = await getStaffPerServices(params.serviceId);
  const plainStaffs = staffs
    ? staffs.map((staff) => ({
        ...staff.toObject(),
        id: staff._id.toString(),
        createdAt: staff.createdAt.toISOString(),
        updatedAt: staff.updatedAt.toISOString(),
      }))
    : null;

  return json({ staffs: plainStaffs });
}

export async function action({ request, params }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const response = await protectRoute(request);
    const { tokenPayload: user } = await response.json();

    if (!user) {
      return json({ errors: { auth: "Unauthorized" } }, { status: 401 });
    }

    const patientId = user?.id;
    const service = await getService(params.serviceId!);

    if (!service) {
      return json(
        { errors: { service: "Service not found" } },
        { status: 404 }
      );
    }

    const basePrice = service.price;
    const paymentAmount = basePrice * 0.15;

    const dateValue = formData.get("date");
    const parsedDate = dateValue ? new Date(dateValue.toString()) : null;

    if (!parsedDate) {
      return json(
        {
          errors: { date: "Invalid date format" },
        },
        { status: 400 }
      );
    }

    const result = CreateSchedulingSchema.safeParse({
      staffId: formData.get("staffId"),
      date: parsedDate,
      session: formData.get("session"),
      serviceId: params.serviceId,
      patientId,
    });

    if (!result.success) {
      return json(
        {
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { staffId, date, session, serviceId } = result.data;

    // Create payload with all necessary data
    const payload = {
      staffId,
      date,
      session,
      serviceId,
      patientId,
      paymentAmount,
    };

    const schedule = await createSchedule(payload);

    if (!schedule) {
      return json(
        {
          errors: { submit: "Failed to create schedule" },
        },
        { status: 500 }
      );
    }

    return redirect(`/dashboard/patient/payment/${schedule.id}`);
  } catch (error) {
    console.error("Booking error:", error);
    return json(
      {
        errors: { submit: "Booking failed. Please try again." },
      },
      { status: 500 }
    );
  }
}
export default function BookingPage() {
  const { staffs } = useLoaderData<typeof loader>();
  const actionData = useActionData<{
    errors?: {
      staffId?: string[];
      date?: string[];
      session?: string[];
      submit?: string;
    };
  }>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  if (!staffs) {
    return <div>Service not found</div>;
  }

  return (
    <div className="container mx-auto py-10 max-w-screen-md">
      <h1 className="text-3xl font-bold mb-6">Book a Service</h1>

      <Form method="post" className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="staffId">Staff Member</Label>
          <Select name="staffId">
            <SelectTrigger>
              <SelectValue placeholder="Select a staff member" />
            </SelectTrigger>
            <SelectContent>
              {staffs.map((staff: Profile) => (
                <SelectItem key={staff._id} value={staff._id!}>
                  {staff.name}
                  {/* {staff.staffDetails?.specialties && */}
                  {/*   `(since ${new Date( */}
                  {/*     staff.staffDetails.specialties */}
                  {/*   ).toLocaleDateString()})`} */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {actionData?.errors?.staffId && (
            <p className="text-sm text-destructive">
              {actionData.errors.staffId[0]}
            </p>
          )}
          <p className="text-sm text-gray-500">
            Choose the staff member you'd like to book with.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" className="w-full" />
          {actionData?.errors?.date && (
            <p className="text-sm text-destructive">
              {actionData.errors.date[0]}
            </p>
          )}
          <p className="text-sm text-gray-500">
            Select the date for your appointment.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="session">Session</Label>
          <Select name="session">
            <SelectTrigger>
              <SelectValue placeholder="Select a session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MORNING">Morning</SelectItem>
              <SelectItem value="AFTERNOON">Afternoon</SelectItem>
              <SelectItem value="EVENING">Evening</SelectItem>
            </SelectContent>
          </Select>
          {actionData?.errors?.session && (
            <p className="text-sm text-destructive">
              {actionData.errors.session[0]}
            </p>
          )}
          <p className="text-sm text-gray-500">
            Choose the time of day for your appointment.
          </p>
        </div>

        {actionData?.errors?.submit && (
          <p className="text-destructive">{actionData.errors.submit}</p>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Booking..." : "Book Appointment"}
        </Button>
      </Form>
    </div>
  );
}
