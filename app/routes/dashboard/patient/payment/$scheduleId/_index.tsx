import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
  redirect,
} from "@remix-run/react";
import { json, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  findByIdAndUpdateSchedulingPaymentStatus,
  getScheduleById,
} from "~/utils/schedule.server";
import { getService } from "~/utils/service.server";

type LoaderData = {
  schedule: {
    id: string;
    date: string;
    session: string;
    [key: string]: any;
  };
  service: {
    id: string;
    name: string;
    price: number;
    [key: string]: any;
  };
  paymentAmount: number;
  totalPrice: number;
};
// Loader to fetch schedule and service details
export async function loader({ params }: LoaderFunctionArgs) {
  const scheduleId = params.scheduleId;

  if (!scheduleId) {
    throw new Error("Schedule ID is required");
  }

  const schedule = await getScheduleById(scheduleId);
  if (!schedule) {
    throw new Error("Schedule not found");
  }

  const service = await getService(schedule.serviceId);
  if (!service) {
    throw new Error("Service not found");
  }

  // Calculate 15% payment amount
  const basePrice = service.price;
  const paymentAmount = basePrice * 0.15;

  return json({
    schedule: {
      id: schedule._id.toString(),
      date: schedule.date,
      session: schedule.session,
      ...schedule.toObject(),
    },
    service: {
      id: service._id.toString(),
      name: service.name,
      price: service.price,
      ...service.toObject(),
    },
    paymentAmount,
    totalPrice: basePrice,
  });
}

// Action to handle payment submission
export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const amount = Number(formData.get("amount"));
  const scheduleId = params.scheduleId!;

  try {
    const loaderResult = await loader({ params } as LoaderFunctionArgs);
    const { paymentAmount } = (await loaderResult.json()) as LoaderData;

    // Validate payment amount
    if (amount !== paymentAmount) {
      return json(
        {
          errors: {
            amount: ["The payment amount must match the required down payment"],
          },
        },
        { status: 400 }
      );
    }
    await findByIdAndUpdateSchedulingPaymentStatus(scheduleId);

    return redirect("/dashboard/patient/scheduling");
  } catch (error) {
    return json(
      {
        errors: {
          submit: "Payment failed. Please try again.",
        },
      },
      { status: 400 }
    );
  }
}

export default function PaymentPage() {
  const { schedule, service, paymentAmount, totalPrice } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<{
    errors?: {
      amount?: string[];
      submit?: string;
    };
  }>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  const formattedDate = new Date(schedule.date).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Please complete your down payment for the scheduled service
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Service Details */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Service:</span>
              <span>{service.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Schedule:</span>
              <span>
                {formattedDate} - {schedule.session}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Price:</span>
              <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-primary font-semibold">
              <span>Down Payment (15%):</span>
              <span>Rp {paymentAmount.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* Payment Form */}
          <Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter payment amount"
                className="w-full"
              />
              {actionData?.errors?.amount && (
                <p className="text-sm text-destructive">
                  {actionData.errors.amount[0]}
                </p>
              )}
              <p className="text-sm text-gray-500">
                Please enter the exact down payment amount: Rp{" "}
                {paymentAmount.toLocaleString("id-ID")}
              </p>
            </div>

            {actionData?.errors?.submit && (
              <p className="text-destructive text-center">
                {actionData.errors.submit}
              </p>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Processing Payment..." : "Complete Payment"}
            </Button>
          </Form>
        </CardContent>

        <CardFooter className="text-sm text-gray-500">
          <p>
            Note: This is a prototype payment page. In production, this would be
            connected to a proper payment gateway.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
