import { json, redirect } from "@remix-run/node";
import jwt from "jsonwebtoken";
import { UserData } from "~/types/auth";
import { getSession } from "./session.server";

export const protectRoute = async (
  request: Request,
  allowedRoles: string[]
) => {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) {
    console.log("tidak ada token.");
    return redirect("/login");
  }

  try {
    const tokenPayload = jwt.verify(token, process.env.JWT_SECRET!) as UserData;

    if (!allowedRoles.includes(tokenPayload.role)) {
      return redirect(`/dashboard/${tokenPayload.role}`);
    }

    return json({ tokenPayload });
  } catch (error) {
    return redirect("/login");
  }
};
