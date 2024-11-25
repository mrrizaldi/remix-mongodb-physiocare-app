import { json, redirect } from "@remix-run/node";
import { getScheduling } from "./medical-record.server";

export async function checkSchedulingMiddleware(request: Request) {
  const url = new URL(request.url);
  const schedulingId = url.searchParams.get("schedulingId");

  if (!schedulingId) {
    return redirect("/dashboard");
  }

  const scheduling = (await getScheduling(schedulingId)) as any;

  if (!scheduling || scheduling.status !== "CONFIRMED") {
    return json({ error: "No valid scheduling found" }, { status: 403 });
  }

  return null; // Allow the request to proceed
}
