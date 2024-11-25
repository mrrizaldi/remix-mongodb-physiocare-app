import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { RoleTypes, Days, SessionTypes, Profile } from "~/schema/profile";
import { getServices } from "~/utils/service.server";
import { createManyProfiles, deleteManyProfiles } from "~/utils/profile.server";

// Loader untuk mendapatkan available services
export const loader: LoaderFunction = async () => {
  const services: Array<{ _id: string; name: string }> = await getServices();
  return json({ services });
};

// Helper function untuk generate username yang unique
function generateUsername(name: string, role: string, index: number): string {
  const baseName = name.toLowerCase().replace(/\s+/g, "");
  return `${baseName}.${role.toLowerCase()}${index}`;
}

function generateEmail(username: string): string {
  return `${username}@example.com`;
}

// Sample data untuk patients
const patientSamples = [
  { name: "John Doe", age: 35, gender: "Male" },
  { name: "Jane Smith", age: 28, gender: "Female" },
  { name: "Robert Johnson", age: 45, gender: "Male" },
  { name: "Maria Garcia", age: 32, gender: "Female" },
  { name: "David Brown", age: 50, gender: "Male" },
  { name: "Lisa Davis", age: 29, gender: "Female" },
  { name: "Michael Wilson", age: 41, gender: "Male" },
  { name: "Sarah Anderson", age: 37, gender: "Female" },
  { name: "James Taylor", age: 55, gender: "Male" },
  { name: "Emma Martinez", age: 26, gender: "Female" },
].map((patient, index) => ({
  ...patient,
  dob: new Date(new Date().setFullYear(new Date().getFullYear() - patient.age)),
  address: "123 Main St, City",
  phone: `+1234567890${index}`,
  account: {
    username: generateUsername(patient.name, "PATIENT", index + 1),
    email: generateEmail(generateUsername(patient.name, "PATIENT", index + 1)),
    password: "password123",
    role: RoleTypes.PATIENT,
  },
}));

function createDoctorProfiles(services: any[]) {
  const doctorBaseNames = [
    { name: "Dr. William Parker", gender: "Male", age: 45 },
    { name: "Dr. Susan White", gender: "Female", age: 38 },
    { name: "Dr. Richard Lee", gender: "Male", age: 50 },
    { name: "Dr. Jennifer Chen", gender: "Female", age: 42 },
    { name: "Dr. Thomas Anderson", gender: "Male", age: 48 },
    { name: "Dr. Emily Johnson", gender: "Female", age: 40 },
    { name: "Dr. Michael Brown", gender: "Male", age: 52 },
    { name: "Dr. Sarah Davis", gender: "Female", age: 39 },
    { name: "Dr. David Wilson", gender: "Male", age: 47 },
    { name: "Dr. Laura Martinez", gender: "Female", age: 44 },
  ];

  const doctorProfiles: Profile[] = [];

  services.forEach((service, serviceIndex) => {
    for (let i = 0; i < 5; i++) {
      const doctorIndex = serviceIndex * 5 + i;
      const doctor = doctorBaseNames[doctorIndex % doctorBaseNames.length];
      const uniqueName = `${doctor.name} ${String.fromCharCode(
        65 + doctorIndex
      )}`; // Adds A, B, C, etc. to make names unique

      const username = generateUsername(
        uniqueName,
        "DOCTOR",
        doctorProfiles.length + 1
      );

      doctorProfiles.push({
        name: uniqueName,
        dob: new Date(
          new Date().setFullYear(new Date().getFullYear() - doctor.age)
        ),
        age: doctor.age,
        gender: doctor.gender,
        address: "456 Hospital Ave, City",
        phone: `+1987654321${doctorProfiles.length}`,
        account: {
          username,
          email: generateEmail(username),
          password: "password123",
          role: RoleTypes.DOCTOR,
        },
        staffDetails: {
          position: {
            name: "Specialist Doctor",
            minSalary: 10000000,
            maxSalary: 20000000,
          },
          salary: 15000000,
          joinDate: new Date(2020, 0, 1),
          active: true,
          specialties: [
            {
              serviceId: service._id,
              startDate: new Date(2020, 0, 1),
              active: true,
            },
          ],
          schedule: [
            {
              day: Days.MONDAY,
              isActive: true,
              capacities: [
                { session: SessionTypes.MORNING, maxPatients: 10 },
                { session: SessionTypes.AFTERNOON, maxPatients: 8 },
              ],
            },
            {
              day: Days.WEDNESDAY,
              isActive: true,
              capacities: [
                { session: SessionTypes.MORNING, maxPatients: 10 },
                { session: SessionTypes.AFTERNOON, maxPatients: 8 },
              ],
            },
            {
              day: Days.FRIDAY,
              isActive: true,
              capacities: [{ session: SessionTypes.MORNING, maxPatients: 10 }],
            },
          ],
        },
      });
    }
  });

  return doctorProfiles;
}

// Sample data untuk officers
const officerSamples = [
  { name: "Mark Wilson", gender: "Male", age: 30 },
  { name: "Linda Brown", gender: "Female", age: 28 },
  { name: "Steven Clark", gender: "Male", age: 32 },
  { name: "Patricia Moore", gender: "Female", age: 35 },
  { name: "Kevin Wright", gender: "Male", age: 29 },
].map((officer, index) => ({
  name: officer.name,
  dob: new Date(new Date().setFullYear(new Date().getFullYear() - officer.age)),
  age: officer.age,
  gender: officer.gender,
  address: "789 Office Rd, City",
  phone: `+1122334455${index}`,
  account: {
    username: generateUsername(officer.name, "OFFICER", index + 1),
    email: generateEmail(generateUsername(officer.name, "OFFICER", index + 1)),
    password: "password123",
    role: RoleTypes.OFFICER,
  },
  staffDetails: {
    position: {
      name: "Medical Officer",
      minSalary: 5000000,
      maxSalary: 8000000,
    },
    salary: 6500000,
    joinDate: new Date(2021, 0, 1),
    active: true,
    schedule: [
      {
        day: Days.MONDAY,
        isActive: true,
        capacities: [{ session: SessionTypes.MORNING, maxPatients: 15 }],
      },
      {
        day: Days.TUESDAY,
        isActive: true,
        capacities: [{ session: SessionTypes.AFTERNOON, maxPatients: 15 }],
      },
    ],
  },
}));

// Sample data untuk admin
const adminSamples = [
  { name: "Admin Master", gender: "Male", age: 40 },
  { name: "Super Admin", gender: "Female", age: 35 },
].map((admin, index) => ({
  name: admin.name,
  dob: new Date(new Date().setFullYear(new Date().getFullYear() - admin.age)),
  age: admin.age,
  gender: admin.gender,
  address: "321 Admin St, City",
  phone: `+1999888777${index}`,
  account: {
    username: generateUsername(admin.name, "ADMIN", index + 1),
    email: generateEmail(generateUsername(admin.name, "ADMIN", index + 1)),
    password: "password123",
    role: RoleTypes.ADMIN,
  },
  staffDetails: {
    position: {
      name: "System Administrator",
      minSalary: 8000000,
      maxSalary: 12000000,
    },
    salary: 10000000,
    joinDate: new Date(2020, 0, 1),
    active: true,
  },
}));

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    // Get services directly instead of using loader
    const services = await getServices();

    if (!services || services.length === 0) {
      return json({
        success: false,
        message: "Please seed services first before creating profiles",
      });
    }

    // Generate semua profiles
    const doctorProfiles = createDoctorProfiles(services);
    const allProfiles = [
      ...patientSamples,
      ...doctorProfiles,
      ...officerSamples,
      ...adminSamples,
    ];

    // Delete existing profiles
    await deleteManyProfiles();

    // Create new profiles
    const result = await createManyProfiles(allProfiles);

    return json({
      success: true,
      message: `Successfully seeded ${result.length} profiles (${patientSamples.length} patients, ${doctorProfiles.length} doctors, ${officerSamples.length} officers, ${adminSamples.length} admins)`,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return json({
      success: false,
      message: "Failed to seed profiles",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default function SeedProfilesPage() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Seed Profiles Data</h1>

      {loaderData.services.length === 0 ? (
        <div className="text-yellow-600 bg-yellow-50 p-4 rounded mb-4">
          Please seed Services first before creating profiles.
        </div>
      ) : (
        <Form method="post">
          <Button type="submit" disabled={loaderData.services.length === 0}>
            Seed Profiles
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
