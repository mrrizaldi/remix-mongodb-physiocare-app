import { createCookieSessionStorage } from "@remix-run/node";

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
