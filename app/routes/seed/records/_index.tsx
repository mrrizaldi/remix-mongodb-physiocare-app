// app/routes/admin/seed-medical.tsx
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { SessionTypes } from "~/schema/profile";
import {
  createManyMedicalRecords,
  deleteManyMedicalRecords,
} from "~/utils/record.server";
import { getProfiles } from "~/utils/profile.server";
import { getServices } from "~/utils/service.server";
import { getMedicalInventories } from "~/utils/inventory.server";
import { PaymentStatus, SchedulingStatus } from "~/models";
import {
  createManySchedules,
  deleteManySchedules,
} from "~/utils/schedule.server";

export const loader: LoaderFunction = async () => {
  const [profiles, services, inventory] = await Promise.all([
    getProfiles(),
    getServices(),
    getMedicalInventories(),
  ]);

  return json({ profiles, services, inventory });
};

// Helper untuk generate random date dalam range tertentu
function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Helper untuk random element dari array
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const [profiles, services, inventory] = await Promise.all([
      getProfiles(),
      getServices(),
      getMedicalInventories(),
    ]);

    // Filter patients dan doctors
    const patients = profiles.filter((p) => p.account.role === "PATIENT");
    const doctors = profiles.filter((p) => p.account.role === "DOCTOR");

    if (
      !patients.length ||
      !doctors.length ||
      !services.length ||
      !inventory.length
    ) {
      return json({
        success: false,
        message: "Please seed profiles, services, and inventory first",
      });
    }

    // Generate 25 schedules (20 akan punya medical record, 5 cancelled)
    const schedules = Array.from({ length: 25 }, (_, index) => {
      const doctor = randomElement(doctors);
      const patient = randomElement(patients);
      const service = randomElement(services);
      const isCancelled = index >= 20; // 5 terakhir akan cancelled
      const startDate = new Date(2024, 0, 1); // 1 Jan 2024
      const endDate = new Date(2024, 11, 31); // 31 Dec 2024

      return {
        staffId: doctor._id,
        patientId: patient._id,
        serviceId: service._id,
        date: randomDate(startDate, endDate),
        session: randomElement(Object.values(SessionTypes)),
        status: isCancelled
          ? SchedulingStatus.CANCELLED
          : SchedulingStatus.CONFIRMED,
        payment: {
          amount: service.price,
          status: isCancelled ? PaymentStatus.CANCELLED : PaymentStatus.PAID,
          paymentMethod: "CASH",
        },
      };
    });

    // Generate 20 medical records untuk schedules yang completed
    const medicalRecords = Array.from({ length: 20 }, () => {
      const randomInventoryItems = Array.from(
        { length: Math.floor(Math.random() * 3) + 1 }, // 1-3 items per prescription
        () => ({
          medicalInventory: randomElement(inventory)._id,
          quantity: Math.floor(Math.random() * 5) + 1, // 1-5 quantity
          dosageInstructions: "Take after meals",
        })
      );

      return {
        patientId: randomElement(patients)._id,
        complaint: "Patient reports feeling unwell",
        medicalHistory: "No significant medical history",
        physicalExamination: "Normal examination findings",
        vitals: {
          systolic: Math.floor(Math.random() * 40) + 100, // 100-140
          diastolic: Math.floor(Math.random() * 30) + 60, // 60-90
          heartRate: Math.floor(Math.random() * 40) + 60, // 60-100
          respiratoryRate: Math.floor(Math.random() * 8) + 12, // 12-20
          temperature: Math.floor(Math.random() * 2) + 36, // 36-38
        },
        serviceNotes: [
          {
            additionalNotes: "Patient showing improvement",
            prescription: {
              details: randomInventoryItems,
            },
          },
        ],
      };
    });

    // Delete existing records
    await Promise.all([deleteManyMedicalRecords(), deleteManySchedules()]);

    // Create new records
    const createdRecords = await createManyMedicalRecords(medicalRecords);

    // Update schedules dengan medical record IDs
    const schedulesWithRecords = schedules.map((schedule, index) => {
      if (index < 20) {
        // Hanya 20 schedule pertama yang dapat medical record
        return {
          ...schedule,
          medicalRecordId: createdRecords[index]._id,
        };
      }
      return schedule;
    });

    const createdSchedules = await createManySchedules(schedulesWithRecords);

    return json({
      success: true,
      message: `Successfully seeded ${createdSchedules.length} schedules and ${createdRecords.length} medical records`,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return json({
      success: false,
      message: "Failed to seed medical records and schedules",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default function SeedMedicalPage() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const canSeed =
    loaderData.profiles?.length > 0 &&
    loaderData.services?.length > 0 &&
    loaderData.inventory?.length > 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Seed Medical Records & Schedules
      </h1>

      {!canSeed ? (
        <div className="text-yellow-600 bg-yellow-50 p-4 rounded mb-4">
          Please seed Profiles, Services, and Medical Inventory first.
        </div>
      ) : (
        <Form method="post">
          <Button type="submit" disabled={!canSeed}>
            Seed Medical Data
          </Button>
        </Form>
      )}

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
