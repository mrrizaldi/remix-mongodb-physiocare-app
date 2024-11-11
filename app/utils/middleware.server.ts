import { json, redirect } from "@remix-run/node";
import jwt from "jsonwebtoken";
import { UserData } from "~/types/auth";
import { getSession } from "./session.server";

export const protectRoute = async (
  request: Request,
  allowedRoles?: string[]
): Promise<Response> => {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) {
    console.log("tidak ada token.");
    return redirect("/login");
  }

  try {
    const tokenPayload = jwt.verify(token, process.env.JWT_SECRET!) as UserData;

    if (allowedRoles && !allowedRoles.includes(tokenPayload.role)) {
      return redirect(`/dashboard/${tokenPayload.role.toLowerCase()}`);
    }

    return json({ tokenPayload });
  } catch (error) {
    return redirect("/login");
  }
};

export const protectAuthPage = async (
  request: Request
): Promise<Response | null> => {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (token) {
    try {
      const tokenPayload = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as UserData;
      return redirect(`/dashboard/${tokenPayload.role.toLowerCase()}`);
    } catch (error) {
      return null;
    }
  }

  return null;
};
