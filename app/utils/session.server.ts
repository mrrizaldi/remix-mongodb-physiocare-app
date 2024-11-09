import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import { parseJWT } from "./parseJWT";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "authSession",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.JWT_SECRET!],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
    httpOnly: true,
  },
});

export const { commitSession, destroySession, getSession } = sessionStorage;

export async function getUser(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) {
    throw redirect("/login");
  }

  const payload = parseJWT(token);
  if (!payload) {
    throw redirect("/login");
  }

  return payload;
}
