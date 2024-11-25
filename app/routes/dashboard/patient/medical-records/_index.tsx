import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getMedicalRecordsById } from "~/utils/medical-record.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { format } from "date-fns";
import { PatientMedicalRecordView } from "~/schema/record";
import { protectRoute } from "~/utils/middleware.server";

type LoaderData = {
  medicalRecords: PatientMedicalRecordView[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const response = await protectRoute(request);
  const { tokenPayload: user } = await response.json();

  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  const patientId = user.id;
  const medicalRecords = await getMedicalRecordsById(patientId);
  return json<LoaderData>({ medicalRecords });
};

export default function PatientMedicalRecordsPage() {
  const { medicalRecords } = useLoaderData<LoaderData>();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Your Medical Records</h1>
      <ScrollArea className="h-[calc(100vh-200px)]">
        {medicalRecords.map((record) => (
          <Card key={record._id} className="mb-6">
            <CardHeader>
              <CardTitle>
                Record Date: {format(new Date(record.createdAt), "PPP")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="complaint">
                  <AccordionTrigger>Complaint</AccordionTrigger>
                  <AccordionContent>{record.complaint}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="medicalHistory">
                  <AccordionTrigger>Medical History</AccordionTrigger>
                  <AccordionContent>{record.medicalHistory}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="physicalExamination">
                  <AccordionTrigger>Physical Examination</AccordionTrigger>
                  <AccordionContent>
                    {record.physicalExamination}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="vitals">
                  <AccordionTrigger>Vitals</AccordionTrigger>
                  <AccordionContent>
                    <ul>
                      <li>
                        Blood Pressure: {record.vitals.systolic}/
                        {record.vitals.diastolic} mmHg
                      </li>
                      <li>Heart Rate: {record.vitals.heartRate} bpm</li>
                      <li>
                        Respiratory Rate: {record.vitals.respiratoryRate}{" "}
                        breaths/min
                      </li>
                      <li>Temperature: {record.vitals.temperature}°C</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="serviceNotes">
                  <AccordionTrigger>Service Notes</AccordionTrigger>
                  <AccordionContent>
                    {record.serviceNotes.map((note, index) => (
                      <div key={index} className="mb-4">
                        <h4 className="font-semibold">Note {index + 1}</h4>
                        <p>{note.additionalNotes}</p>
                        <h5 className="font-semibold mt-2">Prescription:</h5>
                        <ul>
                          {note.prescription.details.map((detail, idx) => (
                            <li key={idx}>
                              {detail.medicineDetails?.name} - Quantity:{" "}
                              {detail.quantity}, Instructions:{" "}
                              {detail.dosageInstructions}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
}
