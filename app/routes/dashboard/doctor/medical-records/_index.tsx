import { useState } from "react";
import {
  json,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  createMedicalRecord,
  getPatients,
} from "~/utils/medical-record.server";
import {
  getMedicalInventories,
  getMedicalInventory,
} from "~/utils/inventory.server";
import {
  type MedicalInventory,
  type PrescriptionDetail,
  medicalRecordSchema,
} from "~/schema/record";
import { z } from "zod";

// Types for our loader data
type LoaderData = {
  patients: Array<{ _id: string; name: string }>;
  medicalInventory: MedicalInventory[];
};

// Loader function to get patients and medical inventory
export const loader: LoaderFunction = async () => {
  const [patients, medicalInventory] = await Promise.all([
    getPatients(),
    getMedicalInventories(),
  ]);
  return json<LoaderData>({ patients, medicalInventory });
};

// Action function to handle form submission
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);

  try {
    // Parse prescription details from hidden input
    const prescriptionDetails = JSON.parse(
      formData.get("prescriptionDetails") as string
    ) as PrescriptionDetail[];

    const validPrescriptionDetails = prescriptionDetails.filter(
      (detail: PrescriptionDetail) => detail.medicalInventory !== ""
    );

    // Construct the medical record object
    const medicalRecord = {
      patientId: rawData.patientId,
      complaint: rawData.complaint,
      medicalHistory: rawData.medicalHistory,
      physicalExamination: rawData.physicalExamination,
      vitals: {
        systolic: Number(rawData.systolic),
        diastolic: Number(rawData.diastolic),
        heartRate: Number(rawData.heartRate),
        respiratoryRate: Number(rawData.respiratoryRate),
        temperature: Number(rawData.temperature),
      },
      serviceNotes: [
        {
          additionalNotes: formData.get("additionalNotes"),
          prescription: {
            details: validPrescriptionDetails,
          },
        },
      ],
    };

    // Validate the data
    const validatedData = medicalRecordSchema.parse(medicalRecord);

    // Create the medical record
    await createMedicalRecord(validatedData);

    return json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ success: false, errors: error.errors }, { status: 400 });
    }
    return json(
      { success: false, error: "Failed to create medical record" },
      { status: 500 }
    );
  }
};

// Vitals form component
function VitalsForm({ className }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="systolic">Systolic Blood Pressure</Label>
        <Input
          id="systolic"
          name="systolic"
          type="number"
          min="0"
          max="300"
          placeholder="120"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="diastolic">Diastolic Blood Pressure</Label>
        <Input
          id="diastolic"
          name="diastolic"
          type="number"
          min="0"
          max="200"
          placeholder="80"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
        <Input
          id="heartRate"
          name="heartRate"
          type="number"
          min="0"
          max="300"
          placeholder="75"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
        <Input
          id="respiratoryRate"
          name="respiratoryRate"
          type="number"
          min="0"
          max="100"
          placeholder="16"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="temperature">Temperature (°C)</Label>
        <Input
          id="temperature"
          name="temperature"
          type="number"
          min="30"
          max="45"
          step="0.1"
          placeholder="37.0"
          required
        />
      </div>
    </div>
  );
}

// Prescription form component
function PrescriptionForm({
  prescriptionDetails,
  medicalInventory,
  updatePrescriptionDetail,
}: {
  prescriptionDetails: PrescriptionDetail[];
  medicalInventory: MedicalInventory[];
  updatePrescriptionDetail: (
    index: number,
    field: keyof PrescriptionDetail,
    value: string | number
  ) => void;
}) {
  return (
    <div className="space-y-2">
      {prescriptionDetails.map((detail, index) => (
        <div key={index} className="grid grid-cols-3 gap-2">
          <Select
            name={`prescription.${index}.medicalInventory`}
            value={detail.medicalInventory}
            onValueChange={(value) =>
              updatePrescriptionDetail(index, "medicalInventory", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select medication" />
            </SelectTrigger>
            <SelectContent>
              {medicalInventory.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            name={`prescription.${index}.quantity`}
            placeholder="Quantity"
            min="1"
            value={detail.quantity}
            onChange={(e) =>
              updatePrescriptionDetail(
                index,
                "quantity",
                Number(e.target.value)
              )
            }
          />
          <Input
            name={`prescription.${index}.dosageInstructions`}
            placeholder="Dosage Instructions"
            value={detail.dosageInstructions}
            onChange={(e) =>
              updatePrescriptionDetail(
                index,
                "dosageInstructions",
                e.target.value
              )
            }
          />
        </div>
      ))}
    </div>
  );
}

// Main component
export default function NewMedicalRecordPage() {
  const { patients, medicalInventory } = useLoaderData<LoaderData>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [prescriptionDetails, setPrescriptionDetails] = useState<
    PrescriptionDetail[]
  >([]);

  const addPrescriptionDetail = () => {
    setPrescriptionDetails([
      ...prescriptionDetails,
      {
        medicalInventory: "",
        quantity: 1,
        dosageInstructions: "",
      } as PrescriptionDetail,
    ]);
  };

  const updatePrescriptionDetail = (
    index: number,
    field: keyof PrescriptionDetail,
    value: string | number
  ) => {
    const newDetails = [...prescriptionDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setPrescriptionDetails(newDetails);
  };

  const isSubmitting = navigation.state === "submitting";

  const isFormValid = () => {
    return (
      prescriptionDetails.length === 0 ||
      prescriptionDetails.every((detail) => detail.medicalInventory !== "")
    );
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>New Medical Record</CardTitle>
      </CardHeader>
      <CardContent>
        <Form method="post" className="space-y-6">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient</Label>
            <Select name="patientId" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient._id} value={patient._id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Complaint */}
          <div className="space-y-2">
            <Label htmlFor="complaint">Complaint</Label>
            <Textarea
              id="complaint"
              name="complaint"
              placeholder="Patient's complaint"
              required
            />
          </div>

          {/* Medical History */}
          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              name="medicalHistory"
              placeholder="Patient's medical history"
              required
            />
          </div>

          {/* Physical Examination */}
          <div className="space-y-2">
            <Label htmlFor="physicalExamination">Physical Examination</Label>
            <Textarea
              id="physicalExamination"
              name="physicalExamination"
              placeholder="Physical examination notes"
              required
            />
          </div>

          {/* Vitals */}
          <div className="space-y-2">
            <Label>Vitals</Label>
            <VitalsForm />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              name="additionalNotes"
              placeholder="Additional notes"
            />
          </div>

          {/* Prescription */}
          <div className="space-y-2">
            <Label>Prescription</Label>
            <PrescriptionForm
              prescriptionDetails={prescriptionDetails}
              medicalInventory={medicalInventory}
              updatePrescriptionDetail={updatePrescriptionDetail}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addPrescriptionDetail}
              className="mt-2"
            >
              Add Medication
            </Button>
          </div>

          {/* Hidden input for prescription details */}
          <input
            type="hidden"
            name="prescriptionDetails"
            value={JSON.stringify(prescriptionDetails)}
          />

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting || !isFormValid()}>
            {isSubmitting ? "Saving..." : "Save Medical Record"}
          </Button>

          {/* Success Message */}
          {actionData?.success && (
            <p className="text-green-600">
              Medical record created successfully!
            </p>
          )}

          {/* Error Messages */}
          {actionData?.errors && (
            <div className="text-red-600 space-y-1">
              {actionData.errors.map((error: z.ZodError, index: number) => (
                <p key={index}>{error.message}</p>
              ))}
            </div>
          )}
          {!isFormValid() && (
            <p className="text-red-600 mt-2">
              Please select a medication for all prescription entries or remove
              empty ones.
            </p>
          )}
        </Form>
      </CardContent>
    </Card>
  );
}
