// app/routes/admin/seed-inventory.tsx
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  createMedicalInventory,
  deleteManyMedicalInventories,
} from "~/utils/inventory.server";
import { medicalInventorySamples } from "./sample";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    await deleteManyMedicalInventories();
    const result = await createMedicalInventory(medicalInventorySamples);

    return json({
      success: true,
      message: `Successfully seeded ${result.length} medical inventory items`,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return json({
      success: false,
      message: "Failed to seed medical inventory",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default function SeedInventoryPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Seed Medical Inventory Data</h1>

      <Form method="post">
        <Button type="submit">Seed Medical Inventory</Button>
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
