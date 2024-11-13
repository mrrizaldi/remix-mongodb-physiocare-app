// app/routes/admin/seed.tsx
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Service } from "~/models/index";
import { createService, deleteManyServices } from "~/utils/service.server";

const services = [
  { name: "General Check-up", price: 100000 },
  { name: "Dental Cleaning", price: 250000 },
  { name: "Eye Examination", price: 150000 },
  { name: "Blood Test", price: 200000 },
  { name: "X-Ray", price: 300000 },
  { name: "Vaccination", price: 180000 },
  { name: "Physical Therapy", price: 275000 },
  { name: "Consultation", price: 120000 },
  { name: "ECG Test", price: 350000 },
  { name: "Ultrasound", price: 400000 },
];

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    await deleteManyServices();

    const result = await createService(services);
    return json({
      success: true,
      message: `Successfully seeded ${result.length} services`,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return json({
      success: false,
      message: "Failed to seed services",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default function SeedPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Seed Services Data</h1>

      <Form method="post">
        <Button type="submit">Seed Services</Button>
      </Form>

      {actionData && (
        <div
          className={`mt-4 p-4 rounded ${
            actionData.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {actionData.message}
        </div>
      )}
    </div>
  );
}
